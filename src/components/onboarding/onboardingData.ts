/**
 * Dados e lógica pura do onboarding (sem React) — facilita testes unitários.
 */
import type { GuardianAnimalId, StudentProfile } from '@/lib/types';
import { DEFAULT_STUDENT_PROFILE, GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';

export type TargetCareer = StudentProfile['targetCareer'];
export type ExperienceLevel = StudentProfile['experienceLevel'];
export type PainPointId = NonNullable<StudentProfile['mainPainPoint']>;

export interface PopularTarget {
  title: string;
  career: TargetCareer;
  banca: string;
  icon: string;
  recommendedGuardian: GuardianAnimalId;
  tag: string;
  description: string;
  /** Palavras-chave (normalizadas) para reconhecer o edital a partir de textos livres */
  keywords: string[];
}

// Catálogo de carreiras e editais de alta demanda no Brasil
export const POPULAR_TARGETS: PopularTarget[] = [
  {
    title: 'Polícia Federal - Agente & Escrivão',
    career: 'policial',
    banca: 'Cebraspe',
    icon: '🚔',
    recommendedGuardian: 'lobo',
    tag: '1 Errada Anula 1 Certa',
    description: 'Foco em Penal, TI, RLM e Contabilidade com cálculo de pontuação líquida.',
    keywords: ['policia federal', 'agente de policia federal', 'escrivao', ' pf '],
  },
  {
    title: 'PRF - Policial Rodoviário Federal',
    career: 'policial',
    banca: 'Cebraspe',
    icon: '⚡',
    recommendedGuardian: 'lobo',
    tag: 'Alta Pressão Tática',
    description: 'Legislação de Trânsito, Física Aplicada e Direito com foco em casos práticos.',
    keywords: ['prf', 'rodoviaria'],
  },
  {
    title: 'Receita Federal - Auditor-Fiscal',
    career: 'fiscal',
    banca: 'FGV',
    icon: '🦅',
    recommendedGuardian: 'gaviao',
    tag: 'Teto do Executivo',
    description: 'Enunciados densos da FGV, Contabilidade Avançada, Auditoria e Tributário.',
    keywords: ['receita federal', 'auditor-fiscal', 'auditor fiscal'],
  },
  {
    title: 'TJ-SP & Tribunais Estaduais',
    career: 'tribunais',
    banca: 'Vunesp',
    icon: '⚖️',
    recommendedGuardian: 'raposa',
    tag: 'Lei Seca Literal',
    description: 'Exigência extrema de memorização de artigos literais e normas internas.',
    keywords: ['tj-sp', 'tjsp', 'tribunal de justica', 'tribunais estaduais', 'escrevente'],
  },
  {
    title: 'Carreiras Jurídicas (Magistratura/MP/OAB)',
    career: 'juridica',
    banca: 'FGV',
    icon: '🏛️',
    recommendedGuardian: 'coruja',
    tag: 'Jurisprudência em Teses',
    description: 'Informativos recentes STF/STJ, súmulas vinculantes e doutrina majoritária.',
    keywords: ['magistratura', 'ministerio publico', 'oab', 'carreiras juridicas', 'defensoria'],
  },
  {
    title: 'Concurso Nacional Unificado (CNU)',
    career: 'administrativa',
    banca: 'Cesgranrio',
    icon: '🌐',
    recommendedGuardian: 'leao',
    tag: 'Eixos Transversais',
    description: 'Realidade brasileira, políticas públicas, gestão governamental e ética.',
    keywords: ['cnu', 'nacional unificado'],
  },
];

export const WEAK_SUBJECT_DEFAULT = 'Direito Administrativo';
export const HOURS_OPTIONS = [2, 4, 6, 8] as const;
export const DEFAULT_RECOMMENDED_GUARDIAN: GuardianAnimalId = 'lobo';
export const CUSTOM_EXAM_BANCA = 'Banca Especial';
export const CUSTOM_EXAM_MAX_LENGTH = 80;
export const WAR_NAME_MAX_LENGTH = 40;

export const ONBOARDING_COMPLETED_KEY = 'argus_onboarding_completed';
export const ONBOARDING_SKIPPED_KEY = 'argus_onboarding_skipped_at';
export const ONBOARDING_PROFILE_KEY = 'argus_student_profile';
export const ONBOARDING_EMAIL_SENT_KEY = 'argus_welcome_email_sent_to';
export const ONBOARDING_DRAFT_KEY = 'argus_onboarding_draft';
/** Após "Pular", não reabre sozinho por 3 dias */
export const ONBOARDING_SKIP_SUPPRESS_MS = 3 * 24 * 60 * 60 * 1000;

// Regra 9 & Validação de Produto ("O QUE essa resposta vai mudar?"):
// Explicação em 1 linha do benefício direto ao aluno e impacto algorítmico real
export const QUESTION_VALUE_PROPOSITIONS: Record<number, { whyWeAsk: string; whatItChanges: string }> = {
  1: {
    whyWeAsk: 'Identificamos o vício que mais reduz sua pontuação líquida nas provas.',
    whatItChanges: 'Calibra o algoritmo de repetição espaçada e engenharia reversa para blindar seu ponto fraco.'
  },
  2: {
    whyWeAsk: 'Carregamos a matriz de incidência da banca examinadora do seu concurso.',
    whatItChanges: 'Filtra os 20% do edital que respondem por 80% das questões históricas da sua carreira.'
  },
  3: {
    whyWeAsk: 'Mapeamos a disciplina que mais ameaça sua aprovação na nota de corte.',
    whatItChanges: 'Aloca essa matéria no primeiro bloco do seu ciclo de estudos das primeiras 24 horas.'
  },
  4: {
    whyWeAsk: 'Calculamos a dosagem de questões e revisões viável para a sua rotina real.',
    whatItChanges: 'Define a cota líquida de questões/dia sem sobrecarga cognitiva ou risco de desistência.'
  },
  5: {
    whyWeAsk: 'Ativamos o arquétipo de inteligência com bônus estatísticos para o seu edital.',
    whatItChanges: 'Gera seu Passaporte Tático de posse com imunidade ampliada a pegadinhas da banca.'
  }
};

// Regra 10: Não peça o que o sistema consiga descobrir sozinho
export interface UserDetectedContext {
  timeZone: string;
  locale: string;
  deviceType: 'mobile' | 'desktop';
  currency: string;
}

export function autoDetectUserContext(): UserDetectedContext {
  let timeZone = 'America/Sao_Paulo';
  let locale = 'pt-BR';
  let deviceType: 'mobile' | 'desktop' = 'desktop';

  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || timeZone;
    }
  } catch {}

  try {
    if (typeof navigator !== 'undefined') {
      locale = navigator.language || locale;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        deviceType = 'mobile';
      }
    }
  } catch {}

  return {
    timeZone,
    locale,
    deviceType,
    currency: 'BRL',
  };
}

// Regra 11: Salve a resposta a cada passo (Auto-save no localStorage)
export interface OnboardingDraftPayload {
  step: number;
  form: Partial<OnboardingFormState>;
  savedAt: number;
}

export function saveOnboardingDraft(step: number, form: OnboardingFormState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const payload: OnboardingDraftPayload = {
      step,
      form,
      savedAt: Date.now(),
    };
    localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(payload));
  } catch {}
}

export function loadOnboardingDraft(): OnboardingDraftPayload | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Válido por até 7 dias
    if (Date.now() - parsed.savedAt > 7 * 24 * 60 * 60 * 1000) {
      clearOnboardingDraft();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearOnboardingDraft(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    }
  } catch {}
}

// ---------------------------------------------------------------------------
// Texto
// ---------------------------------------------------------------------------

export function normalizeText(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove caracteres de marcação, colapsa espaços e limita o tamanho do nome de guerra. */
export function sanitizeWarName(value: string): string {
  return (value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, WAR_NAME_MAX_LENGTH);
}

export function sanitizeCustomExam(value: string): string {
  return (value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart()
    .slice(0, CUSTOM_EXAM_MAX_LENGTH);
}

export function isValidEmail(email?: string | null): boolean {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()));
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------

/** O perfil é o "placeholder" padrão do app (ninguém fez onboarding ainda)? */
export function isPlaceholderProfile(profile?: Partial<StudentProfile> | null): boolean {
  if (!profile) return true;
  const sameTarget =
    !profile.targetExamTitle || profile.targetExamTitle === DEFAULT_STUDENT_PROFILE.targetExamTitle;
  const sameWarName = !profile.warName || profile.warName === DEFAULT_STUDENT_PROFILE.warName;
  return sameTarget && sameWarName;
}

/** Encontra o card de edital que melhor representa um título livre (ou null). */
export function matchPopularTarget(title?: string | null): PopularTarget | null {
  if (!title) return null;
  const exact = POPULAR_TARGETS.find((t) => t.title === title);
  if (exact) return exact;

  const normalized = ` ${normalizeText(title)} `;
  // O placeholder "Polícia Federal & Rodoviária Federal" é ambíguo → não escolhe nada
  if (normalized.includes('policia federal') && normalized.includes('rodoviaria')) return null;

  return POPULAR_TARGETS.find((t) => t.keywords.some((k) => normalized.includes(k))) || null;
}

export function snapHours(hours?: number): number {
  const value = Number.isFinite(hours) ? (hours as number) : 4;
  return HOURS_OPTIONS.reduce((best, h) => (Math.abs(h - value) < Math.abs(best - value) ? h : best), 4 as number);
}

export interface OnboardingFormState {
  painPoint: PainPointId;
  /** Título final do edital (vazio = ainda não escolhido) */
  targetExamTitle: string;
  targetCareer: TargetCareer;
  detectedBanca: string;
  customExamInput: string;
  warName: string;
  weakSubject: string;
  dailyHoursGoal: number;
  experienceLevel: ExperienceLevel;
  guardianId: GuardianAnimalId;
  /** O guardião já veio escolhido pelo usuário (não deve ser sobrescrito por recomendação) */
  guardianTouched: boolean;
}

/** Estado inicial do formulário a partir do perfil salvo (ignorando valores placeholder). */
export function buildInitialOnboardingState(
  profile: Partial<StudentProfile> | null | undefined,
  weakSubjectOptions: string[] = []
): OnboardingFormState {
  const real = !isPlaceholderProfile(profile);
  const p = (real ? profile : null) || {};

  const matched = matchPopularTarget(p.targetExamTitle);
  const hasCustomTarget = Boolean(p.targetExamTitle && !matched);

  const validGuardian = GUARDIAN_ANIMALS.some((a) => a.id === p.guardianAnimalId);
  const guardianId: GuardianAnimalId = validGuardian
    ? (p.guardianAnimalId as GuardianAnimalId)
    : matched?.recommendedGuardian || DEFAULT_RECOMMENDED_GUARDIAN;

  const weakSubject =
    p.weakSubject && (weakSubjectOptions.length === 0 || weakSubjectOptions.includes(p.weakSubject))
      ? p.weakSubject
      : WEAK_SUBJECT_DEFAULT;

  return {
    painPoint: p.mainPainPoint || 'pegadinhas',
    targetExamTitle: matched?.title || (hasCustomTarget ? (p.targetExamTitle as string) : ''),
    targetCareer: matched?.career || p.targetCareer || 'policial',
    detectedBanca: matched?.banca || (hasCustomTarget ? p.targetBanca || CUSTOM_EXAM_BANCA : ''),
    customExamInput: hasCustomTarget ? (p.targetExamTitle as string) : '',
    warName: sanitizeWarName(p.warName || ''),
    weakSubject,
    dailyHoursGoal: snapHours(p.dailyHoursGoal),
    experienceLevel: p.experienceLevel || 'intermediario',
    guardianId,
    guardianTouched: validGuardian,
  };
}

// ---------------------------------------------------------------------------
// Abertura automática
// ---------------------------------------------------------------------------

export interface AutoOpenInput {
  completed: boolean;
  hasSavedProfile: boolean;
  skippedAt?: string | number | null;
  now?: number;
}

/** O onboarding deve abrir sozinho após o splash? */
export function shouldAutoOpenOnboarding({
  completed,
  hasSavedProfile,
  skippedAt,
  now = Date.now(),
}: AutoOpenInput): boolean {
  if (completed || hasSavedProfile) return false;
  if (skippedAt) {
    const skippedTime = typeof skippedAt === 'number' ? skippedAt : Number(skippedAt);
    if (Number.isFinite(skippedTime) && now - skippedTime < ONBOARDING_SKIP_SUPPRESS_MS) {
      return false;
    }
  }
  return true;
}

/** Escolhe o e-mail de boas-vindas: usuário autenticado > perfil > e-mail salvo. Ignora demo. */
export function pickWelcomeEmail(...candidates: Array<string | null | undefined>): string | null {
  for (const c of candidates) {
    if (isValidEmail(c) && !/@(argus\.app|argus\.app\.br|learningai\.com\.br)$/i.test((c as string).trim())) {
      return (c as string).trim().toLowerCase();
    }
  }
  return null;
}
