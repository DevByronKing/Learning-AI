import { describe, it, expect } from 'vitest';
import { calculateExamScore, ExamAnswerItem } from '@/lib/examScoring';

describe('Regras Críticas de Negócio: Pontuação Líquida de Bancas Examinadoras', () => {
  describe('Método Cebraspe (1 Errada Anula 1 Certa)', () => {
    it('deve calcular corretamente 60 certas, 40 erradas e 20 em branco em 120 itens = 20 pts líquidos', () => {
      const answers: ExamAnswerItem[] = [];

      // 60 acertos
      for (let i = 1; i <= 60; i++) {
        answers.push({
          questionId: `q-${i}`,
          subjectName: 'Direito Constitucional',
          selectedOption: 'CERTO',
          officialAnswer: 'CERTO',
        });
      }

      // 40 erros
      for (let i = 61; i <= 100; i++) {
        answers.push({
          questionId: `q-${i}`,
          subjectName: 'Direito Administrativo',
          selectedOption: 'CERTO',
          officialAnswer: 'ERRADO', // Errou
        });
      }

      // 20 em branco (estratégia clássica Cebraspe)
      for (let i = 101; i <= 120; i++) {
        answers.push({
          questionId: `q-${i}`,
          subjectName: 'Língua Portuguesa',
          selectedOption: null, // Deixou em branco
          officialAnswer: 'CERTO',
        });
      }

      const result = calculateExamScore({
        totalQuestions: 120,
        scoringRule: 'cebraspe_uma_anula_uma',
        answers,
        cutoffScore: 50, // 50% de corte
      });

      expect(result.correctCount).toBe(60);
      expect(result.wrongCount).toBe(40);
      expect(result.blankCount).toBe(20);
      expect(result.grossScore).toBe(60);
      expect(result.penaltyDeductions).toBe(40);
      expect(result.netScore).toBe(20); // 60 - 40 = 20 pontos líquidos!
      expect(result.percentage).toBe(Math.round((20 / 120) * 100)); // 17%
      expect(result.isAboveCutoff).toBe(false); // Abaixo dos 50%
    });

    it('deve atribuir ponto para questão anulada sem aplicar penalidade', () => {
      const answers: ExamAnswerItem[] = [
        {
          questionId: 'q-1',
          subjectName: 'Penal',
          selectedOption: 'ERRADO',
          officialAnswer: 'ANULADA', // Anulada pela banca
          isAnnulled: true,
        },
        {
          questionId: 'q-2',
          subjectName: 'Penal',
          selectedOption: 'CERTO',
          officialAnswer: 'CERTO',
        },
      ];

      const result = calculateExamScore({
        totalQuestions: 2,
        scoringRule: 'cebraspe_uma_anula_uma',
        answers,
      });

      expect(result.annulledCount).toBe(1);
      expect(result.correctCount).toBe(2);
      expect(result.penaltyDeductions).toBe(0);
      expect(result.netScore).toBe(2);
    });

    it('deve fixar nota líquida mínima em 0 quando erros superarem acertos', () => {
      const answers: ExamAnswerItem[] = [
        {
          questionId: 'q-1',
          subjectName: 'Raciocínio Lógico',
          selectedOption: 'CERTO',
          officialAnswer: 'ERRADO',
        },
        {
          questionId: 'q-2',
          subjectName: 'Raciocínio Lógico',
          selectedOption: 'CERTO',
          officialAnswer: 'ERRADO',
        },
      ];

      const result = calculateExamScore({
        totalQuestions: 2,
        scoringRule: 'cebraspe_uma_anula_uma',
        answers,
      });

      expect(result.correctCount).toBe(0);
      expect(result.wrongCount).toBe(2);
      expect(result.penaltyDeductions).toBe(2);
      expect(result.netScore).toBe(0); // Piso em zero
    });
  });

  describe('Método Múltipla Escolha Ponderada (FGV, FCC, Vunesp)', () => {
    it('NÃO deve deduzir penalidade por erros em múltipla escolha', () => {
      const answers: ExamAnswerItem[] = [
        {
          questionId: 'q-1',
          subjectName: 'Português',
          selectedOption: 'A',
          officialAnswer: 'A',
          weight: 2,
        },
        {
          questionId: 'q-2',
          subjectName: 'Português',
          selectedOption: 'B',
          officialAnswer: 'C', // Errou
          weight: 2,
        },
      ];

      const result = calculateExamScore({
        totalQuestions: 2,
        scoringRule: 'multipla_escolha_ponderada',
        answers,
      });

      expect(result.correctCount).toBe(1);
      expect(result.wrongCount).toBe(1);
      expect(result.penaltyDeductions).toBe(0); // Sem penalidade
      expect(result.netScore).toBe(2); // Pontuação do peso da questão 1
    });
  });

  describe('Critérios de Eliminação e Cláusula de Barreira por Disciplina', () => {
    it('deve eliminar o candidato se a nota em disciplina obrigatória for menor que o corte mínimo', () => {
      const answers: ExamAnswerItem[] = [
        // Português: obteve apenas 1 acerto
        {
          questionId: 'q-1',
          subjectName: 'Língua Portuguesa',
          selectedOption: 'A',
          officialAnswer: 'A',
        },
        {
          questionId: 'q-2',
          subjectName: 'Língua Portuguesa',
          selectedOption: 'B',
          officialAnswer: 'C',
        },
        // Direito: foi perfeito (3 acertos)
        {
          questionId: 'q-3',
          subjectName: 'Direito Constitucional',
          selectedOption: 'A',
          officialAnswer: 'A',
        },
        {
          questionId: 'q-4',
          subjectName: 'Direito Constitucional',
          selectedOption: 'B',
          officialAnswer: 'B',
        },
        {
          questionId: 'q-5',
          subjectName: 'Direito Constitucional',
          selectedOption: 'C',
          officialAnswer: 'C',
        },
      ];

      const result = calculateExamScore({
        totalQuestions: 5,
        scoringRule: 'multipla_escolha_ponderada',
        answers,
        cutoffScore: 60, // 4 de 5 = 80%, acima do corte geral
        minimumCutoffPerSubject: {
          'Língua Portuguesa': 2, // Exigia mínimo de 2 pontos
        },
      });

      expect(result.netScore).toBe(4);
      expect(result.percentage).toBe(80);
      expect(result.isEliminatedByMinimum).toBe(true);
      expect(result.isAboveCutoff).toBe(false); // Reprovado pela cláusula de barreira!
      expect(result.eliminationReasons[0]).toContain('Língua Portuguesa');
    });
  });
});
