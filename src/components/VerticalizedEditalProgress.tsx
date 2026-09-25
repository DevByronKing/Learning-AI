'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, BookOpen, Target, CheckCircle2, TrendingDown } from 'lucide-react';
import { ExamNotice, ExamSubject } from '@/lib/types';

interface VerticalizedEditalProgressProps {
  selectedExam: ExamNotice;
  onSubjectClick?: (subjectId: string) => void;
}

export const VerticalizedEditalProgress: React.FC<VerticalizedEditalProgressProps> = ({
  selectedExam,
  onSubjectClick
}) => {
  // Mock deterministic theoretical reading percentage vs actual accuracy
  const subjectProgress = selectedExam.subjects.map((s, idx) => {
    // Theory read: typically higher (illusion of competence)
    const theoryRead = Math.min(100, 65 + ((idx * 17) % 35));
    // Actual questions accuracy: merciless truth
    const actualAccuracy = Math.min(100, 48 + ((idx * 13) % 42));
    const gap = actualAccuracy - theoryRead;

    return {
      ...s,
      theoryRead,
      actualAccuracy,
      gap
    };
  });

  // Calculate Banca Shields
  const bancaShields = [
    {
      banca: selectedExam.banca || 'FGV',
      shieldPercent: 78,
      status: 'Blindado',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      description: 'Acima da nota de corte histórica (72%). Baixo risco de eliminação em pegadinhas conceituais.'
    },
    {
      banca: 'Cebraspe',
      shieldPercent: 82,
      status: 'Blindado',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      description: 'Pontuação líquida positiva consistente em assertivas Certo/Errado.'
    },
    {
      banca: 'FCC',
      shieldPercent: 64,
      status: 'Em Risco',
      statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      description: 'Vulnerável na literalidade da Nova Lei de Licitações (Lei 14.133).'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Métrica Agressiva de Blindagem da Banca */}
      <div className="glass-panel bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-blue-50/90 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 p-6 sm:p-8 rounded-3xl border border-indigo-200/80 dark:border-indigo-500/30 shadow-md text-slate-900 dark:text-white transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-100 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-100/80 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300/80 dark:border-cyan-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Métrica Implacável: Blindagem da Banca
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                (Substitui taxas genéricas de acerto)
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Índice de Resistência a Armadilhas por Banca
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Avalia não apenas se você acerta, mas se sua pontuação resiste aos distratores mais perversos da banca.
            </p>
          </div>

          <div className="flex items-baseline gap-2 shrink-0 bg-white/90 dark:bg-white/5 px-4 py-2.5 rounded-2xl border border-indigo-100 dark:border-white/10 shadow-2xs">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Blindagem Global:</span>
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">80.2%</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {bancaShields.map((shield, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/90 dark:bg-white/5 border border-indigo-100/80 dark:border-white/10 space-y-3 hover:border-cyan-500/40 transition-all shadow-2xs dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">{shield.banca}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${shield.statusColor}`}>
                  {shield.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{shield.shieldPercent}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">índice de blindagem</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${shield.shieldPercent >= 75 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                  style={{ width: `${shield.shieldPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {shield.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Progress Bars do Edital Verticalizado (Teoria vs Acertos) */}
      <div className="glass-panel bg-white/80 dark:bg-dark-card/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-black uppercase tracking-wider">
                Edital Verticalizado
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Comparativo de Ilusão de Competência
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Teoria Lida vs. Acerto Real em Questões
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              A barra fina cinza representa a teoria lida. A barra grossa néon representa a precisão real nas questões de prova.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Teoria Lida</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              <span className="text-slate-900 dark:text-white font-bold">Acerto Real</span>
            </div>
          </div>
        </div>

        {/* Subjects List with Dual Overlapping Bars */}
        <div className="space-y-6">
          {subjectProgress.map((subj) => {
            const hasNegativeGap = subj.gap < 0;

            return (
              <div
                key={subj.id}
                onClick={() => onSubjectClick && onSubjectClick(subj.id)}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-indigo-500/20">
                      Peso {subj.weight}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {subj.name}
                    </h4>
                  </div>

                  {/* Gap indicator */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Teoria: <strong className="text-slate-700 dark:text-slate-200">{subj.theoryRead}%</strong>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Acertos: <strong className="text-emerald-600 dark:text-emerald-400 font-black">{subj.actualAccuracy}%</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[11px] flex items-center gap-1 ${
                      hasNegativeGap
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {hasNegativeGap ? (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          <span>Gap: {subj.gap}% (Ilusão)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Gap: +{subj.gap}% (Blindado)</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Overlapping Dual Progress Bars Container */}
                <div className="relative pt-2 pb-1">
                  {/* Background Track */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3.5 relative overflow-hidden">
                    
                    {/* Layer 1: Thin/Subtle Bar for Theory Read */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-slate-400/50 dark:bg-slate-600/60 rounded-full transition-all duration-500"
                      style={{ width: `${subj.theoryRead}%` }}
                    />

                    {/* Layer 2: Overlaid Thick Neon Bar for Actual Questions Accuracy */}
                    <div
                      className="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.7)] transition-all duration-700"
                      style={{ width: `${Math.max(4, subj.actualAccuracy)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>{subj.topics.length} tópicos catalogados</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    Ver Raio-X dos Tópicos →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
