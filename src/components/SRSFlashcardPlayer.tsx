'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Check, 
  X, 
  Clock, 
  Download, 
  Plus, 
  BookOpen, 
  Scale, 
  BrainCircuit, 
  Layers, 
  ArrowRight, 
  ChevronLeft,
  Flame,
  Award,
  Filter
} from 'lucide-react';
import { Flashcard } from '@/lib/types';
import confetti from 'canvas-confetti';

interface SRSFlashcardPlayerProps {
  flashcards: Flashcard[];
  onReviewCard: (id: string, rating: 'facil' | 'bom' | 'dificil' | 'errei') => void;
  onAddNewCard?: (card: Flashcard) => void;
  onClose?: () => void;
}

export const SRSFlashcardPlayer: React.FC<SRSFlashcardPlayerProps> = ({
  flashcards,
  onReviewCard,
  onAddNewCard,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'reviewing' | 'complete' | 'create'>('overview');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('todas');
  const [sessionQueue, setSessionQueue] = useState<Flashcard[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    errei: 0,
    dificil: 0,
    bom: 0,
    facil: 0
  });

  // Create card form state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSubject, setNewSubject] = useState('Direito Constitucional');
  const [newTopic, setNewTopic] = useState('Direitos e Garantias Fundamentais');

  // Subjects list
  const subjects = Array.from(new Set(flashcards.map((fc) => fc.subjectName)));

  // Filtered cards
  const filteredCards = selectedSubjectFilter === 'todas'
    ? flashcards
    : flashcards.filter((fc) => fc.subjectName === selectedSubjectFilter);

  // Cards due today
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCards = filteredCards.filter((fc) => fc.nextReviewDate <= todayStr || fc.repetitions === 0);
  const learningCards = filteredCards.filter((fc) => fc.repetitions > 0 && fc.repetitions < 4);
  const masteredCards = filteredCards.filter((fc) => fc.repetitions >= 4);

  // Start study session
  const handleStartSession = (cardsToReview: Flashcard[]) => {
    if (cardsToReview.length === 0) return;
    setSessionQueue([...cardsToReview]);
    setCurrentQueueIndex(0);
    setIsFlipped(false);
    setSessionStats({
      reviewed: 0,
      errei: 0,
      dificil: 0,
      bom: 0,
      facil: 0
    });
    setViewMode('reviewing');
  };

  const currentCard: Flashcard | undefined = sessionQueue[currentQueueIndex];

  // Rating and SM-2 Progression
  const handleRate = useCallback((rating: 'facil' | 'bom' | 'dificil' | 'errei') => {
    if (!currentCard) return;

    onReviewCard(currentCard.id, rating);

    setSessionStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      [rating]: prev[rating] + 1
    }));

    setIsFlipped(false);

    if (currentQueueIndex < sessionQueue.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
    } else {
      setViewMode('complete');
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [currentCard, currentQueueIndex, onReviewCard, sessionQueue.length]);

  // Keyboard Shortcuts (Space to flip, 1 to 4 to rate)
  useEffect(() => {
    if (viewMode !== 'reviewing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleRate('errei');
        } else if (e.key === '2') {
          e.preventDefault();
          handleRate('dificil');
        } else if (e.key === '3') {
          e.preventDefault();
          handleRate('bom');
        } else if (e.key === '4') {
          e.preventDefault();
          handleRate('facil');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isFlipped, handleRate]);

  // Export to Anki (.txt/.tsv)
  const handleExportToAnki = () => {
    if (flashcards.length === 0) return;

    const header = `#separator:tab\n#html:true\n#tags column:3\n`;
    const rows = flashcards.map((fc) => {
      // Clean up text and replace tabs with spaces
      const frontSanitized = fc.front.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      const backSanitized = fc.back.replace(/\t/g, ' ').replace(/\n/g, '<br>');
      const tags = `${fc.subjectName.replace(/\s+/g, '_')} ${fc.topicName.replace(/\s+/g, '_')} LearningAI_SRS`;
      return `${frontSanitized}\t${backSanitized}\t${tags}`;
    }).join('\n');

    const fullContent = header + rows;
    const blob = new Blob([fullContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LearningAI_Anki_Deck_${todayStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Create manual card
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim() || !onAddNewCard) return;

    const createdCard: Flashcard = {
      id: `fc-user-${Date.now()}`,
      subjectName: newSubject,
      topicName: newTopic,
      front: newFront.trim(),
      back: newBack.trim(),
      nextReviewDate: todayStr,
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5
    };

    onAddNewCard(createdCard);
    setNewFront('');
    setNewBack('');
    setViewMode('overview');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-300 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              Revisão Ativa SRS & Algoritmo SM-2
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Repetição Espaçada de Ebbinghaus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Deck de Flashcards & Memorização de Longo Prazo
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportToAnki}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Exportar todos os flashcards em arquivo formatado para Anki Desktop e AnkiMobile"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Exportar para Anki</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white text-xs font-bold transition-all"
            >
              Fechar
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: DECK OVERVIEW */}
      {viewMode === 'overview' && (
        <div className="space-y-8 mt-6">
          
          {/* Deck Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 glow-brand flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Para Revisar Hoje
                </span>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {dueCards.length}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Cards no ponto ideal da curva</span>
              </span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-300 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Em Consolidação
                </span>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {learningCards.length}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Intervalo de 2 a 10 dias</span>
              </span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-300 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Dominados
                </span>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {masteredCards.length}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" />
                <span>Fixados na memória permanente</span>
              </span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-slate-300 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Total no Deck
                </span>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {flashcards.length}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Criados via simulador e manuais</span>
              </span>
            </div>

          </div>

          {/* Filter and Actions Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-300 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            
            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar por Matéria:</span>
              </div>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-input text-xs text-slate-900 dark:text-white bg-white dark:bg-dark-surface font-medium cursor-pointer"
              >
                <option value="todas">Todas as Matérias ({flashcards.length})</option>
                {subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('create')}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Flashcard</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartSession(dueCards.length > 0 ? dueCards : filteredCards)}
                disabled={filteredCards.length === 0}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-40 text-white font-extrabold text-xs tracking-wider transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {dueCards.length > 0
                    ? `Iniciar Revisão de Hoje (${dueCards.length})`
                    : `Praticar Todos os Cards (${filteredCards.length})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Cards List Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cartões Cadastrados no Deck ({filteredCards.length}):</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCards.map((card) => {
                const isDue = card.nextReviewDate <= todayStr;
                return (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold text-[10px]">
                          {card.subjectName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isDue ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {isDue ? 'Revisar Hoje' : `Em ${card.intervalDays}d`}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 font-medium line-clamp-2 leading-relaxed">
                        {card.front}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Repetições: {card.repetitions}x</span>
                      <span>Facilidade: {(card.easeFactor || 2.5).toFixed(1)}x</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW MODE 2: ACTIVE STUDY SESSION (FLOW STATE) */}
      {viewMode === 'reviewing' && currentCard && (
        <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-300 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="hover:text-slate-900 dark:text-white flex items-center gap-1 font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sair da Sessão</span>
            </button>

            <div className="font-mono font-bold text-slate-600 dark:text-slate-300">
              Card {currentQueueIndex + 1} de {sessionQueue.length}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-indigo-300">
              <span className="hidden sm:inline">Dica: </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-700 text-[10px]">Espaço</kbd> vira o card
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentQueueIndex + 1) / sessionQueue.length) * 100}%` }}
            />
          </div>

          {/* The Flashcard (Interactive 3D Flip Card - <= 250ms) */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[420px] w-full [perspective:1200px] select-none group"
          >
            <div
              className="relative w-full h-full min-h-[420px] rounded-3xl transition-transform duration-200 [transform-style:preserve-3d]"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* FRONT FACE */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/30 hover:border-indigo-400/50 glow-brand flex flex-col justify-between bg-white/90 dark:bg-dark-card/90 shadow-2xl">
                {/* Top metadata */}
                <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 font-bold border border-indigo-500/30">
                      {currentCard.subjectName}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {currentCard.topicName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-180 transition-transform duration-300" />
                    <span>FRENTE</span>
                  </span>
                </div>

                {/* Question content */}
                <div className="my-auto py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-black">
                      Pergunta / Enunciado Ativo
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line font-sans">
                    {currentCard.front}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">
                    Invoque a resposta na mente antes de virar. Clique no cartão ou pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">Espaço</kbd>.
                  </p>
                </div>

                {/* Bottom hint */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Clique no card ou aperte Espaço para virar (Flip 3D)</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 hover:border-emerald-400/50 glow-brand flex flex-col justify-between bg-white/95 dark:bg-[#0f141c] shadow-2xl">
                {/* Top metadata */}
                <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                      {currentCard.subjectName}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Gabarito Comentado
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" />
                    <span>VERSO</span>
                  </span>
                </div>

                {/* Answer content */}
                <div className="my-auto py-4 space-y-3">
                  <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Resposta & Fundamentação Jurídica</span>
                  </span>
                  <div className="text-sm sm:text-base text-slate-800 dark:text-zinc-200 font-serif leading-[1.6] whitespace-pre-line bg-slate-50 dark:bg-[#151922] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                    {currentCard.back}
                  </div>
                </div>

                {/* Bottom prompt indicator */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Selecione o nível de esforço cognitivo abaixo [1 - 4]:
                </div>
              </div>
            </div>
          </div>

          {/* SM-2 Rating Controls (Active when flipped) */}
          {isFlipped ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
              
              <button
                type="button"
                onClick={() => handleRate('errei')}
                className="p-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-400 font-bold text-xs transition-all flex flex-col items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-black/40 text-white text-[11px] font-mono font-bold">[1]</kbd>
                  <span className="text-sm font-black">Errei</span>
                </div>
                <span className="text-[11px] text-rose-400 font-semibold">Repetir em 1m</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate('dificil')}
                className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-500 dark:text-amber-400 font-bold text-xs transition-all flex flex-col items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-black/40 text-white text-[11px] font-mono font-bold">[2]</kbd>
                  <span className="text-sm font-black">Difícil</span>
                </div>
                <span className="text-[11px] text-amber-400 font-semibold">Repetir em 10m</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate('bom')}
                className="p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 text-blue-500 dark:text-blue-400 font-bold text-xs transition-all flex flex-col items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-black/40 text-white text-[11px] font-mono font-bold">[3]</kbd>
                  <span className="text-sm font-black">Bom</span>
                </div>
                <span className="text-[11px] text-blue-400 font-semibold">Repetir em 1 dia</span>
              </button>

              <button
                type="button"
                onClick={() => handleRate('facil')}
                className="p-4 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/60 text-emerald-500 dark:text-emerald-400 font-bold text-xs transition-all flex flex-col items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.15)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-0.5 rounded bg-black/40 text-white text-[11px] font-mono font-bold">[4]</kbd>
                  <span className="text-sm font-black">Fácil</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Repetir em 4 dias</span>
              </button>

            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pressione <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold">Espaço</kbd> para virar o cartão e desbloquear os botões de resposta
              </span>
            </div>
          )}

        </div>
      )}

      {/* VIEW MODE 3: SESSION COMPLETE */}
      {viewMode === 'complete' && (
        <div className="max-w-xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-indigo-500/40 glow-brand text-center space-y-6 animate-fadeIn relative overflow-hidden">
          {/* Subtle victory screen pulse halo */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-emerald-500/5 to-transparent animate-pulse pointer-events-none" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl font-black shadow-[0_0_25px_rgba(52,211,153,0.3)]">
            ✓
          </div>

          <div className="relative space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Sessão de Repetição Espaçada Concluída
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Ciclo de esquecimento quebrado. Memória consolidada.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Você completou todos os <strong>{sessionStats.reviewed} cards</strong> agendados para hoje. A curva de esquecimento de Ebbinghaus foi interceptada e as sinapses foram fortalecidas para o dia da prova.
            </p>
          </div>

          {/* Session breakdown */}
          <div className="grid grid-cols-4 gap-2 p-4 rounded-2xl bg-white dark:bg-dark-surface/90 border border-slate-200 dark:border-white/5 text-xs font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Errei (1m)</span>
              <strong className="text-rose-400 text-sm">{sessionStats.errei}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Difícil (10m)</span>
              <strong className="text-amber-400 text-sm">{sessionStats.dificil}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Bom (1d)</span>
              <strong className="text-blue-400 text-sm">{sessionStats.bom}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Fácil (4d)</span>
              <strong className="text-emerald-400 text-sm">{sessionStats.facil}</strong>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              Voltar ao Deck
            </button>
          </div>

        </div>
      )}

      {/* VIEW MODE 4: CREATE CARD */}
      {viewMode === 'create' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-300 dark:border-white/10">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Criar Novo Flashcard</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Adicione um conceito, artigo de lei ou mnemônico para repetição espaçada.</p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Disciplina:</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Tópico ou Artigo de Lei:</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Frente (Pergunta / Comando):</label>
              <textarea
                rows={3}
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Ex: Qual é o prazo prescricional para a ação de improbidade administrativa segundo a Lei 14.230/21?"
                className="w-full px-3 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">Verso (Resposta / Fundamentação):</label>
              <textarea
                rows={4}
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Ex: O prazo prescricional é de 8 (oito) anos, contados a partir da data de ocorrência do fato ou, no caso de infrações permanentes, do dia em que tiver cessado a permanência (Art. 23 da Lei 8.429/92 reformada)."
                className="w-full px-3 py-2.5 rounded-xl glass-input text-slate-900 dark:text-white text-xs resize-none"
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/30"
              >
                Salvar Flashcard
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
