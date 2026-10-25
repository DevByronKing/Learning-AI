'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  BrainCircuit,
  Target,
  Activity,
  Check,
  Timer,
  BarChart3,
  Brain,
  AlertTriangle,
  Flame,
  CreditCard,
} from 'lucide-react';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import { GuardianAnimalId, StudentProfile } from '@/lib/types';
import { analytics } from '@/lib/analytics';
import { useExperiment } from '@/lib/abTesting';
import { getRealAuthUser } from '@/lib/authIdentity';
import { BrandLogo } from './BrandLogo';
import { Button, Input, Badge, ProgressBar, Avatar } from '@/components/ui';
import {
  POPULAR_TARGETS,
  PopularTarget,
  OnboardingFormState,
  CUSTOM_EXAM_BANCA,
  WAR_NAME_MAX_LENGTH,
  CUSTOM_EXAM_MAX_LENGTH,
  ONBOARDING_COMPLETED_KEY,
  ONBOARDING_SKIPPED_KEY,
  ONBOARDING_PROFILE_KEY,
  ONBOARDING_EMAIL_SENT_KEY,
  QUESTION_VALUE_PROPOSITIONS,
  autoDetectUserContext,
  saveOnboardingDraft,
  loadOnboardingDraft,
  clearOnboardingDraft,
  buildInitialOnboardingState,
  matchPopularTarget,
  pickWelcomeEmail,
  sanitizeCustomExam,
  sanitizeWarName,
} from './onboarding/onboardingData';

export interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<StudentProfile>, destinationTab?: 'cycle' | 'simulator' | 'pricing') => void;
  currentProfile?: StudentProfile;
  onOpenPricing?: () => void;
  theme?: 'dark' | 'light';
}

// As 4 Grandes Dores Estruturais que Reprovam 95% dos Candidatos
const PAIN_POINTS = [
  {
    id: 'pegadinhas' as const,
    icon: AlertTriangle,
    headline: 'A Cilada das Pegadinhas & Distratores',
    subtext: 'Você domina o conteúdo teórico, mas a banca troca uma vírgula ou joga uma exceção obscura e você perde pontos.',
    metric: 'Vulnerabilidade a Pegadinhas: 88%',
    solution: 'Protocolo TRI de Engenharia Reversa: Vacinação contra distratores históricos da banca.',
    badgeVariant: 'error' as const
  },
  {
    id: 'tempo' as const,
    icon: Timer,
    headline: 'Asfixia por Sobrecarga de Editais',
    subtext: 'PDFs intermináveis de 200 páginas, videoaulas lentas e a sensação de nunca conseguir cobrir o edital.',
    metric: 'Sobrecarga Cognitiva: Crítica',
    solution: 'Filtro Preditivo 80/20: Foco no quarto do edital que responde por 80% das questões.',
    badgeVariant: 'warning' as const
  },
  {
    id: 'estagnado' as const,
    icon: BarChart3,
    headline: 'O Muro dos 60-70% (Platô de Desempenho)',
    subtext: 'Você estuda todos os dias há meses, mas sua média de acertos travou e a nota de corte parece inalcançável.',
    metric: 'Estagnação Tática: Alta',
    solution: 'Caderno de Erros Ativo: Diagnóstico de causa-raiz para eliminar pontos cegos.',
    badgeVariant: 'brand' as const
  },
  {
    id: 'esquecimento' as const,
    icon: Brain,
    headline: 'A Curva Impiedosa do Esquecimento',
    subtext: 'Você estuda hoje e daqui a 3 semanas esqueceu quase tudo, tendo a sensação de recomeçar do zero.',
    metric: 'Erosão Mnemônica: ~75% em 14 dias',
    solution: 'Repetição Espaçada SM-2: Revisões programadas no instante exato da curva de retenção.',
    badgeVariant: 'accent' as const
  }
];

// Disciplinas Críticas mais temidas
const WEAK_SUBJECT_OPTIONS = [
  { name: 'Direito Administrativo', tag: 'Licitações 14.133 & Atos' },
  { name: 'Direito Penal / Processo', tag: 'Teoria do Crime & Inquérito' },
  { name: 'Direito Constitucional', tag: 'Controle de Const. & Direitos' },
  { name: 'Raciocínio Lógico (RLM)', tag: 'Tabela Verdade & Análise Comb.' },
  { name: 'Português FGV / Cebraspe', tag: 'Interpretação e Reescrita' },
  { name: 'Informática & TI', tag: 'Redes, Segurança e Banco de Dados' },
  { name: 'Direito Tributário', tag: 'Impostos, CTN e Repartição' },
  { name: 'Contabilidade Geral', tag: 'DRE, Balanço & CPC' },
  { name: 'Legislação Institucional', tag: 'Regimes Jurídicos & Ética' }
];

const WEAK_SUBJECT_NAMES = WEAK_SUBJECT_OPTIONS.map((s) => s.name);

const STEP_TITLES = [
  'O Mapeamento da Ferida',
  'O Alvo & O Adversário',
  'O Calcanhar de Aquiles',
  'O Guardião Cognitivo',
  'O Veredito & Passaporte'
];

const STEP_ANALYTICS_NAMES = [
  'Anamnese da Ferida',
  'Alvo & Adversário',
  'Calcanhar de Aquiles',
  'Guardião Cognitivo',
  'Veredito & Passaporte'
];

type StepNumber = 1 | 2 | 3 | 4 | 5;

/**
 * Card selecionável acessível (botão com aria-pressed) construído sobre os tokens do Design System.
 */
const OptionCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  tone?: 'brand' | 'accent';
  className?: string;
  children: React.ReactNode;
}> = ({ selected, onClick, tone = 'brand', className = '', children }) => {
  const selectedClasses =
    tone === 'accent'
      ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-subtle)] shadow-[var(--shadow-accent)] ring-2 ring-[var(--brand-accent)]'
      : 'border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] shadow-[var(--shadow-brand)] ring-2 ring-[var(--border-focus)]';
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`border text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
        selected
          ? selectedClasses
          : 'bg-[var(--surface-card)] hover:bg-[var(--surface-elevated)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] shadow-[var(--shadow-sm)]'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentProfile,
  theme
}) => {
  // Estado do formulário (passos 1 a 4) inicializado a partir do draft salvo ou perfil atual
  const [form, setForm] = useState<OnboardingFormState>(() => {
    const draft = loadOnboardingDraft();
    const initial = buildInitialOnboardingState(currentProfile, WEAK_SUBJECT_NAMES);
    if (draft?.form) {
      return { ...initial, ...draft.form };
    }
    return initial;
  });

  // Step State: 1 a 5 (restaura etapa do draft caso exista)
  const [step, setStep] = useState<StepNumber>(() => {
    const draft = loadOnboardingDraft();
    if (draft?.step && draft.step >= 1 && draft.step <= 5) {
      return draft.step as StepNumber;
    }
    return 1;
  });

  const [lastPredefined, setLastPredefined] = useState<PopularTarget | null>(() =>
    matchPopularTarget(form.targetExamTitle)
  );

  // Etapa 5: Compilação Tática & Emissão do Passaporte
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [tacticalLogs, setTacticalLogs] = useState<string[]>([]);

  // Detecção ativa de Tema Claro vs Escuro
  const [isDark, setIsDark] = useState(true);

  const { variant: authPlacementVariant } = useExperiment('auth_placement');

  // Refs para valores "mais recentes" sem recriar efeitos
  const formRef = useRef(form);
  formRef.current = form;
  const profileRef = useRef(currentProfile);
  profileRef.current = currentProfile;
  const variantRef = useRef(authPlacementVariant);
  variantRef.current = authPlacementVariant;
  const stepRef = useRef(step);
  stepRef.current = step;

  const compileTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSubmittedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Regra 11: Salve a resposta a cada passo no localStorage
  const patchForm = useCallback((patch: Partial<OnboardingFormState>) => {
    setForm((prev) => {
      const updated = { ...prev, ...patch };
      saveOnboardingDraft(stepRef.current, updated);
      return updated;
    });
  }, []);

  const stopCompileTimer = useCallback(() => {
    if (compileTimerRef.current) {
      clearInterval(compileTimerRef.current);
      compileTimerRef.current = null;
    }
  }, []);

  // Regra 10: Auto-detecção de contexto sem intervenção manual do usuário
  useEffect(() => {
    if (isOpen) {
      const detected = autoDetectUserContext();
      analytics.track('onboarding_context_detected', {
        time_zone: detected.timeZone,
        locale: detected.locale,
        device_type: detected.deviceType,
      });
    }
  }, [isOpen]);

  // Reset ao (re)abrir: se não houver draft ativo, ressincroniza com perfil
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      const draft = loadOnboardingDraft();
      const initial = buildInitialOnboardingState(currentProfile, WEAK_SUBJECT_NAMES);
      const merged = draft?.form ? { ...initial, ...draft.form } : initial;
      setForm(merged);
      setLastPredefined(matchPopularTarget(merged.targetExamTitle));
      setStep((draft?.step && draft.step >= 1 && draft.step <= 5 ? draft.step : 1) as StepNumber);
      setIsCompiling(false);
      setCompilationProgress(0);
      setTacticalLogs([]);
    }
  }

  useEffect(() => {
    if (isOpen) {
      isSubmittedRef.current = false;
    } else {
      stopCompileTimer();
    }
  }, [isOpen, stopCompileTimer]);

  // Limpa o timer de compilação ao desmontar
  useEffect(() => stopCompileTimer, [stopCompileTimer]);

  useEffect(() => {
    if (theme) {
      setIsDark(theme === 'dark');
    } else if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [theme, isOpen]);

  const selectedGuardian = useMemo(
    () => GUARDIAN_ANIMALS.find((a) => a.id === form.guardianId) || GUARDIAN_ANIMALS[0],
    [form.guardianId]
  );

  const selectedPain = useMemo(
    () => PAIN_POINTS.find((p) => p.id === form.painPoint) || PAIN_POINTS[0],
    [form.painPoint]
  );

  const recommendedGuardianId = useMemo<GuardianAnimalId | null>(
    () => matchPopularTarget(form.targetExamTitle)?.recommendedGuardian ?? null,
    [form.targetExamTitle]
  );

  const {
    painPoint,
    targetExamTitle,
    detectedBanca,
    customExamInput,
    warName,
    weakSubject,
    dailyHoursGoal,
    experienceLevel,
  } = form;
  const selectedGuardianId = form.guardianId;

  // Lock body scroll durante exibição do modal (restaura o valor anterior ao fechar)
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Rastreamento automático do funil de onboarding a cada etapa (apenas quando a etapa muda)
  useEffect(() => {
    if (!isOpen) return;
    const f = formRef.current;
    analytics.track('onboarding_step_viewed', {
      step_number: step,
      step_name: STEP_ANALYTICS_NAMES[step - 1],
      target_career: f.targetCareer,
      target_exam: f.targetExamTitle,
      detected_banca: f.detectedBanca,
      auth_placement: variantRef.current,
    });
  }, [isOpen, step]);

  // Cada etapa começa no topo
  useEffect(() => {
    bodyRef.current?.scrollTo?.({ top: 0 });
  }, [step]);

  // Dispensar (Pular / Esc / fechar antes do passo 5): registra para não reabrir sozinho por alguns dias
  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_SKIPPED_KEY, String(Date.now()));
    } catch {}
    analytics.track('onboarding_skipped', { step_number: stepRef.current });
    onClose();
  }, [onClose]);

  // Foco: entra no diálogo, prende o Tab dentro dele e devolve o foco ao fechar
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();

    const handleTab = (e: KeyboardEvent) => {
      const node = cardRef.current;
      if (e.key !== 'Tab' || !node) return;
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const outside = !node.contains(active) || active === node;
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleTab);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  // Tecla Escape fecha se estiver antes do passo 5
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step < 5) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, handleDismiss]);

  // Seleção de edital pré-definido: o guardião recomendado só é aplicado se o usuário ainda não escolheu um
  const handleSelectPredefinedTarget = (target: PopularTarget) => {
    setLastPredefined(target);
    setForm((prev) => ({
      ...prev,
      targetExamTitle: target.title,
      targetCareer: target.career,
      detectedBanca: target.banca,
      customExamInput: '',
      guardianId: prev.guardianTouched ? prev.guardianId : target.recommendedGuardian,
    }));
  };

  const handleCustomExamChange = (raw: string) => {
    const val = sanitizeCustomExam(raw);
    if (val.trim()) {
      patchForm({
        customExamInput: val,
        targetExamTitle: val.trim(),
        detectedBanca: CUSTOM_EXAM_BANCA,
        targetCareer: 'outra',
      });
    } else if (lastPredefined) {
      // Campo apagado: volta ao último edital pré-definido em vez de manter o texto antigo
      setForm((prev) => ({
        ...prev,
        customExamInput: '',
        targetExamTitle: lastPredefined.title,
        targetCareer: lastPredefined.career,
        detectedBanca: lastPredefined.banca,
      }));
    } else {
      patchForm({ customExamInput: '', targetExamTitle: '', detectedBanca: '', targetCareer: 'policial' });
    }
  };

  const hasTarget = Boolean(targetExamTitle.trim());

  // Etapa 5: Disparar compilação tática (Aha Moment)
  const triggerCompilationAndPassport = () => {
    stopCompileTimer();
    const f = formRef.current;
    const guardianName = selectedGuardian.name;

    setStep(5);
    setIsCompiling(true);
    setCompilationProgress(5);
    setTacticalLogs([
      '⚡ KERNEL NEURAL COGNITIVO v3.0 INICIALIZADO...',
      `> Cruzando 120.000 questões históricas da banca examinadora [${f.detectedBanca}]...`
    ]);

    const milestones: Record<number, string> = {
      28: `> Identificando armadilhas de alta incidência em [${f.weakSubject}]...`,
      46: `> Conectando Repetição Espaçada SM-2 com arquétipo [${guardianName}]...`,
      64: `> Gerando cronograma adaptativo de ${f.dailyHoursGoal}h/dia para ${f.warName.trim() || 'Concurseiro(a)'}...`,
      82: '> Selando credencial oficial LAI-2026 com criptografia SHA-256...'
    };

    let currentProg = 10;
    compileTimerRef.current = setInterval(() => {
      currentProg += 18;
      if (currentProg >= 100) {
        stopCompileTimer();
        setCompilationProgress(100);
        setIsCompiling(false);
        setTacticalLogs((prev) => [
          ...prev,
          `> [OK] Mapeamento de pegadinhas e distratores da banca ${f.detectedBanca} concluído.`,
          `> [OK] Vacina cognitiva anti-falha calibrada para: ${f.weakSubject}.`,
          `> [OK] Ciclo Alexandre Meirelles calibrado para ${f.dailyHoursGoal}h diárias líquidas.`,
          `> [OK] Guardião [${guardianName}] sincronizado ao seu perfil tático.`,
          '> [PASSAPORTE COGNITIVO EMITIDO]: Plano de Ataque das Primeiras 24h Liberado!'
        ]);
        return;
      }
      setCompilationProgress(currentProg);
      const message = milestones[currentProg];
      if (message) {
        setTacticalLogs((prev) => [...prev, message]);
      }
    }, 150);
  };

  const handleFinalSubmit = (
    destinationTab: 'cycle' | 'simulator' | 'pricing' = 'pricing',
    cta: 'pro' | 'trial' | 'close' = 'pro'
  ) => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;

    const f = formRef.current;
    const cleanWarName = f.warName.trim();
    const existingProfile = profileRef.current;
    const hasRealName = existingProfile?.name && existingProfile.name !== 'Concurseiro(a)';

    const finalProfile: Partial<StudentProfile> = {
      name: cleanWarName || (hasRealName ? existingProfile?.name : '') || 'Concurseiro(a)',
      warName: cleanWarName || 'Futuro Servidor',
      targetCareer: f.targetCareer,
      targetExamTitle: f.targetExamTitle,
      targetBanca: f.detectedBanca,
      weakSubject: f.weakSubject,
      dailyHoursGoal: f.dailyHoursGoal,
      experienceLevel: f.experienceLevel,
      guardianAnimalId: f.guardianId,
      mainPainPoint: f.painPoint,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(finalProfile));
      localStorage.removeItem(ONBOARDING_SKIPPED_KEY);
    } catch {}

    analytics.track('onboarding_completed', {
      war_name: cleanWarName || 'Futuro Servidor',
      target_career: f.targetCareer,
      target_exam: f.targetExamTitle,
      detected_banca: f.detectedBanca,
      guardian_animal: f.guardianId,
      daily_hours: f.dailyHoursGoal,
      experience_level: f.experienceLevel,
      main_pain_point: f.painPoint,
      destination_tab: destinationTab,
      cta,
      auth_placement: variantRef.current,
    });

    // Disparo assíncrono do E-mail de Boas-Vindas (somente e-mail real, uma única vez por endereço)
    try {
      let storedEmail: string | null = null;
      try {
        storedEmail = localStorage.getItem('user_email');
      } catch {}
      const userEmail = pickWelcomeEmail(getRealAuthUser()?.email, existingProfile?.email, storedEmail);
      const alreadySent = userEmail ? localStorage.getItem(ONBOARDING_EMAIL_SENT_KEY) === userEmail : true;

      if (userEmail && !alreadySent) {
        fetch('/api/welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanWarName || existingProfile?.name || 'Aluno(a)',
            email: userEmail,
            targetExam: f.targetExamTitle,
            guardianAnimal: selectedGuardian.name,
            preferredStudyHours: f.dailyHoursGoal,
          }),
        })
          .then((res) => {
            if (res.ok) {
              try {
                localStorage.setItem(ONBOARDING_EMAIL_SENT_KEY, userEmail);
              } catch {}
            }
          })
          .catch((err) => console.debug('Welcome email dispatch non-blocking log:', err));
      }
    } catch {}

    // Regra 11: Onboarding concluído com sucesso, limpa o rascunho temporário
    clearOnboardingDraft();

    onComplete(finalProfile, destinationTab);
  };

  // Botão X: antes do passo 5 dispensa o fluxo; no passo 5 salva o perfil e segue o funil linear
  const handleCloseClick = () => {
    if (step < 5) {
      handleDismiss();
    } else if (!isCompiling) {
      handleFinalSubmit('pricing', 'close');
    }
  };

  if (!isOpen) return null;

  const projectedQuestionsPerDay = Math.round(dailyHoursGoal * 8);
  const projectedFlashcardsPerDay = Math.round(dailyHoursGoal * 4);
  const nextDisabled = step === 2 && !hasTarget;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      data-theme-mode={isDark ? 'dark' : 'light'}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 select-none overflow-hidden animate-fadeIn"
      style={{
        backgroundColor: 'var(--surface-overlay)'
      }}
    >
      {/* Halo de iluminação focal volumétrica sutil com a cor de assinatura do guardião */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${selectedGuardian.glowColor || 'rgba(67, 56, 202, 0.2)'} 0%, transparent 65%)`
        }}
      />

      {/* Card Central — Construído 100% sobre o Design System */}
      <div
        ref={cardRef}
        tabIndex={-1}
        className="relative w-full max-w-4xl rounded-[var(--radius-xl)] overflow-hidden flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[90dvh] transition-all duration-300 shadow-[var(--shadow-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] outline-none"
      >
        {/* Linha superior de acento visual da marca */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent z-20 pointer-events-none" />

        {/* ================================================================= */}
        {/* BARRA SUPERIOR: Identidade + Ações */}
        {/* ================================================================= */}
        <div className="px-4 sm:px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 bg-[var(--surface-elevated)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo size={34} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-primary)] font-mono truncate">
                  ANAMNESE COGNITIVA & POSSE
                </span>
                <span className="text-[10px] font-bold text-[var(--text-muted)] whitespace-nowrap">
                  • Etapa {step} de 5
                </span>
                {step >= 4 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black animate-pulse">
                    ⚡ Quase lá! Falta pouco!
                  </span>
                )}
              </div>
              <h2 id="onboarding-title" className="text-sm font-extrabold text-[var(--text-primary)] truncate">
                {STEP_TITLES[step - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {step < 5 && (
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                Pular
              </Button>
            )}
            {!(step === 5 && isCompiling) && (
              <button
                type="button"
                onClick={handleCloseClick}
                className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                title={step < 5 ? 'Fechar Anamnese' : 'Concluir e ver planos'}
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stepper Visual de 5 Etapas com Design System */}
        <div className="px-4 sm:px-5 py-2.5 bg-[var(--surface-bg)] border-b border-[var(--border-subtle)] shrink-0">
          <ol className="flex items-center gap-2 max-w-3xl mx-auto" aria-label="Progresso do onboarding">
            {[1, 2, 3, 4, 5].map((s) => (
              <li
                key={s}
                aria-current={s === step ? 'step' : undefined}
                aria-label={`Etapa ${s}${s < step ? ' concluída' : s === step ? ' atual' : ''}`}
                className={`flex items-center gap-2 ${s < 5 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 ${
                    s < step
                      ? 'bg-[var(--status-success)] text-white shadow-sm'
                      : s === step
                      ? 'bg-[var(--brand-primary)] text-[var(--text-on-brand)] shadow-md ring-2 ring-[var(--border-focus)]'
                      : 'border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-muted)]'
                  }`}
                >
                  {s < step ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      s < step ? 'bg-[var(--status-success)]' : 'bg-[var(--border-subtle)]'
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* ================================================================= */}
        {/* CORPO DO ONBOARDING: OS 5 PASSOS */}
        {/* ================================================================= */}
        <div ref={bodyRef} className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain">
          {/* Regra 9: Explique em uma linha por que está perguntando aquilo */}
          {QUESTION_VALUE_PROPOSITIONS[step] && (
            <div className="flex items-center justify-center gap-1.5 py-1 px-3 mb-3 rounded-[var(--radius-md)] bg-[var(--brand-primary-subtle)] border border-[var(--brand-primary)]/20 text-[11px] font-medium text-[var(--brand-primary)] max-w-xl mx-auto text-center animate-fadeIn">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span><strong>Por que perguntamos:</strong> {QUESTION_VALUE_PROPOSITIONS[step].whyWeAsk}</span>
            </div>
          )}

          {/* =============================================================== */}
          {/* ETAPA 1: O MAPEAMENTO DA FERIDA */}
          {/* =============================================================== */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto">
                <Badge variant="warning" hasDot icon={<AlertTriangle className="w-3.5 h-3.5" />} className="mb-2">
                  DIAGNÓSTICO PSICOMÉTRICO • 60 SEGUNDOS
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                  Onde a Banca Examinadora Está Te Derrubando?
                </h3>
                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl mx-auto text-[var(--text-secondary)]">
                  95% dos concurseiros são reprovados pelos mesmos 4 vícios estruturais do estudo passivo. Selecione sua maior dor para blindarmos seu sistema:
                </p>
              </div>

              {/* Grid 2x2 das 4 Dores com Cards Táteis do Design System */}
              <div
                role="group"
                aria-label="Sua maior dor nos estudos"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto pt-1"
              >
                {PAIN_POINTS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = painPoint === item.id;
                  return (
                    <OptionCard
                      key={item.id}
                      selected={isSelected}
                      onClick={() => patchForm({ painPoint: item.id })}
                      className="p-3.5 sm:p-4 rounded-[var(--radius-lg)] relative overflow-hidden group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[var(--brand-primary)] text-[var(--text-on-brand)]'
                            : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)]'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 min-w-0 pr-6">
                          <p className="text-sm font-black leading-snug text-[var(--text-primary)]">
                            {item.headline}
                          </p>
                          <p className="text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                            {item.subtext}
                          </p>
                          <div className="pt-1">
                            <Badge variant={item.badgeVariant} size="sm">
                              {item.metric}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Checkmark Indicador */}
                      <div
                        aria-hidden="true"
                        className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[var(--status-success)] text-white shadow-sm'
                            : 'border border-[var(--border-strong)] text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </OptionCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* ETAPA 2: O ALVO & O ADVERSÁRIO */}
          {/* =============================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <Badge variant="brand" hasDot icon={<Target className="w-3.5 h-3.5" />} className="mb-2">
                  TEATRO DE OPERAÇÕES • CARREIRA & BANCA
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                  Qual Batalha Você Vai Vencer no Diário Oficial?
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-[var(--text-secondary)]">
                  A inteligência do Argus adapta os simuladores, a matriz de relevância e o vocabulário de acordo com a banca examinadora do seu concurso:
                </p>
              </div>

              {/* Grid de Editais de Alta Concorrência */}
              <div
                role="group"
                aria-label="Edital alvo"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-3xl mx-auto"
              >
                {POPULAR_TARGETS.map((item) => {
                  const isSelected = targetExamTitle === item.title && !customExamInput;
                  return (
                    <OptionCard
                      key={item.title}
                      selected={isSelected}
                      onClick={() => handleSelectPredefinedTarget(item)}
                      className="p-3 rounded-[var(--radius-lg)] flex flex-col justify-between group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg" aria-hidden="true">{item.icon}</span>
                            <span className={`text-xs font-black ${isSelected ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                              {item.title}
                            </span>
                          </div>
                          <div
                            aria-hidden="true"
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[var(--brand-primary)] text-white' : 'border border-[var(--border-strong)] text-transparent'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <Badge variant="brand" size="sm">
                            {item.banca}
                          </Badge>
                          <span className="text-[var(--text-muted)] font-medium truncate">• {item.tag}</span>
                        </div>

                        <p className="text-[11px] leading-snug text-[var(--text-secondary)]">
                          {item.description}
                        </p>
                      </div>
                    </OptionCard>
                  );
                })}
              </div>

              {/* Outro concurso + Nome de guerra lado a lado (economiza altura) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto pt-1">
                <Input
                  label="OU DIGITE OUTRO CONCURSO / CARGO:"
                  value={customExamInput}
                  maxLength={CUSTOM_EXAM_MAX_LENGTH}
                  onChange={(e) => handleCustomExamChange(e.target.value)}
                  placeholder="Ex: Auditor SEFAZ-SP, Delegado PC-MG..."
                />
                <div className="space-y-1">
                  <Input
                    label="SEU NOME DE GUERRA (COMO QUER SER CHAMADO):"
                    value={warName}
                    maxLength={WAR_NAME_MAX_LENGTH}
                    autoComplete="nickname"
                    onChange={(e) => patchForm({ warName: sanitizeWarName(e.target.value) })}
                    placeholder="Ex: Agente Lucas, Dra. Camila..."
                    rightIcon={warName.trim().length >= 2 ? (
                      <span className="flex items-center gap-1 text-[var(--status-success)] text-[10px] font-mono font-bold pr-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>OK</span>
                      </span>
                    ) : undefined}
                  />
                  {/* Regra 4: Escolha é melhor do que digitar (1 toque) */}
                  <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">1 toque:</span>
                    {['Guerreiro(a)', 'Auditor(a)', 'Agente', 'Doutor(a)'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => patchForm({ warName: sug })}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-elevated)] hover:bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!hasTarget && (
                <div className="text-center pt-2 space-y-1.5">
                  <p role="status" className="text-[11px] font-mono font-bold text-[var(--status-warning)]">
                    Selecione um edital acima ou digite o seu concurso para continuar.
                  </p>
                  {/* Regra 2: Permitir pular etapas */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectPredefinedTarget(POPULAR_TARGETS[0]);
                        setStep(3);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[var(--brand-primary)] hover:underline cursor-pointer"
                    >
                      <span>Pular seleção e usar Edital Recomendado ({POPULAR_TARGETS[0].title.split('-')[0].trim()}) →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* ETAPA 3: CALCANHAR DE AQUILES & RITMO DE GUERRA */}
          {/* =============================================================== */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <Badge variant="error" hasDot icon={<Activity className="w-3.5 h-3.5" />} className="mb-2">
                  PONTO CRÍTICO • MATRIZ DE RISCO
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                  Qual é o seu &quot;Calcanhar de Aquiles&quot; nesta Prova?
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-[var(--text-secondary)]">
                  Identifique a disciplina que mais ameaça sua aprovação. Vamos priorizá-la nas primeiras 24 horas:
                </p>
              </div>

              {/* 1. Seleção da Matéria Mais Fraca */}
              <div className="max-w-3xl mx-auto space-y-1.5">
                <p className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Matéria que mais tira o seu sono:
                </p>
                <div role="group" aria-label="Matéria mais fraca" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {WEAK_SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = weakSubject === sub.name;
                    return (
                      <OptionCard
                        key={sub.name}
                        selected={isSelected}
                        onClick={() => patchForm({ weakSubject: sub.name })}
                        className="p-2.5 rounded-[var(--radius-md)]"
                      >
                        <p className={`text-xs font-black truncate ${isSelected ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] font-mono truncate mt-0.5 text-[var(--text-muted)]">
                          {sub.tag}
                        </p>
                      </OptionCard>
                    );
                  })}
                </div>
              </div>

              {/* 2. Horas Líquidas por Dia */}
              <div className="max-w-3xl mx-auto space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Ritmo de Guerra Diário (Horas Líquidas):
                  </p>
                  <span className="text-xs font-mono font-bold text-[var(--brand-primary)]">
                    {dailyHoursGoal}h líquidas/dia
                  </span>
                </div>
                <div role="group" aria-label="Horas líquidas por dia" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { h: 2, label: '2h / dia', badge: 'Constância' },
                    { h: 4, label: '4h / dia', badge: 'Alta Performance' },
                    { h: 6, label: '6h / dia', badge: 'Modo Guerra' },
                    { h: 8, label: '8h+ / dia', badge: 'Dedicação Total' }
                  ].map((item) => (
                    <OptionCard
                      key={item.h}
                      selected={dailyHoursGoal === item.h}
                      onClick={() => patchForm({ dailyHoursGoal: item.h })}
                      className="p-3 rounded-[var(--radius-md)]"
                    >
                      <span className={`text-xs font-black block ${dailyHoursGoal === item.h ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">
                        {item.badge}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--brand-accent)] font-bold block mt-0.5">
                        ~{item.h * 8} itens/dia
                      </span>
                    </OptionCard>
                  ))}
                </div>
              </div>

              {/* 3. Momento Atual do Candidato */}
              <div className="max-w-3xl mx-auto space-y-1.5 pt-1">
                <p className="text-xs font-mono font-bold uppercase tracking-wider block text-[var(--text-secondary)]">
                  Seu Momento Atual:
                </p>
                <div role="group" aria-label="Seu momento atual" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante' as const, title: 'Iniciante do Zero', desc: 'Construindo alicerce sem vícios teóricos' },
                    { id: 'intermediario' as const, title: 'Intermediário (60-70%)', desc: 'Buscando romper o teto da nota de corte' },
                    { id: 'veterano' as const, title: 'Avançado / Reta Final', desc: 'Ajuste fino cirúrgico em reta final' }
                  ].map((lvl) => (
                    <OptionCard
                      key={lvl.id}
                      tone="accent"
                      selected={experienceLevel === lvl.id}
                      onClick={() => patchForm({ experienceLevel: lvl.id })}
                      className="p-3 rounded-[var(--radius-md)]"
                    >
                      <p className={`text-xs font-black ${experienceLevel === lvl.id ? 'text-[var(--brand-accent)]' : 'text-[var(--text-primary)]'}`}>
                        {lvl.title}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-snug text-[var(--text-secondary)]">
                        {lvl.desc}
                      </p>
                    </OptionCard>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* ETAPA 4: O ARQUÉTIPO DO GUARDIÃO COGNITIVO */}
          {/* =============================================================== */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <Badge variant="accent" hasDot icon={<Shield className="w-3.5 h-3.5" />} className="mb-2">
                  ARQUÉTIPO DE COMBATE • SEU MENTOR ANIMAL
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                  Desperte Seu Guardião de Aprovação
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-[var(--text-secondary)]">
                  Cada guardião personifica uma força cognitiva da fauna brasileira com bônus estratégicos reais:
                </p>
              </div>

              {/* CARD DE DESTAQUE DO GUARDIÃO SELECIONADO — Feito com Avatar do Design System */}
              <div className="max-w-3xl mx-auto">
                <div
                  className="relative p-4 sm:p-5 rounded-[var(--radius-xl)] border-2 bg-[var(--surface-card)] shadow-[var(--shadow-lg)] overflow-hidden"
                  style={{ borderColor: selectedGuardian.glowColor || 'var(--brand-primary)' }}
                  aria-live="polite"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">

                    {/* AVATAR DO GUARDIÃO USANDO COMPONENTE DESIGN SYSTEM */}
                    <div className="relative shrink-0">
                      <Avatar
                        type={selectedGuardian.id as any}
                        size="xl"
                        shape="rounded"
                        showInsignia={true}
                      />
                    </div>

                    {/* INFOS E ATRIBUTOS */}
                    <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <Badge variant="brand" size="sm">
                            {selectedGuardian.archetype}
                          </Badge>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            Superpoder: {selectedGuardian.superpower}
                          </span>
                        </div>
                        <h4 className="text-xl font-black tracking-tight mt-0.5 text-[var(--text-primary)]">
                          {selectedGuardian.name}
                        </h4>
                        <p className="text-xs italic font-medium text-[var(--text-secondary)]">
                          {selectedGuardian.motto}
                        </p>
                      </div>

                      {/* 4 Barras de Atributos com ProgressBar do Design System */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                        <ProgressBar
                          value={selectedGuardian.stats.foco}
                          label="Foco Mental"
                          size="sm"
                          variant="brand"
                          showPercentage={true}
                          showCompleteMessage={false}
                        />
                        <ProgressBar
                          value={selectedGuardian.stats.velocidade}
                          label="Velocidade"
                          size="sm"
                          variant="gradient"
                          showPercentage={true}
                          showCompleteMessage={false}
                        />
                        <ProgressBar
                          value={selectedGuardian.stats.resiliencia}
                          label="Resiliência"
                          size="sm"
                          variant="accent"
                          showPercentage={true}
                          showCompleteMessage={false}
                        />
                        <ProgressBar
                          value={selectedGuardian.stats.estrategia}
                          label="Estratégia"
                          size="sm"
                          variant="brand"
                          showPercentage={true}
                          showCompleteMessage={false}
                        />
                      </div>

                      {/* Bônus Ativo */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-md)] bg-[var(--brand-primary-subtle)] border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] text-[11px] font-mono font-bold text-left">
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          <span>Bônus: +18% de Imunidade a Pegadinhas em {weakSubject}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SELETOR DE GUARDIÕES EM MINIATURA */}
              <div className="max-w-3xl mx-auto space-y-1.5 pt-1">
                <p className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Alternar Guardião Cognitivo:
                </p>
                <div role="group" aria-label="Escolha seu guardião" className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {GUARDIAN_ANIMALS.map((animal) => {
                    const isSelected = selectedGuardianId === animal.id;
                    const isRecommended = recommendedGuardianId === animal.id;
                    return (
                      <OptionCard
                        key={animal.id}
                        selected={isSelected}
                        onClick={() => patchForm({ guardianId: animal.id, guardianTouched: true })}
                        className="p-2 rounded-[var(--radius-md)] text-center flex flex-col items-center gap-0.5 relative"
                      >
                        <span className="text-2xl" aria-hidden="true">{animal.emoji}</span>
                        <span className={`text-[10px] truncate max-w-full ${isSelected ? 'font-black text-[var(--brand-primary)]' : 'font-bold text-[var(--text-secondary)]'}`}>
                          {animal.name.split(' ')[0]}
                        </span>
                        {isRecommended && (
                          <span className="text-[8px] font-mono font-black uppercase tracking-wide text-[var(--brand-accent)]">
                            Ideal p/ seu edital
                          </span>
                        )}
                      </OptionCard>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* ETAPA 5: O VEREDITO, PASSAPORTE HOLOGRÁFICO & PLANO 24H */}
          {/* =============================================================== */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              {isCompiling ? (
                /* TELA DE COMPILAÇÃO CIBERNÉTICA */
                <div className="max-w-xl mx-auto py-6 text-center space-y-5">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-[var(--brand-primary)] rounded-full animate-ping opacity-25 motion-reduce:animate-none" />
                    <div className="relative w-full h-full rounded-[var(--radius-xl)] bg-[var(--brand-primary)] flex items-center justify-center shadow-[var(--shadow-brand)]">
                      <BrainCircuit className="w-10 h-10 text-[var(--text-on-brand)] animate-pulse motion-reduce:animate-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                      Compilando Plano Tático & Passaporte...
                    </h3>
                    <p className="text-xs text-[var(--brand-primary)] font-mono font-bold">
                      Engenharia reversa em execução • {compilationProgress}%
                    </p>
                  </div>

                  {/* Barra de Progresso com o componente ProgressBar */}
                  <ProgressBar
                    value={compilationProgress}
                    size="md"
                    variant="gradient"
                    showPercentage={false}
                    showCompleteMessage={false}
                  />

                  {/* Terminal de Logs Táticos */}
                  <div
                    role="log"
                    aria-live="polite"
                    className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] font-mono text-[11px] text-left space-y-1 shadow-inner max-h-40 overflow-y-auto"
                  >
                    {tacticalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.startsWith('> [OK]')
                            ? 'text-[var(--status-success)] font-bold'
                            : log.startsWith('> [PASSAPORTE')
                            ? 'text-[var(--status-warning)] font-bold'
                            : 'text-[var(--text-muted)]'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* REVELAÇÃO DO PASSAPORTE & FUNIL LINEAR */
                <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">

                  {/* Cabeçalho */}
                  <div className="text-center space-y-1">
                    <Badge variant="success" hasDot icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      PLANO TÁTICO CERTIFICADO
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                      Seu Plano de Guerra Está Pronto, {warName.trim() || 'Futuro(a) Servidor(a)'}!
                    </h3>
                  </div>

                  {/* O CARTÃO DE PASSAPORTE HOLOGRÁFICO TITÂNIO & OURO */}
                  <div className="passport-card relative rounded-[var(--radius-xl)] p-5 sm:p-6 bg-gradient-to-br from-[#070b14] via-[#0d1426] to-[#080d1a] border border-cyan-500/40 shadow-2xl overflow-hidden text-white">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                      <div className="flex items-center sm:items-start gap-4">
                        <Avatar
                          type={selectedGuardian.id as any}
                          size="lg"
                          shape="rounded"
                          showInsignia={true}
                        />

                        <div className="space-y-1 text-center sm:text-left">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-mono font-black uppercase tracking-wider text-amber-300 inline-block">
                            ★ CREDENCIAL OFICIAL
                          </span>
                          <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white break-words">
                            {warName.trim() || 'Concurseiro(a)'}
                          </h4>
                          <p className="text-xs font-semibold text-indigo-300">
                            Guardião: {selectedGuardian.name} ({selectedGuardian.archetype})
                          </p>
                        </div>
                      </div>

                      <div className="text-center sm:text-right font-mono text-[10px] shrink-0">
                        <div
                          className="px-3 py-1.5 rounded-[var(--radius-md)] border"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            borderColor: 'rgba(255, 255, 255, 0.14)'
                          }}
                        >
                          <span className="text-cyan-300 font-bold block">LAI-2026-CERTIFIED</span>
                          <span className="text-slate-400 text-[9px] block">PADRÃO SHA-256</span>
                        </div>
                      </div>
                    </div>

                    {/* Metas do Passaporte */}
                    <div
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t text-left"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Edital Alvo
                        </span>
                        <span className="text-xs font-bold truncate block text-white" title={targetExamTitle}>
                          {targetExamTitle}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Banca
                        </span>
                        <span className="text-xs font-black text-cyan-400 block truncate">
                          {detectedBanca}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Meta Diária
                        </span>
                        <span className="text-xs font-black text-emerald-400 block">
                          {dailyHoursGoal}h líquidas/dia
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Alvo de Ataque
                        </span>
                        <span className="text-xs font-black text-amber-300 truncate block" title={weakSubject}>
                          {weakSubject}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PLANO DE ATAQUE DAS PRIMEIRAS 24 HORAS */}
                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--brand-primary)] flex items-center justify-center text-[var(--text-on-brand)]">
                        <Flame className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                        Plano Tático das Primeiras 24 Horas
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                        <div className="w-5 h-5 rounded-[var(--radius-xs)] bg-[var(--brand-primary)] flex items-center justify-center shrink-0 text-[var(--text-on-brand)] font-mono font-black text-[10px]">
                          1
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          <strong className="text-[var(--text-primary)]">Ataque ({dailyHoursGoal}h):</strong> {projectedQuestionsPerDay} Questões de {weakSubject} filtradas na banca {detectedBanca}.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                        <div className="w-5 h-5 rounded-[var(--radius-xs)] bg-[var(--brand-primary)] flex items-center justify-center shrink-0 text-[var(--text-on-brand)] font-mono font-black text-[10px]">
                          2
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          <strong className="text-[var(--text-primary)]">Vacina Mnemônica:</strong> {projectedFlashcardsPerDay} Flashcards com Repetição Espaçada SM-2.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                        <div className="w-5 h-5 rounded-[var(--radius-xs)] bg-[var(--brand-accent)] flex items-center justify-center shrink-0 text-white font-mono font-black text-[10px]">
                          3
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          <strong className="text-[var(--text-primary)]">Sua Dor Principal:</strong> {selectedPain.solution}
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)]">
                        <div className="w-5 h-5 rounded-[var(--radius-xs)] bg-[var(--status-success)] flex items-center justify-center shrink-0 text-white font-mono font-black text-[10px]">
                          4
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          <strong className="text-[var(--text-primary)]">Meta:</strong> Elevação de +15.4% de Precisão em {weakSubject} na primeira semana.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AÇÕES DE CONVERSÃO LINEAR COM COMPONENTES BUTTON DO DESIGN SYSTEM */}
                  {/* DIRETRIZ DE PRODUTO (Pilar 1): Funil 100% Linear sem Ramificações Gratuitas — ambos os CTAs levam aos planos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handleFinalSubmit('pricing', 'pro')}
                      leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="w-full uppercase tracking-wider"
                    >
                      Liberar Acesso Pro Imediato
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => handleFinalSubmit('pricing', 'trial')}
                      leftIcon={<CreditCard className="w-4 h-4 text-[var(--brand-accent)]" />}
                      className="w-full uppercase tracking-wider"
                    >
                      Iniciar 7 Dias Grátis com Cartão
                    </Button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* ================================================================= */}
        {/* RODAPÉ FIXO DE NAVEGAÇÃO: SEMPRE VISÍVEL */}
        {/* ================================================================= */}
        {step < 5 && (
          <div className="px-4 sm:px-5 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 shrink-0 bg-[var(--surface-elevated)]">
            {step === 1 ? (
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Etapa 1 de 5 • 4 Dores Mapeadas
              </span>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep((step - 1) as StepNumber)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Voltar
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              disabled={nextDisabled}
              onClick={() => {
                if (step === 4) {
                  triggerCompilationAndPassport();
                } else {
                  setStep((step + 1) as StepNumber);
                }
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="uppercase tracking-wider"
            >
              {step === 1
                ? 'Mapear Campo de Batalha'
                : step === 2
                ? 'Mapear Calcanhar de Aquiles'
                : step === 3
                ? 'Conhecer Seu Guardião'
                : 'Compilar Meu Plano de Guerra'}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOnboardingModal;
