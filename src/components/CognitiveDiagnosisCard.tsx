'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Scale, 
  Plus, 
  Check, 
  HelpCircle,
  Lightbulb,
  Share2,
  Bookmark
} from 'lucide-react';
import { Question, ErrorType, Flashcard } from '@/lib/types';
import confetti from 'canvas-confetti';

interface CognitiveDiagnosisCardProps {
  question: Question;
  selectedOptionId: string;
  isCorrect: boolean;
  confidence: 'alta' | 'media' | 'chute';
  onAddFlashcard: (flashcard: Flashcard) => void;
  onNextQuestion: () => void;
}

export const CognitiveDiagnosisCard: React.FC<CognitiveDiagnosisCardProps> = ({
  question,
  selectedOptionId,
  isCorrect,
  confidence,
  onAddFlashcard,
  onNextQuestion
}) => {
  const [flashcardAdded, setFlashcardAdded] = useState(false);

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const correctOption = question.options.find((o) => o.isCorrect);

  // Determine the cognitive error type
  let errorType: ErrorType = 'pegadinha_banca';
  let errorLabel = 'Distrator Semântico da Banca (Pegadinha Técnica)';
  let errorDesc = 'A banca alterou sutilmente a redação da norma ou jurisprudência para induzir o candidato ao erro.';

  if (!isCorrect) {
    if (selectedOption?.distractorReason?.toLowerCase().includes('desatualização') || selectedOption?.distractorReason?.toLowerCase().includes('conceito')) {
      errorType = 'lacuna_teorica';
      errorLabel = 'Lacuna Teórica ou Doutrinária';
      errorDesc = 'Identificada deficiência na base conceitual ou na atualização legislativa e jurisprudencial do tema.';
    } else if (confidence === 'alta') {
      errorType = 'pegadinha_banca';
      errorLabel = 'Excesso de Confiança em Distrator Sofisticado';
      errorDesc = 'Você respondeu com convicção alta, mas o examinador construiu uma alternativa plausível com inversão sutil.';
    } else if (confidence === 'chute') {
      errorType = 'curva_esquecimento';
      errorLabel = 'Decaimento de Memória (Curva do Esquecimento)';
      errorDesc = 'A retenção do tema decaiu com o tempo. É necessária uma revisão ativa programada para reconsolidar o conceito.';
    } else {
      errorType = 'leitura_apressada';
      errorLabel = 'Desatenção ou Interpretação do Enunciado';
      errorDesc = 'O comando da questão continha ressalvas determinantes (como exceções ou prazos) que passaram despercebidas.';
    }
  }

  const handleCreateFlashcard = () => {
    const newFlashcard: Flashcard = {
      id: `fc-${Date.now()}`,
      subjectName: question.subjectName,
      topicName: question.topicName,
      front: `[${question.banca} / ${question.subjectName}]\n${question.statement.slice(0, 180)}...`,
      back: `Gabarito Correto: ${correctOption?.text}\n\nFundamento: ${question.explanation.slice(0, 200)}...\n\nBase Legal: ${question.lawArticles.join(', ')}`,
      errorOriginQuestionId: question.id,
      nextReviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5
    };

    onAddFlashcard(newFlashcard);
    setFlashcardAdded(true);

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch {}
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 glow-brand animate-fadeIn mt-6">
      
      {/* Header Result Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-300 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? '✓ RESPOSTA CORRETA' : '✗ RESPOSTA INCORRETA'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                Confiança: {confidence.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isCorrect 
                ? 'Excelente domínio conceitual! Sua resposta fortaleceu o índice de acerto deste tema no edital.' 
                : 'Diagnóstico cognitivo processado: compreenda o mecanismo da questão para não repetir o erro no dia da prova.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNextQuestion}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Próxima Questão</span>
          <span>→</span>
        </button>
      </div>

      {/* AI Cognitive Breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Cognitive Diagnosis & Trap */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Diagnostic Badge */}
          {!isCorrect && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Diagnóstico Cognitivo do Erro</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{errorLabel}</p>
              <p className="text-xs text-rose-200 mt-0.5">{errorDesc}</p>
              
              {selectedOption?.distractorReason && (
                <div className="mt-3 p-3 rounded-xl bg-dark-bg/60 border border-rose-500/20 text-xs text-slate-700 dark:text-slate-200">
                  <strong className="text-rose-300">Mecanismo do distrator explorado pela banca: </strong>
                  {selectedOption.distractorReason}
                </div>
              )}
            </div>
          )}

          {/* Explanation / Fundamentação */}
          <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/90 border border-slate-200 dark:border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Fundamentação Jurídica & Doutrinária</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {question.explanation}
            </p>
          </div>

          {/* Law Articles Citations */}
          {question.lawArticles && question.lawArticles.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface/90 border border-slate-200 dark:border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
                <Scale className="w-4 h-4" />
                <span>Artigos de Lei & Jurisprudência Correlata</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {question.lawArticles.map((art, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                    📜 {art}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Flashcard & Banca Insights */}
        <div className="space-y-4">
          
          {/* Banca Tendency Box */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Padrão da Banca {question.banca}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {question.cognitiveAnalysis.bancaTendency}
            </p>
            <div className="mt-3 pt-3 border-t border-indigo-500/20 text-[11px] text-indigo-200">
              <strong>Conceito-Chave:</strong> {question.cognitiveAnalysis.keyConcept}
            </div>
          </div>

          {/* 1-Click Flashcard Creator */}
          <div className="p-4 rounded-2xl bg-white dark:bg-dark-card/90 border border-slate-300 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Fixação por Repetição Espaçada (SRS)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Crie um card de retenção ativa com este fundamento para programar sua revisão nas próximas 24 horas.
            </p>

            {flashcardAdded ? (
              <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Item Adicionado ao Deck de Revisão!</span>
              </div>
            ) : (
              <button
                onClick={handleCreateFlashcard}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Deck de Flashcards</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
