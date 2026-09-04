'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Target, 
  BarChart3, 
  Flame, 
  Zap, 
  Crown,
  BookOpen,
  RotateCcw,
  BookMarked,
  PenTool,
  BrainCircuit,
  Menu,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';

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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Definição estruturada de todas as 8 abas da plataforma
  const navTabs = [
    {
      id: 'landing',
      label: 'Início',
      shortLabel: 'Início',
      icon: Sparkles,
      desc: 'Apresentação & Visão Geral',
      badge: null,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-600/30',
    },
    {
      id: 'edital',
      label: 'Edital IA',
      shortLabel: 'Edital',
      icon: FileText,
      desc: 'Dissecação & Matriz de Pesos',
      badge: null,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-600/30',
    },
    {
      id: 'cycle',
      label: 'Ciclos',
      shortLabel: 'Ciclos',
      icon: BookOpen,
      desc: 'Cronograma Adaptativo Meirelles',
      badge: null,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-600/30',
    },
    {
      id: 'simulator',
      label: 'Simulador',
      shortLabel: 'Questões',
      icon: Target,
      desc: 'Bateria com Diagnóstico Cognitivo',
      badge: null,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-600/30',
    },
    {
      id: 'mistakes',
      label: 'Caderno de Erros',
      shortLabel: 'Erros',
      icon: RotateCcw,
      desc: 'Antídoto Cognitivo de Pegadinhas',
      badge: pendingMistakesCount > 0 ? pendingMistakesCount : null,
      badgeColor: 'bg-rose-500 text-white',
      activeColor: 'bg-rose-600 text-white shadow-rose-600/30',
    },
    {
      id: 'vademecum',
      label: 'Lei Seca',
      shortLabel: 'Legislação',
      icon: BookMarked,
      desc: 'Vade Mecum com Incidência Real',
      badge: null,
      activeColor: 'bg-amber-600 text-white shadow-amber-600/30',
    },
    {
      id: 'discursivas',
      label: 'Discursivas',
      shortLabel: 'Redação',
      icon: PenTool,
      desc: 'Correção de Redações & Peças OAB',
      badge: null,
      activeColor: 'bg-purple-600 text-white shadow-purple-600/30',
    },
    {
      id: 'analytics',
      label: 'Diagnóstico',
      shortLabel: 'Estatísticas',
      icon: BarChart3,
      desc: 'Pontos Cegos & Flashcards SRS',
      badge: null,
      activeColor: 'bg-cyan-600 text-white shadow-cyan-600/30',
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090D16]/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Top Bar Row */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer shrink-0" 
              onClick={() => handleTabClick('landing')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] glow-brand">
                <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                    AprovaLens
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 -mt-0.5 hidden md:block">
                  Copiloto Cognitivo de Concursos
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Visible on Large Screens lg+) */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#11182c]/80 p-1 rounded-2xl border border-white/5 shadow-inner">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? `${tab.activeColor} shadow-md`
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${tab.badgeColor || 'bg-indigo-500 text-white'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Actions (Streak, Copilot, Plan, Drawer Button) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Copilot Launcher Button */}
              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-cyan-500/15 border border-indigo-400/35 text-indigo-200 text-xs font-bold hover:border-indigo-400 hover:bg-indigo-500/25 transition-all shadow-sm"
                  title="Abrir Copiloto Cognitivo Waze dos Estudos"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span className="hidden md:inline">Copiloto</span>
                </button>
              )}

              {/* Supabase Status Badge (Desktops & Tablets) */}
              {isSupabaseConfigured ? (
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold"
                  title="Sincronização em Nuvem Ativa (PostgreSQL Supabase)"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden md:inline">Nuvem Ativa</span>
                </div>
              ) : (
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-400 text-[10px] font-medium"
                  title="Operando em Modo Local Resiliente (LocalStorage)"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  <span className="hidden md:inline">Modo Local</span>
                </div>
              )}

              {/* Streak Badge */}
              <div 
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-extrabold"
                title="Sequência de dias consecutivos estudando"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 animate-bounce" />
                <span>{streakDays}d</span>
              </div>

              {/* Subscription Plan Button */}
              {plan === 'aspirante' ? (
                <button
                  onClick={onOpenPricing}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black tracking-wide transition-all shadow-md shadow-amber-500/20"
                >
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span>ASSINAR PRO</span>
                </button>
              ) : (
                <button
                  onClick={onOpenPricing}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-extrabold"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/40" />
                  <span>{plan.toUpperCase()}</span>
                </button>
              )}

              {/* Mobile & Tablet Menu Toggle Button (Visible below lg) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-[#11182c] border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Abrir menu de navegação"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Subheader: Responsive Horizontal Segmented Strip (For Tablets & Mobile Phones) */}
          <div className="lg:hidden border-t border-white/5 py-2 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? `${tab.activeColor} shadow-md`
                      : 'bg-[#11182c]/80 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.shortLabel}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black shrink-0 ${tab.badgeColor || 'bg-rose-500 text-white'}`}>
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#0c1322] border-l border-white/10 h-full p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 animate-slideLeft">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white">AprovaLens AI</span>
                    <span className="block text-[10px] text-slate-400">Hub de Módulos</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Exam Info Pill */}
              {selectedExamTitle && (
                <div className="p-3 mb-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">
                    Edital em Foco
                  </span>
                  <span className="text-xs font-extrabold text-white line-clamp-1">
                    {selectedExamTitle}
                  </span>
                </div>
              )}

              {/* All Navigation Modules */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
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
                          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border border-indigo-500/40 text-white shadow-sm'
                          : 'bg-[#11182c]/50 hover:bg-[#11182c] text-slate-300 border border-transparent hover:border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{tab.label}</span>
                            {tab.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${tab.badgeColor || 'bg-rose-500 text-white'}`}>
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {tab.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <a
                href="/edital/inss-tecnico-seguro-social-2026"
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Páginas Públicas de Editais (SEO)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPricing();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Gerenciar / Assinar Plano</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar (Thumb Friendly for Smartphones < sm) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1222]/95 backdrop-blur-2xl border-t border-white/10 py-1.5 px-2 flex items-center justify-around">
        <button
          onClick={() => handleTabClick('edital')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'edital' ? 'text-indigo-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Edital</span>
        </button>

        <button
          onClick={() => handleTabClick('simulator')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'simulator' ? 'text-indigo-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="text-[10px]">Simulador</span>
        </button>

        <button
          onClick={() => handleTabClick('mistakes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl relative transition-all ${
            activeTab === 'mistakes' ? 'text-rose-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
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
            activeTab === 'vademecum' ? 'text-amber-400 font-extrabold' : 'text-slate-400'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span className="text-[10px]">Lei Seca</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">Mais</span>
        </button>
      </nav>
    </>
  );
};
