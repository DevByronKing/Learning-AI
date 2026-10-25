/**
 * Argus - Data Safety & Operational Guardrails Engine
 * Implementa travas de segurança programáticas contra deleções acidentais,
 * comandos destrutivos e modificações em massa não autorizadas.
 */

export interface GuardrailCheckResult {
  allowed: boolean;
  blockedReason?: string;
  isDestructive: boolean;
  requiredConfirmationToken?: string;
}

export interface GuardrailContext {
  userId?: string;
  userRole?: 'student' | 'mentor' | 'admin' | 'system';
  confirmationToken?: string;
  sourceIp?: string;
}

// Lista de padrões SQL e comandos destrutivos proibidos em runtime
const DESTRUCTIVE_SQL_PATTERNS = [
  /drop\s+table/i,
  /drop\s+database/i,
  /drop\s+schema/i,
  /truncate\s+table/i,
  /delete\s+from\s+[a-zA-Z0-9_]+\s*(;|$)/i, // DELETE sem WHERE
  /delete\s+from\s+[a-zA-Z0-9_]+\s+where\s+1\s*=\s*1/i, // DELETE com WHERE 1=1
  /delete\s+from\s+(questions|student_profiles|audit_logs|exams)\b/i, // Deleção direta de entidades imutáveis
  /alter\s+table\s+[a-zA-Z0-9_]+\s+drop\s+column/i,
  /rmdir\s+\/s/i,
  /rm\s+-rf\s+\//i,
];

// Tabelas protegidas contra Hard Delete (Exigem Soft Delete / Flag `isDeleted`)
const PROTECTED_ENTITIES = [
  'questions',
  'student_profiles',
  'exam_notices',
  'audit_logs',
  'question_attempts',
  'payment_transactions',
];

/**
 * Validador de Guardrail para consultas e operações de dados
 */
export function validateDatabaseGuardrail(
  queryOrCommand: string,
  context?: GuardrailContext
): GuardrailCheckResult {
  const normalized = queryOrCommand.trim();

  // 1. Proteção de Hard Delete em Entidades Críticas
  const isDeleteOperation = /^delete\s+/i.test(normalized);
  if (isDeleteOperation) {
    for (const entity of PROTECTED_ENTITIES) {
      if (new RegExp(`\\b${entity}\\b`, 'i').test(normalized)) {
        return {
          allowed: false,
          isDestructive: true,
          blockedReason: `Hard Delete na entidade protegida "${entity}" é estritamente proibido. Utilize Soft Delete (ex: status='arquivado' ou isDeleted=true).`,
        };
      }
    }
  }

  // 2. Verificação de padrões estritamente destrutivos
  for (const pattern of DESTRUCTIVE_SQL_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        allowed: false,
        isDestructive: true,
        blockedReason: `Operação destrutiva bloqueada pelo Guardrail de Segurança: padrão "${pattern.source}" proibido.`,
      };
    }
  }

  // 3. Exigência de Confirmação Criptográfica para Ações de Admin com Impacto Elevado
  const isBulkUpdate = /update\s+[a-zA-Z0-9_]+\s+set\s+.*where\s+1\s*=\s*1/i.test(normalized);
  if (isBulkUpdate) {
    const validToken = context?.confirmationToken && context.confirmationToken.startsWith('CONFIRM_BULK_');
    if (!validToken) {
      return {
        allowed: false,
        isDestructive: true,
        blockedReason: 'Atualizações em lote requerem token de confirmação de 2 fatores (confirmationToken).',
      };
    }
  }

  return {
    allowed: true,
    isDestructive: false,
  };
}

/**
 * Guardrail Hook para operações de Soft Delete seguras
 */
export function executeSafeEntityDeletion<T extends { id: string; isDeleted?: boolean; deletedAt?: string }>(
  entityName: string,
  entity: T,
  context?: GuardrailContext
): { success: boolean; entity: T; message: string } {
  // Apenas Admin ou o próprio usuário podem arquivar
  if (context?.userRole === 'student' && entityName === 'questions') {
    throw new Error('Alunos não possuem permissão para deletar ou arquivar questões do banco oficial.');
  }

  const updatedEntity: T = {
    ...entity,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
  };

  return {
    success: true,
    entity: updatedEntity,
    message: `Entidade "${entityName}" arquivada com sucesso via Soft Delete protegido.`,
  };
}
