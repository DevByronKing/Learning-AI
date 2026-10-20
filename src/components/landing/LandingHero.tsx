'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Target, 
  RotateCcw,
  Check,
  X,
  Compass,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Crosshair,
  ScrollText,
  ShieldAlert,
  Scale,
  Feather,
  BookOpen
} from 'lucide-react';
import { Avatar, GuardianAvatarType } from '@/components/ui';
import { analytics } from '@/lib/analytics';

interface LandingHeroProps {
  onStartEdital: () => void;
  onOpenPricing: () => void;
  onNavigateTab?: (tab: string) => void;
  onStartDiscursivas?: () => void;
  onOpenFlashChallenge?: () => void;
}

interface TrapQuestion {
  id: string;
  banca: string;
  discipline: string;
  difficulty: 'Alta' | 'Extrema' | 'Pegadinha Clássica';
  trapRate: string;
  statement: string;
  options: { label: string; isCorrect: boolean }[];
  explanation: {
    trapName: string;
    trapDetail: string;
    rule: string;
  };
}

const TRAP_QUESTIONS: TrapQuestion[] = [
  {
    id: 'cebraspe-penal',
    banca: 'CEBRASPE',
    discipline: 'Direito Penal • PRF & PF',
    difficulty: 'Pegadinha Clássica',
    trapRate: '79.4% erram',
    statement: 'No crime de contrabando de cigarros em quantidade irrisória para consumo pessoal, aplica-se o princípio da insignificância segundo entendimento pacífico dos tribunais superiores.',
    options: [
      { label: 'Certo', isCorrect: false },
      { label: 'Errado', isCorrect: true },
    ],
    explanation: {
      trapName: 'Distrator da Irrisoriedade Ilusória',
      trapDetail: 'A banca induz você a aplicar a regra geral do descaminho. No contrabando de cigarros, o STF e STJ NÃO admitem insignificância, pois o bem jurídico tutelado é a saúde pública, não o mero valor tributário.',
      rule: 'Súmula 599 e Temas Repetitivos do STJ: inaplicabilidade absoluta.'
    }
  },
  {
    id: 'fgv-admin',
    banca: 'FGV',
    discipline: 'Direito Administrativo • OAB & Tribunais',
    difficulty: 'Extrema',
    trapRate: '83.1% erram',
    statement: 'A anulação de ato administrativo do qual decorram efeitos favoráveis para o administrado decai em 5 anos, prazo este que se interrompe pela instauração de sindicância preparatória.',
    options: [
      { label: 'Certo', isCorrect: false },
      { label: 'Errado', isCorrect: true },
    ],
    explanation: {
      trapName: 'Armadilha Semântica Interrupção vs Notificação',
      trapDetail: 'A FGV troca sutilmente o efeito: o prazo decadencial de 5 anos (Lei 9.784/99, art. 54) NÃO se interrompe por sindicância interna sigilosa, mas apenas por medida de autoridade que importe impugnação com notificação válida do interessado.',
      rule: 'Art. 54, § 2º da Lei 9.784/1999: exige notificação formal do administrado.'
    }
  },
  {
    id: 'vunesp-const',
    banca: 'VUNESP',
    discipline: 'Direito Constitucional • TJ-SP',
    difficulty: 'Alta',
    trapRate: '71.8% erram',
    statement: 'As normas constitucionais de eficácia contida possuem aplicabilidade direta, imediata e integral, admitindo restrição legislativa infraconstitucional superveniente.',
    options: [
      { label: 'Certo', isCorrect: false },
      { label: 'Errado', isCorrect: true },
    ],
    explanation: {
      trapName: 'Distrator da Integralidade Técnica',
      trapDetail: 'Atenção cirúrgica à terminologia de José Afonso da Silva: normas contidas são de aplicabilidade direta e imediata, mas NÃO integral (são "não-integral" ou restringíveis). Apenas as normas plenas são integrais.',
      rule: 'Classificação Clássica: Contida = Direta, Imediata e NÃO-Integral.'
    }
  },
  {
    id: 'fcc-procpenal',
    banca: 'FCC',
    discipline: 'Direito Proc. Penal • Tribunais & TRT',
    difficulty: 'Alta',
    trapRate: '76.2% erram',
    statement: 'No inquérito policial, o arquivamento determinado por autoridade judicial a pedido do MP com base em manifesta atipicidade do fato faz coisa julgada formal, mas não material.',
    options: [
      { label: 'Certo', isCorrect: false },
      { label: 'Errado', isCorrect: true },
    ],
    explanation: {
      trapName: 'Distrator da Coisa Julgada Penal',
      trapDetail: 'A FCC tenta induzir o erro misturando falta de provas com atipicidade. O arquivamento fundado em atipicidade manifesta faz coisa julgada material e formal, impedindo a reabertura do inquérito mesmo se surgirem novas provas.',
      rule: 'Entendimento vinculante e pacificado do STF e STJ.'
    }
  }
];

export const LandingHero: React.FC<LandingHeroProps> = ({ 
  onStartEdital, 
  onOpenPricing, 
  onNavigateTab, 
  onStartDiscursivas,
  onOpenFlashChallenge
}) => {
  const [activeTrapIdx, setActiveTrapIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentTrap = TRAP_QUESTIONS[activeTrapIdx];

  const handleSelectOption = (idx: number) => {
    setSelectedAnswer(idx);
    setIsRevealed(true);
  };

  const handleReset = (newIdx: number) => {
    setActiveTrapIdx(newIdx);
    setSelectedAnswer(null);
    setIsRevealed(false);
  };

  return (
    <div className="relative overflow-hidden font-sans">
      {/* Dynamic Ambient Mesh Canvas (Vibrant & High Energy) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Architectural Tech Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        {/* Luminous Glow Auras */}
        <div className="absolute -top-24 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/25 via-blue-500/20 to-emerald-400/20 rounded-full blur-[110px] dark:from-indigo-600/35 dark:via-blue-600/25 dark:to-emerald-500/20" />
        <div className="absolute top-36 right-10 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[100px] dark:bg-emerald-600/20" />
      </div>

      <section className="relative pt-6 sm:pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* ========================================================================= */}
        {/* SPLIT HERO: TEXTO DE IMPACTO À ESQUERDA + COCKPIT AO VIVO À DIREITA      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Coluna Esquerda (5 ou 6 colunas): Mensagem Principal & Conversão */}
          <div className="lg:col-span-6 xl:col-span-5 text-left space-y-5">
            
            {/* Posicionamento & Selo de Precisão */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/80 border border-indigo-200/90 dark:border-indigo-800 text-xs shadow-xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-[11px] text-indigo-700 dark:text-indigo-300">
                  Acelerador Cognitivo de Precisão
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Bancas 2026
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-indigo-600 to-emerald-500 shrink-0" />
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-snug">
                  Ecossistema de IA Aplicada a Estudos de Concursos Públicos e Exame de Ordem do Brasil
                </p>
              </div>
            </div>

            {/* Main Headline with Contrast & Vibrant Gradient */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.14] text-slate-900 dark:text-slate-50">
              Pare de colecionar PDFs. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 dark:from-indigo-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent underline decoration-emerald-500/40 decoration-wavy decoration-2">
                Nós desarmamos a banca
              </span>{' '}
              antes da prova.
            </h1>

            {/* Subtitle / Narrativa Elevada */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Você não é reprovado por falta de conteúdo, mas pelos distratores e pegadinhas que a banca armou e você não viu a olho nu. 
              Com visão onisciente sobre o seu edital — seja em concursos públicos ou no Exame de Ordem (OAB) —, o <strong className="font-extrabold text-indigo-600 dark:text-indigo-400">Argus</strong> expõe as armadilhas psicométricas das bancas examinadoras, neutraliza seus pontos cegos e blinda sua pontuação para você romper a barreira dos 80% de acertos.
            </p>

            {/* CTA Buttons - Linha Principal (Diagnóstico & Planos) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => {
                  analytics.track('cta_clicked', {
                    location: 'landing_hero_primary',
                    cta_label: 'Fazer Diagnóstico Grátis',
                  });
                  onStartEdital();
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <BrainCircuit className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>Fazer Diagnóstico Grátis</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              
              <button
                onClick={() => {
                  analytics.track('paywall_cta_clicked', {
                    location: 'landing_hero_secondary',
                    cta_label: 'Ver Planos & Preços',
                  });
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    onOpenPricing();
                  }
                }}
                className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Ver Planos &amp; Preços</span>
              </button>
            </div>

            {/* Quick Challenge Hook - Desafio Rápido de 2 Minutos */}
            {onOpenFlashChallenge && (
              <div className="pt-0.5">
                <button
                  onClick={() => {
                    analytics.track('cta_clicked', {
                      location: 'landing_hero_flash_challenge',
                      cta_label: 'Desafio 3 Pegadinhas',
                    });
                    onOpenFlashChallenge();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Desafio 3 Pegadinhas (2 min)</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    Grátis &amp; Instantâneo
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* Micro-trust indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Sem cartão
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Diagnóstico &lt; 20s
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Gabaritos 2026
              </span>
            </div>

            {/* Faixa Útil de Cobertura das Bancas & Guardiões Cognitivos */}
            <div className="pt-2.5 flex items-center gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center -space-x-1.5 shrink-0">
                {(['onca', 'coruja', 'lobo'] as GuardianAvatarType[]).map((animal) => (
                  <div key={animal} className="ring-2 ring-white dark:ring-slate-900 rounded-full scale-75 origin-center shadow-xs">
                    <Avatar type={animal} size="sm" showInsignia={false} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug">
                <strong className="text-slate-900 dark:text-slate-200 font-bold">
                  Bancas &amp; OAB Mapeadas:
                </strong>{' '}
                Calibração psicométrica ativa contra pegadinhas para{' '}
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                  FGV, Cebraspe, FCC, Vunesp e Exame de Ordem
                </strong>.
              </p>
            </div>

          </div>

          {/* Coluna Direita (6 ou 7 colunas): COCKPIT INTERATIVO VISÍVEL E EXPANDIDO */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="p-1 rounded-3xl bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-emerald-500/40 shadow-2xl">
              <div className="p-6 sm:p-7 xl:p-8 rounded-[22px] bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-5 shadow-inner">
                
                {/* Header do Cockpit: Estilo Terminal MacOS Ampliado */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 ml-1">
                      Simulador de Pegadinhas • Teste ao Vivo
                    </span>
                  </div>

                  {/* Seletor de Bancas (Tabs Interativas Ampliadas) */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl">
                    {TRAP_QUESTIONS.map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => handleReset(idx)}
                        className={`
                          px-2.5 py-1 rounded-lg text-xs font-black font-mono transition-all cursor-pointer
                          ${activeTrapIdx === idx 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }
                        `}
                      >
                        {t.banca}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Informações da Questão em Destaque */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs">
                      {currentTrap.banca}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm">{currentTrap.discipline}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold font-mono text-xs sm:text-sm">
                    <Flame className="w-4 h-4" />
                    <span>Índice de Queda: {currentTrap.trapRate}</span>
                  </div>
                </div>

                {/* Enunciado Técnico da Questão (Tipografia e Área Ampliadas) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    "{currentTrap.statement}"
                  </p>
                </div>

                {/* Opções Interativas de Resposta: Certo ou Errado (Botões Ampliados) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {currentTrap.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = opt.isCorrect;
                    let buttonStyle = 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-sm';

                    if (isRevealed) {
                      if (isCorrect) {
                        buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/30';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300 ring-2 ring-rose-500/30';
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isRevealed}
                        className={`
                          p-3.5 sm:p-4 rounded-2xl border-2 font-black text-sm sm:text-base transition-all flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99]
                          ${buttonStyle}
                        `}
                      >
                        <span>Gabarito: <strong>{opt.label}</strong></span>
                        {isRevealed && isCorrect && <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        {isRevealed && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Revelação do Diagnóstico Cognitivo da IA (Área de Feedback Ampliada) */}
                {isRevealed && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/90 dark:from-indigo-950/50 dark:via-slate-900 dark:to-emerald-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          Blindagem Cognitiva Ativada
                        </span>
                      </div>
                      <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2.5 py-0.5 rounded-full">
                        {currentTrap.explanation.trapName}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {currentTrap.explanation.trapDetail}
                    </p>

                    <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-indigo-700 dark:text-indigo-300 font-black">
                        💡 {currentTrap.explanation.rule}
                      </span>
                      <button
                        onClick={() => handleReset((activeTrapIdx + 1) % TRAP_QUESTIONS.length)}
                        className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Próxima Questão</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini CTA footer inside Cockpit */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>
                      O Argus decodifica <strong>todas as pegadinhas do seu concurso ou Exame da OAB</strong>.
                    </span>
                  </div>
                  <button
                    onClick={onStartEdital}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                  >
                    <span>Escanear Meu Edital</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BENTO GRID DE RECURSOS REAIS: COMO O ARGUS BLINDA VOCÊ                    */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-22 text-left max-w-7xl mx-auto">
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ferramentas de Engenharia Reversa da Aprovação</span>
            </div>
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Como o Argus blinda você contra reprovações
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Conheça os 6 pilares tecnológicos desenvolvidos para antecipar a malícia do examinador e romper a barreira dos 80% de acertos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Card 1: Arena de Combate 60/40 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shadow-xs">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Simulador 60/40
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Arena de Combate & Modo Zen
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Treinamento cronometrado em alta velocidade com atalhos de teclado (<kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">A</kbd> <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">B</kbd> <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">C</kbd> <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border">F</kbd>), exposição de distratores e ranking de precisão.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  ⚡ 60s/questão
                </span>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('simulator') : onStartEdital()}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <span>Entrar na Arena</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Analisador de Editais & Copiloto Jurídico */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-xs">
                    <ScrollText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Engenharia Reversa
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Edital Verticalizado & Copiloto IA
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Extração automática de 100% dos tópicos com matriz de peso e relevância histórica. Chat conversacional dedicado para sanar qualquer dúvida sobre critérios e notas de corte.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  📜 PDF / Link Oficial
                </span>
                <button
                  onClick={onStartEdital}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span>Escanear Edital</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 3: Caderno de Erros & Revanche */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-rose-400 dark:hover:border-rose-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold shadow-xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Blindagem Ativa
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Caderno de Erros & Revanche
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Identifica a causa exata do seu tropeço (pegadinha semântica, prazo processual ou distrator). Modo Revanche aciona baterias repetidas até você atingir 100% de imunidade.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  🎯 Zero Erros Repetidos
                </span>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('mistakes') : onStartEdital()}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <span>Ver Caderno</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 4: Smart Vade Mecum & Lei Seca 80/20 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-amber-400 dark:hover:border-amber-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shadow-xs">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Lei Seca 80/20
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Smart Vade Mecum & Leis
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    CF/88, Código Penal, Processo Civil e Leis Administrativas com mapa de calor dos artigos mais cobrados pelas bancas e jurisprudência vinculante atualizada.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  ⚖️ Artigos Mais Cobrados
                </span>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('vademecum') : onStartEdital()}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>Abrir Vade Mecum</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 5: Discursivas & Redação IA */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-cyan-400 dark:hover:border-cyan-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shadow-xs">
                    <Feather className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    Grade Oficial
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    Discursivas & Redação IA
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Envie fotos ou digite suas redações e peças jurídicas. A IA corrige com os mesmos critérios oficiais da FGV/Cebraspe, fornecendo nota por quesito e sugestão de reescrita.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  ✍️ OAB & Concursos
                </span>
                <button
                  onClick={() => onStartDiscursivas ? onStartDiscursivas() : (onNavigateTab ? onNavigateTab('discursivas') : onStartEdital())}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>Treinar Redação</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 6: Cockpit de Dados & Previsão TRI */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-200 hover:border-emerald-400 dark:hover:border-emerald-500 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shadow-xs">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Métricas & TRI
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Cockpit de Métricas & 365 Dias
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    Heatmap de constância diária estilo GitHub, radar de retenção por matéria e previsão de pontuação de corte para você romper com solidez a barreira dos 80% de acertos.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  📊 Heatmap 365d Ativo
                </span>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('dashboard') : onStartEdital()}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Ver Cockpit</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};

