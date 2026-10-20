'use client';

import React from 'react';
import { 
  Target, 
  Clock, 
  ShieldAlert, 
  ChevronRight
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

  const days = selectedExam.daysRemaining || 85;
  const isUrgent = days <= 60;

  return (
    <div className="w-full bg-slate-100/90 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-indigo-950/80 dark:to-slate-900/90 backdrop-blur-md border-b border-slate-200/90 dark:border-indigo-500/20 text-slate-800 dark:text-white py-2 px-4 sm:px-6 relative z-15 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Lado Esquerdo: Identidade do Concurso Ativo */}
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-extrabold shrink-0">
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="font-bold text-[11px]">Alvo Ativo</span>
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

        {/* Lado Direito: Ação Rápida de Gerenciar Alvo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onOpenEditalSelector) {
                onOpenEditalSelector();
              } else {
                onNavigateTab('edital');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-white/10 dark:hover:bg-white/20 text-indigo-700 dark:text-white border border-indigo-200 dark:border-white/10 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
            title="Alternar edital em foco ou carregar novo edital oficial"
          >
            <span>Alterar Edital</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
