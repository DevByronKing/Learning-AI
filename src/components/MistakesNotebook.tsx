'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  Printer, 
  Filter, 
  Sparkles, 
  Edit3, 
  Save, 
  Flame, 
  Zap, 
  Layers, 
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MistakeEntry, ErrorType, Question } from '@/lib/types';
import confetti from 'canvas-confetti';

interface MistakesNotebookProps {
  mistakes: MistakeEntry[];
  onUpdateMistakeNote: (mistakeId: string, note: string) => void;
  onResolveMistakeInRevanche: (mistakeId: string, isCorrect: boolean) => void;
  onGoToSimulator: () => void;
}

export const MistakesNotebook: React.FC<MistakesNotebookProps> = ({
  mistakes,
  onUpdateMistakeNote,
  onResolveMistakeInRevanche,
  onGoToSimulator
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overcome'>('pending');
  const [filterErrorType, setFilterErrorType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  // Revanche interactive mode
  const [isRevancheActive, setIsRevancheActive] = useState<boolean>(false);
  const [revancheIndex, setRevancheIndex] = useState<number>(0);
  const [revancheSelectedOption, setRevancheSelectedOption] = useState<string | null>(null);
  const [revancheSubmitted, setRevancheSubmitted] = useState<boolean>(false);
  const [revancheFeedbackCorrect, setRevancheFeedbackCorrect] = useState<boolean | null>(null);

  // Expansion of question details
  const [expandedMistakeIds, setExpandedMistakeIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedMistakeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Metrics
  const totalMistakes = mistakes.length;
  const overcomeMistakes = mistakes.filter(m => m.isOvercome).length;
  const pendingMistakes = totalMistakes - overcomeMistakes;
  const recoveryRate = totalMistakes > 0 ? Math.round((overcomeMistakes / totalMistakes) * 100) : 0;

  // Error type counters
  const errorTypeCounts = {
    pegadinha_banca: mistakes.filter(m => m.errorType === 'pegadinha_banca').length,
    lacuna_teorica: mistakes.filter(m => m.errorType === 'lacuna_teorica').length,
    leitura_apressada: mistakes.filter(m => m.errorType === 'leitura_apressada').length,
    curva_esquecimento: mistakes.filter(m => m.errorType === 'curva_esquecimento').length
  };

  // Subjects available
  const availableSubjects = Array.from(new Set(mistakes.map(m => m.question.subjectName)));

  // Filtered mistakes list
  const filteredMistakes = mistakes.filter(m => {
    if (filterStatus === 'pending' && m.isOvercome) return false;
    if (filterStatus === 'overcome' && !m.isOvercome) return false;
    if (filterErrorType !== 'all' && m.errorType !== filterErrorType) return false;
    if (selectedSubject !== 'all' && m.question.subjectName !== selectedSubject) return false;
    return true;
  });

  const handleStartEditingNote = (mistake: MistakeEntry) => {
    setEditingNoteId(mistake.id);
    setTempNoteText(mistake.userPersonalNote || '');
  };

  const handleSaveNote = (mistakeId: string) => {
    onUpdateMistakeNote(mistakeId, tempNoteText);
    setEditingNoteId(null);
  };

  // Start Revanche Mode
  const pendingListForRevanche = mistakes.filter(m => !m.isOvercome);

  const startRevanche = () => {
    if (pendingListForRevanche.length === 0) return;
    setIsRevancheActive(true);
    setRevancheIndex(0);
    setRevancheSelectedOption(null);
    setRevancheSubmitted(false);
    setRevancheFeedbackCorrect(null);
  };

  const currentRevancheMistake = pendingListForRevanche[revancheIndex];

  const handleRevancheAnswerSubmit = () => {
    if (!revancheSelectedOption || !currentRevancheMistake) return;
    
    const correctOpt = currentRevancheMistake.question.options.find(o => o.isCorrect);
    const isCorrect = correctOpt?.id === revancheSelectedOption;

    setRevancheSubmitted(true);
    setRevancheFeedbackCorrect(isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
      onResolveMistakeInRevanche(currentRevancheMistake.id, true);
    } else {
      onResolveMistakeInRevanche(currentRevancheMistake.id, false);
    }
  };

  const handleNextRevancheQuestion = () => {
    if (revancheIndex < pendingListForRevanche.length - 1) {
      setRevancheIndex(prev => prev + 1);
      setRevancheSelectedOption(null);
      setRevancheSubmitted(false);
      setRevancheFeedbackCorrect(null);
    } else {
      // Revanche completed
      setIsRevancheActive(false);
    }
  };

  const getErrorTypeBadge = (type: ErrorType) => {
    switch (type) {
      case 'pegadinha_banca':
        return {
          label: 'Pegadinha de Banca',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400'
        };
      case 'lacuna_teorica':
        return {
          label: 'Lacuna Teórica',
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400'
        };
      case 'leitura_apressada':
        return {
          label: 'Leitura Apressada',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400'
        };
      case 'curva_esquecimento':
        return {
          label: 'Curva de Esquecimento',
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
          dot: 'bg-purple-400'
        };
      default:
        return {
          label: 'Ajuste de Conceito',
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-300',
          dot: 'bg-slate-400'
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/40 via-dark-surface to-indigo-950/40 border border-rose-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5" />
              Estudo Reverso & Metacognição
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Caderno de Erros Estratégico
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              O concurseiro de alta performance não revisa o que já domina: ele ataca cirurgicamente as armadilhas que o reprovariam. Use o <strong className="text-rose-300">Modo Revanche</strong> para zerar suas pendências antes da prova.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={startRevanche}
              disabled={pendingMistakes === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm tracking-wide transition-all shadow-xl ${
                pendingMistakes > 0
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-rose-600/30 glow-rose active:scale-95'
                  : 'bg-white dark:bg-dark-surface border border-slate-300 dark:border-white/10 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>INICIAR MODO REVANCHE ({pendingMistakes})</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-dark-surface hover:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
              title="Gerar visualização para impressão ou PDF"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Exportar / Imprimir</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
          <div className="bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total de Erros</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{totalMistakes}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">questões</span>
            </div>
          </div>

          <div className="bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
            <span className="text-xs text-amber-300 font-medium">Pendentes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{pendingMistakes}</span>
              <span className="text-[11px] text-amber-300/80">a superar</span>
            </div>
          </div>

          <div className="bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
            <span className="text-xs text-emerald-400 font-medium">Erros Superados</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{overcomeMistakes}</span>
              <span className="text-[11px] text-emerald-400/80">resolvidos</span>
            </div>
          </div>

          <div className="bg-dark-bg/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
            <span className="text-xs text-indigo-300 font-medium">Taxa de Recuperação</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-indigo-400">{recoveryRate}%</span>
              <div className="w-12 h-2 rounded-full bg-indigo-950 overflow-hidden self-center ml-auto">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" style={{ width: `${recoveryRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-dark-surface/70 border border-slate-200 dark:border-white/5 p-4 rounded-2xl backdrop-blur-xl">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-dark-bg/80 p-1 rounded-xl border border-slate-200 dark:border-white/5">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'pending'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Pendentes ({pendingMistakes})
          </button>
          <button
            onClick={() => setFilterStatus('overcome')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'overcome'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Superados ({overcomeMistakes})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            Todos ({totalMistakes})
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Error Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Causa do Erro:</span>
            <select
              value={filterErrorType}
              onChange={(e) => setFilterErrorType(e.target.value)}
              className="bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="all">Todas as Causas</option>
              <option value="pegadinha_banca">🎯 Pegadinhas de Banca ({errorTypeCounts.pegadinha_banca})</option>
              <option value="lacuna_teorica">📚 Lacunas Teóricas ({errorTypeCounts.lacuna_teorica})</option>
              <option value="leitura_apressada">⚡ Leitura Apressada ({errorTypeCounts.leitura_apressada})</option>
              <option value="curva_esquecimento">⏳ Esquecimento ({errorTypeCounts.curva_esquecimento})</option>
            </select>
          </div>

          {/* Subject Filter */}
          {availableSubjects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Disciplina:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todas as Matérias</option>
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Area */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-dark-surface/40 border border-slate-200 dark:border-white/5 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum erro encontrado com os filtros selecionados</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {filterStatus === 'pending'
              ? 'Excelente! Você não possui erros pendentes nesta categoria. Continue resolvendo simulados!'
              : 'Tente mudar os filtros de causa ou disciplina para visualizar outras questões.'}
          </p>
          <button
            onClick={onGoToSimulator}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Treinar no Simulador de Questões</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((mistake, index) => {
            const isExpanded = expandedMistakeIds.has(mistake.id);
            const badge = getErrorTypeBadge(mistake.errorType);
            const correctOption = mistake.question.options.find(o => o.isCorrect);
            const userOption = mistake.question.options.find(o => o.id === mistake.userSelectedOptionId);

            return (
              <div 
                key={mistake.id}
                className={`rounded-2xl border transition-all duration-200 ${
                  mistake.isOvercome
                    ? 'bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-white dark:bg-dark-surface/80 border-slate-200 dark:border-white/5 hover:border-rose-500/30'
                }`}
              >
                {/* Card Header Summary */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400">#{index + 1}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/5 px-2 py-0.5 rounded">
                        {mistake.question.banca} • {mistake.question.year}
                      </span>
                      <span className="text-xs font-semibold text-indigo-300">
                        {mistake.question.subjectName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">›</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {mistake.question.topicName}
                      </span>

                      {/* Error Type Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>

                      {/* Overcome Status */}
                      {mistake.isOvercome ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
                          SUPERADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          PENDENTE
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-800 dark:text-slate-100 font-medium line-clamp-2 pt-1">
                      {mistake.question.statement}
                    </p>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleExpand(mistake.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-bg hover:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
                    >
                      <span>{isExpanded ? 'Recolher' : 'Ver Detalhes'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-200 dark:border-white/5 space-y-5 animate-fadeIn">
                    
                    {/* Full Statement */}
                    <div className="bg-dark-bg/60 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                        Enunciado da Questão
                      </span>
                      <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                        {mistake.question.statement}
                      </p>
                    </div>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                          <XCircle className="w-4 h-4" />
                          <span>Sua Resposta:</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200">
                          {userOption ? `${userOption.text}` : 'Não respondida'}
                        </p>
                      </div>

                      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Gabarito Oficial:</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-200">
                          {correctOption?.text}
                        </p>
                      </div>
                    </div>

                    {/* Cognitive Diagnosis and Legal Backing */}
                    <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-black">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>DIAGNÓSTICO DA IA & REGRA DA BANCA</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {mistake.feedback}
                      </p>

                      <div className="text-xs bg-dark-bg/80 p-3 rounded-lg border border-indigo-500/10 text-indigo-200 font-medium">
                        💡 <strong>Orientação Prática:</strong> {mistake.actionableAdvice}
                      </div>

                      {mistake.question.codeCitation && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          📖 <strong>Base Legal:</strong> {mistake.question.codeCitation}
                        </div>
                      )}
                    </div>

                    {/* Personal Notes / Lição Aprendida */}
                    <div className="bg-dark-bg/80 border border-amber-500/20 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Minhas Anotações & Dica Pessoal ("Lição Aprendida")</span>
                        </div>
                        
                        {editingNoteId !== mistake.id && (
                          <button
                            onClick={() => handleStartEditingNote(mistake)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold"
                          >
                            Editar Anotação
                          </button>
                        )}
                      </div>

                      {editingNoteId === mistake.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={tempNoteText}
                            onChange={(e) => setTempNoteText(e.target.value)}
                            placeholder="Escreva aqui seu resumo, mnemônico ou aviso para não errar mais essa questão..."
                            rows={3}
                            className="w-full bg-white dark:bg-dark-surface border border-amber-500/30 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1 rounded bg-white dark:bg-dark-surface text-slate-500 dark:text-slate-400 text-xs font-semibold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveNote(mistake.id)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Salvar Nota
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                          {mistake.userPersonalNote || 'Nenhuma nota adicionada ainda. Clique em "Editar Anotação" para registrar sua lição aprendida.'}
                        </p>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Revanche Modal View */}
      {isRevancheActive && currentRevancheMistake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-dark-surface border border-rose-500/30 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white font-black">
                  <Flame className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Modo Revanche — Questão {revancheIndex + 1} de {pendingListForRevanche.length}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentRevancheMistake.question.subjectName} • {currentRevancheMistake.question.banca}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsRevancheActive(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5"
              >
                Encerrar
              </button>
            </div>

            {/* Question Statement */}
            <div className="space-y-4">
              <div className="bg-dark-bg p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                  {currentRevancheMistake.question.statement}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentRevancheMistake.question.options.map((option) => {
                  const isSelected = revancheSelectedOption === option.id;
                  let optionStyles = 'bg-dark-bg/60 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-white/20';

                  if (revancheSubmitted) {
                    if (option.isCorrect) {
                      optionStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !option.isCorrect) {
                      optionStyles = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-rose-600/20 border-rose-500 text-white';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={revancheSubmitted}
                      onClick={() => setRevancheSelectedOption(option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-medium flex items-center justify-between gap-3 ${optionStyles}`}
                    >
                      <span>{option.text}</span>
                      {revancheSubmitted && option.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {revancheSubmitted && isSelected && !option.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post submission feedback */}
            {revancheSubmitted && (
              <div className={`p-4 rounded-2xl border animate-fadeIn ${
                revancheFeedbackCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  {revancheFeedbackCorrect ? (
                    <>
                      <Award className="w-5 h-5 text-amber-300" />
                      <span>🎉 EXCELENTE! ERRO SUPERADO COM SUCESSO!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span>Ainda não foi dessa vez. Revise a explicação abaixo:</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {currentRevancheMistake.question.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!revancheSubmitted ? (
                <button
                  disabled={!revancheSelectedOption}
                  onClick={handleRevancheAnswerSubmit}
                  className={`px-6 py-3 rounded-xl font-bold text-xs tracking-wide transition-all ${
                    revancheSelectedOption
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-dark-bg text-slate-500 border border-slate-200 dark:border-white/5 cursor-not-allowed'
                  }`}
                >
                  Confirmar Resposta da Revanche
                </button>
              ) : (
                <button
                  onClick={handleNextRevancheQuestion}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  <span>{revancheIndex < pendingListForRevanche.length - 1 ? 'Próxima Questão do Caderno' : 'Concluir Modo Revanche'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
