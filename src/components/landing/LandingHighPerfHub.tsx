'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Crosshair, 
  Layers, 
  Scale, 
  Microscope, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Zap,
  BookOpen,
  CheckCircle2,
  RotateCw,
  LayoutGrid,
  Laptop,
  Check,
  Award,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

interface LandingHighPerfHubProps {
  onNavigateTab: (tab: string) => void;
}

export const LandingHighPerfHub: React.FC<LandingHighPerfHubProps> = ({ onNavigateTab }) => {
  // View mode: 'bento' or 'sandbox'
  const [viewMode, setViewMode] = useState<'bento' | 'sandbox'>('bento');
  const [activeSandboxTab, setActiveSandboxTab] = useState<string>('dashboard');

  // Interactive states for Bento mini-UIs
  // Simulator mini answer state
  const [simSelectedOption, setSimSelectedOption] = useState<string | null>(null);
  
  // Flashcard mini flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardFeedback, setFlashcardFeedback] = useState<string | null>(null);

  // Vade mecum drawer toggle
  const [showVadeErrors, setShowVadeErrors] = useState(false);

  // Psychometrics live narrative scanner ticker
  const [scannerIndex, setScannerIndex] = useState(0);
  const scannerTexts = [
    'A rastrear armadilhas recorrentes da FGV...',
    'A calcular discriminante "a" dos distratores...',
    'A mapear curva de retenção do Edital...',
    'A neutralizar gap de ilusão teórica...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScannerIndex((prev) => (prev + 1) % scannerTexts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [scannerTexts.length]);

  const pillars = [
    {
      id: 'dashboard',
      num: '01',
      title: 'Cockpit de Dados & Consistência',
      badge: 'HEATMAP 365 DIAS',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      icon: Activity,
      desc: 'Heatmap de consistência diária estilo GitHub, barras duplas de edital verticalizado (revelando o gap de ilusão teórica) e métrica de Blindagem contra FGV e Cebraspe.',
      cta: 'Acessar Cockpit de Dados',
      accent: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/10'
    },
    {
      id: 'simulator',
      num: '02',
      title: 'Arena de Combate (Simulador 60/40)',
      badge: 'LEETCODE STYLE 60/40',
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      icon: Crosshair,
      desc: 'Layout Split-screen 60/40: enunciado técnico à esquerda, coluna psicométrica à direita. Navegação 100% teclado (A-E, Enter) e Modo Foco Zen.',
      cta: 'Entrar na Arena de Combate',
      accent: 'from-blue-600 to-cyan-600',
      glow: 'shadow-blue-500/10'
    },
    {
      id: 'flashcards',
      num: '03',
      title: 'SRS Flashcards (Retenção Ativa)',
      badge: 'FLIP 3D EM 200MS',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
      icon: Layers,
      desc: 'Viragem física 3D instantânea, 4 botões calibrados de esforço cognitivo ([1] Errei a [4] Fácil) e intervalo otimizado para quebrar a curva de esquecimento.',
      cta: 'Treinar Flashcards 3D',
      accent: 'from-purple-600 to-indigo-600',
      glow: 'shadow-purple-500/10'
    },
    {
      id: 'vademecum',
      num: '04',
      title: 'Smart Vade Mecum & Caderno de Erros',
      badge: 'BACKLINKS BIDIRECIONAIS',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
      icon: Scale,
      desc: 'Conexão estilo Obsidian: cada artigo de lei traz badge com questões erradas vinculadas pela FGV/Cebraspe, com Revanche Imediata.',
      cta: 'Abrir Smart Vade Mecum',
      accent: 'from-rose-500 to-orange-500',
      glow: 'shadow-rose-500/10'
    },
    {
      id: 'psychometrics',
      num: '05',
      title: 'Psicometria Educacional & TRI',
      badge: 'SKELETON NARRATIVO & TRI',
      badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
      icon: Microscope,
      desc: 'Diagnósticos profundos com algoritmo TRI: mensura probabilidade de acerto por chute, calibra o tempo de resolução e aponta distratores fatais.',
      cta: 'Executar Diagnóstico com IA',
      accent: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/10'
    }
  ];

  // Helper for generating realistic heatmap cells
  const heatmapWeeks = 18;
  const heatmapDays = 7;
  const getCellIntensity = (week: number, day: number) => {
    const val = (week * 7 + day * 13) % 10;
    if (val < 2) return 'bg-slate-200 dark:bg-white/5';
    if (val < 5) return 'bg-emerald-300/60 dark:bg-emerald-700/40';
    if (val < 8) return 'bg-emerald-400 dark:bg-emerald-500/70';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>Hub de Teste Imediato • Estudante de Alta Performance</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Os 5 Pilares de Combate Calibrados
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Arquitetura cognitiva projetada para o concurseiro de elite. Layouts assimétricos, dados em tempo real e zero elementos infantis.
        </p>

        {/* View Mode Toggle Switcher */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-dark-card/90 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
            <button
              onClick={() => setViewMode('bento')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                viewMode === 'bento'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Visão Panorâmica Bento (5 Pilares)</span>
            </button>
            <button
              onClick={() => setViewMode('sandbox')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                viewMode === 'sandbox'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Degustação Ao Vivo (Sandbox)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: HARMONIOUS 6-COLUMN BENTO GRID (2+1 Row 1, 1+1+1 Row 2)     */}
      {/* ========================================================================= */}
      {viewMode === 'bento' && (
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* ===================================================================== */}
          {/* PILAR 01: COCKPIT DE DADOS (SPAN 2 COLS ON DESKTOP)                  */}
          {/* ===================================================================== */}
          <div 
            onClick={() => onNavigateTab('dashboard')}
            className="group cursor-pointer rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-dark-card/90 border border-slate-200/90 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl lg:col-span-2 shadow-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[1px] shadow-md">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                      <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      HEATMAP 365 DIAS
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                      Cockpit de Dados & Consistência Implacável
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                    <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>48 Dias Consecutivos</span>
                  </div>
                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    01
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                O concurseiro sofre da <em>ilusão teórica</em>: acha que está preparado porque leu o PDF. O Cockpit revela o gap real entre leitura passiva e acerto calibrado contra a banca.
              </p>

              {/* Live Interactive Heatmap Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    Atividade de Resolução Diária (Simulado & Discursivas)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">140 dias monitorados</span>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto pb-1">
                  <div className="flex gap-1 min-w-[340px]">
                    {Array.from({ length: heatmapWeeks }).map((_, w) => (
                      <div key={w} className="flex flex-col gap-1 flex-1">
                        {Array.from({ length: heatmapDays }).map((_, d) => (
                          <div 
                            key={d} 
                            title={`Semana ${w + 1}, Dia ${d + 1}`}
                            className={`h-3 rounded-[3px] transition-all hover:scale-125 hover:z-10 ${getCellIntensity(w, d)}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gap de Ilusão Teórica Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-white/5 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400 mb-1">
                      <span>Teoria Lida (Sensação)</span>
                      <span className="text-slate-500">92%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      <span>Blindagem Real FGV/Cebraspe</span>
                      <span className="font-black">88.4%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[88.4%] shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
              <span className="flex items-center gap-1.5">
                <span>Acessar Cockpit de Dados & Métricas</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Ao Vivo</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PILAR 02: ARENA DE COMBATE 60/40 (SPAN 1 COL ON DESKTOP)             */}
          {/* ===================================================================== */}
          <div 
            onClick={() => onNavigateTab('simulator')}
            className="group cursor-pointer rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-dark-card/90 border border-slate-200/90 dark:border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl lg:col-span-1 shadow-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600" />

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-[1px] shadow-md">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                    <Crosshair className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    60/40 LEETCODE
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    02
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Arena de Combate (Simulador 60/40)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Split-screen profissional: texto de lei à esquerda, botões com hotkey (A-E) à direita.
                </p>
              </div>

              {/* Mini Interactive Split Screen Mockup */}
              <div 
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-2.5 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-1 border-b border-slate-200/50 dark:border-white/5">
                  <span className="font-bold text-blue-600 dark:text-blue-400">FGV • Auditor Fiscal</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-[10px] text-blue-700 dark:text-blue-300 font-bold">Modo Zen (F)</span>
                </div>

                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                  "O princípio da impessoalidade veda a promoção pessoal de autoridades em publicidades oficiais..."
                </p>

                {/* Keypad Buttons A-E */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSimSelectedOption(opt)}
                      className={`h-8 rounded-lg font-mono font-black text-xs transition-all flex items-center justify-center ${
                        simSelectedOption === opt
                          ? opt === 'C'
                            ? 'bg-emerald-600 text-white shadow-md scale-105'
                            : 'bg-rose-600 text-white shadow-md'
                          : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {simSelectedOption && (
                  <div className={`text-[10px] font-bold text-center py-1 rounded-lg ${
                    simSelectedOption === 'C' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {simSelectedOption === 'C' ? '✓ Correta! +22 pts TRI calculados' : '✗ Distrator clássico da banca!'}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div 
              onClick={() => onNavigateTab('simulator')}
              className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-500"
            >
              <span>Entrar na Arena de Combate</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PILAR 03: SRS FLASHCARDS 3D (SPAN 1 COL ON DESKTOP)                   */}
          {/* ===================================================================== */}
          <div 
            className="group rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-dark-card/90 border border-slate-200/90 dark:border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl lg:col-span-1 shadow-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600" />

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px] shadow-md">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                    <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    FLIP 3D EM 200MS
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    03
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  SRS Flashcards (Retenção Ativa)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Repetição espaçada com esforço cognitivo calibrado. Quebra o esquecimento.
                </p>
              </div>

              {/* Interactive 3D Card Simulation */}
              <div 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/5 border border-purple-500/20 text-xs transition-all hover:scale-[1.02] relative min-h-[110px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-700 dark:text-purple-300">
                  <span className="font-bold">{isCardFlipped ? 'RESPOSTA' : 'PERGUNTA'}</span>
                  <span className="flex items-center gap-1 opacity-70">
                    <RotateCw className="w-3 h-3 animate-spin-slow" /> Clique para virar
                  </span>
                </div>

                <div className="py-2">
                  {!isCardFlipped ? (
                    <p className="font-bold text-slate-800 dark:text-white text-xs">
                      "Qual ação constitucional protege direito líquido e certo não amparado por HC ou HD?"
                    </p>
                  ) : (
                    <p className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                      → Mandado de Segurança (Art. 5º, LXIX, CF/88).
                    </p>
                  )}
                </div>

                {isCardFlipped && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="grid grid-cols-4 gap-1 pt-1 border-t border-purple-500/20"
                  >
                    {[
                      { l: '1 Errei', c: 'bg-rose-500/20 text-rose-600 dark:text-rose-300' },
                      { l: '2 Difícil', c: 'bg-amber-500/20 text-amber-600 dark:text-amber-300' },
                      { l: '3 Bom', c: 'bg-blue-500/20 text-blue-600 dark:text-blue-300' },
                      { l: '4 Fácil', c: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' }
                    ].map((b, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setFlashcardFeedback(`Memória consolidada (+${(i + 1) * 3} dias)`);
                          setTimeout(() => setFlashcardFeedback(null), 2500);
                        }}
                        className={`text-[9px] font-black py-1 rounded text-center transition-transform hover:scale-105 ${b.c}`}
                      >
                        {b.l}
                      </button>
                    ))}
                  </div>
                )}

                {flashcardFeedback && (
                  <div className="absolute inset-0 bg-purple-900/90 rounded-2xl flex items-center justify-center text-white text-xs font-bold animate-fadeIn">
                    ✓ {flashcardFeedback}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div 
              onClick={() => onNavigateTab('flashcards')}
              className="cursor-pointer pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-purple-600 dark:text-purple-400 group-hover:text-purple-500"
            >
              <span>Treinar Flashcards 3D</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PILAR 04: SMART VADE MECUM (SPAN 1 COL ON DESKTOP)                    */}
          {/* ===================================================================== */}
          <div 
            className="group rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-dark-card/90 border border-slate-200/90 dark:border-white/10 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl lg:col-span-1 shadow-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500" />

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-[1px] shadow-md">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                    <Scale className="w-6 h-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    BACKLINKS NOTION
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    04
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Smart Vade Mecum & Erros
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Artigos de lei conectados diretamente ao seu caderno de erros e pegadinhas.
                </p>
              </div>

              {/* Mini Article Backlink Mockup */}
              <div 
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-[11px] text-slate-800 dark:text-slate-200">
                    CF/88 • Art. 5º, LXVIII
                  </span>
                  <button
                    onClick={() => setShowVadeErrors(!showVadeErrors)}
                    className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-500/30 hover:scale-105 transition-transform"
                  >
                    🔴 12 Erros FGV
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
                  "...conceder-se-á habeas corpus sempre que alguém sofrer ou se achar ameaçado de coação..."
                </p>

                {showVadeErrors ? (
                  <div className="pt-2 border-t border-rose-500/20 text-[10px] text-rose-700 dark:text-rose-300 font-bold space-y-1 animate-fadeIn">
                    <div>⚡ Pegadinha: Punição disciplinar militar (súmula 694 STF).</div>
                    <button 
                      onClick={() => onNavigateTab('vademecum')}
                      className="text-xs text-rose-600 underline font-black"
                    >
                      Revanche Imediata no Vade Mecum →
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Conexão bidirecional: Clique na badge para ver pegadinhas vinculadas.
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div 
              onClick={() => onNavigateTab('vademecum')}
              className="cursor-pointer pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-rose-600 dark:text-rose-400 group-hover:text-rose-500"
            >
              <span>Abrir Smart Vade Mecum</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PILAR 05: PSICOMETRIA & TRI (SPAN 1 COL ON DESKTOP)                   */}
          {/* ===================================================================== */}
          <div 
            onClick={() => onNavigateTab('psychometrics')}
            className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-dark-card/90 border border-slate-200/90 dark:border-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl lg:col-span-1 shadow-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-md">
                  <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    SKELETON NARRATIVO
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    05
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Psicometria & Calibração TRI
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Algoritmo estatístico que avalia coerência pedagógica e probabilidade de chute.
                </p>
              </div>

              {/* Mini Diagnostic Scanner Mockup */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 font-black">
                    CALIBRAÇÃO ATIVA
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    TRI: <span className="text-cyan-600 font-black">842.5 pts</span>
                  </span>
                </div>

                {/* Animated Scanner Ticker */}
                <div className="h-7 bg-cyan-500/10 rounded-lg px-2 flex items-center overflow-hidden">
                  <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-300 font-bold truncate animate-pulse">
                    {scannerTexts[scannerIndex]}
                  </span>
                </div>

                {/* Micro Metric Badge */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-white/5">
                  <span>Distratores Mapeados: <strong>14</strong></span>
                  <span className="text-emerald-600 font-bold">Top 5% da Amostra</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500">
              <span>Executar Diagnóstico com IA</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 group-hover:bg-cyan-600 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: DEGUSTAÇÃO INTERATIVA (SANDBOX EM FOCO)                     */}
      {/* ========================================================================= */}
      {viewMode === 'sandbox' && (
        <div className="relative bg-white/95 dark:bg-dark-card/90 rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {/* Segmented Selector for the 5 Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-slate-200 dark:border-white/10">
            {pillars.map((p) => {
              const Icon = p.icon;
              const isActive = activeSandboxTab === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveSandboxTab(p.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${p.accent} text-white shadow-md scale-105`
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.num}. {p.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Stage Content */}
          <div className="py-8">
            {activeSandboxTab === 'dashboard' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                    Pilar 01 • Cockpit de Dados & Métricas
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Simulação de Consistência e Gap de Ilusão Teórica
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Visualize o seu progresso diário em 365 dias com o mesmo rigor dos repositórios de código do GitHub.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Heatmap de Resoluções Semanais</span>
                    <span className="text-emerald-600 font-mono">Consistência: 98.2%</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    {Array.from({ length: 48 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-5 rounded-md ${
                          idx % 7 === 0 ? 'bg-slate-200 dark:bg-white/10' :
                          idx % 3 === 0 ? 'bg-emerald-500' :
                          idx % 2 === 0 ? 'bg-emerald-400' : 'bg-emerald-300/80'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-white/5">
                    <span>Menos ativo</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-300" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                      <div className="w-2.5 h-2.5 rounded bg-emerald-700" />
                    </div>
                    <span>Mais ativo</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onNavigateTab('dashboard')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    <span>Abrir Cockpit de Dados Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeSandboxTab === 'simulator' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-600 border border-blue-500/30">
                    Pilar 02 • Arena de Combate 60/40
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Simulador Split-Screen no Padrão FGV/Cebraspe
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Enunciado à esquerda e console de resposta rápida à direita. Sem cliques desnecessários.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 space-y-3">
                    <div className="text-[11px] font-mono text-blue-600 font-bold">QUESTÃO #14.892 • DIREITO CONSTITUCIONAL</div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                      "Acerca dos direitos e garantias fundamentais previstos na Constituição Federal de 1988, assinale a alternativa juridicamente correta quanto à inviolabilidade do domicílio:"
                    </p>
                    <div className="text-[10px] text-slate-500 bg-white dark:bg-white/5 p-2.5 rounded-lg border border-slate-200 dark:border-white/5">
                      💡 <strong>Dica da IA:</strong> Atenção à jurisprudência do STF sobre mandado de busca noturno e flagrante delito.
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {['A) Só com consentimento', 'B) Flagrante ou desastre a qualquer hora', 'C) Determinação judicial à noite', 'D) Não há exceção'].map((alt, i) => (
                        <button
                          key={i}
                          onClick={() => setSimSelectedOption(String.fromCharCode(65 + i))}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            simSelectedOption === String.fromCharCode(65 + i)
                              ? i === 1
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400'
                          }`}
                        >
                          {alt}
                        </button>
                      ))}
                    </div>
                    {simSelectedOption && (
                      <div className="text-[11px] font-bold text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                        {simSelectedOption === 'B' ? '✓ Perfeito! Art. 5º, XI, CF/88' : '✗ Incorreto. Revise as exceções.'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onNavigateTab('simulator')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
                  >
                    <span>Entrar na Arena de Combate Real</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeSandboxTab === 'flashcards' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/15 text-purple-600 border border-purple-500/30">
                    Pilar 03 • Repetição Espaçada SRS
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Memória Consolidada com Flip 3D
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Vire o card para testar sua recuperação ativa imediata.
                  </p>
                </div>

                <div 
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="cursor-pointer max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/5 border-2 border-purple-500/30 text-center space-y-4 hover:shadow-2xl transition-all"
                >
                  <div className="text-xs font-mono font-bold text-purple-600">
                    {isCardFlipped ? 'VERSO (RESPOSTA)' : 'FRENTE (CONCEITO)'}
                  </div>
                  <div className="min-h-[90px] flex items-center justify-center">
                    <p className="text-base sm:text-lg font-black text-slate-800 dark:text-white">
                      {!isCardFlipped
                        ? 'Qual é a diferença essencial entre Descentralização e Desconcentração Administrativa?'
                        : 'Descentralização cria nova pessoa jurídica (ex: Autarquia); Desconcentração distribui competências internamente (órgãos).'}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Clique para virar o flashcard
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onNavigateTab('flashcards')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-xl shadow-purple-500/20 transition-all hover:scale-105"
                  >
                    <span>Treinar Bateria de Flashcards</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeSandboxTab === 'vademecum' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
                    Pilar 04 • Smart Vade Mecum Bidirecional
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    A Lei Seca Conectada aos Seus Erros
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Nunca mais leia a lei no escuro. Veja exatamente quantas vezes a banca tentou te enganar em cada dispositivo legal.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3 font-serif">
                  <div className="font-mono text-xs font-black text-rose-600 not-italic">
                    CONSTITUIÇÃO FEDERAL DE 1988 • ART. 37, §6º
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    "As pessoas jurídicas de direito público e as de direito privado prestadoras de serviços públicos responderão pelos danos que seus agentes, nessa qualidade, causarem a terceiros..."
                  </p>
                  <div className="flex items-center gap-2 pt-2 not-italic">
                    <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-500/30">
                      🔴 8 Questões Erradas Vinculadas
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      (Responsabilidade Civil Objetiva)
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onNavigateTab('vademecum')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-xl shadow-rose-500/20 transition-all hover:scale-105"
                  >
                    <span>Navegar no Smart Vade Mecum</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeSandboxTab === 'psychometrics' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/15 text-cyan-600 border border-cyan-500/30">
                    Pilar 05 • Psicometria Educacional & TRI
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Teoria de Resposta ao Item em Tempo Real
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Descubra seu score estatístico real eliminando o fator sorte e calibrando a consistência dos seus acertos.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Parâmetros de Calibração TRI</span>
                    <span className="text-cyan-600 font-mono">Índice 'b' (Dificuldade): 2.14 (Alto)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 font-bold">DISCRIMINAÇÃO (a)</div>
                      <div className="text-lg font-black text-cyan-600">1.82</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 font-bold">ACERTO CASUAL (c)</div>
                      <div className="text-lg font-black text-emerald-600">0.05</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-500 font-bold">SCORE TRI</div>
                      <div className="text-lg font-black text-indigo-600">842.5</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => onNavigateTab('psychometrics')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
                  >
                    <span>Executar Diagnóstico Psicométrico com IA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
