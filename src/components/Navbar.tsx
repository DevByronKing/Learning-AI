'use client';

import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Target, 
  BarChart3, 
  Flame, 
  Zap, 
  Crown,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  PenTool,
  RotateCcw,
  BookMarked
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
  isSupabaseConfigured = false
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1.5px] glow-brand">
              <div className="w-full h-full bg-dark-surface rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  AprovaLens
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Copiloto Cognitivo de Concursos
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-dark-surface/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => setActiveTab('edital')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'edital'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Edital
            </button>
            <button
              onClick={() => setActiveTab('cycle')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cycle'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Ciclos
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'mistakes'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Caderno de Erros</span>
              {pendingMistakesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {pendingMistakesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('vademecum')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'vademecum'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span>Lei Seca</span>
            </button>
            <button
              onClick={() => setActiveTab('discursivas')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'discursivas'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              Discursivas
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Diagnóstico
            </button>
          </nav>

          {/* User Stats & Plan Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Copilot Launcher Button */}
            {onOpenCopilot && (
              <button
                onClick={onOpenCopilot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold hover:border-indigo-400 transition-all shadow-md shadow-indigo-500/10"
                title="Abrir Copiloto Nexus AI (Waze dos Estudos)"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span className="hidden sm:inline">Copiloto IA</span>
              </button>
            )}

            {/* Supabase Cloud / Local Status Badge */}
            {isSupabaseConfigured ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold" title="Banco de Dados PostgreSQL (Supabase) Ativo">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Nuvem Ativa</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-400 text-[10px] font-medium" title="Operando em modo Offline-First com LocalStorage">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Modo Local</span>
              </div>
            )}

            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold" title="Sequência de dias ativos de estudo">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 animate-bounce" />
              <span className="hidden xs:inline">{streakDays}d</span>
            </div>

            {/* Plan Button / Upgrade */}
            {plan === 'aspirante' ? (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black tracking-wide transition-all shadow-lg shadow-amber-500/20 glow-emerald"
              >
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>ASSINAR PRO</span>
              </button>
            ) : (
              <button
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
                <span>{plan.toUpperCase()}</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex xl:hidden items-center justify-around py-2 border-t border-white/5 text-[11px] overflow-x-auto">
          <button 
            onClick={() => setActiveTab('edital')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'edital' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Edital</span>
          </button>
          <button 
            onClick={() => setActiveTab('simulator')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'simulator' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Simulador</span>
          </button>
          <button 
            onClick={() => setActiveTab('mistakes')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'mistakes' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Erros ({pendingMistakesCount})</span>
          </button>
          <button 
            onClick={() => setActiveTab('vademecum')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'vademecum' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            <span>Lei Seca</span>
          </button>
          <button 
            onClick={() => setActiveTab('discursivas')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'discursivas' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Discursivas</span>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`flex flex-col items-center gap-0.5 px-2 ${activeTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Diagnóstico</span>
          </button>
        </div>

      </div>
    </header>
  );
};
