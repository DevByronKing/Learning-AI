'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Flame, 
  RotateCcw, 
  Scale, 
  BookOpen, 
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, QuestionAttempt, MistakeEntry } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { analytics } from '@/lib/analytics';

interface FlashChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBanca: string;
  targetRole?: string;
  warName?: string;
  onRecordAttempt?: (attempt: QuestionAttempt) => void;
  onOpenMistakes?: () => void;
}

export const FlashChallengeModal: React.FC<FlashChallengeModalProps> = ({
  isOpen,
  onClose,
  targetBanca,
  targetRole = 'Carreiras Públicas / OAB',
  warName = 'Concurseiro',
  onRecordAttempt,
  onOpenMistakes
}) => {
  // Filtra 3 questões de pegadinhas calibradas para a banca do aluno ou bancas equivalentes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (isOpen) {
      // Prioriza questões da banca do aluno
      const filtered = MOCK_QUESTIONS.filter(
        (q) => q.banca?.toLowerCase() === targetBanca?.toLowerCase()
      );
      const fallbackPool = MOCK_QUESTIONS;
      const combined = (filtered.length >= 3 ? filtered : [...filtered, ...fallbackPool]).slice(0, 3);
      setQuestions(combined);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setIsRevealed(false);
      setUserScore(0);
      setIsFinished(false);
      setTimeSpentSeconds(0);
      setStartTime(Date.now());
      analytics.track('flash_challenge_started', { targetBanca });
    }
  }, [isOpen, targetBanca]);

  // Cronômetro da questão atual
  useEffect(() => {
    if (!isOpen || isFinished || isRevealed) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished, isRevealed, currentIndex]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (optionId: string) => {
    if (isRevealed) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isRevealed) return;

    const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = Boolean(chosenOption?.isCorrect);

    if (isCorrect) {
      setUserScore((prev) => prev + 1);
    }

    setIsRevealed(true);

    // Registra tentativa no sistema do Argus
    if (onRecordAttempt) {
      const attempt: QuestionAttempt = {
        id: `att_flash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        questionId: currentQ.id,
        selectedOptionId,
        isCorrect,
        timeSpentSeconds,
        answeredAt: new Date().toISOString(),
        diagnostic: {
          errorType: isCorrect ? undefined : 'pegadinha_banca',
          confidenceLevel: 'alta',
          feedback: isCorrect 
            ? 'Você neutralizou com precisão o distrator psicométrico armado pela banca.' 
            : chosenOption?.distractorReason || currentQ.cognitiveAnalysis?.commonTrap || 'Atenção aos distratores.',
          suggestedReviewTopic: currentQ.topicName,
          flashcardFront: currentQ.statement.slice(0, 140) + '...',
          flashcardBack: currentQ.explanation,
          actionableAdvice: currentQ.cognitiveAnalysis?.commonTrap || 'Revise a letra da lei.'
        }
      };
      onRecordAttempt(attempt);
    }

    // Marca no storage que o aluno executou o desafio
    try {
      localStorage.setItem('argus_d0_challenge_completed', 'true');
      localStorage.setItem('argus_last_active_timestamp', Date.now().toString());
    } catch {}
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      analytics.track('flash_challenge_completed', {
        score: userScore,
        total: questions.length,
        targetBanca
      });
      // Dispara confetes dopaminérgicos de vitória
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsRevealed(false);
      setTimeSpentSeconds(0);
      setStartTime(Date.now());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header com Gradiente Temático */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  D0 • Retenção Instantânea
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                  Desafio Relâmpago das 3 Pegadinhas
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white/80 hover:text-white transition-colors"
              title="Fechar desafio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-2 text-xs text-blue-100 leading-relaxed max-w-xl">
            Descubra em 2 minutos se você cairia nas 3 armadilhas psicométricas que a banca <strong>{targetBanca}</strong> costuma usar para eliminar candidatos ao cargo de <strong>{targetRole}</strong>.
          </p>

          {/* Stepper Visual de 3 Etapas */}
          <div className="mt-4 flex items-center gap-2">
            {[0, 1, 2].map((idx) => {
              const isActive = idx === currentIndex && !isFinished;
              const isPast = idx < currentIndex || isFinished;
              return (
                <div key={idx} className="flex-1 flex flex-col gap-1">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    isPast 
                      ? 'bg-amber-300' 
                      : isActive 
                      ? 'bg-white shadow-sm' 
                      : 'bg-white/25'
                  }`} />
                  <span className="text-[10px] font-mono text-blue-200 text-center font-bold">
                    Pegadinha {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corpo: Questão Interativa */}
        {!isFinished ? (
          <div className="p-5 sm:p-7 space-y-5">
            {/* Tag da Disciplina & Tempo */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                {currentQ.subjectName} • {currentQ.banca}
              </span>
              <span className="font-mono text-slate-400">
                ⏱️ {timeSpentSeconds}s
              </span>
            </div>

            {/* Enunciado */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
              <p className="whitespace-pre-line">{currentQ.statement}</p>
            </div>

            {/* Alternativas */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                let optionStyles = 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/80';

                if (isRevealed) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-md shadow-emerald-500/10';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-500 bg-rose-50/90 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 shadow-md shadow-rose-500/10';
                  } else {
                    optionStyles = 'opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
                  }
                } else if (isSelected) {
                  optionStyles = 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isRevealed}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyles}`}
                  >
                    <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Painel do Desmonte da Pegadinha pós-revelação */}
            {isRevealed && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 animate-fade-in space-y-3">
                <div className="flex items-center gap-2 font-black text-sm">
                  {currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      🛡️ Visão Blindada! Você escapou do distrator da banca.
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      🎯 Armadilha Disparada! Você caiu no distrator da banca.
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p><strong>Por que a banca fez isso:</strong> {currentQ.cognitiveAnalysis?.commonTrap || currentQ.explanation}</p>
                </div>

                {currentQ.lawArticles && currentQ.lawArticles.length > 0 && (
                  <div className="pt-2 border-t border-indigo-100 dark:border-white/5 flex items-center gap-2 text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span>Fundamento: {currentQ.lawArticles.join(' • ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rodapé de Ação */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {!isRevealed ? 'Selecione uma opção para testar sua visão' : 'Pegadinha desarmada pela IA'}
              </span>

              {!isRevealed ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Confirmar Resposta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Ver Diagnóstico Final' : 'Próxima Pegadinha'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Tela de Fechamento / Diagnóstico D0 Completo */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-cyan-500/20 animate-bounce">
              <Flame className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-cyan-400">
                Diagnóstico de Retenção D0 Concluído
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {userScore === 3 ? '🎉 Blindagem Onisciente 100%!' : userScore >= 1 ? '⚡ Diagnóstico Concluído com Sucesso!' : '⚠️ Atenção Máxima às Armadilhas!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
                Parabéns, <strong>{warName}</strong>! Você testou sua visão contra 3 armadilhas da banca <strong>{targetBanca}</strong>.
              </p>
            </div>

            {/* Cartões de Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Acertos</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {userScore} / 3 <span className="text-xs text-slate-500 font-normal">({Math.round((userScore / 3) * 100)}%)</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Ofensiva D1
                </span>
                <p className="text-xl font-black text-amber-900 dark:text-amber-300 mt-0.5">
                  1 Dia Ativo
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40">
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> Modo Revanche
                </span>
                <p className="text-xl font-black text-indigo-900 dark:text-indigo-300 mt-0.5">
                  {3 - userScore} Armadilhas
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left space-y-1.5 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Seu Próximo Passo na Metodologia Argus:
              </p>
              <p>
                As questões que você errou foram catalogadas no seu <strong>Caderno de Erros</strong> com o artigo de lei correspondente. Sua primeira revanche está agendada para amanhã para consolidar a fixação no algoritmo SM-2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {3 - userScore > 0 && onOpenMistakes && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMistakes();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Ver Erros no Modo Revanche</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ir para o Painel de Estudos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashChallengeModal;
