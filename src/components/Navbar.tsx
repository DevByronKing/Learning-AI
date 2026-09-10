'use client';

import React, { useState } from 'react';
import { 
  Compass,
  ScrollText,
  CalendarClock,
  Crosshair,
  ShieldAlert,
  Scale,
  Feather,
  Activity,
  Sun,
  Moon,
  Flame, 
  Crown,
  Zap,
  Sparkles,
  BrainCircuit,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  BookCheck,
  Trophy,
  Smartphone
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import { MobileAppModal } from './MobileAppModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakDays: number;
  plan: SubscriptionPlan;
  onOpenPricing: () => void;
  selectedExamTitle?: string;
  pendingMistakesCount?: number;
  onOpenCopilot?: () => void;
  isSupabaseConfigured?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  plan,
  onOpenPricing,
  selectedExamTitle,
  pendingMistakesCount = 0,
  onOpenCopilot,
  isSupabaseConfigured = false,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Módulos com Rótulos Inteligentes e Responsivos sem quebra de layout
  const navTabs = [
    {
      id: 'landing',
      label: 'Início',
      shortLabel: 'Início',
      icon: Compass,
      desc: 'Visão Geral & Apresentação',
      badge: null,
    },
    {
      id: 'edital',
      label: 'Edital IA',
      shortLabel: 'Edital',
      icon: ScrollText,
      desc: 'Análise Estratégica & Matriz de Pesos',
      badge: null,
    },
    {
      id: 'cycle',
      label: 'Ciclos',
      shortLabel: 'Ciclos',
      icon: CalendarClock,
      desc: 'Cronograma Adaptativo Meirelles',
      badge: null,
    },
    {
      id: 'questions',
      label: 'Questões',
      shortLabel: 'Questões',
      icon: BookCheck,
      desc: 'Banco Extenso com Filtros e Banca',
      badge: null,
    },
    {
      id: 'simulator',
      label: 'Simulador',
      shortLabel: 'Simulado',
      icon: Crosshair,
      desc: 'Bateria com Diagnóstico Cognitivo',
      badge: null,
    },
    {
      id: 'mistakes',
      label: 'Erros',
      shortLabel: 'Erros',
      icon: ShieldAlert,
      desc: 'Antídoto de Pegadinhas',
      badge: pendingMistakesCount > 0 ? pendingMistakesCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'vademecum',
      label: 'Lei Seca',
      shortLabel: 'Leis',
      icon: Scale,
      desc: 'Vade Mecum com Incidência Real',
      badge: null,
    },
    {
      id: 'discursivas',
      label: 'Discursivas',
      shortLabel: 'Redação',
      icon: Feather,
      desc: 'Correção de Redações & Peças OAB',
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Jornada & IA',
      shortLabel: 'Jornada',
      icon: Trophy,
      desc: 'Companheiro Animal, Metas & Conquistas',
      badge: null,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const isLight = theme === 'light';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        isLight 
          ? 'bg-white/90 border-slate-200 backdrop-blur-xl shadow-sm' 
          : 'bg-[#090D16]/95 border-slate-800 dark:border-white/10 backdrop-blur-2xl'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          
          {/* Top Bar Row */}
          <div className="flex items-center justify-between h-16 gap-2 xl:gap-3">
            
            {/* Logo: Learning AI */}
            <div 
              className="flex items-center gap-2 xl:gap-2.5 cursor-pointer shrink-0" 
              onClick={() => handleTabClick('landing')}
              title="Ir para o início"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] glow-brand shadow-md">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                  isLight ? 'bg-white' : 'bg-[#0d1322]'
                }`}>
                  <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base sm:text-lg xl:text-xl font-black tracking-tight transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">AI</span>
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    PRO
                  </span>
                </div>
                <p className={`text-[10px] -mt-0.5 hidden 2xl:block transition-colors ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Copiloto Cognitivo de Concursos
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Responsive sizing, no cutting off) */}
            <nav className={`hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 p-1 rounded-2xl border shadow-inner flex-1 max-w-4xl xl:max-w-5xl transition-colors ${
              isLight 
                ? 'bg-slate-100/95 border-slate-200/90' 
                : 'bg-slate-900/80 dark:bg-dark-surface/90 border-slate-700/60 dark:border-white/10'
            }`}>
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    title={tab.desc}
                    className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-xl text-[11px] xl:text-xs font-bold transition-all whitespace-nowrap shrink-0 select-none ${
                      isActive
                        ? isLight
                          ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200 font-extrabold'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-extrabold'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? (isLight ? 'text-indigo-600' : 'text-white') : (isLight ? 'text-slate-500' : 'text-slate-400')}`} />
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="inline xl:hidden">{tab.shortLabel}</span>
                    {tab.badge && (
                      <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${tab.badgeColor || 'bg-rose-500 text-white'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Utility Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
              
              {/* Theme Toggle Button (Modo Claro / Modo Escuro) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-200 shadow-sm' 
                      : 'bg-white dark:bg-[#11182c] hover:bg-[#18223d] text-amber-400 border-slate-300 dark:border-white/10'
                  }`}
                  title={isLight ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
                  aria-label="Alternar tema de cores"
                >
                  {isLight ? (
                    <Moon className="w-4 h-4 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
                  )}
                </button>
              )}

              {/* Copilot Launcher Button */}
              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                    isLight 
                      ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' 
                      : 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border-indigo-400/35 text-indigo-200 hover:border-indigo-400 hover:bg-indigo-500/25'
                  }`}
                  title="Abrir Copiloto Cognitivo Waze dos Estudos"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-cyan-400'} animate-pulse`} />
                  <span className={`hidden md:inline whitespace-nowrap ${isLight ? 'text-indigo-700 font-black' : 'text-indigo-200'}`}>Copiloto</span>
                </button>
              )}

              {/* Streak Badge */}
              <div 
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold ${
                  isLight 
                    ? 'bg-amber-50 border-amber-200 text-amber-800' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                }`}
                title="Sequência de dias consecutivos de estudo"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 animate-bounce" />
                <span className="whitespace-nowrap">{streakDays}d</span>
              </div>

              {/* Mobile App Button (Onboarding Multimodal) */}
              <button
                onClick={() => setIsMobileModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                title="Abrir ou Sincronizar com App Mobile (iOS / Android)"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline whitespace-nowrap">App Mobile</span>
              </button>

              {/* Plan Button */}
              {plan === 'aspirante' ? (
                <button
                  onClick={onOpenPricing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black tracking-wide transition-all shadow-md shadow-amber-500/20 whitespace-nowrap"
                >
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span>ASSINAR PRO</span>
                </button>
              ) : (
                <button
                  onClick={onOpenPricing}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-extrabold whitespace-nowrap ${
                    isLight 
                      ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' 
                      : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600 fill-purple-600/40' : 'text-indigo-500 fill-indigo-500/40'}`} />
                  <span className={isLight ? 'text-purple-800 font-black' : 'text-indigo-300'}>{plan.toUpperCase()}</span>
                </button>
              )}

              {/* Mobile Menu Trigger Button (Visible below lg) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl border transition-colors ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900' 
                    : 'bg-slate-900 dark:bg-dark-surface border-slate-700 dark:border-white/10 text-slate-300 hover:text-white'
                }`}
                aria-label="Abrir menu de navegação"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Subheader Strip: Clean Horizontal Scroll for Tablets and Phones (< lg) */}
          <div className={`lg:hidden border-t py-2 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 ${
            isLight ? 'border-slate-200' : 'border-slate-800 dark:border-white/10'
          }`}>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all ${
                    isActive
                      ? isLight
                        ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-extrabold'
                      : isLight
                        ? 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                        : 'bg-slate-900/90 dark:bg-dark-surface/80 text-slate-300 hover:text-white border border-slate-800 dark:border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.shortLabel}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white shrink-0">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className={`relative w-full max-w-xs sm:max-w-sm h-full p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 border-l transition-colors ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-900' 
              : 'bg-[#0c1322] dark:bg-dark-surface border-slate-800 dark:border-white/10 text-white'
          }`}>
            <div>
              {/* Drawer Header */}
              <div className={`flex items-center justify-between pb-4 border-b mb-5 ${
                isLight ? 'border-slate-200' : 'border-slate-800 dark:border-white/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black">Learning AI</span>
                    <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Navegação Completa
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onToggleTheme && (
                    <button
                      onClick={onToggleTheme}
                      className={`p-1.5 rounded-lg border ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 dark:border-white/10 text-slate-300'
                      }`}
                      title={isLight ? 'Modo Escuro' : 'Modo Claro'}
                    >
                      {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-1.5 rounded-lg ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Exam Pill */}
              {selectedExamTitle && (
                <div className={`p-3 mb-4 rounded-2xl border ${
                  isLight 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                    : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                    Edital em Foco
                  </span>
                  <span className="text-xs font-extrabold line-clamp-1">
                    {selectedExamTitle}
                  </span>
                </div>
              )}

              {/* All Navigation Modules */}
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Módulos de Estudo
                </span>

                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? isLight
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold shadow-sm'
                            : 'bg-indigo-600/25 border border-indigo-500/40 text-white font-bold'
                          : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
                            : 'bg-slate-900/60 dark:bg-dark-card/50 hover:bg-slate-800 text-slate-300 border border-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          isActive 
                            ? 'bg-indigo-600 text-white' 
                            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/5 text-slate-500 dark:text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{tab.label}</span>
                            {tab.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] block mt-0.5 ${
                            isLight ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {tab.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'opacity-40'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className={`mt-6 pt-4 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-300 dark:border-white/10'}`}>
              <a
                href="/edital/inss-tecnico-seguro-social-2026"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Páginas de Editais (SEO)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPricing();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Assinar / Gerenciar Plano</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar (Thumb Friendly for Smartphones < sm) */}
      <nav className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-1.5 px-2 flex items-center justify-around transition-colors ${
        isLight 
          ? 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-600' 
          : 'bg-[#0c1222]/95 backdrop-blur-2xl border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400'
      }`}>
        <button
          onClick={() => handleTabClick('edital')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'edital' ? 'text-indigo-600 font-extrabold' : ''
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span className="text-[10px]">Edital</span>
        </button>

        <button
          onClick={() => handleTabClick('simulator')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'simulator' ? 'text-indigo-600 font-extrabold' : ''
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span className="text-[10px]">Simulador</span>
        </button>

        <button
          onClick={() => handleTabClick('mistakes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl relative transition-all ${
            activeTab === 'mistakes' ? 'text-rose-600 font-extrabold' : ''
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px]">Erros</span>
          {pendingMistakesCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
              {pendingMistakesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabClick('vademecum')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'vademecum' ? 'text-amber-600 font-extrabold' : ''
          }`}
        >
          <Scale className="w-4 h-4" />
          <span className="text-[10px]">Lei Seca</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl hover:opacity-100 transition-all"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">Mais</span>
        </button>
      </nav>

      {/* Modal de Onboarding Multimodal (Continuar no Celular) */}
      <MobileAppModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)} 
      />
    </>
  );
};
