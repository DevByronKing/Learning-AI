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
  Clock,
  Swords,
  Activity,
  BookOpen,
  Check,
  Star,
  TrendingUp,
  Users,
  AlertTriangle,
  Brain,
  Timer,
  BarChart3,
  Quote,
  BadgeCheck,
  Flame
} from 'lucide-react';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import { GuardianAnimalId, StudentProfile } from '@/lib/types';
import { HolographicAvatar3D } from '@/components/HolographicAvatar3D';

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<StudentProfile>, destinationTab?: 'cycle' | 'simulator') => void;
  currentProfile?: StudentProfile;
  onOpenPricing?: () => void;
}

// Catálogo de editais pré-configurados para seleção rápida
const POPULAR_TARGETS = [
  {
    title: 'Polícia Federal - Agente & Escrivão',
    career: 'policial' as const,
    banca: 'Cebraspe',
    icon: '🚔',
    recommendedGuardian: 'lobo' as GuardianAnimalId,
    tag: 'Edital Mais Desejado'
  },
  {
    title: 'PRF - Policial Rodoviário Federal',
    career: 'policial' as const,
    banca: 'Cebraspe',
    icon: '⚡',
    recommendedGuardian: 'lobo' as GuardianAnimalId,
    tag: 'Polícia Rodoviária'
  },
  {
    title: 'Receita Federal - Auditor-Fiscal',
    career: 'fiscal' as const,
    banca: 'FGV',
    icon: '🦅',
    recommendedGuardian: 'gaviao' as GuardianAnimalId,
    tag: 'Teto do Executivo'
  },
  {
    title: 'TJ-SP - Escrevente Técnico Judiciário',
    career: 'tribunais' as const,
    banca: 'Vunesp',
    icon: '⚖️',
    recommendedGuardian: 'raposa' as GuardianAnimalId,
    tag: 'Tribunais Estaduais'
  },
  {
    title: 'OAB - Exame de Ordem Unificado (1ª Fase)',
    career: 'juridica' as const,
    banca: 'FGV',
    icon: '🏛️',
    recommendedGuardian: 'coruja' as GuardianAnimalId,
    tag: 'Aprovação OAB'
  },
  {
    title: 'INSS - Técnico do Seguro Social',
    career: 'administrativa' as const,
    banca: 'Cebraspe',
    icon: '📑',
    recommendedGuardian: 'onca' as GuardianAnimalId,
    tag: 'Seguridade Social'
  },
  {
    title: 'CNU - Concurso Nacional Unificado',
    career: 'administrativa' as const,
    banca: 'Cesgranrio',
    icon: '🌐',
    recommendedGuardian: 'leao' as GuardianAnimalId,
    tag: 'Carreiras Federais'
  }
];

// Dores estratégicas do concurseiro (Pilar 1)
const PAIN_POINTS = [
  {
    id: 'pegadinhas',
    icon: AlertTriangle,
    headline: 'Estudo muito, mas na hora da prova caio nas pegadinhas da banca.',
    subtext: 'Falta de psicometria de banca e vício de leitura apressada',
    color: 'text-red-500 dark:text-red-400',
    bgSelected: 'bg-red-50 dark:bg-red-950/30 border-red-500'
  },
  {
    id: 'tempo',
    icon: Timer,
    headline: 'Tenho pouco tempo livre e me sinto perdido com o tamanho do edital.',
    subtext: 'Falta de gestão de ciclo de estudos / Sobrecarga cognitiva',
    color: 'text-amber-500 dark:text-amber-400',
    bgSelected: 'bg-amber-50 dark:bg-amber-950/30 border-amber-500'
  },
  {
    id: 'estagnado',
    icon: BarChart3,
    headline: 'Estou estagnado na faixa dos 60% e não consigo atingir a nota de corte.',
    subtext: 'Lacunas teóricas não mapeadas / Platô de desempenho',
    color: 'text-blue-500 dark:text-blue-400',
    bgSelected: 'bg-blue-50 dark:bg-blue-950/30 border-blue-500'
  },
  {
    id: 'esquecimento',
    icon: Brain,
    headline: 'Esqueço o que estudei há poucas semanas e preciso recomeçar do zero.',
    subtext: 'Ausência de repetição espaçada / Curva do esquecimento',
    color: 'text-purple-500 dark:text-purple-400',
    bgSelected: 'bg-purple-50 dark:bg-purple-950/30 border-purple-500'
  }
];

// Provas sociais segmentadas por banca/carreira
const SOCIAL_PROOFS: Record<string, {
  quote: string;
  name: string;
  role: string;
  banca: string;
  weakSubject: string;
  score: string;
  position: string;
}> = {
  Cebraspe: {
    quote: 'Eu travava nos Certo/Errado do Cebraspe e perdia pontos líquidos por medo de chutar. Com o Caderno de Erros Inteligente e o simulador calibrado do AprovaLens, identifiquei meus padrões de erro e subi de 62% para 84% em 3 meses.',
    name: 'Rafael Silveira',
    role: 'Aprovado na PF — Agente',
    banca: 'Cebraspe',
    weakSubject: 'Direito Penal',
    score: '84.2%',
    position: '14ª colocação'
  },
  FGV: {
    quote: 'A FGV cobra interpretação profunda e eu vivia errando por falta de atenção ao enunciado longo. O AprovaLens me forçou a treinar a leitura tática e mapear distratores. Resultado: aprovação na 1ª tentativa.',
    name: 'Camila Torres',
    role: 'Aprovada na Receita Federal — Auditora',
    banca: 'FGV',
    weakSubject: 'Contabilidade Geral',
    score: '87.5%',
    position: '9ª colocação'
  },
  Vunesp: {
    quote: 'A Vunesp é literal e exige memória de lei seca. O sistema de flashcards com repetição espaçada do AprovaLens foi decisivo para eu memorizar artigos que caíram na prova.',
    name: 'Lucas Mendes',
    role: 'Aprovado no TJ-SP — Escrevente',
    banca: 'Vunesp',
    weakSubject: 'Língua Portuguesa',
    score: '81.3%',
    position: '22ª colocação'
  },
  default: {
    quote: 'Antes eu estudava sem direção. Depois de calibrar meu ciclo de estudos com a IA do AprovaLens, consegui aprovação com nota acima da média em todas as disciplinas de peso.',
    name: 'Ana Beatriz Costa',
    role: 'Aprovada no CNU — Analista',
    banca: 'Diversas',
    weakSubject: 'Raciocínio Lógico',
    score: '79.8%',
    position: '31ª colocação'
  }
};

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentProfile,
  onOpenPricing
}) => {
  // Step State: 1-5 (5 Pilares Estratégicos)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Dor & Promessa
  const [painPoint, setPainPoint] = useState<string | null>(null);
  const [showPromiseBox, setShowPromiseBox] = useState(false);

  // Step 2: Personalização (Cargo + Banca + Nome de Guerra)
  const [targetExamTitle, setTargetExamTitle] = useState(
    currentProfile?.targetExamTitle || 'Polícia Federal - Agente & Escrivão'
  );
  const [targetCareer, setTargetCareer] = useState<
    'policial' | 'fiscal' | 'tribunais' | 'administrativa' | 'juridica' | 'controle' | 'outra'
  >(currentProfile?.targetCareer || 'policial');
  const [detectedBanca, setDetectedBanca] = useState('Cebraspe');
  const [customExamInput, setCustomExamInput] = useState('');
  const [warName, setWarName] = useState(currentProfile?.warName || '');

  // Step 3: Progresso & Calcanhar de Aquiles + Guardião
  const [experienceLevel, setExperienceLevel] = useState<'iniciante' | 'intermediario' | 'veterano'>(
    currentProfile?.experienceLevel || 'intermediario'
  );
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(currentProfile?.dailyHoursGoal || 4);
  const [weakSubject, setWeakSubject] = useState('Direito Administrativo');
  const [selectedGuardianId, setSelectedGuardianId] = useState<GuardianAnimalId>(
    currentProfile?.guardianAnimalId || 'lobo'
  );

  // Step 5: Compilação & Passaporte
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationProgress, setCompilationProgress] = useState(0);
  const [tacticalLogs, setTacticalLogs] = useState<string[]>([]);
  const [isPassportReady, setIsPassportReady] = useState(false);

  const selectedGuardian = useMemo(
    () => GUARDIAN_ANIMALS.find((a) => a.id === selectedGuardianId) || GUARDIAN_ANIMALS[0],
    [selectedGuardianId]
  );

  // Prova social segmentada pela banca selecionada
  const activeProof = useMemo(
    () => SOCIAL_PROOFS[detectedBanca] || SOCIAL_PROOFS.default,
    [detectedBanca]
  );

  // Lock body scroll
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

  // Pilar 1: Selecionar dor e mostrar promessa
  const handleSelectPain = (painId: string) => {
    setPainPoint(painId);
    setShowPromiseBox(false);
    // Revelar a promessa com um delay sutil para impacto psicológico
    setTimeout(() => setShowPromiseBox(true), 300);
  };

  // Etapa 5: Disparar compilação tática
  const triggerCompilationAndPassport = () => {
    setStep(5);
    setIsCompiling(true);
    setCompilationProgress(5);
    setTacticalLogs([
      '⚡ KERNEL COGNITIVO v3.0 ATIVADO...',
      `> Cruzando incidência histórica da banca [${detectedBanca}]...`
    ]);

    let currentProg = 10;
    const interval = setInterval(() => {
      currentProg += 15;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        setIsCompiling(false);
        setIsPassportReady(true);
        setTacticalLogs((prev) => [
          ...prev,
          `> [OK] Mapeamento de pegadinhas da banca ${detectedBanca} concluído.`,
          `> [OK] Módulo de blindagem ativado para: ${weakSubject}.`,
          `> [OK] Ciclo Alexandre Meirelles calibrado para ${dailyHoursGoal}h diárias líquidas.`,
          `> [OK] Guardião [${selectedGuardian.name}] sincronizado com o perfil.`,
          `> [PASSAPORTE COGNITIVO EMITIDO]: Plano das Primeiras 24h disponível!`
        ]);
      } else {
        setCompilationProgress(currentProg);
        if (currentProg === 25) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Identificando armadilhas em [${weakSubject}]...`
          ]);
        } else if (currentProg === 40) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Conectando Repetição Espaçada SM-2 com o Guardião [${selectedGuardian.name}]...`
          ]);
        } else if (currentProg === 55) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Gerando Ciclo de ${dailyHoursGoal}h/dia para ${warName || 'Concurseiro(a)'}...`
          ]);
        } else if (currentProg === 70) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Compilando plano de ataque com 15 questões críticas de ${weakSubject}...`
          ]);
        } else if (currentProg === 85) {
          setTacticalLogs((prev) => [
            ...prev,
            `> Finalizando Passaporte Cognitivo e Plano das Primeiras 24h...`
          ]);
        }
      }
    }, 300);
  };

  const handleFinalSubmit = (destinationTab: 'cycle' | 'simulator' = 'cycle') => {
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
    } catch {}

    onComplete(finalProfile, destinationTab);
  };

  if (!isOpen) return null;

  // Labels das etapas para o stepper
  const STEP_LABELS = [
    'Sua Maior Trava',
    'Cargo & Banca Alvo',
    'Calcanhar de Aquiles',
    'Método Validado',
    'Plano de Ataque'
  ];

  // Cálculo do % esperado de acerto baseado nas horas e experiência
  const projectedQuestionsPerDay = Math.round(dailyHoursGoal * 8);
  const projectedFlashcardsPerDay = Math.round(dailyHoursGoal * 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 dark:bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      {/* Glow de fundo ambiental */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${selectedGuardian.glowColor}, transparent 65%)`
        }}
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* BARRA SUPERIOR: Stepper de 5 Etapas + Botão de Fechar */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">
                  PERSONALIZAÇÃO COGNITIVA
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  • Etapa {step} de 5
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {STEP_LABELS[step - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                onClick={onClose}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium"
              >
                Pular
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Fechar Onboarding"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Visual de 5 Etapas */}
        <div className="px-6 py-3 bg-slate-50/30 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 ${
                    s < step
                      ? 'bg-emerald-500 text-white'
                      : s === step
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s < step ? <Check className="w-3 h-3 stroke-[3]" /> : s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      s < step
                        ? 'bg-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Barra de Progresso Animada */}
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CONTEÚDO PRINCIPAL DAS 5 ETAPAS */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto max-h-[70vh]">

          {/* ================================================================= */}
          {/* ETAPA 1: DOR & PROMESSA (Pilar 1 — NOVA) */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs mb-3">
                  <Target className="w-3.5 h-3.5" /> Diagnóstico Inicial • 60 segundos
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Qual é a sua maior trava rumo ao Diário Oficial?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-lg mx-auto">
                  Mais de 80% dos candidatos estudam centenas de horas mas são reprovados pelos mesmos 3 erros. Escolha o seu principal desafio atual:
                </p>
              </div>

              {/* Cards de Dor Selecionáveis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {PAIN_POINTS.map((pain) => {
                  const IconComp = pain.icon;
                  const isSelected = painPoint === pain.id;
                  return (
                    <button
                      key={pain.id}
                      onClick={() => handleSelectPain(pain.id)}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                        isSelected
                          ? `${pain.bgSelected} shadow-md`
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white/80 dark:bg-white/10'
                            : 'bg-slate-100 dark:bg-white/5'
                        }`}>
                          <IconComp className={`w-5 h-5 ${pain.color}`} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-bold leading-snug ${
                            isSelected
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {pain.headline}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            {pain.subtext}
                          </p>
                        </div>
                      </div>
                      {/* Indicador de seleção */}
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'border border-slate-300 dark:border-white/20 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Box de Validação Imediata (A Promessa) — aparece ao selecionar uma dor */}
              {showPromiseBox && painPoint && (
                <div className="max-w-3xl mx-auto animate-fadeIn">
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-emerald-950/20 border border-blue-200/60 dark:border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                          Você não precisa de mais material nem de mais horas brutas.
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          O AprovaLens foi construído para blindar <strong>exatamente essa falha</strong> através de repetição inteligente, predição estatística de bancas e ciclos de estudo adaptativos. Vamos calibrar o seu sistema agora.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end max-w-3xl mx-auto pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={!painPoint}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all transform ${
                    painPoint
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 hover:scale-[1.02]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continuar Calibração</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 2: PERSONALIZAÇÃO TÁTICA (Pilar 2 — Cargo + Banca + Nome) */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs mb-3">
                  <Target className="w-3.5 h-3.5" /> Defina seu Destino & Adversário
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Qual o seu alvo e quem é o seu adversário?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  A IA do AprovaLens adapta o vocabulário das questões e o peso das matérias conforme o padrão da banca examinadora.
                </p>
              </div>

              {/* Grid de Editais Pré-Configurados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {POPULAR_TARGETS.map((item) => {
                  const isSelected =
                    targetExamTitle === item.title && !customExamInput;
                  return (
                    <button
                      key={item.title}
                      onClick={() => handleSelectPredefinedTarget(item)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between group ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-500/40'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.icon}</span>
                          <span
                            className={`text-xs font-bold ${
                              isSelected
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 font-bold text-slate-700 dark:text-slate-300">
                            Banca: {item.banca}
                          </span>
                          <span>• {item.tag}</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 dark:border-white/20 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ou Digitar Outro Concurso */}
              <div className="max-w-3xl mx-auto pt-1">
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Ou digite o nome do seu concurso / carreira personalizada:
                  </label>
                  <input
                    type="text"
                    value={customExamInput}
                    onChange={(e) => handleCustomExamChange(e.target.value)}
                    placeholder="Ex: Auditor Fiscal SEFAZ-SP, Delegado PC-MG, Analista BACEN..."
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>

              {/* Nome de Guerra (movido da antiga Etapa 3) */}
              <div className="max-w-3xl mx-auto space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Como quer ser chamado(a)? (Seu Nome de Guerra):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={warName}
                    onChange={(e) => setWarName(e.target.value)}
                    placeholder="Ex: Agente Lucas, Dra. Camila, Fiscal Santos..."
                    className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                  {warName.trim().length >= 2 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Este nome será usado nos relatórios táticos, avisos de revisão e na sua credencial oficial.
                </p>
              </div>

              <div className="flex justify-between max-w-3xl mx-auto pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
                >
                  <span>Mapear Fraquezas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 3: PROGRESSO & CALCANHAR DE AQUILES + GUARDIÃO (Pilar 3) */}
          {/* ================================================================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Banner Dinâmico de Progresso — usa dados das Etapas 1-2 */}
              <div className="max-w-3xl mx-auto p-3 rounded-2xl bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 dark:from-white/[0.03] dark:via-blue-950/20 dark:to-white/[0.03] border border-slate-200/60 dark:border-blue-500/15">
                <div className="flex items-center gap-3 flex-wrap text-[10px] font-mono font-bold">
                  <span className="text-slate-500 dark:text-slate-400">🎯 OPERAÇÃO CONFIGURADA:</span>
                  {warName.trim() && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                      {warName}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 truncate max-w-[200px]">
                    {targetExamTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {detectedBanca}
                  </span>
                </div>
              </div>

              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs mb-3">
                  <Activity className="w-3.5 h-3.5" /> Calibragem & Foco
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Qual o seu &quot;Calcanhar de Aquiles&quot; nesta prova?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Vamos priorizar essa matéria nas suas primeiras 24 horas para você sentir a evolução na prática.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                {/* 1. Calcanhar de Aquiles (Pior Matéria) — PRIMEIRO */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2.5">
                    A matéria que mais tira seu sono:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Direito Administrativo',
                      'Direito Penal / Processo',
                      'Direito Constitucional',
                      'Raciocínio Lógico (RLM)',
                      'Português FGV / Cebraspe',
                      'Informática & TI',
                      'Direito Tributário',
                      'Contabilidade Geral',
                      'Legislação Especial'
                    ].map((subject) => (
                      <button
                        key={subject}
                        onClick={() => setWeakSubject(subject)}
                        className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                          weakSubject === subject
                            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Horas Diárias */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2.5">
                    Horas líquidas disponíveis por dia:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { hours: 2, label: '2h / dia', badge: 'Constância' },
                      { hours: 4, label: '4h / dia', badge: 'Alta Performance' },
                      { hours: 6, label: '6h / dia', badge: 'Modo Guerra' },
                      { hours: 8, label: '8h+ / dia', badge: 'Dedicação Total' }
                    ].map((h) => (
                      <button
                        key={h.hours}
                        onClick={() => setDailyHoursGoal(h.hours)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          dailyHoursGoal === h.hours
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                        }`}
                      >
                        <span
                          className={`text-sm font-black block ${
                            dailyHoursGoal === h.hours
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {h.label}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                          {h.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Nível + Guardião lado a lado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nível de Preparação */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
                      Seu momento atual:
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'iniciante' as const, label: 'Iniciante do Zero', desc: 'Base conceitual' },
                        { id: 'intermediario' as const, label: 'Intermediário (60-70%)', desc: 'Estagnado em platô' },
                        { id: 'veterano' as const, label: 'Avançado / Pós-Edital', desc: 'Reta final cirúrgica' }
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => setExperienceLevel(lvl.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            experienceLevel === lvl.id
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                              : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span className={`text-xs font-black block ${
                            experienceLevel === lvl.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {lvl.label}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{lvl.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guardião Cognitivo (simplificado) */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
                      Seu guardião de aprovação:
                    </label>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                      {GUARDIAN_ANIMALS.map((animal) => {
                        const isSelected = selectedGuardianId === animal.id;
                        return (
                          <button
                            key={animal.id}
                            onClick={() => setSelectedGuardianId(animal.id)}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                                : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                            }`}
                          >
                            <span className="text-lg shrink-0">{animal.emoji}</span>
                            <div className="min-w-0">
                              <span className={`text-[11px] font-black block truncate ${
                                isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {animal.name}
                              </span>
                              <span className="text-[9px] text-slate-400 truncate block">{animal.archetype}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between max-w-3xl mx-auto pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
                >
                  <span>Ver Resultados do Método</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 4: PROVA SOCIAL ESTRATÉGICA (Pilar 4 — NOVA) */}
          {/* ================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-2xl mx-auto mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-3">
                  <Users className="w-3.5 h-3.5" /> Método Validado
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Você não está sozinho. O método já validou aprovações.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Veja o que acontece quando você troca o estudo aleatório pela precisão estatística da banca <strong className="text-slate-800 dark:text-slate-200">{detectedBanca}</strong>:
                </p>
              </div>

              {/* Comparativo de Paradigma: Método Tradicional vs. AprovaLens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] font-black">✕</span>
                    <span>O MÉTODO TRADICIONAL (PASSIVO)</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <p className="flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0 font-bold">•</span>
                      <span>PDFs de 150 páginas e videoaulas infinitas de 2 horas.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0 font-bold">•</span>
                      <span>Ilusão de competência: grifos coloridos que evaporam na hora da prova.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0 font-bold">•</span>
                      <span>Vulnerabilidade máxima aos distratores e pegadinhas da banca {detectedBanca}.</span>
                    </p>
                  </div>
                  <div className="pt-2 border-t border-rose-200/50 dark:border-rose-500/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Retenção no Dia D:</span>
                    <span className="font-black text-rose-600 dark:text-rose-400">~20% (Esquecimento Rápido)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300/80 dark:border-emerald-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black">✓</span>
                    <span>O MÉTODO APROVALENS (ENGENHARIA REVERSA)</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0 font-bold">•</span>
                      <span>Engenharia reversa dos 20% do edital que geram 80% das questões.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0 font-bold">•</span>
                      <span>Diagnóstico cognitivo instantâneo que mapeia a raiz do seu erro.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0 font-bold">•</span>
                      <span>Repetição Espaçada SM-2 + Guardião calibrado para seu ritmo.</span>
                    </p>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-500/15 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Retenção Estimada:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">~85% (Fixação Cirúrgica)</span>
                  </div>
                </div>
              </div>

              {/* Card de Depoimento Segmentado */}
              <div className="max-w-3xl mx-auto">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-white/[0.03] dark:to-blue-950/10 border border-slate-200/80 dark:border-white/10 shadow-sm">
                  <Quote className="w-8 h-8 text-blue-200 dark:text-blue-800 absolute top-4 right-4" />
                  <div className="space-y-4 relative z-10">
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                      &quot;{activeProof.quote}&quot;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        {activeProof.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {activeProof.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {activeProof.role} • Banca: {activeProof.banca}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold mt-0.5">
                          Score: {activeProof.score} • {activeProof.position}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores de Confiança */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">84.2%</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                    Precisão na antecipação dos tópicos mais cobrados
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">3.2x</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                    Mais rápido na memorização via repetição espaçada SM-2
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto">
                    <BadgeCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-xl font-black text-amber-600 dark:text-amber-400">250K+</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                    Questões comentadas calibrando o algoritmo preditivo
                  </p>
                </div>
              </div>

              <div className="flex justify-between max-w-3xl mx-auto pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={triggerCompilationAndPassport}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-indigo-600/25 transition-all transform hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Compilar Meu Plano de Ação</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ETAPA 5: AHA MOMENT — COMPILAÇÃO + PASSAPORTE + PLANO 24H (Pilar 5) */}
          {/* ================================================================= */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              {isCompiling ? (
                /* Tela de Compilação Tática */
                <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                      <BrainCircuit className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Compilando Plano de Ataque...
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Engenharia reversa em execução • {compilationProgress}%
                    </p>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full max-w-md mx-auto h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-200"
                      style={{ width: `${compilationProgress}%` }}
                    />
                  </div>

                  {/* Terminal de Logs */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] text-left max-w-lg mx-auto space-y-1.5 shadow-inner max-h-40 overflow-y-auto border border-slate-800">
                    {tacticalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={
                          log.includes('OK')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('EMITIDO') || log.includes('24h')
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
                /* PASSAPORTE COGNITIVO + PLANO DAS PRIMEIRAS 24H */
                <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
                  {/* Header de Sucesso */}
                  <div className="text-center space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Plano de Ataque Liberado
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      Aqui está sua rota de fuga da média, {warName || 'Concurseiro(a)'}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                      Nosso algoritmo estruturou as suas próximas 24 horas para neutralizar a {detectedBanca} começando pelo seu ponto fraco.
                    </p>
                  </div>

                  {/* CARD DO PLANO DAS PRIMEIRAS 24H (NOVO — Aha Moment) */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-emerald-950/15 border border-blue-200/50 dark:border-blue-500/15 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          Plano das Primeiras 24 Horas
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          Guardião: {selectedGuardian.name} ({selectedGuardian.archetype})
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 text-white font-black text-[10px]">1</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Bloco de Ataque ({dailyHoursGoal}h): {projectedQuestionsPerDay} Questões Críticas de {weakSubject}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Filtradas por incidência na {detectedBanca} com comentários pedagógicos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 text-white font-black text-[10px]">2</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {projectedFlashcardsPerDay} Flashcards com pegadinhas históricas da {detectedBanca}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Repetição espaçada SM-2 para fixação de longo prazo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200/40 dark:border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 text-white font-black text-[10px]">3</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Resultado esperado: Elevação de +12% de precisão em {weakSubject}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Baseado na curva média de alunos com perfil similar ao seu
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/15">
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-300 text-center">
                        💡 A rota está traçada. O algoritmo fez a parte dele. Agora a execução é 100% sua.
                      </p>
                    </div>
                  </div>

                  {/* O CARTÃO DE PASSAPORTE COGNITIVO */}
                  <div className="passport-card preserve-dark relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-[#0e1428] to-slate-900 text-white border border-indigo-500/30 shadow-2xl overflow-hidden">
                    {/* Linhas de fundo decorativas */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                      <div className="flex items-center sm:items-start gap-5">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black/60 border border-white/20 shrink-0 flex items-center justify-center text-4xl shadow-lg">
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

                        <div className="space-y-1.5 text-center sm:text-left">
                          <span
                            className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider inline-block"
                            style={{ color: '#fcd34d' }}
                          >
                            ★ Concurseiro em Alta Performance
                          </span>
                          <h4
                            className="text-2xl sm:text-3xl font-black tracking-tight"
                            style={{ color: '#ffffff' }}
                          >
                            {warName || 'Concurseiro(a)'}
                          </h4>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: '#a5b4fc' }}
                          >
                            Guardião: {selectedGuardian.name} ({selectedGuardian.archetype})
                          </p>
                        </div>
                      </div>

                      {/* Selo Oficial */}
                      <div className="text-center sm:text-right font-mono text-[10px] shrink-0">
                        <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 inline-block">
                          <span style={{ color: '#cbd5e1' }}>REGISTRO: LAI-2026-OK</span>
                        </div>
                      </div>
                    </div>

                    {/* Grade de Metas Configurada */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/15 text-left">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono block mb-0.5" style={{ color: '#94a3b8' }}>
                          Concurso Alvo
                        </span>
                        <span className="text-xs font-bold truncate block" style={{ color: '#f8fafc' }}>
                          {targetExamTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono block mb-0.5" style={{ color: '#94a3b8' }}>
                          Banca Foco
                        </span>
                        <span className="text-xs font-extrabold block" style={{ color: '#38bdf8' }}>
                          {detectedBanca}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono block mb-0.5" style={{ color: '#94a3b8' }}>
                          Meta Diária
                        </span>
                        <span className="text-xs font-extrabold block" style={{ color: '#34d399' }}>
                          {dailyHoursGoal}h líquidas/dia
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-mono block mb-0.5" style={{ color: '#94a3b8' }}>
                          Ponto de Ataque
                        </span>
                        <span className="text-xs font-extrabold truncate block" style={{ color: '#fbbf24' }}>
                          {weakSubject}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banner de Garantia & Soft Paywall Contextualizado (Valor sem atrito) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-emerald-50/70 dark:from-white/[0.03] dark:via-blue-950/20 dark:to-white/[0.03] border border-blue-200/60 dark:border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🛡️</span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          Treino 100% gratuito liberado • Sem cartão ou barreira de entrada
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Quando quiser acelerar com diagnósticos ilimitados de IA, o Pro custa menos de R$ 1,30/dia (o valor de um café).
                        </p>
                      </div>
                    </div>
                    {onOpenPricing && (
                      <button
                        type="button"
                        onClick={onOpenPricing}
                        className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline shrink-0 flex items-center gap-1 self-start sm:self-center"
                      >
                        <span>Ver Planos Pro</span>
                        <span>➔</span>
                      </button>
                    )}
                  </div>

                  {/* Ações de Partida */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleFinalSubmit('simulator')}
                      className="py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Iniciar Desafio de Questões de {weakSubject}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleFinalSubmit('cycle')}
                      className="py-4 px-6 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
                    >
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>Explorar Cockpit e Ciclo de Estudos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOnboardingModal;
