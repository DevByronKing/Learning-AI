'use client';

import React from 'react';
import { Clock, HelpCircle, CheckCircle2, Lock, ArrowRight, Play } from 'lucide-react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

export type LessonStatus = 'completed' | 'in_progress' | 'locked';

export interface LessonCardProps {
  title: string;
  subject: string;
  durationMinutes: number;
  questionsCount: number;
  progressPercent?: number;
  status: LessonStatus;
  onClick?: () => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  subject,
  durationMinutes,
  questionsCount,
  progressPercent = 0,
  status,
  onClick,
  className = '',
}) => {
  const isLocked = status === 'locked';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLocked) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const statusBadge = {
    completed: <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>Concluída</Badge>,
    in_progress: <Badge variant="accent" size="sm" hasDot>Em Andamento</Badge>,
    locked: <Badge variant="neutral" size="sm" icon={<Lock className="w-3 h-3" />}>Bloqueada</Badge>,
  }[status];

  return (
    <div
      role={isLocked ? 'article' : 'button'}
      tabIndex={isLocked ? undefined : 0}
      aria-disabled={isLocked ? 'true' : 'false'}
      onClick={isLocked ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={`
        group relative rounded-[var(--radius-lg)] p-5 sm:p-6
        bg-[var(--surface-card)] text-[var(--text-primary)]
        border border-[var(--border-subtle)]
        transition-all duration-200 font-sans flex flex-col justify-between
        ${isLocked 
          ? 'opacity-60 cursor-not-allowed bg-[var(--surface-elevated)]/50' 
          : 'cursor-pointer hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5'
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]
        focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)]
        ${className}
      `}
    >
      <div className="space-y-3">
        {/* Top Header Row with Subject and Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[var(--brand-primary)] uppercase tracking-wider">
            {subject}
          </span>
          {statusBadge}
        </div>

        {/* Lesson Title */}
        <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug">
          {title}
        </h4>

        {/* Metadata items */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] pt-1">
          <div className="flex items-center gap-1.5" title={`Duração estimada: ${durationMinutes} minutos`}>
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <span>{durationMinutes} min</span>
          </div>

          <div className="flex items-center gap-1.5" title={`${questionsCount} questões associadas`}>
            <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
            <span>{questionsCount} questões</span>
          </div>
        </div>
      </div>

      {/* Footer Area: Progress or Action */}
      <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        {status === 'in_progress' ? (
          <div className="w-full">
            <ProgressBar value={progressPercent} label="Progresso do Módulo" size="sm" isAnimated={false} />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-xs font-bold">
            <span className={status === 'completed' ? 'text-[var(--brand-accent)]' : 'text-[var(--text-muted)]'}>
              {status === 'completed' ? 'Revisar Conteúdo' : isLocked ? 'Requer módulo anterior' : 'Iniciar Aula'}
            </span>
            <div className={`
              w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center transition-transform
              ${status === 'completed' 
                ? 'bg-[var(--brand-accent-muted)] text-[var(--brand-accent)]' 
                : isLocked 
                ? 'bg-[var(--surface-elevated)] text-[var(--text-muted)]' 
                : 'bg-[var(--brand-primary-muted)] text-[var(--brand-primary)] group-hover:translate-x-1'
              }
            `}>
              {isLocked ? (
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              ) : status === 'completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
