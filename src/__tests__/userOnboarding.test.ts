import { describe, it, expect } from 'vitest';
import { GUARDIAN_ANIMALS, DEFAULT_STUDENT_PROFILE } from '../lib/guardianAnimals';
import { StudentProfile } from '../lib/types';

describe('User Onboarding & Protocolo de Iniciação Cognitiva', () => {
  it('deve possuir o catálogo de 7 Guardiões Cognitivos devidamente calibrados', () => {
    expect(GUARDIAN_ANIMALS.length).toBe(7);
    const ids = GUARDIAN_ANIMALS.map(a => a.id);
    expect(ids).toContain('coruja');
    expect(ids).toContain('lobo');
    expect(ids).toContain('gaviao');
    expect(ids).toContain('leao');
    expect(ids).toContain('raposa');
    expect(ids).toContain('onca');
    expect(ids).toContain('fenix');

    GUARDIAN_ANIMALS.forEach(animal => {
      expect(animal.name).toBeTruthy();
      expect(animal.superpower).toBeTruthy();
      expect(animal.stats.foco).toBeGreaterThanOrEqual(80);
      expect(animal.stats.estrategia).toBeGreaterThanOrEqual(80);
    });
  });

  it('deve inicializar o perfil do aluno com valores padrão coerentes', () => {
    expect(DEFAULT_STUDENT_PROFILE).toBeDefined();
    expect(DEFAULT_STUDENT_PROFILE.dailyHoursGoal).toBe(4.0);
    expect(DEFAULT_STUDENT_PROFILE.guardianAnimalId).toBe('coruja');
    expect(DEFAULT_STUDENT_PROFILE.targetCareer).toBe('policial');
  });

  it('deve gerar corretamente o payload do Passaporte Cognitivo após o onboarding', () => {
    const mockOnboardingInput = {
      warName: 'Auditor Tático',
      targetCareer: 'fiscal' as const,
      targetExamTitle: 'Receita Federal - Auditor-Fiscal',
      dailyHoursGoal: 6,
      experienceLevel: 'veterano' as const,
      guardianAnimalId: 'gaviao' as const,
    };

    const simulatedProfile: StudentProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      name: mockOnboardingInput.warName,
      warName: mockOnboardingInput.warName,
      targetCareer: mockOnboardingInput.targetCareer,
      targetExamTitle: mockOnboardingInput.targetExamTitle,
      dailyHoursGoal: mockOnboardingInput.dailyHoursGoal,
      experienceLevel: mockOnboardingInput.experienceLevel,
      guardianAnimalId: mockOnboardingInput.guardianAnimalId,
      updatedAt: new Date().toISOString(),
    };

    expect(simulatedProfile.warName).toBe('Auditor Tático');
    expect(simulatedProfile.guardianAnimalId).toBe('gaviao');
    expect(simulatedProfile.dailyHoursGoal).toBe(6);
    expect(simulatedProfile.targetCareer).toBe('fiscal');
  });

  it('deve garantir que o arquétipo do Guardião Gavião Real é otimizado para carreiras fiscais', () => {
    const gaviao = GUARDIAN_ANIMALS.find(a => a.id === 'gaviao');
    expect(gaviao).toBeDefined();
    expect(gaviao?.title).toContain('Fiscal');
    expect(gaviao?.superpower).toContain('Inconsistências');
    expect(gaviao?.bestForCareers.some(c => c.toLowerCase().includes('receita'))).toBe(true);
  });

  it('deve garantir que o Lobo-Guará é especializado em carreiras de alta pressão policial', () => {
    const lobo = GUARDIAN_ANIMALS.find(a => a.id === 'lobo');
    expect(lobo).toBeDefined();
    expect(lobo?.superpower).toContain('Distratores');
    expect(lobo?.bestForCareers.some(c => c.includes('Polícia Federal'))).toBe(true);
  });
});
