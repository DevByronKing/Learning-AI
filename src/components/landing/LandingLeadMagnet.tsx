'use client';

import React, { useState } from 'react';
import { Zap, ArrowRight, Clock, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { INITIAL_EXAMS } from '@/lib/mockData';

interface LandingLeadMagnetProps {
  onStartEdital: () => void;
}

export const LandingLeadMagnet: React.FC<LandingLeadMagnetProps> = ({ onStartEdital }) => {
  const [leadInput, setLeadInput] = useState('INSS 2026');
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [isCalculating, setIsCalculating] = useState(false);
  const [leadResult, setLeadResult] = useState<{
    examTitle: string;
    banca: string;
    daysRemaining: number;
    dailyHours: number;
    totalHoursNeeded: number;
    topSubjectsWithHours: { name: string; weight: number; relevance: number; hours: number }[];
    bancaTrapIndex: string;
  } | null>(null);

  const calculateFor = (examQuery: string, hoursPerDay: number) => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);

      const searchTerms = examQuery.toLowerCase().trim();
      const matchedExam = INITIAL_EXAMS.find(exam => 
        exam.title.toLowerCase().includes(searchTerms) ||
        exam.role.toLowerCase().includes(searchTerms) ||
        exam.banca.toLowerCase().includes(searchTerms)
      ) || INITIAL_EXAMS[0];

      const days = matchedExam.daysRemaining || 90;
      const totalHours = days * hoursPerDay;

      // Pegar matérias ordenadas por relevancePercentage
      const sortedSubjects = [...matchedExam.subjects].sort((a, b) => b.relevancePercentage - a.relevancePercentage);
      const topSubjectsWithHours = sortedSubjects.slice(0, 4).map(sub => ({
        name: sub.name,
        weight: sub.weight,
        relevance: sub.relevancePercentage,
        hours: Math.round((totalHours * sub.relevancePercentage) / 100)
      }));

      let trapDescription = `Alta incidência de pegadinhas doutrinárias e inversão de premissas da banca ${matchedExam.banca}.`;
      if (matchedExam.banca === 'FGV') {
        trapDescription = 'A FGV foca em casos concretos longos, termos de negação dupla ("não é defeso", "prescinde") e enunciados que induzem ao erro por cansaço visual.';
      } else if (matchedExam.banca === 'Cebraspe') {
        trapDescription = 'O Cebraspe pune o chute e arma distratores de generalização ("sempre", "nunca", "exclusivamente"), além de cobrar jurisprudência recente dos Tribunais Superiores.';
      } else if (matchedExam.banca === 'Vunesp') {
        trapDescription = 'A Vunesp privilegia a letra fria da lei com troca cirúrgica de prazos e conjunções. Erros ocorrem por leitura apressada da lei seca.';
      } else if (matchedExam.banca === 'FCC') {
        trapDescription = 'A FCC equilibra letra da lei com súmulas consolidadas, utilizando alternativas com semelhança sintática para confundir o candidato.';
      }

      setLeadResult({
        examTitle: matchedExam.title,
        banca: matchedExam.banca,
        daysRemaining: days,
        dailyHours: hoursPerDay,
        totalHoursNeeded: totalHours,
        topSubjectsWithHours,
        bancaTrapIndex: trapDescription
      });
    }, 600);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateFor(leadInput || 'INSS 2026', dailyHours);
  };

  const handlePresetSelect = (preset: string) => {
    setLeadInput(preset);
    calculateFor(preset, dailyHours);
  };

  const handleHoursChange = (hours: number) => {
    setDailyHours(hours);
    calculateFor(leadInput || 'INSS 2026', hours);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200 dark:border-indigo-500/30 relative overflow-hidden bg-white/90 dark:bg-dark-surface/90 shadow-2xl">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black mb-4">
            <Zap className="w-4 h-4 fill-emerald-500" />
            <span>CALCULADORA COGNITIVA 100% GRATUITA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Calculadora de Edital Verticalizado & Rota de Carga Horária
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Descubra a carga horária líquida ideal até o dia da prova e veja a distribuição das disciplinas com 80% do peso da sua aprovação.
          </p>
        </div>

        {/* Input Form & Daily Hours Selector */}
        <form onSubmit={handleCalculate} className="mt-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Concurso ou Cargo Alvo:
              </label>
              <input
                type="text"
                placeholder="Ex: Técnico do Seguro Social - INSS ou Escrevente TJ-SP"
                value={leadInput}
                onChange={(e) => setLeadInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-4 flex flex-col justify-end">
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <span>Calcular Rota</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Daily hours pill selector */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              Sua disponibilidade diária:
            </span>
            {[2, 3, 4, 6].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => handleHoursChange(hours)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  dailyHours === hours
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-dark-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5'
                }`}
              >
                {hours}h / dia
              </button>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sugestões rápidas:</span>
            {['INSS 2026', 'TJ-SP Escrevente', 'Polícia Federal Agente', 'Receita Federal Auditor'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </form>

        {/* Calculation Result */}
        {leadResult && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-dark-card border border-emerald-500/40 shadow-xl shadow-emerald-500/10 animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-3">
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Diagnóstico do Edital: {leadResult.examTitle}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Banca: <strong className="text-slate-800 dark:text-white">{leadResult.banca}</strong> • Faltam aproximadamente <strong>{leadResult.daysRemaining} dias</strong> até a prova.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0">
                Meta: ~{leadResult.totalHoursNeeded}h líquidas ({leadResult.dailyHours}h/dia)
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Disciplinas 80/20 com horas estimadas */}
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Distribuição 80/20 Recomendada:
                </h4>
                <div className="space-y-3">
                  {leadResult.topSubjectsWithHours.map((sub, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <span className="truncate pr-2">{sub.name}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono shrink-0">~{sub.hours}h ({sub.relevance}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" 
                          style={{ width: `${sub.relevance}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banca Trap Index */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Perfil de Pegadinhas da {leadResult.banca}:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                    {leadResult.bancaTrapIndex}
                  </p>
                </div>

                <button
                  onClick={onStartEdital}
                  className="mt-5 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                >
                  <span>Abrir Ciclo Completo deste Edital no App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
