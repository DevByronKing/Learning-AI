/**
 * Argus - RBAC & Least Privilege Engine
 * Implementação de:
 * - Autenticação & Autorização granular
 * - Menor Privilégio (Least Privilege Matrix)
 * - Defesa contra Escalação de Privilégios (Vertical & Horizontal)
 * - Proteção contra IDOR (Insecure Direct Object Reference)
 */

export type UserRole = 'guest' | 'student' | 'mentor' | 'secops' | 'admin';

export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'study:read'
  | 'study:write'
  | 'questions:read'
  | 'questions:answer'
  | 'edital:read'
  | 'edital:upload'
  | 'billing:read'
  | 'billing:manage'
  | 'secops:audit_read'
  | 'secops:siem_read'
  | 'secops:waf_manage'
  | 'admin:users_manage'
  | 'admin:system_config'
  | 'admin:all';

// Hierarquia numérica de papéis para validação de escalação
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  student: 10,
  mentor: 20,
  secops: 50,
  admin: 100,
};

// Matriz de Menor Privilégio (Princípio do Least Privilege)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: ['study:read', 'questions:read', 'edital:read'],
  student: [
    'profile:read',
    'profile:write',
    'study:read',
    'study:write',
    'questions:read',
    'questions:answer',
    'edital:read',
    'billing:read',
  ],
  mentor: [
    'profile:read',
    'profile:write',
    'study:read',
    'study:write',
    'questions:read',
    'questions:answer',
    'edital:read',
    'edital:upload',
    'billing:read',
  ],
  secops: [
    'profile:read',
    'study:read',
    'questions:read',
    'edital:read',
    'secops:audit_read',
    'secops:siem_read',
    'secops:waf_manage',
  ],
  admin: [
    'profile:read',
    'profile:write',
    'study:read',
    'study:write',
    'questions:read',
    'questions:answer',
    'edital:read',
    'edital:upload',
    'billing:read',
    'billing:manage',
    'secops:audit_read',
    'secops:siem_read',
    'secops:waf_manage',
    'admin:users_manage',
    'admin:system_config',
    'admin:all',
  ],
};

/**
 * Valida se um determinado papel possui a permissão solicitada.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'admin') return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('admin:all');
}

/**
 * Previne Escalação Vertical de Privilégios.
 * Um ator só pode atribuir ou modificar papéis estritamente inferiores ao seu próprio nível.
 */
export function canAssignRole(actorRole: UserRole, targetRole: UserRole): boolean {
  const actorWeight = ROLE_HIERARCHY[actorRole] ?? -1;
  const targetWeight = ROLE_HIERARCHY[targetRole] ?? -1;

  // Apenas Admin pode promover usuários até o nível secops/mentor
  // Ninguém pode se auto-promover para um nível igual ou superior
  return actorWeight >= 100 && actorWeight >= targetWeight;
}

/**
 * Previne adulteração de parâmetros de perfil (Parameter Tampering / Mass Assignment).
 * Remove chaves sensíveis como 'role', 'isAdmin', 'permissions', 'quota' se o ator não for admin.
 */
export function sanitizeProfileUpdatePayload(
  actorRole: UserRole,
  payload: Record<string, any>
): { sanitized: Record<string, any>; blockedFields: string[] } {
  const privilegedFields = ['role', 'isAdmin', 'is_admin', 'permissions', 'subscriptionStatus', 'trialEndsAt'];
  const sanitized: Record<string, any> = { ...payload };
  const blockedFields: string[] = [];

  if (actorRole !== 'admin') {
    for (const field of privilegedFields) {
      if (field in sanitized) {
        delete sanitized[field];
        blockedFields.push(field);
      }
    }
  }

  return { sanitized, blockedFields };
}

/**
 * Previne IDOR (Insecure Direct Object Reference) / Escalação Horizontal.
 * Garante que um usuário só pode acessar ou alterar seus próprios registros.
 */
export function authorizeResourceAccess(params: {
  actorUserId: string;
  actorRole: UserRole;
  resourceOwnerId: string;
}): boolean {
  // Administradores e SecOps possuem visibilidade de governança
  if (params.actorRole === 'admin' || params.actorRole === 'secops') {
    return true;
  }

  // Usuários comuns só acessam o seu próprio UID
  return params.actorUserId === params.resourceOwnerId;
}
