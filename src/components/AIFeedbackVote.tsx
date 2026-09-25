'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check, Send, Sparkles } from 'lucide-react';

export interface AIFeedbackVoteProps {
  questionId: string;
  banca?: string;
  subject?: string;
  className?: string;
  onVoteSubmitted?: (vote: 'up' | 'down', details?: { tags: string[]; comment: string }) => void;
}

const COMMON_REASONS = [
  'Faltou citar artigo/lei',
  'Jurisprudência desatualizada',
  'Pegadinha mal explicada',
  'Texto prolixo / confuso',
  'Gabarito controverso'
];

export const AIFeedbackVote: React.FC<AIFeedbackVoteProps> = ({
  questionId,
  banca = 'Geral',
  subject = 'Direito',
  className = '',
  onVoteSubmitted
}) => {
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Carregar voto anterior se houver
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aprovalens_ai_feedback_votes');
      if (stored) {
        const votes = JSON.parse(stored);
        const existing = votes.find((v: any) => v.questionId === questionId);
        if (existing) {
          setCurrentVote(existing.vote);
          setIsSubmitted(true);
        }
      }
    } catch {}
  }, [questionId]);

  const saveVoteLocally = (vote: 'up' | 'down', tags: string[] = [], textComment: string = '') => {
    try {
      const stored = localStorage.getItem('aprovalens_ai_feedback_votes');
      const votes: any[] = stored ? JSON.parse(stored) : [];
      const updated = votes.filter((v: any) => v.questionId !== questionId);
      updated.push({
        id: `vote-${Date.now()}`,
        questionId,
        banca,
        subject,
        vote,
        tags,
        comment: textComment,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('aprovalens_ai_feedback_votes', JSON.stringify(updated));
    } catch (err) {
      console.warn('Erro ao salvar voto de feedback local:', err);
    }
  };

  const handleThumbUp = () => {
    setCurrentVote('up');
    setIsSubmitted(true);
    setShowFeedbackForm(false);
    saveVoteLocally('up');
    if (onVoteSubmitted) onVoteSubmitted('up');
  };

  const handleThumbDown = () => {
    setCurrentVote('down');
    setShowFeedbackForm(true);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitNegativeDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setShowFeedbackForm(false);
    saveVoteLocally('down', selectedTags, comment);
    if (onVoteSubmitted) onVoteSubmitted('down', { tags: selectedTags, comment });
  };

  return (
    <div
      className={`rounded-2xl border transition-all p-3.5 sm:p-4 text-xs ${
        currentVote === 'up'
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
          : currentVote === 'down' && isSubmitted
          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30'
          : 'bg-slate-50/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Esta explicação da IA eliminou sua dúvida?
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block sm:inline sm:ml-1.5 font-medium">
              (Ciclo de feedback transacional)
            </span>
          </div>
        </div>

        {/* Botões de Voto */}
        {!isSubmitted ? (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleThumbUp}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                currentVote === 'up'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-dark-card border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Sim, ajudou</span>
            </button>
            <button
              type="button"
              onClick={handleThumbDown}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                currentVote === 'down'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white dark:bg-dark-card border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Não, faltou algo</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-bold self-end sm:self-auto shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">
              {currentVote === 'up'
                ? 'Obrigado! Feedback computado para calibração.'
                : 'Obrigado! Enviado para auditoria pedagógica.'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setShowFeedbackForm(false);
              }}
              className="text-[10px] text-indigo-500 hover:underline ml-1 font-semibold"
            >
              Alterar
            </button>
          </div>
        )}
      </div>

      {/* Formulário de Motivo se votou 'Não' */}
      {showFeedbackForm && !isSubmitted && (
        <form onSubmit={handleSubmitNegativeDetails} className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5 animate-fadeIn">
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            O que faltou ou ficou confuso na resposta da IA?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_REASONS.map((reason) => {
              const active = selectedTags.includes(reason);
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleToggleTag(reason)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    active
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-400 font-bold'
                      : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comentário opcional (ex: a lei citada foi revogada...)"
              className="flex-1 bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <Send className="w-3 h-3" />
              <span>Enviar</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
