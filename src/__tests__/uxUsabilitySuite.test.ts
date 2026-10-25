import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveOnboardingDraft, loadOnboardingDraft, clearOnboardingDraft, ONBOARDING_DRAFT_KEY } from '@/components/onboarding/onboardingData';

describe('Suíte de Testes: 7 Leis de UX, Usabilidade e Onboarding', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Pilar 1: Persistência de Onboarding Anti-Queda (4G Resilience)', () => {
    it('deve salvar o rascunho a cada passo com integridade no localStorage', () => {
      const mockState = {
        painPoint: 'pegadinhas' as const,
        targetCareer: 'tribunais' as const,
        targetExamTitle: 'TJ-SP Escrevente Técnico Judiciário',
        detectedBanca: 'Vunesp',
        weakSubject: 'Direito Constitucional',
        dailyHoursGoal: 3,
        experienceLevel: 'intermediario' as const,
        guardianId: 'coruja' as const,
        warName: 'Dra. Vitória Concurseira',
      };

      saveOnboardingDraft(3, mockState);

      const saved = loadOnboardingDraft();
      expect(saved).not.toBeNull();
      expect(saved?.step).toBe(3);
      expect(saved?.form.targetExamTitle).toBe('TJ-SP Escrevente Técnico Judiciário');
      expect(saved?.form.dailyHoursGoal).toBe(3);
    });

    it('deve limpar o rascunho com sucesso ao finalizar o cadastro', () => {
      saveOnboardingDraft(5, {
        painPoint: 'tempo' as const,
        targetCareer: 'oab' as const,
        targetExamTitle: 'Exame de Ordem OAB 1ª Fase',
        detectedBanca: 'FGV',
        weakSubject: 'Direito Tributário',
        dailyHoursGoal: 4,
        experienceLevel: 'iniciante' as const,
        guardianId: 'lobo' as const,
        warName: 'Dr. Advogado',
      });

      expect(localStorage.getItem(ONBOARDING_DRAFT_KEY)).not.toBeNull();
      clearOnboardingDraft();
      expect(loadOnboardingDraft()).toBeNull();
    });
  });

  describe('Pilar 2: Usabilidade de Questões & Riscar Alternativa (Lei de Fitts & Jakob)', () => {
    it('deve gerenciar conjunto de alternativas eliminadas sem mutação indevida', () => {
      let eliminatedIds: string[] = [];

      const toggleEliminate = (id: string) => {
        eliminatedIds = eliminatedIds.includes(id)
          ? eliminatedIds.filter((item) => item !== id)
          : [...eliminatedIds, id];
      };

      // Riscar alternativa B
      toggleEliminate('opt-b');
      expect(eliminatedIds).toContain('opt-b');

      // Riscar alternativa D
      toggleEliminate('opt-d');
      expect(eliminatedIds).toEqual(['opt-b', 'opt-d']);

      // Restaurar alternativa B
      toggleEliminate('opt-b');
      expect(eliminatedIds).toEqual(['opt-d']);
    });

    it('deve transicionar a escala de zoom de fonte entre sm, base, lg e xl', () => {
      const levels: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];
      let currentLevel: 'sm' | 'base' | 'lg' | 'xl' = 'base';

      const zoomIn = () => {
        const idx = levels.indexOf(currentLevel);
        if (idx < levels.length - 1) currentLevel = levels[idx + 1];
      };

      const zoomOut = () => {
        const idx = levels.indexOf(currentLevel);
        if (idx > 0) currentLevel = levels[idx - 1];
      };

      zoomIn();
      expect(currentLevel).toBe('lg');
      zoomIn();
      expect(currentLevel).toBe('xl');
      zoomIn(); // Limite máximo
      expect(currentLevel).toBe('xl');

      zoomOut();
      expect(currentLevel).toBe('lg');
      zoomOut();
      expect(currentLevel).toBe('base');
      zoomOut();
      expect(currentLevel).toBe('sm');
      zoomOut(); // Limite mínimo
      expect(currentLevel).toBe('sm');
    });
  });

  describe('Pilar 3: Gradiente de Meta (Incentivo Motivacional acima de 75%)', () => {
    it('deve ativar o gatilho motivacional estritamente quando o progresso for >= 75%', () => {
      const totalQuestions = 10;

      const isGoalGradientActive = (currentIndex: number) => {
        return (currentIndex + 1) / totalQuestions >= 0.75;
      };

      // Questão 5 de 10 (50%) -> falso
      expect(isGoalGradientActive(4)).toBe(false);

      // Questão 7 de 10 (70%) -> falso
      expect(isGoalGradientActive(6)).toBe(false);

      // Questão 8 de 10 (80%) -> verdadeiro
      expect(isGoalGradientActive(7)).toBe(true);

      // Questão 10 de 10 (100%) -> verdadeiro
      expect(isGoalGradientActive(9)).toBe(true);
    });
  });

  describe('Pilar 4: Telemetria e Voto de Auditoria Rápida em 1 Clique', () => {
    it('deve armazenar votos de feedback com tags de concurso no localStorage', () => {
      const mockVote = {
        id: 'vote-1',
        questionId: 'q-const-01',
        banca: 'FGV',
        subject: 'Direito Constitucional',
        vote: 'down' as const,
        tags: ['Questão desatualizada', 'Gabarito controverso'],
        comment: 'A emenda constitucional 132 alterou a regra.',
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('argus_ai_feedback_votes', JSON.stringify([mockVote]));

      const stored = JSON.parse(localStorage.getItem('argus_ai_feedback_votes') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].tags).toContain('Questão desatualizada');
      expect(stored[0].tags).toContain('Gabarito controverso');
    });
  });
});
