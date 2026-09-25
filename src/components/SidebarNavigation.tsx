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
  Layers,
  Microscope,
  Radar,
  BookCheck,
  BookOpen,
  Crown,
  Settings,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { StudentProfile, SubscriptionPlan } from '@/lib/types';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: 'dark' | 'light';
  pendingMistakesCount?: number;
  studentProfile?: StudentProfile;
  streakDays?: number;
  plan?: SubscriptionPlan;
  onOpenPricing?: () => void;
  onOpenProfile?: () => void;
  onOpenOnboarding?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  theme = 'dark',
  pendingMistakesCount = 0,
  studentProfile,
  streakDays = 1,
  plan = 'aspirante',
  onOpenPricing,
  onOpenProfile,
  onOpenOnboarding,
  isCollapsed,
  onToggleCollapse
}) => {
  const isLight = theme === 'light';
  const currentGuardian = GUARDIAN_ANIMALS.find((a) => a.id === studentProfile?.guardianAnimalId) || GUARDIAN_ANIMALS[0];

  const primaryPillars = [
    {
      id: 'dashboard',
      label: 'Cockpit de Dados',
      shortLabel: 'Cockpit',
      icon: Activity,
      badge: 'HEATMAP',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'simulator',
      label: 'Arena 60/40',
      shortLabel: 'Arena',
      icon: Crosshair,
      badge: '60/40',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'flashcards',
      label: 'SRS Flashcards',
      shortLabel: 'Flashcards',
      icon: Layers,
      badge: '3D',
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    },
    {
      id: 'vademecum',
      label: 'Smart Vade Mecum',
      shortLabel: 'Vade Mecum',
      icon: Scale,
      badge: 'LINKS',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    {
      id: 'mistakes',
      label: 'Caderno de Erros',
      shortLabel: 'Erros',
      icon: ShieldAlert,
      badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'psychometrics',
      label: 'Psicometria TRI',
      shortLabel: 'Psico',
      icon: Microscope,
      badge: 'IA',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    }
  ];

  const prepModules = [
    {
      id: 'radar',
      label: 'Radar 2026',
      shortLabel: 'Radar',
      icon: Radar,
      badge: 'NOVO',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'edital',
      label: 'Edital IA',
      shortLabel: 'Edital',
      icon: ScrollText,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'cycle',
      label: 'Ciclos de Estudo',
      shortLabel: 'Ciclos',
      icon: CalendarClock,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'questions',
      label: 'Banco de Questões',
      shortLabel: 'Questões',
      icon: BookCheck,
      badge: null,
      badgeColor: ''
    },
    {
      id: 'summaries',
      label: 'Resumos Inteligentes',
      shortLabel: 'Resumos',
      icon: BookOpen,
      badge: '80/20',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    },
    {
      id: 'discursivas',
      label: 'Discursivas',
      shortLabel: 'Redação',
      icon: Feather,
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      } ${
        isLight 
          ? 'bg-white/95 border-slate-200/90 text-slate-800 backdrop-blur-xl' 
          : 'bg-[#080c16]/98 border-slate-800 dark:border-white/10 text-white backdrop-blur-2xl'
      }`}
    >
      {/* Topo da Sidebar: Logo & Botão Recolher */}
      <div className="flex items-center justify-between h-17 px-4 border-b border-inherit">
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          title="Ir para o início"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1.5px] glow-brand shadow-sm shrink-0">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
              isLight ? 'bg-white' : 'bg-[#0d1322]'
            }`}>
              <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5 whitespace-nowrap animate-fadeIn">
              <span className="font-black text-base tracking-tight">
                Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">AI</span>
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}>
                PRO
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Lista de Navegação com Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2.5 space-y-5">
        
        {/* Seção 1: 5 Pilares de Alta Performance */}
        <div>
          {!isCollapsed && (
            <div className="px-2.5 mb-2 text-[10px] font-black uppercase tracking-wider text-blue-500 dark:text-cyan-400 flex items-center justify-between">
              <span>Alta Performance</span>
              <Sparkles className="w-3 h-3 opacity-60" />
            </div>
          )}

          <div className="space-y-1">
            {primaryPillars.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 group cursor-pointer relative ${
                    isActive
                      ? isLight
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-extrabold shadow-xs'
                        : 'bg-blue-600/20 text-white border border-blue-500/40 font-extrabold shadow-md shadow-blue-600/10'
                      : isLight
                        ? 'hover:bg-slate-100/90 text-slate-600 hover:text-slate-900 border border-transparent'
                        : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  {/* Glowing vertical indicator on active */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-500 shadow-sm shadow-blue-500" />
                  )}

                  <div className={`p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black shrink-0 ${item.badgeColor || 'bg-blue-500 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção 2: Editais & Preparação */}
        <div>
          {!isCollapsed && (
            <div className="px-2.5 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Editais & Prática</span>
              <Radar className="w-3 h-3 opacity-60" />
            </div>
          )}

          <div className="space-y-1">
            {prepModules.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 group cursor-pointer relative ${
                    isActive
                      ? isLight
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-extrabold shadow-xs'
                        : 'bg-blue-600/20 text-white border border-blue-500/40 font-extrabold shadow-md shadow-blue-600/10'
                      : isLight
                        ? 'hover:bg-slate-100/90 text-slate-600 hover:text-slate-900 border border-transparent'
                        : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-blue-500 shadow-sm shadow-blue-500" />
                  )}

                  <div className={`p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black shrink-0 ${item.badgeColor || 'bg-blue-500 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seção 3: Sistema & Ferramentas */}
        <div className="pt-2 border-t border-inherit">
          <div className="space-y-1">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                title={isCollapsed ? 'Onboarding & Diagnóstico' : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isLight ? 'text-blue-600 hover:bg-blue-50' : 'text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                <div className="p-1.5 rounded-lg shrink-0 bg-blue-500/10 text-blue-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                {!isCollapsed && <span className="truncate font-black">Onboarding & Metas</span>}
              </button>
            )}

            <button
              onClick={() => setActiveTab('guide')}
              title={isCollapsed ? 'Guia do Aluno' : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'guide'
                  ? isLight ? 'bg-blue-50 text-blue-900 font-extrabold' : 'bg-blue-600/20 text-white font-extrabold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="p-1.5 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="truncate">Guia do Aluno</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              title={isCollapsed ? 'Configurações' : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? isLight ? 'bg-blue-50 text-blue-900 font-extrabold' : 'bg-blue-600/20 text-white font-extrabold'
                  : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="p-1.5 rounded-lg shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="truncate">Configurações</span>}
            </button>
          </div>
        </div>

      </div>

      {/* Rodapé da Sidebar: Perfil do Aluno & Streak */}
      <div className={`p-3 border-t border-inherit ${isLight ? 'bg-slate-50/50' : 'bg-black/20'}`}>
        {onOpenProfile && (
          <div 
            onClick={onOpenProfile}
            className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-200 shadow-2xs' 
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
            title={`Perfil: ${studentProfile?.name || 'Estudante'} (${currentGuardian.name})`}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-amber-400/30 shrink-0 relative shadow-sm flex items-center justify-center">
              {currentGuardian.avatar3dUrl ? (
                <img src={currentGuardian.avatar3dUrl} alt={currentGuardian.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg select-none">{currentGuardian.emoji}</span>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate leading-tight">
                  {studentProfile?.warName || studentProfile?.name || 'Concurseiro'}
                </p>
                <span className="text-[10px] text-blue-500 dark:text-cyan-400 font-semibold truncate block">
                  {currentGuardian.archetype}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

    </aside>
  );
};
