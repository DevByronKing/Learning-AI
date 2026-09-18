'use client';

import React, { useState, useMemo } from 'react';
import { Flame, Calendar, Sparkles, TrendingUp, Info } from 'lucide-react';

interface ConsistencyHeatmapProps {
  streakDays?: number;
  longestStreak?: number;
  totalQuestionsYear?: number;
}

interface DayData {
  dateStr: string;
  dayOfWeek: number; // 0 = Dom, 6 = Sab
  weekIndex: number; // 0 to 51
  count: number; // questions answered
  studyMinutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  streakDays = 42,
  longestStreak = 56,
  totalQuestionsYear = 4820
}) => {
  const [palette, setPalette] = useState<'emerald' | 'purple'>('emerald');
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  // Generate 52 weeks (364 days) deterministic data simulating an elite student study log
  const days: DayData[] = useMemo(() => {
    const list: DayData[] = [];
    const today = new Date();
    
    // Start from 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7 - 1));

    for (let i = 0; i < 52 * 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const weekIndex = Math.floor(i / 7);
      const dayOfWeek = d.getDay();
      
      // Pseudo-random but deterministic density with high recent streak
      const dayOfYear = i;
      const isRecentStreak = i >= (52 * 7 - streakDays);
      let count = 0;

      if (isRecentStreak) {
        // Active streak days: high performance
        count = 15 + ((dayOfYear * 7) % 35);
      } else {
        // Historical distribution with ~75% consistency
        const isRestDay = (dayOfYear % 7 === 0) && (dayOfYear % 3 === 0);
        if (!isRestDay) {
          count = ((dayOfYear * 13) % 45);
        }
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 35) level = 4;
      else if (count >= 25) level = 3;
      else if (count >= 15) level = 2;
      else if (count > 0) level = 1;

      list.push({
        dateStr: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        dayOfWeek,
        weekIndex,
        count,
        studyMinutes: Math.round(count * 2.5),
        level
      });
    }

    return list;
  }, [streakDays]);

  const getColorClass = (level: number) => {
    if (level === 0) {
      return 'bg-slate-200 dark:bg-slate-800/70 border-slate-300/40 dark:border-white/5';
    }
    if (palette === 'emerald') {
      switch (level) {
        case 1: return 'bg-emerald-900/60 border-emerald-700/50 shadow-[0_0_4px_rgba(16,185,129,0.2)]';
        case 2: return 'bg-emerald-600 border-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]';
        case 3: return 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
        case 4: return 'bg-emerald-400 border-white shadow-[0_0_12px_rgba(52,211,153,0.9)] scale-105';
        default: return 'bg-slate-200 dark:bg-slate-800/70';
      }
    } else {
      switch (level) {
        case 1: return 'bg-purple-900/60 border-purple-700/50 shadow-[0_0_4px_rgba(168,85,247,0.2)]';
        case 2: return 'bg-purple-600 border-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.4)]';
        case 3: return 'bg-purple-500 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
        case 4: return 'bg-fuchsia-400 border-white shadow-[0_0_12px_rgba(232,121,249,0.9)] scale-105';
        default: return 'bg-slate-200 dark:bg-slate-800/70';
      }
    }
  };

  // Group by weeks for columns
  const weeks = useMemo(() => {
    const w: DayData[][] = [];
    for (let i = 0; i < 52; i++) {
      w.push(days.slice(i * 7, (i + 1) * 7));
    }
    return w;
  }, [days]);

  const activeDaysCount = days.filter(d => d.count > 0).length;

  return (
    <div className="glass-panel bg-white/80 dark:bg-dark-card/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
      
      {/* Header with Title and Streak Indicators */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              Cockpit de Consistência Implacável
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Registro de 365 Dias • Estilo GitHub
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Grelha de Foco &quot;Não Quebre a Corrente&quot;
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cada quadrado representa um dia de treino. O concurseiro de elite mantém o ritmo sem falhar.
          </p>
        </div>

        {/* Action Controls & Color Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setPalette('emerald')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                palette === 'emerald'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Verde Néon
            </button>
            <button
              onClick={() => setPalette('purple')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                palette === 'purple'
                  ? 'bg-purple-500 text-white shadow-sm font-black'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Roxo Néon
            </button>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streakDays} Dias Seguidos</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
            Recorde: <strong className="text-slate-900 dark:text-white font-black">{longestStreak}d</strong>
          </div>
        </div>
      </div>

      {/* Main Heatmap Grid with Horizontal Scroll on mobile */}
      <div className="mt-6 overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[780px]">
          
          {/* Month labels */}
          <div className="flex text-[10px] font-bold text-slate-400 mb-2 pl-6 gap-[58px]">
            <span>Out</span>
            <span>Nov</span>
            <span>Dez</span>
            <span>Jan</span>
            <span>Fev</span>
            <span>Mar</span>
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
            <span>Set</span>
          </div>

          <div className="flex gap-1.5">
            {/* Days of week labels */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 pr-1 select-none">
              <span>Dom</span>
              <span>Ter</span>
              <span>Qui</span>
              <span>Sáb</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] border transition-all cursor-pointer ${getColorClass(day.level)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Info Tooltip / Summary Bar */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {hoveredDay ? (
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium animate-fadeIn">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span><strong>{hoveredDay.dateStr}:</strong></span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {hoveredDay.count} questões resolvidas
              </span>
              <span className="text-slate-400">• {hoveredDay.studyMinutes}m de estudo líquido</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>Passe o cursor sobre os blocos para inspecionar o volume diário.</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <span>Menos</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-200 dark:bg-slate-800" />
          <span className={`w-2.5 h-2.5 rounded-[2px] ${palette === 'emerald' ? 'bg-emerald-900' : 'bg-purple-900'}`} />
          <span className={`w-2.5 h-2.5 rounded-[2px] ${palette === 'emerald' ? 'bg-emerald-600' : 'bg-purple-600'}`} />
          <span className={`w-2.5 h-2.5 rounded-[2px] ${palette === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
          <span className={`w-2.5 h-2.5 rounded-[2px] ${palette === 'emerald' ? 'bg-emerald-400' : 'bg-fuchsia-400'}`} />
          <span>Mais</span>
          <span className="ml-3 font-bold text-slate-700 dark:text-slate-300">
            {activeDaysCount} de 364 dias ativos ({(activeDaysCount / 364 * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

    </div>
  );
};
