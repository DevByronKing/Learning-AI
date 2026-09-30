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
  Sparkles
} from 'lucide-react';
import { Avatar, GuardianAvatarType } from '@/design-system/ui';

interface LandingHeroProps {
  onStartEdital: () => void;
  onOpenPricing: () => void;
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

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartEdital, onOpenPricing }) => {
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
            
            {/* Announcement Pill with Pulsing Live Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/80 border border-indigo-200/90 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 text-xs font-bold shadow-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-indigo-700 dark:text-indigo-400">Algoritmo 2026</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">Engenharia Reversa de Bancas</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            </div>

            {/* Main Headline with Contrast & Vibrant Gradient */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.12] text-slate-900 dark:text-slate-50">
              Pare de colecionar PDFs. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 dark:from-indigo-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent underline decoration-emerald-500/40 decoration-wavy decoration-2">
                Nós desarmamos a banca
              </span>{' '}
              antes da prova.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Você não é reprovado por falta de teoria, mas pelas pegadinhas que a banca armou e você não viu. 
              O <strong className="font-extrabold text-indigo-600 dark:text-indigo-400">Learning AI</strong> decodifica seu edital, expõe os distratores psicométricos e blinda sua pontuação para você romper a barreira dos 80% de acertos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onStartEdital}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <BrainCircuit className="w-5 h-5 text-emerald-300" />
                <span>Fazer Diagnóstico Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onOpenPricing}
                className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Ver Planos & Preços</span>
              </button>
            </div>

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

            {/* Social Proof Strip */}
            <div className="pt-2 flex items-center gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center -space-x-1.5">
                {(['onca', 'coruja', 'lobo'] as GuardianAvatarType[]).map((animal) => (
                  <div key={animal} className="ring-2 ring-white dark:ring-slate-900 rounded-full scale-75 origin-center">
                    <Avatar type={animal} size="sm" showInsignia={false} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                <strong className="text-slate-900 dark:text-slate-200 font-bold">+14.800 editais</strong> processados com <strong className="text-emerald-600 dark:text-emerald-400 font-bold">92.4% de neutralização</strong> de pegadinhas.
              </p>
            </div>

          </div>

          {/* Coluna Direita (6 ou 7 colunas): COCKPIT INTERATIVO VISÍVEL IMEDIATAMENTE */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500/40 via-blue-500/30 to-emerald-500/40 shadow-2xl">
              <div className="p-5 sm:p-6 rounded-[14px] bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner">
                
                {/* Header do Cockpit: Estilo Terminal MacOS */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 ml-1">
                      Simulador de Pegadinhas • Teste ao Vivo
                    </span>
                  </div>

                  {/* Seletor de Bancas (Tabs Interativas) */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg">
                    {TRAP_QUESTIONS.map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => handleReset(idx)}
                        className={`
                          px-2 py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer
                          ${activeTrapIdx === idx 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }
                        `}
                      >
                        {t.banca}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Informações da Questão */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px]">
                      {currentTrap.banca}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">{currentTrap.discipline}</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold font-mono text-[11px]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Índice de Queda: {currentTrap.trapRate}</span>
                  </div>
                </div>

                {/* Enunciado Técnico da Questão */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    "{currentTrap.statement}"
                  </p>
                </div>

                {/* Opções Interativas de Resposta: Certo ou Errado */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {currentTrap.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = opt.isCorrect;
                    let buttonStyle = 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-xs';

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
                          p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer
                          ${buttonStyle}
                        `}
                      >
                        <span>Gabarito: <strong>{opt.label}</strong></span>
                        {isRevealed && isCorrect && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        {isRevealed && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Revelação do Diagnóstico Cognitivo da IA */}
                {isRevealed && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/90 dark:from-indigo-950/50 dark:via-slate-900 dark:to-emerald-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          Blindagem Cognitiva Ativada
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full">
                        {currentTrap.explanation.trapName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {currentTrap.explanation.trapDetail}
                    </p>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                        💡 {currentTrap.explanation.rule}
                      </span>
                      <button
                        onClick={() => handleReset((activeTrapIdx + 1) % TRAP_QUESTIONS.length)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Próxima Questão</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mini CTA footer inside Cockpit */}
                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    O Learning AI decodifica <strong>todas as pegadinhas do seu edital</strong>.
                  </span>
                  <button
                    onClick={onStartEdital}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Escanear Meu Edital</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BENTO GRID DE RECURSOS VISUAIS DE ALTO IMPACTO                            */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-18 text-left max-w-7xl mx-auto">
          <div className="mb-6 text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Arquitetura de Alta Performance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Como o Learning AI blinda você contra reprovações
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Bento Card 1: Animais Guardiões & Psicometria */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-indigo-400 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  Arquétipos
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">6 Animais Guardiões</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Identifica seu perfil comportamental de estudo e calibra o ciclo de questões para seu nível cognitivo.
                </p>
              </div>

              {/* Mini Avatar Gallery */}
              <div className="flex items-center -space-x-2 pt-2">
                {(['coruja', 'lobo', 'gaviao', 'leao', 'onca', 'raposa'] as GuardianAvatarType[]).map((animal) => (
                  <div key={animal} className="ring-2 ring-white dark:ring-slate-900 rounded-full">
                    <Avatar type={animal} size="sm" showInsignia={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 2: Psicometria TRI de Bancas */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-emerald-400 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Algoritmo TRI
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Raio-X de Distratores</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Mapeia onde 70% dos candidatos escorregam e treina você especificamente nas pegadinhas da banca examinadora.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  <span>Taxa de Neutralização</span>
                  <span className="text-emerald-600 dark:text-emerald-400">92.4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="w-[92%] h-full rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            {/* Bento Card 3: Ciclo Meirelles Adaptativo */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-blue-400 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Método 2026
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Ciclo de Estudo Adaptativo</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Adequa os blocos de disciplinas ao seu tempo diário real, com repetição espaçada SM-2 automática.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                <Compass className="w-4 h-4" />
                <span>Edital 100% Verticalizado</span>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};

