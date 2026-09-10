'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  BrainCircuit,
  Award,
  Check
} from 'lucide-react';
import { Question, QuestionAttempt, Flashcard, QuestionBankFilter } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';

interface QuestionBankProps {
  onAddFlashcard: (flashcard: Flashcard) => void;
  onRecordAttempt: (attempt: QuestionAttempt) => void;
  onGoToSimulator?: () => void;
  onGoToMistakes?: () => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  onAddFlashcard,
  onRecordAttempt,
  onGoToSimulator,
  onGoToMistakes
}) => {
  const [filter, setFilter] = useState<QuestionBankFilter>({
    searchQuery: '',
    banca: 'todas',
    subject: 'todas',
    topic: 'todos',
    year: 'todos',
    difficulty: 'todas',
    status: 'todas'
  });

  // Respostas locais para o banco
  const [userAnswers, setUserAnswers] = useState<Record<string, { selectedOptionId: string; isCorrect: boolean; confirmed: boolean }>>({});
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Extrair listas únicas para os seletores de filtros
  const availableBancas = useMemo(() => {
    const set = new Set(MOCK_QUESTIONS.map(q => q.banca));
    return ['todas', ...Array.from(set)];
  }, []);

  const availableSubjects = useMemo(() => {
    const set = new Set(MOCK_QUESTIONS.map(q => q.subjectName));
    return ['todas', ...Array.from(set)];
  }, []);

  const availableYears = useMemo(() => {
    const set = new Set(MOCK_QUESTIONS.map(q => q.year.toString()));
    return ['todos', ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, []);

  // Filtragem dinâmica das questões
  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter(q => {
      // Busca textual
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchesStatement = q.statement.toLowerCase().includes(query);
        const matchesSubject = q.subjectName.toLowerCase().includes(query);
        const matchesTopic = q.topicName.toLowerCase().includes(query);
        const matchesLaw = q.lawArticles?.some(l => l.toLowerCase().includes(query));
        if (!matchesStatement && !matchesSubject && !matchesTopic && !matchesLaw) {
          return false;
        }
      }

      // Filtro de Banca
      if (filter.banca !== 'todas' && q.banca !== filter.banca) {
        return false;
      }

      // Filtro de Disciplina
      if (filter.subject !== 'todas' && q.subjectName !== filter.subject) {
        return false;
      }

      // Filtro de Dificuldade
      if (filter.difficulty !== 'todas' && q.difficulty !== filter.difficulty) {
        return false;
      }

      // Filtro de Ano
      if (filter.year !== 'todos' && q.year.toString() !== filter.year) {
        return false;
      }

      // Filtro de Status
      if (filter.status !== 'todas') {
        const ans = userAnswers[q.id];
        if (filter.status === 'nao_resolvidas' && ans?.confirmed) return false;
        if (filter.status === 'acertos' && (!ans?.confirmed || !ans.isCorrect)) return false;
        if (filter.status === 'erros' && (!ans?.confirmed || ans.isCorrect)) return false;
      }

      return true;
    });
  }, [filter, userAnswers]);

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / itemsPerPage));
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(start, start + itemsPerPage);
  }, [filteredQuestions, currentPage]);

  // Estatísticas de resolução
  const stats = useMemo(() => {
    const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k].confirmed).length;
    const correctCount = Object.values(userAnswers).filter(a => a.confirmed && a.isCorrect).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return {
      totalQuestions: MOCK_QUESTIONS.length,
      filteredCount: filteredQuestions.length,
      answeredCount,
      correctCount,
      wrongCount: answeredCount - correctCount,
      accuracy
    };
  }, [userAnswers, filteredQuestions]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (userAnswers[questionId]?.confirmed) return; // já confirmou
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOptionId: optionId,
        isCorrect: false,
        confirmed: false
      }
    }));
  };

  const handleConfirmAnswer = (question: Question) => {
    const ans = userAnswers[question.id];
    if (!ans || !ans.selectedOptionId) return;

    const selectedOption = question.options.find(o => o.id === ans.selectedOptionId);
    const isCorrect = !!selectedOption?.isCorrect;

    setUserAnswers(prev => ({
      ...prev,
      [question.id]: {
        selectedOptionId: ans.selectedOptionId,
        isCorrect,
        confirmed: true
      }
    }));

    setExpandedDetails(prev => ({
      ...prev,
      [question.id]: true
    }));

    // Notificar pai para métricas e caderno de erros
    onRecordAttempt({
      id: `attempt-${Date.now()}`,
      questionId: question.id,
      selectedOptionId: ans.selectedOptionId,
      isCorrect,
      answeredAt: new Date().toISOString(),
      timeSpentSeconds: 45,
      diagnostic: {
        errorType: isCorrect ? undefined : 'pegadinha_banca',
        confidenceLevel: 'alta',
        feedback: isCorrect ? 'Excelente! Resposta correta com fundamentação.' : question.explanation,
        actionableAdvice: question.cognitiveAnalysis.commonTrap,
        suggestedReviewTopic: question.topicName,
        flashcardFront: question.statement,
        flashcardBack: question.explanation
      }
    });
  };

  const handleCreateFlashcardFromQuestion = (question: Question) => {
    const correctOpt = question.options.find(o => o.isCorrect);
    const flashcard: Flashcard = {
      id: `fc-qb-${Date.now()}`,
      subjectName: question.subjectName,
      topicName: question.topicName,
      front: `${question.statement.slice(0, 180)}... (${question.banca} / ${question.year})`,
      back: `Gabarito: ${correctOpt?.text}\n\nFundamentação: ${question.explanation}\n\nPegadinha da Banca: ${question.cognitiveAnalysis.commonTrap}`,
      errorOriginQuestionId: question.id,
      nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5
    };
    onAddFlashcard(flashcard);
  };

  const handleResetFilter = () => {
    setFilter({
      searchQuery: '',
      banca: 'todas',
      subject: 'todas',
      topic: 'todos',
      year: 'todos',
      difficulty: 'todas',
      status: 'todas'
    });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Header com Apresentação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              Módulo de Treinamento
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {stats.filteredCount} {stats.filteredCount === 1 ? 'questão disponível' : 'questões disponíveis'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5">
            Banco de Questões Inteligente
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Pratique com questões reais comentadas das principais bancas, com diagnóstico imediato de pegadinhas, fundamentação em lei e integração automática com o Caderno de Erros.
          </p>
        </div>

        {/* Resumo de Desempenho Rápido */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Taxa de Acerto</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{stats.accuracy}%</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Resolvidas</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{stats.answeredCount} / {stats.totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca e Filtros Multicritério */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        
        {/* Campo de Busca Livre */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquise por termo no enunciado, artigo de lei, pegadinha ou tema (ex: 'dano moral', 'art. 37', 'improbidade')..."
            value={filter.searchQuery}
            onChange={(e) => {
              setFilter(prev => ({ ...prev, searchQuery: e.target.value }));
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Dropdowns de Filtro */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          
          {/* Banca */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Banca
            </label>
            <select
              value={filter.banca}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, banca: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="todas">Todas as Bancas</option>
              {availableBancas.filter(b => b !== 'todas').map(banca => (
                <option key={banca} value={banca}>{banca}</option>
              ))}
            </select>
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Disciplina
            </label>
            <select
              value={filter.subject}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, subject: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="todas">Todas as Matérias</option>
              {availableSubjects.filter(s => s !== 'todas').map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Dificuldade
            </label>
            <select
              value={filter.difficulty}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, difficulty: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="todas">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Média">Média</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Ano
            </label>
            <select
              value={filter.year}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, year: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="todos">Todos os Anos</option>
              {availableYears.filter(y => y !== 'todos').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter(prev => ({ ...prev, status: e.target.value as any }));
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              <option value="todas">Todas</option>
              <option value="nao_resolvidas">Não Resolvidas</option>
              <option value="acertos">Acertos</option>
              <option value="erros">Erros</option>
            </select>
          </div>

          {/* Botão Limpar Filtros */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilter}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-dark-surface hover:dark:bg-dark-hover text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>

        </div>

      </div>

      {/* Lista de Questões */}
      <div className="space-y-5">
        {paginatedQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma questão encontrada</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Tente alterar os termos da busca ou redefinir os filtros de banca e disciplina.
            </p>
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Redefinir Filtros
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q, qIndex) => {
            const answerState = userAnswers[q.id];
            const isConfirmed = !!answerState?.confirmed;
            const isDetailsOpen = !!expandedDetails[q.id];

            return (
              <div 
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4 transition-all"
              >
                {/* Metadados Superiores */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/5 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/20">
                      Q{((currentPage - 1) * itemsPerPage) + qIndex + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {q.institution}
                    </span>
                    {q.role && (
                      <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                        • {q.role}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {q.banca} ({q.year})
                    </span>
                    {q.difficulty && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.difficulty === 'Fácil' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : q.difficulty === 'Média'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{q.subjectName}</span>
                    <span>&rsaquo;</span>
                    <span className="line-clamp-1">{q.topicName}</span>
                  </div>
                </div>

                {/* Enunciado da Questão */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-normal whitespace-pre-line">
                  {q.statement}
                </div>

                {/* Código / Artigo Citado se houver */}
                {q.codeCitation && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-dark-surface/60 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                    ⚖️ Fundamento Legal em Referência: <span className="text-slate-700 dark:text-slate-300 font-semibold">{q.codeCitation}</span>
                  </div>
                )}

                {/* Opções de Resposta */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answerState?.selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;

                    let optionStyle = 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 hover:border-indigo-400/50';

                    if (isConfirmed) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500';
                      } else {
                        optionStyle = 'opacity-60 bg-slate-50 dark:bg-dark-surface border-transparent text-slate-400';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500';
                    }

                    const optionLetter = String.fromCharCode(65 + optIndex);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm flex items-start gap-3 select-none ${optionStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                          isConfirmed && isCorrect
                            ? 'bg-emerald-500 text-white'
                            : isConfirmed && isSelected && !isCorrect
                            ? 'bg-rose-500 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isConfirmed && isCorrect ? <Check className="w-3.5 h-3.5" /> : optionLetter}
                        </div>

                        <div className="flex-1">
                          <p>{opt.text}</p>
                          {isConfirmed && opt.distractorReason && !isCorrect && (
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-sans">
                              <span>⚠️ <strong>Distrator da banca:</strong> {opt.distractorReason}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Barra de Ações (Confirmar Resposta / Ver Comentário) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    {!isConfirmed ? (
                      <button
                        onClick={() => handleConfirmAnswer(q)}
                        disabled={!answerState?.selectedOptionId}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          answerState?.selectedOptionId
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 glow-brand'
                            : 'bg-slate-100 dark:bg-dark-surface text-slate-400 cursor-not-allowed border border-slate-200 dark:border-white/5'
                        }`}
                      >
                        Responder Questão
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                          answerState.isCorrect 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {answerState.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Você acertou!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Você errou (enviado ao Caderno de Erros)</span>
                            </>
                          )}
                        </span>

                        <button
                          onClick={() => setExpandedDetails(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-surface hover:dark:bg-dark-hover text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200 dark:border-white/5"
                        >
                          {isDetailsOpen ? 'Ocultar Explicação' : 'Ver Gabarito Comentado'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ações Rápidas: Salvar como Flashcard */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCreateFlashcardFromQuestion(q)}
                      title="Transformar esta questão em um flashcard com repetição espaçada"
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gerar Flashcard SRS</span>
                    </button>
                  </div>
                </div>

                {/* Caixa de Diagnóstico Cognitivo da Banca (Expandida após resposta ou clique) */}
                {isConfirmed && isDetailsOpen && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-dark-surface/90 border border-indigo-500/30 space-y-3.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400">
                      <BrainCircuit className="w-4 h-4" />
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        Gabarito Comentado & Análise Cognitiva da Banca
                      </h4>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
                      <p><strong>Fundamentação:</strong> {q.explanation}</p>
                    </div>

                    {/* Artigos de Lei Envolvidos */}
                    {q.lawArticles && q.lawArticles.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                          Dispositivos Legais & Jurisprudência:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {q.lawArticles.map((art, aIdx) => (
                            <span 
                              key={aIdx} 
                              className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1"
                            >
                              📜 {art}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pegadinha e Tendência da Banca */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
                        <p className="font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                          <Flame className="w-3.5 h-3.5" /> Pegadinha Mapeada
                        </p>
                        <p className="text-[11px] leading-snug">{q.cognitiveAnalysis.commonTrap}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-300">
                        <p className="font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1">
                          <Award className="w-3.5 h-3.5" /> Tendência {q.banca}
                        </p>
                        <p className="text-[11px] leading-snug">{q.cognitiveAnalysis.bancaTendency}</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-sm text-xs font-bold">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-dark-surface dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/5 transition-all text-slate-700 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="text-slate-500 dark:text-slate-400">
            Página <strong className="text-slate-900 dark:text-white">{currentPage}</strong> de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-dark-surface dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/5 transition-all text-slate-700 dark:text-slate-300"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
