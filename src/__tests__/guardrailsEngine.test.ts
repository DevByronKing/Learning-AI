import { describe, it, expect } from 'vitest';
import { validateDatabaseGuardrail, executeSafeEntityDeletion } from '@/lib/guardrails';

describe('Suíte de Testes: Guardrails & Travas de Segurança Operacional (SDD/TDD)', () => {
  describe('Validação de Comandos Destrutivos (Database Guardrails)', () => {
    it('deve bloquear comandos DROP TABLE imediatamente', () => {
      const result = validateDatabaseGuardrail('DROP TABLE student_profiles;');
      expect(result.allowed).toBe(false);
      expect(result.isDestructive).toBe(true);
      expect(result.blockedReason).toContain('Operação destrutiva bloqueada');
    });

    it('deve bloquear comandos TRUNCATE TABLE imediatamente', () => {
      const result = validateDatabaseGuardrail('TRUNCATE TABLE questions;');
      expect(result.allowed).toBe(false);
      expect(result.isDestructive).toBe(true);
    });

    it('deve bloquear comandos DELETE sem cláusula WHERE', () => {
      const result = validateDatabaseGuardrail('DELETE FROM audit_logs');
      expect(result.allowed).toBe(false);
      expect(result.isDestructive).toBe(true);
    });

    it('deve bloquear DELETE com WHERE 1=1 (tentativa de contorno de segurança)', () => {
      const result = validateDatabaseGuardrail('DELETE FROM questions WHERE 1=1;');
      expect(result.allowed).toBe(false);
      expect(result.isDestructive).toBe(true);
    });

    it('deve impedir Hard Delete direto na tabela de questões oficiais', () => {
      const result = validateDatabaseGuardrail('DELETE FROM questions WHERE id = "q-123";');
      expect(result.allowed).toBe(false);
      expect(result.blockedReason).toContain('Hard Delete na entidade protegida "questions" é estritamente proibido');
    });

    it('deve permitir comandos de consulta seguros (SELECT)', () => {
      const result = validateDatabaseGuardrail('SELECT * FROM questions WHERE banca = "FGV" LIMIT 10;');
      expect(result.allowed).toBe(true);
      expect(result.isDestructive).toBe(false);
    });
  });

  describe('Execução Protegida de Soft Delete', () => {
    it('deve aplicar soft delete com isDeleted=true e deletedAt preenchido', () => {
      const mockQuestion = {
        id: 'q-custom-99',
        statement: 'Questão personalizada arquivada',
        isDeleted: false,
      };

      const result = executeSafeEntityDeletion('questions', mockQuestion, {
        userRole: 'admin',
        userId: 'admin-01',
      });

      expect(result.success).toBe(true);
      expect(result.entity.isDeleted).toBe(true);
      expect(result.entity.deletedAt).toBeDefined();
    });

    it('deve barrar tentativa de aluno deletar questão oficial do sistema', () => {
      const mockQuestion = {
        id: 'q-official-01',
        statement: 'Questão do Banco Geral',
      };

      expect(() => {
        executeSafeEntityDeletion('questions', mockQuestion, {
          userRole: 'student',
          userId: 'aluno-123',
        });
      }).toThrow('Alunos não possuem permissão');
    });
  });
});
