import { describe, it, expect } from 'vitest';
import {
  sanitizeWarName,
  isValidEmail,
  isPlaceholderProfile,
  matchPopularTarget,
  snapHours,
  buildInitialOnboardingState,
  shouldAutoOpenOnboarding,
  pickWelcomeEmail,
  normalizeText,
  POPULAR_TARGETS,
  QUESTION_VALUE_PROPOSITIONS,
  autoDetectUserContext,
  saveOnboardingDraft,
  loadOnboardingDraft,
  clearOnboardingDraft,
} from '@/components/onboarding/onboardingData';
import { DEFAULT_STUDENT_PROFILE } from '@/lib/guardianAnimals';

describe('onboardingData', () => {
  it('normalizeText remove acentos, caixa e espaços duplicados', () => {
    expect(normalizeText('  Polícia   Federal ')).toBe('policia federal');
  });

  it('sanitizeWarName remove < >, colapsa espaços e limita tamanho', () => {
    expect(sanitizeWarName('<b>Ana</b>   Lima')).toBe('bAna/b Lima');
    expect(sanitizeWarName('x'.repeat(200)).length).toBeLessThanOrEqual(40);
  });

  it('isValidEmail valida formato básico', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  it('isPlaceholderProfile detecta o perfil padrão', () => {
    expect(isPlaceholderProfile(null)).toBe(true);
    expect(isPlaceholderProfile(DEFAULT_STUDENT_PROFILE)).toBe(true);
    expect(isPlaceholderProfile({ ...DEFAULT_STUDENT_PROFILE, warName: 'Maria' })).toBe(false);
  });

  it('matchPopularTarget acha edital por título exato e por palavra-chave', () => {
    const first = POPULAR_TARGETS[0];
    expect(matchPopularTarget(first.title)?.title).toBe(first.title);
    expect(matchPopularTarget('')).toBeNull();
    expect(matchPopularTarget('Concurso inexistente XYZ qualquer')).toBeNull();
  });

  it('snapHours encaixa no valor de opção mais próximo', () => {
    const v = snapHours(3.9);
    expect(typeof v).toBe('number');
    expect(snapHours(undefined)).toBe(snapHours(4));
  });

  it('buildInitialOnboardingState ignora perfil placeholder', () => {
    const state = buildInitialOnboardingState(DEFAULT_STUDENT_PROFILE, []);
    expect(state.warName).toBe('');
    expect(state.targetExamTitle).toBe('');
    expect(state.guardianTouched).toBe(false);
  });

  it('buildInitialOnboardingState preserva edital personalizado', () => {
    const state = buildInitialOnboardingState(
      { ...DEFAULT_STUDENT_PROFILE, warName: 'Maria', targetExamTitle: 'Concurso Exótico da Prefeitura de Lugar Nenhum' },
      []
    );
    expect(state.warName).toBe('Maria');
    expect(state.customExamInput).toContain('Exótico');
    expect(state.targetExamTitle).toContain('Exótico');
  });

  it('shouldAutoOpenOnboarding respeita completed, perfil salvo e suppress de skip', () => {
    const now = 1_000_000_000;
    expect(shouldAutoOpenOnboarding({ completed: true, hasSavedProfile: false, now })).toBe(false);
    expect(shouldAutoOpenOnboarding({ completed: false, hasSavedProfile: true, now })).toBe(false);
    expect(shouldAutoOpenOnboarding({ completed: false, hasSavedProfile: false, skippedAt: now - 1000, now })).toBe(false);
    expect(shouldAutoOpenOnboarding({ completed: false, hasSavedProfile: false, now })).toBe(true);
    expect(
      shouldAutoOpenOnboarding({ completed: false, hasSavedProfile: false, skippedAt: now - 1000 * 60 * 60 * 24 * 365, now })
    ).toBe(true);
  });

  it('pickWelcomeEmail ignora e-mails demo e escolhe o primeiro válido', () => {
    expect(pickWelcomeEmail('concurseiro@argus.app.br', 'real@x.com')).toBe('real@x.com');
    expect(pickWelcomeEmail(null, 'bad', undefined)).toBeNull();
  });

  it('QUESTION_VALUE_PROPOSITIONS define justificativa e impacto prático para as 5 etapas', () => {
    expect(Object.keys(QUESTION_VALUE_PROPOSITIONS).length).toBe(5);
    for (let step = 1; step <= 5; step++) {
      expect(QUESTION_VALUE_PROPOSITIONS[step].whyWeAsk).toBeTruthy();
      expect(QUESTION_VALUE_PROPOSITIONS[step].whatItChanges).toBeTruthy();
    }
  });

  it('autoDetectUserContext detecta timezone, idioma e dispositivo sem perguntar ao usuário', () => {
    const ctx = autoDetectUserContext();
    expect(ctx.timeZone).toBeDefined();
    expect(ctx.locale).toBeDefined();
    expect(['mobile', 'desktop']).toContain(ctx.deviceType);
    expect(ctx.currency).toBe('BRL');
  });

  it('saveOnboardingDraft, loadOnboardingDraft e clearOnboardingDraft gerenciam rascunho', () => {
    const sampleForm = buildInitialOnboardingState(null, []);
    sampleForm.warName = 'Fiscal Elite';

    saveOnboardingDraft(3, sampleForm);
    const loaded = loadOnboardingDraft();
    expect(loaded).toBeDefined();
    expect(loaded?.step).toBe(3);
    expect(loaded?.form.warName).toBe('Fiscal Elite');

    clearOnboardingDraft();
    expect(loadOnboardingDraft()).toBeNull();
  });
});
