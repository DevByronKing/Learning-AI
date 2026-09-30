'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { BrandLogo } from './BrandLogo';

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<StudentProfile>, destinationTab?: 'cycle' | 'simulator' | 'pricing') => void;
  currentProfile?: StudentProfile;
  onOpenPricing?: () => void;
}

// Catálogo de carreiras e editais de alta demanda no Brasil
const POPULAR_TARGETS = [
  {
    title: 'Polícia Federal - Agente & Escrivão',
    career: 'policial' as const,
    banca: 'Cebraspe',
    icon: '🚔',
    recommendedGuardian: 'lobo' as GuardianAnimalId,
    tag: 'Fator 1 Errada Anula 1 Certa',
    description: 'Foco em Penal, TI, RLM e Contabilidade com cálculo frio de pontuação líquida.'
  },
  {
    title: 'PRF - Policial Rodoviário Federal',
    career: 'policial' as const,
    banca: 'Cebraspe',
    icon: '⚡',
    recommendedGuardian: 'lobo' as GuardianAnimalId,
    tag: 'Alta Pressão Tática',
    description: 'Legislação de Trânsito, Física Aplicada e Direito com foco em casos práticos.'
  },
  {
    title: 'Receita Federal - Auditor-Fiscal',
    career: 'fiscal' as const,
    banca: 'FGV',
    icon: '🦅',
    recommendedGuardian: 'gaviao' as GuardianAnimalId,
    tag: 'Teto do Executivo',
    description: 'Enunciados longos da FGV, Contabilidade Avançada, Auditoria e Tributário.'
  },
  {
    title: 'TJ-SP & Tribunais Estaduais',
    career: 'tribunais' as const,
    banca: 'Vunesp',
    icon: '⚖️',
    recommendedGuardian: 'raposa' as GuardianAnimalId,
    tag: 'Lei Seca Literal',
    description: 'Exigência extrema de memorização de artigos literais e normas internas.'
  },
  {
    title: 'Carreiras Jurídicas (Magistratura/MP/OAB)',
    career: 'juridica' as const,
    banca: 'FGV',
    icon: '🏛️',
    recommendedGuardian: 'coruja' as GuardianAnimalId,
    tag: 'Jurisprudência em Teses',
    description: 'Informativos recentes STF/STJ, súmulas vinculantes e doutrina majoritária.'
  },
  {
    title: 'Concurso Nacional Unificado (CNU)',
    career: 'administrativa' as const,
    banca: 'Cesgranrio',
    icon: '🌐',
    recommendedGuardian: 'leao' as GuardianAnimalId,
    tag: 'Eixos Transversais',
    description: 'Realidade brasileira, políticas públicas, gestão governamental e ética.'
  }
];

// As 4 Grandes Dores Estruturais que Reprovam 95% dos Candidatos
const PAIN_POINTS = [
  {
    id: 'pegadinhas',
    icon: AlertTriangle,
    headline: 'A Cilada das Pegadinhas & Distratores',
    subtext: 'Você domina o conteúdo teórico, mas a banca troca uma vírgula ou joga uma exceção obscura e você perde pontos preciosos.',
    metric: 'Vulnerabilidade a Pegadinhas: 88%',
    solution: 'Protocolo TRI de Engenharia Reversa: Vacinação contra os vícios históricos do examinador.',
    borderSelected: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/80 shadow-md',
    badgeStyle: { backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#e11d48', borderColor: 'rgba(244, 63, 94, 0.25)' }
  },
  {
    id: 'tempo',
    icon: Timer,
    headline: 'Asfixia por Sobrecarga de Editais',
    subtext: 'PDFs intermináveis de 200 páginas, videoaulas lentas e a sensação angustiante de nunca conseguir cobrir o edital a tempo da prova.',
    metric: 'Sobrecarga Cognitiva: Crítica',
    solution: 'Filtro Preditivo 80/20: Foco obsessivo no quarto do edital que responde por 80% das questões.',
    borderSelected: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/80 shadow-md',
    badgeStyle: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', borderColor: 'rgba(245, 158, 11, 0.25)' }
  },
  {
    id: 'estagnado',
    icon: BarChart3,
    headline: 'O Muro dos 60-70% (Platô de Desempenho)',
    subtext: 'Você estuda todos os dias há meses, mas sua média de acertos empacou e a nota de corte parece uma barreira intransponível.',
    metric: 'Estagnação Tática: Alta',
    solution: 'Caderno de Erros Ativo: Diagnóstico de causa-raiz para eliminar pontos cegos recorrentes.',
    borderSelected: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/80 shadow-md',
    badgeStyle: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', borderColor: 'rgba(59, 130, 246, 0.25)' }
  },
  {
    id: 'esquecimento',
    icon: Brain,
    headline: 'A Curva Impiedosa do Esquecimento',
    subtext: 'Você estuda com afinco hoje, e daqui a 3 semanas esqueceu quase tudo, tendo a sensação desoladora de recomeçar do zero.',
    metric: 'Erosão Mnemônica: ~75% em 14 dias',
    solution: 'Repetição Espaçada SM-2: Revisões programadas no instante exato da curva de retenção.',
    borderSelected: 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/80 shadow-md',
    badgeStyle: { backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#9333ea', borderColor: 'rgba(168, 85, 247, 0.25)' }
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

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentProfile,
  onOpenPricing
}) => {
  // Step State: 1 a 5
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Dor & Diagnóstico
  const [painPoint, setPainPoint] = useState<string>('pegadinhas');

  // Step 2: Personalização Tática
  const [targetExamTitle, setTargetExamTitle] = useState(
    currentProfile?.targetExamTitle || 'Polícia Federal - Agente & Escrivão'
  );
  const [targetCareer, setTargetCareer] = useState<
    'policial' | 'fiscal' | 'tribunais' | 'administrativa' | 'juridica' | 'controle' | 'outra'
  >(currentProfile?.targetCareer || 'policial');
  const [detectedBanca, setDetectedBanca] = useState('Cebraspe');
  const [customExamInput, setCustomExamInput] = useState('');
  const [warName, setWarName] = useState(currentProfile?.warName || '');

  // Step 3: Calcanhar de Aquiles & Ritmo de Guerra
  const [weakSubject, setWeakSubject] = useState(currentProfile?.weakSubject || 'Direito Administrativo');
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(currentProfile?.dailyHoursGoal || 4);
  const [experienceLevel, setExperienceLevel] = useState<'iniciante' | 'intermediario' | 'veterano'>(
    currentProfile?.experienceLevel || 'intermediario'
  );

  // Step 4: O Arquétipo do Guardião Cognitivo
  const [selectedGuardianId, setSelectedGuardianId] = useState<GuardianAnimalId>(
    currentProfile?.guardianAnimalId || 'lobo'
  );

  // Step 5: Compilação Tática & Emissão do Passaporte
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [tacticalLogs, setTacticalLogs] = useState<string[]>([]);

  const selectedGuardian = useMemo(
    () => GUARDIAN_ANIMALS.find((a) => a.id === selectedGuardianId) || GUARDIAN_ANIMALS[0],
    [selectedGuardianId]
  );

  const selectedPain = useMemo(
    () => PAIN_POINTS.find((p) => p.id === painPoint) || PAIN_POINTS[0],
    [painPoint]
  );

  // Lock body scroll durante exibição do modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const { variant: authPlacementVariant } = useExperiment('auth_placement');

  // Rastreamento automático do funil de onboarding a cada etapa
  useEffect(() => {
    if (isOpen) {
      const stepNames = [
        'Anamnese da Ferida',
        'Alvo & Adversário',
        'Calcanhar de Aquiles',
        'Guardião Cognitivo',
        'Veredito & Passaporte'
      ];
      analytics.track('onboarding_step_viewed', {
        step_number: step,
        step_name: stepNames[step - 1],
        target_career: targetCareer,
        target_exam: targetExamTitle,
        detected_banca: detectedBanca,
        auth_placement: authPlacementVariant,
      });
    }
  }, [isOpen, step, targetCareer, targetExamTitle, detectedBanca, authPlacementVariant]);

  // Sincronizar Guardião recomendado ao mudar a carreira
  const handleSelectPredefinedTarget = (target: (typeof POPULAR_TARGETS)[0]) => {
    setTargetExamTitle(target.title);
    setTargetCareer(target.career);
    setDetectedBanca(target.banca);
    setSelectedGuardianId(target.recommendedGuardian);
    setCustomExamInput('');
  };

  const handleCustomExamChange = (val: string) => {
    setCustomExamInput(val);
    if (val.trim()) {
      setTargetExamTitle(val.trim());
      setDetectedBanca('Banca Especial');
    }
  };

  // Etapa 5: Disparar compilação tática (Aha Moment)
  const triggerCompilationAndPassport = () => {
    setStep(5);
    setIsCompiling(true);
    setCompilationProgress(5);
    setTacticalLogs([
      '⚡ KERNEL NEURAL COGNITIVO v3.0 INICIALIZADO...',
      `> Cruzando 120.000 questões históricas da banca examinadora [${detectedBanca}]...`
    ]);

    let currentProg = 10;
    const interval = setInterval(() => {
      currentProg += 18;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setIsCompiling(false);
        setTacticalLogs((prev) => [
          ...prev,
          `> [OK] Mapeamento de pegadinhas e distratores da banca ${detectedBanca} concluído.`,
          `> [OK] Vacina cognitiva anti-falha calibrada para: ${weakSubject}.`,
          `> [OK] Ciclo Alexandre Meirelles calibrado para ${dailyHoursGoal}h diárias líquidas.`,
          `> [OK] Guardião [${selectedGuardian.name}] sincronizado ao seu perfil tático.`,
          `> [PASSAPORTE COGNITIVO EMITIDO]: Plano de Ataque das Primeiras 24h Liberado!`
        ]);
      } else {
        setCompilationProgress(currentProg);
        if (currentProg === 28) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Identificando armadilhas de alta incidência em [${weakSubject}]...`
          ]);
        } else if (currentProg === 46) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Conectando Repetição Espaçada SM-2 com arquétipo [${selectedGuardian.name}]...`
          ]);
        } else if (currentProg === 64) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Gerando cronograma adaptativo de ${dailyHoursGoal}h/dia para ${warName || 'Concurseiro(a)'}...`
          ]);
        } else if (currentProg === 82) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Selando credencial oficial LAI-2026 com criptografia militar...`
          ]);
        }
      }
    }, 150);
  };

  const handleFinalSubmit = (destinationTab: 'cycle' | 'simulator' | 'pricing' = 'pricing') => {
    const finalProfile: Partial<StudentProfile> = {
      name: warName.trim() || currentProfile?.name || 'Concurseiro(a)',
      warName: warName.trim() || 'Futuro Servidor',
      targetCareer,
      targetExamTitle,
      targetBanca: detectedBanca,
      weakSubject,
      dailyHoursGoal,
      experienceLevel,
      guardianAnimalId: selectedGuardianId,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('learning_ai_onboarding_completed', 'true');
      localStorage.setItem('aprovalens_student_profile', JSON.stringify(finalProfile));
    } catch {}

    analytics.track('onboarding_completed', {
      war_name: warName.trim() || 'Futuro Servidor',
      target_career: targetCareer,
      target_exam: targetExamTitle,
      detected_banca: detectedBanca,
      guardian_animal: selectedGuardianId,
      daily_hours: dailyHoursGoal,
      experience_level: experienceLevel,
      destination_tab: destinationTab,
      auth_placement: authPlacementVariant,
    });

    // Disparo assíncrono do E-mail de Boas-Vindas
    const userEmail = currentProfile?.email || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : null);
    if (userEmail) {
      fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: warName.trim() || currentProfile?.name || 'Aluno(a)',
          email: userEmail,
          targetExam: targetExamTitle,
          guardianAnimal: selectedGuardian.name,
          preferredStudyHours: dailyHoursGoal,
        }),
      }).catch((err) => console.debug('Welcome email dispatch non-blocking log:', err));
    }

    onComplete(finalProfile, destinationTab);
  };

  if (!isOpen) return null;

  const STEP_TITLES = [
    'O Mapeamento da Ferida',
    'O Alvo & O Adversário',
    'O Calcanhar de Aquiles',
    'O Guardião Cognitivo',
    'O Veredito & Passaporte'
  ];

  const projectedQuestionsPerDay = Math.round(dailyHoursGoal * 8);
  const projectedFlashcardsPerDay = Math.round(dailyHoursGoal * 4);

  return (
    <div
      role="dialog"
      aria-label="Modal de Onboarding Cognitivo"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn overflow-hidden"
    >
      {/* Glow de Fundo Holográfico Adaptativo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${selectedGuardian.glowColor}, transparent 65%)`
        }}
      />

      <div className="relative w-full max-w-4xl bg-white/95 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* BARRA SUPERIOR: Stepper de 5 Etapas + Identidade (COMPACTA & LEGÍVEL) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="px-5 py-3 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo size={34} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 font-mono">
                  ANAMNESE COGNITIVA & POSSE
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  • Etapa {step} de 5
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">
                {STEP_TITLES[step - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors font-medium cursor-pointer text-slate-500 hover:text-slate-800"
              >
                Pular
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer text-slate-400 hover:text-slate-700"
              title="Fechar Anamnese"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Stepper Visual de 5 Etapas (ALTO CONTRASTE TEMA CLARO) */}
        <div className="px-5 py-2.5 bg-slate-100/80 border-b border-slate-200/70 shrink-0">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 ${
                    s < step
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : s === step
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md ring-2 ring-blue-400/40'
                      : 'border border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {s < step ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      s < step
                        ? 'bg-emerald-500 shadow-sm'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Barra de Progresso Animada no Topo */}
        <div className="w-full h-1 bg-slate-100 overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CORPO DO ONBOARDING: OS 5 PASSOS (SEM SCROLLBAR VISÍVEL, CABE NA TELA) */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div 
          className="p-4 sm:p-5 flex-1 overflow-y-auto no-scrollbar onboarding-body" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .onboarding-body::-webkit-scrollbar,
            .no-scrollbar::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }
          `}</style>

          {/* ================================================================= */}
          {/* ETAPA 1: O MAPEAMENTO DA FERIDA */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs mb-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" /> DIAGNÓSTICO PSICOMÉTRICO • 60 SEGUNDOS
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight text-slate-900">
                  Onde a Banca Examinadora Está Te Derrubando?
                </h3>
                <p className="text-[11px] sm:text-xs mt-1 leading-relaxed max-w-xl mx-auto text-slate-600">
                  95% dos concurseiros são reprovados pelos mesmos 4 vícios estruturais do estudo passivo. Selecione sua maior dor para blindarmos seu sistema:
                </p>
              </div>

              {/* Grid 2x2 Compacto — Cabe Inteiro na Viewport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
                {PAIN_POINTS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = painPoint === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPainPoint(item.id)}
                      className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? `${item.borderSelected}`
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0 pr-6">
                          <p className="text-xs sm:text-sm font-black leading-snug text-slate-900">
                            {item.headline}
                          </p>
                          <p className="text-[11px] leading-snug line-clamp-2 text-slate-600">
                            {item.subtext}
                          </p>
                          <span 
                            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border mt-1"
                            style={item.badgeStyle}
                          >
                            {item.metric}
                          </span>
                        </div>
                      </div>

                      {/* Check */}
                      <div 
                        className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'border border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 2: O ALVO & O ADVERSÁRIO */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs mb-2 font-mono">
                  <Target className="w-3.5 h-3.5" /> TEATRO DE OPERAÇÕES • CARREIRA & BANCA
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-slate-900">
                  Qual Batalha Você Vai Vencer no Diário Oficial?
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-600">
                  A inteligência do AprovaLens adapta o vocabulário, o peso das matérias e os simuladores de acordo com a banca examinadora do seu concurso:
                </p>
              </div>

              {/* Grid de Editais de Alta Concorrência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
                {POPULAR_TARGETS.map((item) => {
                  const isSelected = targetExamTitle === item.title && !customExamInput;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSelectPredefinedTarget(item)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className={`text-xs font-black ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 text-transparent'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">
                            {item.banca}
                          </span>
                          <span className="text-slate-500 font-medium truncate">• {item.tag}</span>
                        </div>

                        <p className="text-[11px] leading-snug text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Digitar Outro Concurso */}
              <div className="max-w-3xl mx-auto pt-1">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider mb-1 text-slate-700">
                  Ou digite outro concurso / cargo específico:
                </label>
                <input
                  type="text"
                  value={customExamInput}
                  onChange={(e) => handleCustomExamChange(e.target.value)}
                  placeholder="Ex: Auditor SEFAZ-SP, Delegado PC-MG, Analista BACEN, Defensoria..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                />
              </div>

              {/* Nome de Guerra & Identidade Oficial */}
              <div className="max-w-3xl mx-auto space-y-1 pt-1">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                  Como quer ser chamado(a)? (Seu Nome de Guerra):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={warName}
                    onChange={(e) => setWarName(e.target.value)}
                    placeholder="Ex: Agente Lucas, Dra. Camila, Fiscal Santos, Analista Mendes..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                  />
                  {warName.trim().length >= 2 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-600 text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>IDENTIDADE VERIFICADA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 3: CALCANHAR DE AQUILES & RITMO DE GUERRA */}
          {/* ================================================================= */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs mb-2 font-mono">
                  <Activity className="w-3.5 h-3.5" /> PONTO CRÍTICO • MATRIZ DE RISCO
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-slate-900">
                  Qual é o seu &quot;Calcanhar de Aquiles&quot; nesta Prova?
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-600">
                  Identifique a disciplina que mais ameaça sua aprovação. Vamos priorizá-la nas primeiras 24 horas:
                </p>
              </div>

              {/* 1. Seleção da Matéria Mais Fraca */}
              <div className="max-w-3xl mx-auto space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Matéria que mais tira o seu sono:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {WEAK_SUBJECT_OPTIONS.map((sub) => {
                    const isSelected = weakSubject === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => setWeakSubject(sub.name)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                        }`}
                      >
                        <p className={`text-xs font-black truncate ${isSelected ? 'text-amber-800' : 'text-slate-900'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] font-mono truncate mt-0.5 text-slate-500">
                          {sub.tag}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Horas Líquidas por Dia */}
              <div className="max-w-3xl mx-auto space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                    Ritmo de Guerra Diário (Horas Líquidas):
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600">
                    {dailyHoursGoal}h líquidas/dia
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { h: 2, label: '2h / dia', badge: 'Constância', questions: '~16 itens/dia' },
                    { h: 4, label: '4h / dia', badge: 'Alta Performance', questions: '~32 itens/dia' },
                    { h: 6, label: '6h / dia', badge: 'Modo Guerra', questions: '~48 itens/dia' },
                    { h: 8, label: '8h+ / dia', badge: 'Dedicação Total', questions: '~64 itens/dia' }
                  ].map((item) => (
                    <button
                      key={item.h}
                      onClick={() => setDailyHoursGoal(item.h)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        dailyHoursGoal === item.h
                          ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <span className={`text-xs font-black block ${dailyHoursGoal === item.h ? 'text-blue-700' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        {item.badge}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold block mt-0.5">
                        {item.questions}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Momento Atual do Candidato */}
              <div className="max-w-3xl mx-auto space-y-1.5 pt-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider block text-slate-700">
                  Seu Momento Atual:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante' as const, title: 'Iniciante do Zero', desc: 'Construindo alicerce sem vícios' },
                    { id: 'intermediario' as const, title: 'Intermediário (60-70%)', desc: 'Buscando romper a nota de corte' },
                    { id: 'veterano' as const, title: 'Avançado / Reta Final', desc: 'Ajuste fino cirúrgico de erros' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        experienceLevel === lvl.id
                          ? 'bg-cyan-50/80 border-cyan-500 shadow-sm ring-2 ring-cyan-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <p className={`text-xs font-black ${experienceLevel === lvl.id ? 'text-cyan-800' : 'text-slate-900'}`}>
                        {lvl.title}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-snug text-slate-600">
                        {lvl.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 4: O ARQUÉTIPO DO GUARDIÃO COGNITIVO */}
          {/* ================================================================= */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs mb-2 font-mono">
                  <Shield className="w-3.5 h-3.5" /> ARQUÉTIPO DE COMBATE • SEU MENTOR ANIMAL
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-slate-900">
                  Desperte Seu Guardião de Aprovação
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-600">
                  Cada guardião personifica uma força cognitiva da fauna brasileira com bônus estratégicos reais:
                </p>
              </div>

              {/* CARD DE DESTAQUE DO GUARDIÃO SELECIONADO */}
              <div className="max-w-3xl mx-auto">
                <div 
                  className="relative p-4 sm:p-5 rounded-2xl border-2 bg-white shadow-lg overflow-hidden"
                  style={{ borderColor: selectedGuardian.glowColor }}
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
                    
                    {/* AVATAR DO GUARDIÃO */}
                    <div className="relative shrink-0">
                      <div 
                        className="absolute inset-0 rounded-xl blur-lg opacity-25"
                        style={{ backgroundColor: selectedGuardian.glowColor }}
                      />
                      <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-4xl shadow-md">
                        {selectedGuardian.avatar3dUrl ? (
                          <img
                            src={selectedGuardian.avatar3dUrl}
                            alt={selectedGuardian.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{selectedGuardian.emoji}</span>
                        )}
                      </div>
                    </div>

                    {/* INFOS E ATRIBUTOS */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {selectedGuardian.archetype}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Superpoder: {selectedGuardian.superpower}
                          </span>
                        </div>
                        <h4 className="text-xl font-black tracking-tight mt-0.5 text-slate-900">
                          {selectedGuardian.name}
                        </h4>
                        <p className="text-xs italic font-medium text-slate-600">
                          {selectedGuardian.motto}
                        </p>
                      </div>

                      {/* 4 Barras de Atributos Cognitivos */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-0.5">
                        {[
                          { label: 'Foco Mental', val: selectedGuardian.stats.foco, color: 'from-blue-500 to-cyan-500' },
                          { label: 'Velocidade', val: selectedGuardian.stats.velocidade, color: 'from-amber-500 to-yellow-500' },
                          { label: 'Resiliência', val: selectedGuardian.stats.resiliencia, color: 'from-emerald-500 to-teal-500' },
                          { label: 'Estratégia', val: selectedGuardian.stats.estrategia, color: 'from-purple-500 to-indigo-500' }
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-0.5">
                            <div className="flex justify-between text-[10px] font-mono font-bold">
                              <span className="text-slate-500">{stat.label}</span>
                              <span className="text-slate-900">{stat.val}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                                style={{ width: `${stat.val}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bônus Ativo */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-mono font-bold">
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Bônus: +18% de Imunidade a Pegadinhas em {weakSubject}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SELETOR DE GUARDIÕES EM MINIATURA */}
              <div className="max-w-3xl mx-auto space-y-1">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700">
                  Alternar Guardião Cognitivo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                  {GUARDIAN_ANIMALS.map((animal) => {
                    const isSelected = selectedGuardianId === animal.id;
                    return (
                      <button
                        key={animal.id}
                        onClick={() => setSelectedGuardianId(animal.id)}
                        className={`p-2 rounded-xl border text-center transition-all duration-200 flex flex-col items-center gap-0.5 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20 scale-105'
                            : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="text-xl">{animal.emoji}</span>
                        <span className={`text-[10px] truncate max-w-full ${isSelected ? 'font-black text-indigo-700' : 'font-bold text-slate-700'}`}>
                          {animal.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 5: O VEREDITO, PASSAPORTE HOLOGRÁFICO & PLANO 24H */}
          {/* ================================================================= */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              {isCompiling ? (
                /* TELA DE COMPILAÇÃO CIBERNÉTICA */
                <div className="max-w-xl mx-auto py-8 text-center space-y-5">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
                      <BrainCircuit className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      Compilando Plano Tático & Passaporte...
                    </h3>
                    <p className="text-xs text-blue-600 font-mono font-bold">
                      Engenharia reversa em execução • {compilationProgress}%
                    </p>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden p-[1px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 shadow-sm transition-all duration-150"
                      style={{ width: `${compilationProgress}%` }}
                    />
                  </div>

                  {/* Terminal de Logs Táticos */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] text-left space-y-1 shadow-inner max-h-40 overflow-y-auto">
                    {tacticalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.includes('OK')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('PASSAPORTE')
                            ? 'text-amber-300 font-bold'
                            : 'text-slate-400'
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PLANO TÁTICO CERTIFICADO
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                      Seu Plano de Guerra Está Pronto, {warName || 'Futuro(a) Servidor(a)'}!
                    </h3>
                  </div>

                  {/* O CARTÃO DE PASSAPORTE HOLOGRÁFICO TITÂNIO & OURO */}
                  <div className="passport-card relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#070b14] via-[#0d1426] to-[#080d1a] border border-cyan-500/40 shadow-xl overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                      <div className="flex items-center sm:items-start gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/80 border-2 border-cyan-400/40 shrink-0 flex items-center justify-center text-3xl shadow-xl">
                          {selectedGuardian.avatar3dUrl ? (
                            <img
                              src={selectedGuardian.avatar3dUrl}
                              alt={selectedGuardian.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{selectedGuardian.emoji}</span>
                          )}
                        </div>

                        <div className="space-y-1 text-center sm:text-left">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-mono font-black uppercase tracking-wider text-amber-300 inline-block">
                            ★ CREDENCIAL OFICIAL
                          </span>
                          <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            {warName || 'Concurseiro(a)'}
                          </h4>
                          <p className="text-xs font-semibold text-indigo-300">
                            Guardião: {selectedGuardian.name} ({selectedGuardian.archetype})
                          </p>
                        </div>
                      </div>

                      <div className="text-center sm:text-right font-mono text-[10px] shrink-0">
                        <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-cyan-300 font-bold block">LAI-2026-CERTIFIED</span>
                          <span className="text-slate-400 text-[9px] block">PADRÃO SHA-256</span>
                        </div>
                      </div>
                    </div>

                    {/* Metas do Passaporte */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-white/10 text-left">
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Edital Alvo
                        </span>
                        <span className="text-xs font-bold truncate block text-white">
                          {targetExamTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Banca
                        </span>
                        <span className="text-xs font-black text-cyan-400 block">
                          {detectedBanca}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Meta Diária
                        </span>
                        <span className="text-xs font-black text-emerald-400 block">
                          {dailyHoursGoal}h líquidas/dia
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400">
                          Alvo de Ataque
                        </span>
                        <span className="text-xs font-black text-amber-300 truncate block">
                          {weakSubject}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PLANO DE ATAQUE DAS PRIMEIRAS 24 HORAS */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <Flame className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Plano Tático das Primeiras 24 Horas
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-blue-100 shadow-sm">
                        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0 text-white font-mono font-black text-[10px]">
                          1
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong className="text-slate-900">Ataque ({dailyHoursGoal}h):</strong> {projectedQuestionsPerDay} Questões de {weakSubject} filtradas na banca {detectedBanca}.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-blue-100 shadow-sm">
                        <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center shrink-0 text-white font-mono font-black text-[10px]">
                          2
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong className="text-slate-900">Vacina Mnemônica:</strong> {projectedFlashcardsPerDay} Flashcards com Repetição Espaçada SM-2.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-blue-100 shadow-sm">
                        <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center shrink-0 text-white font-mono font-black text-[10px]">
                          3
                        </div>
                        <p className="text-xs text-slate-700">
                          <strong className="text-slate-900">Meta:</strong> Elevação de +15.4% de Precisão em {weakSubject} na primeira semana.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AÇÕES DE CONVERSÃO LINEAR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFinalSubmit('pricing')}
                      className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Liberar Acesso Pro Imediato</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFinalSubmit('pricing')}
                      className="py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Iniciar 7 Dias Grátis com Cartão</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* RODAPÉ FIXO DE NAVEGAÇÃO: SEMPRE VISÍVEL, ZERO TRANSLADO OU CORTE */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {step < 5 && (
          <div className="px-5 py-3.5 border-t border-slate-200/80 bg-slate-50/90 flex items-center justify-between shrink-0">
            {step === 1 ? (
              <span className="text-[11px] font-mono text-slate-500">
                Etapa 1 de 5 • 4 Dores Mapeadas
              </span>
            ) : (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}

            <button
              onClick={() => {
                if (step === 4) {
                  triggerCompilationAndPassport();
                } else {
                  setStep((step + 1) as any);
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>
                {step === 1
                  ? 'Mapear Campo de Batalha'
                  : step === 2
                  ? 'Mapear Calcanhar de Aquiles'
                  : step === 3
                  ? 'Conhecer Seu Guardião'
                  : 'Compilar Meu Plano de Guerra'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOnboardingModal;
