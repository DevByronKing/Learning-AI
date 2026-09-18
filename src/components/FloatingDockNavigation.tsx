'use client';

import React, { useState } from 'react';
import {
  Compass,
  Activity,
  Crosshair,
  Layers,
  Scale,
  ShieldAlert,
  Plus,
  X,
  Microscope,
  Radar,
  ScrollText,
  CalendarClock,
  BookCheck,
  Feather,
  Settings,
  BookOpen,
  Crown
} from 'lucide-react';

interface FloatingDockNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: 'dark' | 'light';
  pendingMistakesCount?: number;
}

export const FloatingDockNavigation: React.FC<FloatingDockNavigationProps> = ({
  activeTab,
  setActiveTab,
  theme = 'dark',
  pendingMistakesCount = 0
}) => {
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const isLight = theme === 'light';

  const dockPillars = [
    {
      id: 'dashboard',
      label: 'Cockpit',
      fullName: 'Cockpit de Dados',
      icon: Activity,
      badge: 'HEATMAP',
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'simulator',
      label: 'Arena',
      fullName: 'Arena de Combate 60/40',
      icon: Crosshair,
      badge: '60/40',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      fullName: 'SRS Flashcards 3D',
      icon: Layers,
      badge: '3D',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'vademecum',
      label: 'Vade Mecum',
      fullName: 'Smart Vade Mecum',
      icon: Scale,
      badge: 'LINKS',
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'mistakes',
      label: 'Erros',
      fullName: 'Caderno de Erros',
      icon: ShieldAlert,
      badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null,
      badgeColor: 'bg-rose-500'
    }
  ];

  const extraModules = [
    { id: 'psychometrics', label: 'Psicometria TRI', icon: Microscope },
    { id: 'radar', label: 'Radar 2026', icon: Radar },
    { id: 'edital', label: 'Edital IA', icon: ScrollText },
    { id: 'cycle', label: 'Ciclos de Estudo', icon: CalendarClock },
    { id: 'questions', label: 'Banco de Questões', icon: BookCheck },
    { id: 'discursivas', label: 'Discursivas', icon: Feather },
    { id: 'guide', label: 'Guia do Aluno', icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'pricing-plans', label: 'Planos & Preços', icon: Crown }
  ];

  return (
    <>
      {/* Dock Flutuante Centralizado no Rodapé (Estilo macOS / Apple VisionOS) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 select-none animate-fadeIn">
        <nav
          className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
            isLight
              ? 'bg-white/90 border-slate-200 shadow-slate-400/40 text-slate-800'
              : 'bg-[#090e1a]/90 border-slate-700/80 dark:border-white/15 shadow-black/90 text-white ring-1 ring-white/10'
          }`}
        >
          {dockPillars.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsExpandedOpen(false);
                }}
                className={`relative group flex flex-col items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? isLight
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                    : isLight
                      ? 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110 ${
                  isActive ? (isLight ? 'text-white' : 'text-cyan-400') : ''
                }`} />

                <span className="text-[10px] sm:text-[11px] font-extrabold mt-1 tracking-tight">
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[8px] font-black text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip flutuante no hover */}
                <span className={`absolute bottom-full mb-2 hidden group-hover:block px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                  isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
                }`}>
                  {item.fullName}
                </span>
              </button>
            );
          })}

          <div className={`w-px h-8 mx-0.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />

          {/* Botão [+] para expandir todos os módulos */}
          <button
            onClick={() => setIsExpandedOpen(!isExpandedOpen)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
              isExpandedOpen
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-300'
            }`}
            title="Ver todos os módulos"
          >
            {isExpandedOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Popover Expandido do Dock */}
      {isExpandedOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-md rounded-3xl border shadow-2xl backdrop-blur-3xl p-4 animate-fadeIn transition-all select-none">
          <div className={`rounded-2xl p-4 ${
            isLight ? 'bg-white/95 border border-slate-200' : 'bg-[#0b101e]/95 border border-white/15 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-500 dark:text-cyan-400">
                Outros Módulos
              </span>
              <button
                onClick={() => setIsExpandedOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {extraModules.map((m) => {
                const Icon = m.icon;
                const isSelected = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTab(m.id);
                      setIsExpandedOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
