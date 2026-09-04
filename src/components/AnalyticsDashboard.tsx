'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  BrainCircuit, 
  Layers, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import { UserMetrics, ExamNotice, Flashcard } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';
import { SRSFlashcardPlayer } from './SRSFlashcardPlayer';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

interface AnalyticsDashboardProps {
  metrics: UserMetrics;
  selectedExam: ExamNotice;
  flashcards: Flashcard[];
  onReviewFlashcard: (flashcardId: string, rating: 'facil' | 'bom' | 'dificil' | 'errei') => void;
  onAddNewFlashcard?: (card: Flashcard) => void;
  onGoToSimulator: (subjectId?: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics,
  selectedExam,
  flashcards,
  onReviewFlashcard,
  onAddNewFlashcard,
  onGoToSimulator
}) => {
  const [showSRSPlayer, setShowSRSPlayer] = useState(false);
  const [selectedTopicForFocus, setSelectedTopicForFocus] = useState<string | null>(null);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Data for Error Breakdown Donut
  const errorData = [
    { name: 'Pegadinha de Banca', value: metrics.errorDistribution.pegadinha_banca, color: '#F43F5E' },
    { name: 'Lacuna Teórica', value: metrics.errorDistribution.lacuna_teorica, color: '#8B5CF6' },
    { name: 'Leitura Apressada', value: metrics.errorDistribution.leitura_apressada, color: '#F59E0B' },
    { name: 'Curva de Esquecimento', value: metrics.errorDistribution.curva_esquecimento, color: '#06B6D4' }
  ];

  // Data for Banca Alignment
  const bancaAlignmentData = metrics.bancaAlignment.map((b) => ({
    banca: b.banca,
    SeuIndice: b.userProficiency,
    ExigenciaBanca: b.bancaRequirement
  }));

  const currentFlashcard = flashcards[activeFlashcardIndex] || flashcards[0];

  const handleFlashcardRating = (rating: 'facil' | 'bom' | 'dificil' | 'errei') => {
    if (currentFlashcard) {
      onReviewFlashcard(currentFlashcard.id, rating);
    }
    setIsFlipped(false);
    if (activeFlashcardIndex < flashcards.length - 1) {
      setActiveFlashcardIndex((prev) => prev + 1);
    } else {
      setActiveFlashcardIndex(0);
    }
  };

  if (showSRSPlayer) {
    return (
      <SRSFlashcardPlayer
        flashcards={flashcards}
        onReviewCard={onReviewFlashcard}
        onAddNewCard={onAddNewFlashcard}
        onClose={() => setShowSRSPlayer(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
              Painel Analítico Cognitivo
            </span>
            <span className="text-xs text-slate-400">Edital: {selectedExam.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Painel de Desempenho & Mapeamento de Vulnerabilidades
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mapeamento em tempo real da sua precisão por disciplina, classificação dos erros e predição de nota de corte.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">
              Taxa Geral: <strong className="text-indigo-400">{metrics.globalAccuracy}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Cutoff Probability */}
        <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 relative overflow-hidden glow-brand">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Probabilidade de Aprovação</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{metrics.probabilityOfPassing}%</span>
            <span className="text-xs font-bold text-emerald-400">+4.2% esta semana</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Nota de corte estimada: {metrics.estimatedCutoffScore}%</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${metrics.probabilityOfPassing}%` }} />
          </div>
        </div>

        {/* Card 2: Streak */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Constância de Estudos</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{metrics.streakDays} dias</span>
            <span className="text-xs text-slate-400">Recorde: 22d</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Consolidação contínua de memória</p>
        </div>

        {/* Card 3: Total Questions Answered */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Questões Realizadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{metrics.totalAnswered}</span>
            <span className="text-xs text-emerald-400 font-bold">{metrics.totalCorrect} acertos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tempo médio por questão: 1m 42s</p>
        </div>

        {/* Card 4: SRS Flashcards Deck */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Deck de Repetição Espaçada</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400">{flashcards.length} cards</span>
            <span className="text-xs text-slate-400">Agendados p/ revisão</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gerados a partir de diagnósticos cognitivos</p>
        </div>

      </div>

      {/* INTERACTIVE TOPIC HEATMAP */}
      <div className="mt-10 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Mapeamento Diagnóstico Visual
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Mapa de Calor: Proficiência & Vulnerabilidades
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecione um tópico para analisar sua precisão e acionar baterias de revisão direcionadas.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">Ponto Crítico (&lt; 50%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Em Desenvolvimento (50-70%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Consolidado (&gt; 70%)</span>
            </span>
          </div>
        </div>

        {/* Heatmap Grid by Subject */}
        <div className="mt-8 space-y-6">
          {selectedExam.subjects.map((subject) => (
            <div key={subject.id} className="bg-dark-surface/60 p-5 rounded-2xl border border-white/5">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    Peso {subject.weight}
                  </span>
                  <h3 className="text-sm font-bold text-white">{subject.name}</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {subject.relevancePercentage}% do peso do edital
                </span>
              </div>

              {/* Topics Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subject.topics.map((topic) => {
                  const accuracy = topic.accuracyRate || 50;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopicForFocus(topic.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between ${getStatusColor(topic.status)}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold leading-snug">{topic.name}</h4>
                          <span className="text-[11px] font-black shrink-0 font-mono">
                            {accuracy}%
                          </span>
                        </div>

                        {topic.articlesOrLaws && topic.articlesOrLaws.length > 0 && (
                          <p className="text-[10px] text-slate-400 font-mono mt-2 truncate">
                            📜 {topic.articlesOrLaws[0]}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="font-semibold uppercase tracking-wider">{topic.status}</span>
                        <span className="text-slate-300">Cobrança {topic.frequencyInBanca}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Two Column Charts: Error Distribution & Banca Radar */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Error Breakdown (Donut Chart) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <span>Distribuição dos Tipos de Erro</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              A IA classifica a raiz cognitiva de cada erro para calibrar seu próximo ciclo.
            </p>

            <div className="h-64 mt-4 flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">Carregando métricas...</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs">
            {errorData.map((e) => (
              <div key={e.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                <span className="truncate">{e.name}: <strong>{e.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Banca Alignment (Radar/Bar Chart) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Índice de Alinhamento com a Banca</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Comparativo do seu rendimento atual contra o perfil histórico de cobrança.
            </p>

            <div className="h-64 mt-4 flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bancaAlignmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="banca" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="SeuIndice" fill="#6366f1" radius={[6, 6, 0, 0]} name="Seu Índice (%)" />
                    <Bar dataKey="ExigenciaBanca" fill="#1e293b" stroke="#475569" radius={[6, 6, 0, 0]} name="Ponto de Corte Médio (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">Carregando radar...</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Banca do Concurso: <strong>{selectedExam.banca}</strong></span>
            <span className="text-indigo-400 font-bold">Gap para a posse: ~15%</span>
          </div>
        </div>

      </div>

      {/* ACTIVE FLASHCARDS SPACED REPETITION DECK */}
      {currentFlashcard && (
        <div className="mt-10 glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 glow-brand">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Revisão Ativa de Curva de Esquecimento (SRS)
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Deck de Flashcards Baseado nos Seus Erros
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                Card {activeFlashcardIndex + 1} de {flashcards.length}
              </span>
              <button
                type="button"
                onClick={() => setShowSRSPlayer(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Abrir Player SRS Completo (Anki)</span>
              </button>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="mt-6 min-h-[180px] p-6 sm:p-8 rounded-2xl bg-dark-card border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-indigo-400 font-bold mb-3">
                <span>{currentFlashcard.subjectName} • {currentFlashcard.topicName}</span>
                <span>{isFlipped ? 'VERSO (RESPOSTA)' : 'FRENTE (PERGUNTA)'}</span>
              </div>
              
              <p className="text-sm sm:text-base text-white font-medium leading-relaxed whitespace-pre-line">
                {isFlipped ? currentFlashcard.back : currentFlashcard.front}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>{isFlipped ? 'Clique para ver a pergunta' : 'Clique no cartão para virar a resposta'}</span>
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Spaced Repetition Rating Buttons */}
          {isFlipped && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              <button
                onClick={() => handleFlashcardRating('errei')}
                className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors"
              >
                Errei (Rever Hoje)
              </button>
              <button
                onClick={() => handleFlashcardRating('dificil')}
                className="py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors"
              >
                Difícil (Rever em 1d)
              </button>
              <button
                onClick={() => handleFlashcardRating('bom')}
                className="py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition-colors"
              >
                Bom (Rever em 3d)
              </button>
              <button
                onClick={() => handleFlashcardRating('facil')}
                className="py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors"
              >
                Fácil (Rever em 7d)
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
