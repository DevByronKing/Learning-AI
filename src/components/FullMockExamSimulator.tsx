'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  RotateCcw, 
  Scale, 
  BarChart2, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { MockExam, MockExamAnswer, MockExamResult, MockExamSubjectBreakdown, Question, Flashcard } from '@/lib/types';
import { MOCK_FULL_EXAMS } from '@/lib/mockData';
import confetti from 'canvas-confetti';

interface FullMockExamSimulatorProps {
  onAddFlashcardsBatch?: (flashcards: Flashcard[]) => void;
  onGoBackToQuickQuiz?: () => void;
}

export const FullMockExamSimulator: React.FC<FullMockExamSimulatorProps> = ({
  onAddFlashcardsBatch,
  onGoBackToQuickQuiz
}) => {
  const [exams] = useState<MockExam[]>(MOCK_FULL_EXAMS);
  const [selectedExam, setSelectedExam] = useState<MockExam>(exams[0]);
  const [viewMode, setViewMode] = useState<'select' | 'in_progress' | 'result'>('select');

  // Exam execution state
  const [answers, setAnswers] = useState<Record<string, MockExamAnswer>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(45 * 60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [result, setResult] = useState<MockExamResult | null>(null);

  // Result filter state
  const [resultFilter, setResultFilter] = useState<'all' | 'wrong' | 'blank' | 'correct'>('all');
  const [addedToSRS, setAddedToSRS] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (viewMode === 'in_progress' && isTimerActive && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [viewMode, isTimerActive, remainingSeconds]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam: MockExam) => {
    setSelectedExam(exam);
    const initialAnswers: Record<string, MockExamAnswer> = {};
    exam.questions.forEach((q) => {
      initialAnswers[q.id] = {
        questionId: q.id,
        selectedOptionId: null,
        isFlaggedForReview: false
      };
    });
    setAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setRemainingSeconds(exam.durationMinutes * 60);
    setIsTimerActive(true);
    setViewMode('in_progress');
    setResult(null);
    setAddedToSRS(false);
  };

  const currentQuestion: Question | undefined = selectedExam.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: optionId
      }
    }));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: null
      }
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isFlaggedForReview: !prev[questionId]?.isFlaggedForReview
      }
    }));
  };

  const handleFinishExam = () => {
    setIsTimerActive(false);
    setShowConfirmModal(false);

    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;

    const subjectsMap: Record<string, { total: number; correct: number; wrong: number; blank: number }> = {};

    selectedExam.questions.forEach((q) => {
      const ans = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);

      if (!subjectsMap[q.subjectName]) {
        subjectsMap[q.subjectName] = { total: 0, correct: 0, wrong: 0, blank: 0 };
      }
      subjectsMap[q.subjectName].total += 1;

      if (!ans || ans.selectedOptionId === null) {
        blankCount += 1;
        subjectsMap[q.subjectName].blank += 1;
      } else if (ans.selectedOptionId === correctOption?.id) {
        correctCount += 1;
        subjectsMap[q.subjectName].correct += 1;
      } else {
        wrongCount += 1;
        subjectsMap[q.subjectName].wrong += 1;
      }
    });

    const totalQuestions = selectedExam.questions.length;
    const answeredCount = correctCount + wrongCount;

    let grossScore = 0;
    let penaltyDeductions = 0;
    let netScore = 0;

    if (selectedExam.scoringRule === 'cebraspe_uma_anula_uma') {
      grossScore = correctCount;
      penaltyDeductions = wrongCount;
      netScore = Math.max(0, correctCount - wrongCount);
    } else {
      grossScore = correctCount;
      penaltyDeductions = 0;
      netScore = correctCount;
    }

    const percentage = Math.round((netScore / totalQuestions) * 100);
    const isAboveCutoff = percentage >= selectedExam.estimatedCutoffScore;

    // Simulated Ranking generation
    const totalCandidates = 1420;
    let simulatedRank = 14;
    if (percentage >= 90) simulatedRank = Math.floor(Math.random() * 8) + 1; // 1 to 8
    else if (percentage >= 80) simulatedRank = Math.floor(Math.random() * 25) + 9;
    else if (percentage >= 70) simulatedRank = Math.floor(Math.random() * 80) + 35;
    else if (percentage >= 50) simulatedRank = Math.floor(Math.random() * 300) + 150;
    else simulatedRank = Math.floor(Math.random() * 600) + 600;

    // Subject breakdown
    const subjectBreakdown: MockExamSubjectBreakdown[] = Object.entries(subjectsMap).map(([name, data]) => {
      const subjNet = selectedExam.scoringRule === 'cebraspe_uma_anula_uma' 
        ? Math.max(0, data.correct - data.wrong)
        : data.correct;

      return {
        subjectName: name,
        total: data.total,
        correct: data.correct,
        wrong: data.wrong,
        blank: data.blank,
        grossScore: data.correct,
        penaltyDeductions: selectedExam.scoringRule === 'cebraspe_uma_anula_uma' ? data.wrong : 0,
        netScore: subjNet
      };
    });

    const examResult: MockExamResult = {
      mockExamId: selectedExam.id,
      mockExamTitle: selectedExam.title,
      banca: selectedExam.banca,
      scoringRule: selectedExam.scoringRule,
      totalQuestions,
      answeredCount,
      correctCount,
      wrongCount,
      blankCount,
      grossScore,
      penaltyDeductions,
      netScore,
      percentage,
      simulatedRank,
      totalCandidates,
      isAboveCutoff,
      cutoffScore: selectedExam.estimatedCutoffScore,
      timeSpentSeconds: selectedExam.durationMinutes * 60 - remainingSeconds,
      completedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      subjectBreakdown
    };

    setResult(examResult);
    setViewMode('result');

    if (isAboveCutoff) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const handleAddWrongQuestionsToSRS = () => {
    if (!result || !onAddFlashcardsBatch) return;

    const wrongQuestions = selectedExam.questions.filter((q) => {
      const ans = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      return ans && ans.selectedOptionId !== null && ans.selectedOptionId !== correctOption?.id;
    });

    if (wrongQuestions.length === 0) return;

    const newCards: Flashcard[] = wrongQuestions.map((q) => {
      const correctOpt = q.options.find((o) => o.isCorrect);
      return {
        id: `fc-sim-${Date.now()}-${q.id}`,
        subjectName: q.subjectName,
        topicName: q.topicName,
        front: `[${q.banca} / ${q.subjectName}] ${q.statement}`,
        back: `GABARITO: ${correctOpt?.text}\n\nFUNDAMENTO: ${q.explanation}\n\nARTIGOS: ${q.lawArticles?.join(', ') || 'Jurisprudência oficial'}`,
        errorOriginQuestionId: q.id,
        intervalDays: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
      };
    });

    onAddFlashcardsBatch(newCards);
    setAddedToSRS(true);
  };

  // Quick stats during test
  const answeredCount = Object.values(answers).filter((a) => a.selectedOptionId !== null).length;
  const blankCount = selectedExam.questions.length - answeredCount;
  const flaggedCount = Object.values(answers).filter((a) => a.isFlaggedForReview).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">

      {/* VIEW MODE 1: SELECT EXAM */}
      {viewMode === 'select' && (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-300 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  Simulados Oficiais de Prova Real
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Padrão Cebraspe • FGV • FCC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Central de Simulados Cronometrados & Ranking
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Simule a pressão real do dia da prova com cartão-resposta digital, anulação de questões e apuração de nota líquida oficial.
              </p>
            </div>

            {onGoBackToQuickQuiz && (
              <button
                onClick={onGoBackToQuickQuiz}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar ao Treino Avulso</span>
              </button>
            )}
          </div>

          {/* Exam Presets Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Meta Badges */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-300 dark:border-white/10 text-xs">
                    <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      Banca {exam.banca}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {exam.durationMinutes} minutos
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-4 group-hover:text-indigo-300 transition-colors">
                    {exam.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {exam.institution} • Cargo: <strong>{exam.role}</strong>
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                    {exam.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-6 p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5 text-center text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Questões</span>
                      <p className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">{exam.totalQuestions}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Regra</span>
                      <p className="text-xs font-bold text-amber-400 mt-1">
                        {exam.scoringRule === 'cebraspe_uma_anula_uma' ? '1 Errada Anula 1' : 'Ponderada'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Corte Estimado</span>
                      <p className="text-base font-black text-emerald-400 font-mono mt-0.5">{exam.estimatedCutoffScore}%</p>
                    </div>
                  </div>

                  {/* Scoring Alert */}
                  {exam.scoringRule === 'cebraspe_uma_anula_uma' && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Estratégia Cebraspe:</strong> Cada resposta errada desconta 1 ponto positivo. Respostas em branco não pontuam nem anulam.</span>
                    </div>
                  )}

                </div>

                {/* Start Button */}
                <div className="mt-8 pt-4 border-t border-slate-300 dark:border-white/10">
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    <span>Iniciar Prova Simulada</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW MODE 2: IN PROGRESS (MODO PROVA REAL) */}
      {viewMode === 'in_progress' && currentQuestion && (
        <div className="space-y-6">
          
          {/* Top Real-time Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-300 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 shadow-2xl backdrop-blur-md">
            
            {/* Title & Question number */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                {selectedExam.banca}
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  Questão {currentQuestionIndex + 1} de {selectedExam.questions.length}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentQuestion.subjectName} • {currentQuestion.topicName}
                </span>
              </div>
            </div>

            {/* Middle: Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-black text-sm ${
              remainingSeconds <= 300
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-white dark:bg-dark-surface border-slate-300 dark:border-white/10 text-amber-400'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleFlag(currentQuestion.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentAnswer?.isFlaggedForReview
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-black'
                    : 'bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{currentAnswer?.isFlaggedForReview ? 'Marcada para Revisão' : 'Marcar para Revisar'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/30"
              >
                Entregar Prova
              </button>
            </div>

          </div>

          {/* Main Layout: Question (Left) vs Answer Sheet Grid (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Question Card */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10">
                
                {/* Law citation badge */}
                {currentQuestion.codeCitation && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{currentQuestion.codeCitation}</span>
                  </div>
                )}

                {/* Statement */}
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                  {currentQuestion.statement}
                </p>

                {/* Options */}
                <div className="mt-8 space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentAnswer?.selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-400'
                            : 'bg-white dark:bg-dark-surface/70 hover:bg-slate-50 dark:hover:bg-dark-hover border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {option.id.replace('opt-', '').toUpperCase()}
                          </div>
                          <span className="leading-snug">{option.text}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Bottom Bar: Leave in blank & Navigation */}
                <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Clear answer button (Cebraspe feature) */}
                  <button
                    type="button"
                    onClick={() => handleClearAnswer(currentQuestion.id)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 self-start"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Deixar esta questão em branco</span>
                  </button>

                  {/* Prev / Next buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      disabled={currentQuestionIndex === selectedExam.questions.length - 1}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(selectedExam.questions.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <span>Próxima</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* Cartão-Resposta Digital (Gabarito Lateral) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="glass-panel p-6 rounded-3xl border border-slate-300 dark:border-white/10 sticky top-36">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Cartão-Resposta Digital</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {answeredCount} / {selectedExam.questions.length} marcadas
                  </span>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span>Marcada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span>Revisar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    <span>Em branco</span>
                  </div>
                </div>

                {/* Answers Grid */}
                <div className="grid grid-cols-5 gap-2 mt-5">
                  {selectedExam.questions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isAnswered = ans && ans.selectedOptionId !== null;
                    const isFlagged = ans && ans.isFlaggedForReview;
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-11 rounded-xl font-mono text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                          isCurrent
                            ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-dark-bg z-10'
                            : ''
                        } ${
                          isFlagged
                            ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                            : isAnswered
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                        {isAnswered && (
                          <span className="text-[9px] uppercase font-black -mt-1 opacity-90">
                            {ans.selectedOptionId?.replace('opt-', '')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Live exam summary box */}
                <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Respondidas:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{answeredCount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Em Branco:</span>
                    <strong className="text-amber-400 font-mono">{blankCount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Para Revisão:</span>
                    <strong className="text-amber-400 font-mono">{flaggedCount}</strong>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30"
                  >
                    Finalizar e Entregar Gabarito
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Confirm Finish Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
              <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 glow-brand">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Entregar Gabarito Definitivo?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Confira o resumo do seu preenchimento antes de fechar a prova:
                </p>

                <div className="my-5 p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Questões Respondidas:</span>
                    <strong className="text-emerald-400 font-mono">{answeredCount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Questões em Branco:</span>
                    <strong className="text-amber-400 font-mono">{blankCount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Marcadas para Revisão:</span>
                    <strong className="text-amber-400 font-mono">{flaggedCount}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Tempo Restante:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatTime(remainingSeconds)}</strong>
                  </div>
                </div>

                {blankCount > 0 && selectedExam.scoringRule === 'cebraspe_uma_anula_uma' && (
                  <p className="text-[11px] text-amber-300 mb-4 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    💡 <strong>Lembrete Cebraspe:</strong> Deixar {blankCount} questões em branco é uma estratégia válida para não perder pontos positivos em caso de dúvida.
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                  >
                    Voltar à Prova
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishExam}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30"
                  >
                    Confirmar Entrega
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW MODE 3: OFFICIAL RESULT & SIMULATED RANKING */}
      {viewMode === 'result' && result && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Hero Performance Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 glow-brand">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-300 dark:border-white/10">
              
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 ${
                  result.isAboveCutoff
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                }`}>
                  {result.isAboveCutoff ? '✓' : '✗'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      result.isAboveCutoff ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {result.isAboveCutoff ? 'DENTRO DA NOTA DE CORTE' : 'ABAIXO DA NOTA DE CORTE'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      Corte Estimado: {result.cutoffScore}%
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    Nota Líquida: <span className={result.isAboveCutoff ? 'text-emerald-400' : 'text-rose-400'}>
                      {result.netScore > 0 ? `+${result.netScore}` : result.netScore}
                    </span> / {result.totalQuestions} pts líquidos ({result.percentage}%)
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {result.mockExamTitle} • Concluído em {result.completedAt} ({Math.round(result.timeSpentSeconds / 60)} min gastos).
                  </p>
                </div>
              </div>

              {/* Formula calculation badge */}
              <div className="bg-white dark:bg-dark-surface/90 p-4 rounded-2xl border border-slate-200 dark:border-white/5 text-xs self-start md:self-auto">
                <span className="text-slate-500 dark:text-slate-400">Fórmula de Apuração Oficial:</span>
                {result.scoringRule === 'cebraspe_uma_anula_uma' ? (
                  <div className="mt-1">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">Nota Líquida = Acertos ({result.correctCount}) - Erros ({result.wrongCount})</p>
                    <p className="text-[11px] text-rose-400 mt-0.5">Penalidades deduzidas: -{result.penaltyDeductions} pts</p>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">Nota = {result.correctCount} acertos de {result.totalQuestions} questões</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Sem fator de penalização por erro</p>
                  </div>
                )}
              </div>

            </div>

            {/* Simulated Ranking Banner */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Posição no Ranking Simulado do Concurso
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    🏆 Você ficou em <span className="text-amber-400">{result.simulatedRank}º lugar</span> entre {result.totalCandidates.toLocaleString('pt-BR')} candidatos
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Percentil atingido: <strong>{Math.max(1, 100 - Math.round((result.simulatedRank / result.totalCandidates) * 100))}%</strong> dos concorrentes simulados.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block">Status no Concurso</span>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black inline-block mt-1 ${
                  result.isAboveCutoff 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {result.isAboveCutoff ? 'Classificado para a 2ª Fase' : 'Fora das Vagas Imediatas'}
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs text-center">
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Acertos (Certas)</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-1">+{result.correctCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Erros (Anulam)</span>
                <p className="text-xl font-black text-rose-400 font-mono mt-1">-{result.wrongCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Em Branco (Neutras)</span>
                <p className="text-xl font-black text-amber-400 font-mono mt-1">{result.blankCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Tempo Médio/Questão</span>
                <p className="text-xl font-black text-indigo-400 font-mono mt-1">
                  {Math.round(result.timeSpentSeconds / result.totalQuestions)}s
                </p>
              </div>
            </div>

          </div>

          {/* Performance by Subject Breakdown Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Desempenho Discriminado por Disciplina</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                <thead className="bg-white dark:bg-dark-surface text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-300 dark:border-white/10">
                  <tr>
                    <th className="p-3">Disciplina</th>
                    <th className="p-3 text-center">Questões</th>
                    <th className="p-3 text-center text-emerald-400">Acertos</th>
                    <th className="p-3 text-center text-rose-400">Erros</th>
                    <th className="p-3 text-center text-amber-400">Em Branco</th>
                    <th className="p-3 text-center font-bold text-slate-900 dark:text-white">Saldo Líquido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {result.subjectBreakdown.map((subj, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">{subj.subjectName}</td>
                      <td className="p-3 text-center">{subj.total}</td>
                      <td className="p-3 text-center text-emerald-400">+{subj.correct}</td>
                      <td className="p-3 text-center text-rose-400">-{subj.wrong}</td>
                      <td className="p-3 text-center text-amber-400">{subj.blank}</td>
                      <td className="p-3 text-center font-bold text-indigo-300">
                        {subj.netScore > 0 ? `+${subj.netScore}` : subj.netScore} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Complete Answer Key (Gabarito Comentado Oficial) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 dark:border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Gabarito Comentado</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Conferência Questão por Questão com Análise da Banca
                </h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-white/10 text-xs">
                <button
                  onClick={() => setResultFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    resultFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({result.totalQuestions})
                </button>
                <button
                  onClick={() => setResultFilter('wrong')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    resultFilter === 'wrong' ? 'bg-rose-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  Erros ({result.wrongCount})
                </button>
                <button
                  onClick={() => setResultFilter('blank')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    resultFilter === 'blank' ? 'bg-amber-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  Em Branco ({result.blankCount})
                </button>
              </div>
            </div>

            {/* SRS Sync Banner */}
            {result.wrongCount > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Você errou <strong>{result.wrongCount} questões</strong> neste simulado. Converta seus erros em flashcards para fixação definitiva.
                  </span>
                </div>
                <button
                  onClick={handleAddWrongQuestionsToSRS}
                  disabled={addedToSRS}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    addedToSRS
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {addedToSRS ? <Check className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{addedToSRS ? 'Flashcards Adicionados!' : 'Salvar Erros no Deck SRS'}</span>
                </button>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {selectedExam.questions
                .filter((q) => {
                  const ans = answers[q.id];
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  const isCorrect = ans && ans.selectedOptionId === correctOpt?.id;
                  const isBlank = !ans || ans.selectedOptionId === null;

                  if (resultFilter === 'wrong') return !isBlank && !isCorrect;
                  if (resultFilter === 'blank') return isBlank;
                  if (resultFilter === 'correct') return isCorrect;
                  return true;
                })
                .map((q, idx) => {
                  const ans = answers[q.id];
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  const selectedOpt = q.options.find((o) => o.id === ans?.selectedOptionId);
                  const isCorrect = ans && ans.selectedOptionId === correctOpt?.id;
                  const isBlank = !ans || ans.selectedOptionId === null;

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border text-xs sm:text-sm transition-all ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isBlank
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      {/* Meta header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">Questão #{selectedExam.questions.indexOf(q) + 1}</span>
                          <span className="text-slate-500 dark:text-slate-400">• {q.subjectName}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isBlank
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {isCorrect ? '✓ Acerto (+1 pt)' : isBlank ? '○ Em Branco (0 pt)' : '✗ Erro (-1 pt no Cebraspe)'}
                        </span>
                      </div>

                      {/* Statement */}
                      <p className="mt-3 text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {q.statement}
                      </p>

                      {/* Comparison of Selected vs Correct */}
                      <div className="mt-4 p-3.5 rounded-xl bg-dark-bg/70 border border-slate-200 dark:border-white/5 space-y-1.5 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400">Sua Marcação:</span>
                          <strong className={isCorrect ? 'text-emerald-400' : isBlank ? 'text-amber-400' : 'text-rose-400'}>
                            {isBlank ? 'EM BRANCO' : selectedOpt?.text}
                          </strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 dark:text-slate-400">Gabarito Oficial:</span>
                          <strong className="text-emerald-400">{correctOpt?.text}</strong>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-indigo-300">Fundamentação: </strong>
                        {q.explanation}
                      </div>

                      {/* Legal references */}
                      {q.lawArticles && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {q.lawArticles.map((art, aIdx) => (
                            <span key={aIdx} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-semibold">
                              {art}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-300 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setViewMode('select')}
                className="px-6 py-3 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Voltar aos Simulados
              </button>

              <button
                type="button"
                onClick={() => handleStartExam(selectedExam)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Este Simulado</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
