'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  BrainCircuit, 
  Calendar, 
  ChevronRight, 
  Flame, 
  Plus, 
  Play, 
  RefreshCw,
  Sliders,
  Award
} from 'lucide-react';
import { ExamNotice, StudyMethodology, DailyScheduleItem } from '@/lib/types';
import confetti from 'canvas-confetti';

interface StudyCycleManagerProps {
  selectedExam: ExamNotice;
  onGoToSimulator: (subjectId?: string) => void;
}

export const StudyCycleManager: React.FC<StudyCycleManagerProps> = ({
  selectedExam,
  onGoToSimulator
}) => {
  const [methodology, setMethodology] = useState<StudyMethodology>('ciclo_meirelles');
  const [dailyHours, setDailyHours] = useState(3.5);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceMessage, setRebalanceMessage] = useState<string | null>(null);

  // Initial Schedule State
  const [schedule, setSchedule] = useState<DailyScheduleItem[]>([
    {
      id: 'day-1',
      dayOfWeek: 'Hoje (Segunda-feira)',
      dateStr: '01 Set 2026',
      blocks: [
        {
          id: 'b-1',
          subjectId: 'sub-dir-prev',
          subjectName: 'Direito Previdenciário',
          topicName: 'Segurados Obrigatórios e Facultativos (Ponto Cego)',
          durationMinutes: 75,
          method: 'Estudo Teórico Focado + Lei 8.213/91',
          status: 'concluido',
          questionsTarget: 15,
          completedQuestions: 15
        },
        {
          id: 'b-2',
          subjectId: 'sub-dir-adm',
          subjectName: 'Direito Administrativo',
          topicName: 'Improbidade Administrativa (Lei 14.230/21)',
          durationMinutes: 60,
          method: 'Simulador de Questões FGV/Cebraspe',
          status: 'pendente',
          questionsTarget: 20,
          completedQuestions: 5
        },
        {
          id: 'b-3',
          subjectId: 'sub-portugues',
          subjectName: 'Língua Portuguesa',
          topicName: 'Crase e Regência Nominal',
          durationMinutes: 45,
          method: 'Revisão Espaçada (SRS 7 dias)',
          status: 'pendente',
          questionsTarget: 10,
          completedQuestions: 0
        }
      ]
    },
    {
      id: 'day-2',
      dayOfWeek: 'Amanhã (Terça-feira)',
      dateStr: '02 Set 2026',
      blocks: [
        {
          id: 'b-4',
          subjectId: 'sub-dir-prev',
          subjectName: 'Direito Previdenciário',
          topicName: 'Período de Graça e Qualidade de Segurado',
          durationMinutes: 90,
          method: 'Ciclo Ponderado Peso 3',
          status: 'pendente',
          questionsTarget: 25,
          completedQuestions: 0
        },
        {
          id: 'b-5',
          subjectId: 'sub-dir-const',
          subjectName: 'Direito Constitucional',
          topicName: 'Administração Pública na CF/88 (Art. 37 ao 41)',
          durationMinutes: 60,
          method: 'Estudo Reverso por Questões',
          status: 'pendente',
          questionsTarget: 15,
          completedQuestions: 0
        }
      ]
    },
    {
      id: 'day-3',
      dayOfWeek: 'Quarta-feira',
      dateStr: '03 Set 2026',
      blocks: [
        {
          id: 'b-6',
          subjectId: 'sub-dir-adm',
          subjectName: 'Direito Administrativo',
          topicName: 'Atos Administrativos (Anulação vs Revogação)',
          durationMinutes: 75,
          method: 'Mapa Mental + Questões FCC',
          status: 'pendente',
          questionsTarget: 20,
          completedQuestions: 0
        },
        {
          id: 'b-7',
          subjectId: 'sub-portugues',
          subjectName: 'Língua Portuguesa',
          topicName: 'Interpretação e Tipologia Textual Cebraspe',
          durationMinutes: 60,
          method: 'Análise de Distratores da Banca',
          status: 'pendente',
          questionsTarget: 15,
          completedQuestions: 0
        }
      ]
    }
  ]);

  const toggleBlockStatus = (dayId: string, blockId: string) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          blocks: day.blocks.map((block) => {
            if (block.id !== blockId) return block;
            const newStatus = block.status === 'concluido' ? 'pendente' : 'concluido';
            if (newStatus === 'concluido') {
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.7 }
                });
              } catch {}
            }
            return {
              ...block,
              status: newStatus,
              completedQuestions: newStatus === 'concluido' ? block.questionsTarget : 0
            };
          })
        };
      })
    );
  };

  const handleAutoRebalance = () => {
    setIsRebalancing(true);
    setRebalanceMessage(null);

    setTimeout(() => {
      setIsRebalancing(false);
      setRebalanceMessage(
        '✓ Ciclo de estudos recalibrado com sucesso! As disciplinas de maior peso no edital foram redistribuídas para otimizar sua retenção cognitiva.'
      );
    }, 1200);
  };

  const totalTodayBlocks = schedule[0]?.blocks.length || 0;
  const completedTodayBlocks = schedule[0]?.blocks.filter((b) => b.status === 'concluido').length || 0;
  const todayProgressPercentage = totalTodayBlocks > 0 ? Math.round((completedTodayBlocks / totalTodayBlocks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              Metodologia de Alta Performance
            </span>
            <span className="text-xs text-slate-400">Edital Ativo: {selectedExam.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Ciclo de Estudos Inteligente & Dinâmico
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Balanceamento adaptativo de carga horária baseado no peso do edital e nos seus pontos cegos diagnosticados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoRebalance}
            disabled={isRebalancing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>Recalibrar Ciclo por Imprevistos</span>
          </button>
        </div>
      </div>

      {/* Auto-rebalance Success Alert */}
      {rebalanceMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{rebalanceMessage}</span>
          <button onClick={() => setRebalanceMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Methodology Selector Cards */}
      <div className="mt-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Selecione a Metodologia de Estudo:
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Option 1 */}
          <div
            onClick={() => setMethodology('ciclo_meirelles')}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              methodology === 'ciclo_meirelles'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-400'
                : 'glass-panel border-white/5 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Ciclo de Meirelles</span>
              {methodology === 'ciclo_meirelles' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intercalação contínua de disciplinas com blocos proporcionais ao peso e relevância no edital.
            </p>
          </div>

          {/* Option 2 */}
          <div
            onClick={() => setMethodology('ebbinghaus_srs')}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              methodology === 'ebbinghaus_srs'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-400'
                : 'glass-panel border-white/5 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Curva de Ebbinghaus (SRS)</span>
              {methodology === 'ebbinghaus_srs' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Revisões periódicas programadas (24h, 7d, 15d, 30d) para consolidação definitiva na memória de longo prazo.
            </p>
          </div>

          {/* Option 3 */}
          <div
            onClick={() => setMethodology('estudo_reverso')}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              methodology === 'estudo_reverso'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-400'
                : 'glass-panel border-white/5 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Estudo Reverso</span>
              {methodology === 'estudo_reverso' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prática guiada por questões da banca $\rightarrow$ Diagnóstico das falhas $\rightarrow$ Teoria focada na raiz do erro.
            </p>
          </div>

          {/* Option 4 */}
          <div
            onClick={() => setMethodology('pomodoro_pro')}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              methodology === 'pomodoro_pro'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-400'
                : 'glass-panel border-white/5 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">Pomodoro Estruturado (50/10)</span>
              {methodology === 'pomodoro_pro' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sessões de 50 minutos de concentração profunda seguidas de 10 minutos para consolidação neural.
            </p>
          </div>

        </div>
      </div>

      {/* Daily Target & Progress Tracker */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <div className="glass-panel p-6 rounded-3xl border border-white/10 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Progresso da Meta de Hoje</span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {completedTodayBlocks} de {totalTodayBlocks} Blocos Concluídos ({todayProgressPercentage}%)
              </h3>
            </div>
            <span className="text-2xl font-black text-indigo-400">{todayProgressPercentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${todayProgressPercentage}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <span>Tempo de estudo estimado hoje: <strong>3h 00min</strong></span>
            <span>Meta de questões: <strong>45 questões</strong></span>
          </div>
        </div>

        {/* Daily Hours Slider Configuration */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disponibilidade Diária</span>
              <span className="text-sm font-black text-indigo-400">{dailyHours} horas/dia</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1h (Trabalho pesado)</span>
              <span>4h (Média)</span>
              <span>8h (Tempo integral)</span>
            </div>
          </div>

          <button
            onClick={() => onGoToSimulator()}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md glow-brand"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Iniciar Bloco no Simulador de Questões</span>
          </button>
        </div>

      </div>

      {/* Schedule Days Timeline */}
      <div className="mt-10 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>Cronograma Dinâmico por Blocos</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {schedule.map((day, dayIndex) => (
            <div key={day.id} className="glass-panel rounded-3xl border border-white/10 p-5 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div>
                    <h4 className="text-sm font-black text-white">{day.dayOfWeek}</h4>
                    <p className="text-[11px] text-slate-400">{day.dateStr}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {day.blocks.length} Blocos
                  </span>
                </div>

                {/* Blocks in this Day */}
                <div className="space-y-3">
                  {day.blocks.map((block) => (
                    <div
                      key={block.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        block.status === 'concluido'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-dark-surface/80 border-white/5 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            {block.subjectName}
                          </span>
                          <h5 className={`text-xs font-bold mt-0.5 ${block.status === 'concluido' ? 'text-emerald-300 line-through' : 'text-white'}`}>
                            {block.topicName}
                          </h5>
                        </div>

                        <button
                          onClick={() => toggleBlockStatus(day.id, block.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            block.status === 'concluido'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {block.durationMinutes} min
                        </span>
                        <span className="text-slate-300 font-medium">
                          {block.method}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <button
                  onClick={() => onGoToSimulator()}
                  className="w-full py-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Resolver Questões deste Dia</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
