'use client';

import React from 'react';
import { 
  Target, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  CalendarClock, 
  Crosshair, 
  Scale, 
  PenTool, 
  FileText, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ExamNotice, StudentProfile } from '@/lib/types';

interface GlobalExamContextBarProps {
  selectedExam: ExamNotice;
  studentProfile?: StudentProfile;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenEditalSelector?: () => void;
}

export const GlobalExamContextBar: React.FC<GlobalExamContextBarProps> = ({
  selectedExam,
  studentProfile,
  activeTab,
  onNavigateTab,
  onOpenEditalSelector
}) => {
  // Não exibir na landing page para manter a apresentação limpa
  if (activeTab === 'landing') {
    return null;
  }

  const isOAB = selectedExam.title.toLowerCase().includes('oab') || selectedExam.role.toLowerCase().includes('advoga');
  const days = selectedExam.daysRemaining || 85;
  const isUrgent = days <= 60;

  const quickNavItems = [
    { id: 'edital', label: 'Edital Verticalizado', shortLabel: 'Edital', icon: BookOpen },
    { id: 'cycle', label: 'Ciclo Meirelles', shortLabel: 'Ciclo', icon: CalendarClock },
    { id: 'simulator', label: 'Arena de Questões', shortLabel: 'Arena', icon: Crosshair },
    { id: 'vademecum', label: 'Vade Mecum (Leis)', shortLabel: 'Lei Seca', icon: Scale },
    { id: 'discursivas', label: isOAB ? 'Peças Práticas 2ª Fase' : 'Estúdio Discursivas', shortLabel: isOAB ? 'Peças OAB' : 'Discursiva', icon: PenTool },
    { id: 'summaries', label: 'Resumos Inteligentes', shortLabel: 'Resumos', icon: FileText },
  ];

  return (
    <div className="w-full bg-slate-100/90 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-indigo-950/80 dark:to-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-indigo-500/20 text-slate-800 dark:text-white py-2 px-4 sm:px-6 relative z-15 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Lado Esquerdo: Identidade do Concurso Ativo */}
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-extrabold shrink-0">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="uppercase tracking-wider text-[10px]">Alvo Ativo</span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-black text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate" title={selectedExam.title}>
              {selectedExam.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-200/70 dark:bg-white/10 text-cyan-800 dark:text-cyan-300 border border-slate-300/60 dark:border-white/10 shrink-0">
              {selectedExam.banca}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px] shrink-0">
            <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className={isUrgent ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-300'}>
              Faltam <strong>{days} dias</strong> para a prova
            </span>
          </div>

          {studentProfile?.weakSubject && (
            <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/25 text-rose-700 dark:text-rose-300 text-[10px] font-bold shrink-0">
              <ShieldAlert className="w-3 h-3 text-rose-500 dark:text-rose-400" />
              <span>Calcanhar: {studentProfile.weakSubject}</span>
            </div>
          )}
        </div>

        {/* Lado Direito: Deep Links do Ecossistema Interligado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden xl:inline-block mr-1">
            Ecossistema:
          </span>

          {quickNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                title={`Ir para ${item.label} calibrado para este concurso`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'bg-white dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 shadow-2xs'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              if (onOpenEditalSelector) {
                onOpenEditalSelector();
              } else {
                onNavigateTab('edital');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-200/90 dark:border-amber-500/30 text-[11px] font-bold transition-all shrink-0 ml-1 cursor-pointer"
            title="Alternar concurso ou fazer upload de novo edital"
          >
            <span>Trocar</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
