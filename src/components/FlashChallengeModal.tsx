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
  Target,
  CreditCard,
  Check,
  BrainCircuit,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, QuestionAttempt, MistakeEntry } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { analytics } from '@/lib/analytics';
import { POPULAR_TARGETS, PopularTarget } from './onboarding/onboardingData';

interface FlashChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBanca: string;
  targetRole?: string;
  warName?: string;
  onRecordAttempt?: (attempt: QuestionAttempt) => void;
  onOpenMistakes?: () => void;
  onOpenPricing?: () => void;
  onSelectTarget?: (examTitle: string, banca: string) => void;
}

export const FlashChallengeModal: React.FC<FlashChallengeModalProps> = ({
  isOpen,
  onClose,
  targetBanca: initialBanca,
  targetRole: initialRole = 'Carreiras Públicas / OAB',
  warName = 'Concurseiro',
  onRecordAttempt,
  onOpenMistakes,
  onOpenPricing,
  onSelectTarget
}) => {
  // Estado de fase do funil: 'target' (Micro-Compromisso) -> 'quiz' (Teste de Fogo) -> 'completed' (Choque Cognitivo & Paywall Suave)
  const [phase, setPhase] = useState<'target' | 'quiz' | 'completed'>('quiz');
  const [selectedBanca, setSelectedBanca] = useState(initialBanca || 'Cebraspe');
  const [selectedRole, setSelectedRole] = useState(initialRole || 'OAB & Carreiras Públicas');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Inicialização e filtro de questões pela banca selecionada
  useEffect(() => {
    if (isOpen) {
      const activeBanca = selectedBanca || initialBanca || 'Cebraspe';
      const filtered = MOCK_QUESTIONS.filter(
        (q) => q.banca?.toLowerCase().trim() === activeBanca?.toLowerCase().trim()
      );
      const fallbackPool = MOCK_QUESTIONS;
      // 3 a 5 questões clássicas com pegadinhas históricas da banca
      const combined = (filtered.length >= 3 ? filtered : [...filtered, ...fallbackPool]).slice(0, 3);
      
      setQuestions(combined);
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setIsRevealed(false);
      setUserScore(0);
      setTimeSpentSeconds(0);
      
      // Se não havia banca definida previamente, começa no Micro-Compromisso
      if (!initialBanca || initialBanca === 'Banca') {
        setPhase('target');
      } else {
        setPhase('quiz');
      }

      analytics.track('flash_challenge_started', { targetBanca: activeBanca });
    }
  }, [isOpen, selectedBanca, initialBanca]);

  // Cronômetro da questão atual
  useEffect(() => {
    if (!isOpen || phase !== 'quiz' || isRevealed) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, phase, isRevealed, currentIndex]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length || 3;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Escolha do concurso em alta (Micro-Compromisso: 02)
  const handlePickTarget = (target: PopularTarget) => {
    setSelectedBanca(target.banca);
    setSelectedRole(target.title);
    if (onSelectTarget) {
      onSelectTarget(target.title, target.banca);
    }
    setPhase('quiz');
    analytics.track('micro_commitment_selected', {
      exam: target.title,
      banca: target.banca,
      career: target.career
    });
  };

  const handleSelectOption = (optionId: string) => {
    if (isRevealed) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isRevealed || !currentQ) return;

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
            ? 'Você neutralizou com precisão o distrator psicológico armado pela banca.' 
            : chosenOption?.distractorReason || currentQ.cognitiveAnalysis?.commonTrap || 'Atenção ao distrator armado pela banca.',
          suggestedReviewTopic: currentQ.topicName,
          flashcardFront: currentQ.statement.slice(0, 140) + '...',
          flashcardBack: currentQ.explanation,
          actionableAdvice: currentQ.cognitiveAnalysis?.commonTrap || 'Revise a letra da lei.'
        }
      };
      onRecordAttempt(attempt);
    }

    try {
      localStorage.setItem('argus_d0_challenge_completed', 'true');
      localStorage.setItem('argus_last_active_timestamp', Date.now().toString());
    } catch {}
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setPhase('completed');
      analytics.track('flash_challenge_completed', {
        score: userScore,
        total: questions.length,
        targetBanca: selectedBanca
      });
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsRevealed(false);
      setTimeSpentSeconds(0);
    }
  };

  const handleOpenPaywall = () => {
    onClose();
    if (onOpenPricing) {
      onOpenPricing();
    } else {
      window.dispatchEvent(new CustomEvent('open-pricing-modal'));
    }
    analytics.track('soft_paywall_cta_clicked', {
      source: 'flash_challenge_d0',
      mistakesToFix: totalQuestions - userScore,
      targetBanca: selectedBanca
    });
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
                  Desafio Relâmpago das Pegadinhas
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Fechar desafio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-2 text-xs text-blue-100 leading-relaxed max-w-xl">
            {phase === 'target' 
              ? 'Passo 1 de 2: Escolha seu concurso ou exame em alta para carregar os distratores reais da banca examinadora.'
              : `Descubra se você cairia nas pegadinhas psicométricas que a banca ${selectedBanca} costuma usar para eliminar candidatos ao cargo de ${selectedRole}.`}
          </p>

          {/* Stepper Visual de Etapas */}
          {phase === 'quiz' && (
            <div className="mt-4 flex items-center gap-2">
              {[0, 1, 2].map((idx) => {
                const isActive = idx === currentIndex;
                const isPast = idx < currentIndex;
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
          )}
        </div>

        {/* ========================================================================= */}
        {/* ETAPA 02: MICRO-COMPROMISSO (SELEÇÃO DE CONCURSO EM ALTA & BANCA FOCO)    */}
        {/* ========================================================================= */}
        {phase === 'target' && (
          <div className="p-5 sm:p-7 space-y-4 animate-fadeIn">
            <div className="text-center space-y-1 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                Micro-Compromisso Instantâneo
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Qual certame você está disputando agora?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Selecione um edital em alta para disparar o Teste de Fogo com pegadinhas históricas calibradas:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {POPULAR_TARGETS.map((item) => {
                const isSelected = selectedRole === item.title;
                return (
                  <button
                    key={item.title}
                    onClick={() => handlePickTarget(item)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/30' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 shrink-0">
                          {item.banca}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-tight">
                        {item.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Sem cadastros burocráticos • Acesso direto
              </span>
              <button
                onClick={() => setPhase('quiz')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar com {selectedBanca}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 03 & 04: O TESTE DE FOGO & O CHOQUE COGNITIVO                       */}
        {/* ========================================================================= */}
        {phase === 'quiz' && currentQ && (
          <div className="p-5 sm:p-7 space-y-5 animate-fadeIn">
            {/* Tag da Disciplina, Banca & Cronômetro */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  {currentQ.subjectName} • {currentQ.banca || selectedBanca}
                </span>
                <button
                  onClick={() => setPhase('target')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  title="Alterar banca examinadora"
                >
                  (Trocar Banca)
                </button>
              </div>
              <span className="font-mono text-slate-400 font-bold">
                ⏱️ {timeSpentSeconds}s
              </span>
            </div>

            {/* Enunciado da Pegadinha */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
              <p className="whitespace-pre-line">{currentQ.statement}</p>
            </div>

            {/* Alternativas de Resposta */}
            <div className="space-y-2">
              {currentQ.options.map((opt, optIndex) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.isCorrect;

                let optionStyles = 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800/80';

                if (isRevealed) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-md shadow-emerald-500/10 font-bold';
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
                    className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${optionStyles}`}
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

            {/* PAINEL DO CHOQUE COGNITIVO (ETAPA 04: DISTRATOR PSICOLÓGICO DA BANCA) */}
            {isRevealed && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/90 dark:from-slate-800 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-500/30 animate-fade-in space-y-2.5">
                <div className="flex items-center gap-2 font-black text-sm">
                  {currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      🛡️ Visão Blindada! Você escapou da pegadinha da banca.
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      🎯 Choque Cognitivo! Você caiu no distrator armado pela banca.
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
                  <p className="font-extrabold text-blue-900 dark:text-cyan-300">
                    O Distrator Psicológico da Banca:
                  </p>
                  <p>{currentQ.cognitiveAnalysis?.commonTrap || currentQ.explanation}</p>
                </div>

                {currentQ.lawArticles && currentQ.lawArticles.length > 0 && (
                  <div className="pt-2 border-t border-indigo-100 dark:border-white/5 flex items-center gap-2 text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span>Fundamento: {currentQ.lawArticles.join(' • ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rodapé de Ação do Teste */}
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
        )}

        {/* ========================================================================= */}
        {/* ETAPA 05: PAYWALL SUAVE (REPETIÇÃO ESPAÇADA SM-2 & CHECKOUT 1-CLICK)      */}
        {/* ========================================================================= */}
        {phase === 'completed' && (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-cyan-500/20 animate-bounce">
              <Flame className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                Diagnóstico de Pegadinhas Concluído
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                {userScore === 3 ? '🎉 Visão Blindada! 100% de Acertos!' : userScore >= 1 ? '⚡ Pontos Cegos Mapeados com Sucesso!' : '⚠️ Alerta de Vulnerabilidade Crítica!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                Parabéns, <strong>{warName}</strong>! Você testou sua visão contra as pegadinhas da banca <strong>{selectedBanca}</strong> para <strong>{selectedRole}</strong>.
              </p>
            </div>

            {/* Cartões de Status */}
            <div className="grid grid-cols-3 gap-2.5 text-left">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Acertos</span>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {userScore} / {totalQuestions}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Ofensiva
                </span>
                <p className="text-lg font-black text-amber-900 dark:text-amber-300 mt-0.5">
                  1º Dia Ativo
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40">
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Ponto Cego
                </span>
                <p className="text-lg font-black text-indigo-900 dark:text-indigo-300 mt-0.5">
                  {totalQuestions - userScore} Armadilhas
                </p>
              </div>
            </div>

            {/* O PAYWALL SUAVE (PROPOSTA EXATA DE VALOR) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-800/90 dark:via-indigo-950/30 dark:to-slate-900 border-2 border-indigo-400 dark:border-indigo-500/40 text-left space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-cyan-300 font-black text-xs uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Bloqueio Permanente da Reprovação</span>
              </div>

              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                "Gostaria de salvar este ponto cego no seu Caderno de Erros com Repetição Espaçada e garantir que não errará na prova?"
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                As armadilhas que você errou foram catalogadas com o artigo de lei correspondente. No plano PRO, a IA programa sua primeira revanche no instante exato da curva de esquecimento para consolidar a fixação no algoritmo SM-2.
              </p>

              {/* Botões do Paywall Suave */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleOpenPaywall}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-98"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>SIM, SALVAR PONTO CEGO E ATIVAR PRO</span>
                </button>

                {onOpenMistakes && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMistakes();
                    }}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Ver Erros Grátis</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline cursor-pointer"
              >
                Continuar no Plano Aspirante (Gratuito) e ir para o painel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashChallengeModal;
