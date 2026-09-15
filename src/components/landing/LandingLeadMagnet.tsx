import React, { useState } from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { INITIAL_EXAMS } from '@/lib/mockData';

interface LandingLeadMagnetProps {
  onStartEdital: () => void;
}

export const LandingLeadMagnet: React.FC<LandingLeadMagnetProps> = ({ onStartEdital }) => {
  const [leadInput, setLeadInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('INSS 2026');
  const [isCalculating, setIsCalculating] = useState(false);
  const [leadResult, setLeadResult] = useState<{
    totalHoursNeeded: number;
    topTopics: string[];
    bancaTrapIndex: string;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);

      // Search for an exam matching the input
      const searchTerms = leadInput.toLowerCase().trim();
      const matchedExam = INITIAL_EXAMS.find(exam => 
        exam.title.toLowerCase().includes(searchTerms) ||
        exam.role.toLowerCase().includes(searchTerms)
      ) || INITIAL_EXAMS[0]; // fallback to first (INSS) if none matches

      // Get top 3 topics by accuracyRate (simulating the most difficult ones or highest weight)
      const allTopics = matchedExam.subjects.flatMap(sub => 
        sub.topics.map(topic => `${sub.name} (${topic.name} - Peso ${sub.weight})`)
      );

      const topTopics = allTopics.slice(0, 3);
      if (topTopics.length === 0) {
        topTopics.push('Conteúdo base do edital', 'Conhecimentos Específicos', 'Língua Portuguesa');
      }

      setLeadResult({
        totalHoursNeeded: matchedExam.daysRemaining * 3, // mock 3h a day
        topTopics,
        bancaTrapIndex: `Alta probabilidade de pegadinhas da banca ${matchedExam.banca} em temas de jurisprudência recente`
      });
    }, 1200);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-indigo-500/30 relative overflow-hidden glow-brand">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-sm font-bold mb-4">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>FERRAMENTA 100% GRATUITA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            Calculadora de Edital Verticalizado & Rota de Carga Horária
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Descubra quantas horas você realmente precisa estudar e quais matérias têm 80% do peso do seu concurso.
          </p>
        </div>

        <form onSubmit={handleCalculate} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Ex: Técnico do Seguro Social - INSS 2026 ou Escrevente TJ-SP"
              value={leadInput}
              onChange={(e) => setLeadInput(e.target.value)}
              className="w-full px-5 py-4 rounded-xl glass-input text-base text-slate-900 dark:text-white placeholder-slate-400 font-medium border-2 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isCalculating}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calculando Carga...</span>
              </>
            ) : (
              <>
                <span>Calcular Rota Grátis</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Preset Buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Sugestões rápidas:</span>
          {['INSS 2026', 'OAB 43º Exame', 'TJ-SP Escrevente', 'Polícia Federal Agente'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setLeadInput(preset);
                setSelectedPreset(preset);
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-semibold"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Lead Result Card */}
        {leadResult && (
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-surface border border-emerald-500/50 shadow-xl shadow-emerald-500/10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-3">
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-5 h-5 fill-emerald-500" /> Diagnóstico do Edital Gerado
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                Tempo estimado: ~{leadResult.totalHoursNeeded}h de estudo líquido
              </span>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide">
                  Matérias com 80% do Peso no Ponto de Corte:
                </p>
                <ul className="space-y-3">
                  {leadResult.topTopics.map((top, i) => (
                    <li key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{top}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 dark:bg-dark-card p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Índice de Pegadinhas da Banca:
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-2 leading-relaxed">
                    {leadResult.bancaTrapIndex}
                  </p>
                </div>
                <button
                  onClick={onStartEdital}
                  className="mt-6 w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
                >
                  <span>Abrir Cronograma Completo no App</span>
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
