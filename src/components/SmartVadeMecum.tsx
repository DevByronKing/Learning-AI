'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Search, 
  Filter, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Layers, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  Volume2,
  VolumeX,
  Swords,
  Trophy,
  RotateCcw,
  Zap,
  Check,
  X
} from 'lucide-react';
import { VadeMecumArticle } from '@/lib/types';
import { INITIAL_VADE_MECUM } from '@/lib/mockData';
import confetti from 'canvas-confetti';

interface SmartVadeMecumProps {
  onGoToQuestion?: (questionId: string) => void;
  onGoToSimulator: () => void;
}

interface TrapChallenge {
  id: string;
  diploma: string;
  numberStr: string;
  topic: string;
  banca: string;
  adulteratedText: string;
  trapWord: string;
  originalWord: string;
  explanation: string;
  frequency: string;
}

const TRAP_CHALLENGES: TrapChallenge[] = [
  {
    id: 'trap-1',
    diploma: 'CF/88',
    numberStr: 'Art. 5º, XLII',
    topic: 'Direitos e Garantias Fundamentais',
    banca: 'Cebraspe',
    adulteratedText: 'A prática do racismo constitui crime inafiançável e PRESCRITÍVEL, sujeito à pena de reclusão, nos termos da lei.',
    trapWord: 'PRESCRITÍVEL',
    originalWord: 'imprescritível',
    explanation: 'Pegadinha clássica do Cebraspe e FGV! O racismo é INAFIANÇÁVEL e IMPRESCRITÍVEL (Art. 5º, XLII, CF/88). A banca retirou o prefixo "im" para induzir ao erro em leitura desatenta.',
    frequency: '92% de incidência'
  },
  {
    id: 'trap-2',
    diploma: 'Lei 8.112/90',
    numberStr: 'Art. 13, § 1º',
    topic: 'Regime Jurídico dos Servidores',
    banca: 'FGV',
    adulteratedText: 'A posse ocorrerá no prazo de QUINZE dias contados da publicação do ato de provimento no Diário Oficial.',
    trapWord: 'QUINZE',
    originalWord: 'trinta (30)',
    explanation: 'A FGV troca frequentemente os prazos de posse e exercício! A posse ocorre em até 30 (trinta) dias contados da publicação. Já o exercício ocorre no prazo de 15 (quinze) dias após a posse.',
    frequency: '88% de incidência'
  },
  {
    id: 'trap-3',
    diploma: 'Lei 14.230/21 (LIA)',
    numberStr: 'Art. 1º, § 1º',
    topic: 'Improbidade Administrativa',
    banca: 'FCC',
    adulteratedText: 'Consideram-se atos de improbidade administrativa as condutas dolosas ou CULPOSAS tipificadas nos artigos 9º, 10 e 11 desta Lei.',
    trapWord: 'CULPOSAS',
    originalWord: 'exclusivamente dolosas (com dolo específico)',
    explanation: 'Com a Nova LIA (Lei 14.230/21), foi EXTINTA a modalidade culposa em qualquer ato de improbidade. Agora exige-se SEMPRE dolo específico com comprovação de fim ilícito!',
    frequency: '95% de incidência'
  },
  {
    id: 'trap-4',
    diploma: 'Lei 8.213/91',
    numberStr: 'Art. 15, II',
    topic: 'Previdenciário (Período de Graça)',
    banca: 'Cebraspe',
    adulteratedText: 'Mantém a qualidade de segurado, independentemente de contribuições, até SEIS meses após a cessação das contribuições, o segurado empregado que deixar de exercer atividade remunerada.',
    trapWord: 'SEIS',
    originalWord: '12 (doze)',
    explanation: 'Para o segurado obrigatório que cessa as contribuições, o período de graça básico é de 12 (doze) meses, e NÃO 6 meses. O prazo de 6 meses aplica-se exclusivamente ao segurado facultativo (Art. 15, IV).',
    frequency: '84% de incidência'
  },
  {
    id: 'trap-5',
    diploma: 'Lei 14.133/21',
    numberStr: 'Art. 28',
    topic: 'Nova Lei de Licitações',
    banca: 'Vunesp / FGV',
    adulteratedText: 'São modalidades de licitação: pregão, concorrência, concurso, leilão, diálogo competitivo e TOMADA de preços.',
    trapWord: 'TOMADA',
    originalWord: 'extinta na nova lei',
    explanation: 'A Lei 14.133/21 extinguiu expressamente as modalidades "Tomada de Preços" e "Convite", inserindo o "Diálogo Competitivo". As bancas inserem Tomada de Preços para reprovar quem estuda por material antigo!',
    frequency: '91% de incidência'
  }
];

export const SmartVadeMecum: React.FC<SmartVadeMecumProps> = ({
  onGoToQuestion,
  onGoToSimulator
}) => {
  const [articles] = useState<VadeMecumArticle[]>(INITIAL_VADE_MECUM);
  const [selectedDiploma, setSelectedDiploma] = useState<string>('all');
  const [selectedIncidence, setSelectedIncidence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Speech state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Gamification Trap Hunter Mode
  const [isTrapModeActive, setIsTrapModeActive] = useState<boolean>(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [userSelectedWord, setUserSelectedWord] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<'correct' | 'wrong' | null>(null);
  const [trapStreak, setTrapStreak] = useState<number>(0);
  const [trapScore, setTrapScore] = useState<number>(0);

  // Stop audio if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const currentChallenge = TRAP_CHALLENGES[currentChallengeIndex];

  // Diplomas available
  const diplomas = [
    { id: 'all', name: 'Todos os Diplomas' },
    { id: 'CF/88', name: 'CF/88' },
    { id: 'Lei 8.112/90', name: 'Lei 8.112/90 (Servidores)' },
    { id: 'Lei 14.230/21 (LIA)', name: 'Lei 14.230/21 (Improbidade)' },
    { id: 'Lei 14.133/21 (Licitações)', name: 'Lei 14.133/21 (Licitações)' },
    { id: 'Lei 8.213/91 (Previdência)', name: 'Lei 8.213/91 (Previdência)' }
  ];

  // Filtering
  const filteredArticles = articles.filter(art => {
    if (selectedDiploma !== 'all' && art.diploma !== selectedDiploma) return false;
    if (selectedIncidence !== 'all' && art.incidence !== selectedIncidence) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = art.text.toLowerCase().includes(q);
      const matchNum = art.numberStr.toLowerCase().includes(q);
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchTags = art.tags.some(t => t.toLowerCase().includes(q));
      if (!matchText && !matchNum && !matchTitle && !matchTags) return false;
    }
    return true;
  });

  const handleCopyText = (art: VadeMecumArticle) => {
    navigator.clipboard.writeText(`${art.diploma} - ${art.numberStr}: ${art.text}`);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Web Speech API Native Audio Reader
  const handleToggleAudio = (art: VadeMecumArticle) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não possui suporte para síntese de voz nativa.');
      return;
    }

    if (playingAudioId === art.id) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${art.diploma}, ${art.numberStr}. ${art.title}. ${art.text}. Dica da banca: ${art.bancaTrapNote}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);

    setPlayingAudioId(art.id);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to highlight trap keywords in the text
  const renderHighlightedText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;

    const regex = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isKeyword) {
        return (
          <mark 
            key={i} 
            className="bg-amber-100 dark:bg-amber-400/25 text-amber-800 dark:text-amber-300 font-bold px-1 py-0.5 rounded border-b-2 border-amber-400 inline-block"
            title="Palavra com altíssimo índice de adulteração pelas bancas!"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Trap Hunter Interactive Word Click
  const handleWordClickInChallenge = (cleanWord: string) => {
    if (challengeResult !== null) return;

    setUserSelectedWord(cleanWord);
    const targetWord = currentChallenge.trapWord.toUpperCase();
    const isCorrect = cleanWord.toUpperCase() === targetWord;

    if (isCorrect) {
      setChallengeResult('correct');
      setTrapStreak(prev => prev + 1);
      setTrapScore(prev => prev + 25);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}
    } else {
      setChallengeResult('wrong');
      setTrapStreak(0);
    }
  };

  const handleNextChallenge = () => {
    setUserSelectedWord(null);
    setChallengeResult(null);
    setCurrentChallengeIndex((prev) => (prev + 1) % TRAP_CHALLENGES.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-white dark:bg-gradient-to-r dark:from-amber-950/30 dark:via-dark-surface dark:to-indigo-950/30 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 dark:border-amber-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <BookMarked className="w-3.5 h-3.5" />
              Lei Seca Esquematizada com IA
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Vade Mecum Inteligente & Grifos de Risco
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mais de <strong>75% das questões</strong> em concursos federais, estaduais e OAB são resolvidas exclusivamente pela literalidade da lei. O Learning AI destaca os termos exatos que os examinadores adulteram para te induzir ao erro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Toggle Caçador de Pegadinhas */}
            <button
              onClick={() => setIsTrapModeActive(!isTrapModeActive)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs tracking-wide transition-all shadow-lg active:scale-95 ${
                isTrapModeActive
                  ? 'bg-rose-600 text-white shadow-rose-600/30 ring-2 ring-rose-400/40'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500 text-black hover:from-rose-400 hover:to-amber-400 shadow-rose-500/20'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>{isTrapModeActive ? 'FECHAR MODO DESAFIO' : '🎯 JOGAR CAÇADOR DE PEGADINHAS'}</span>
            </button>

            <button
              onClick={onGoToSimulator}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-dark-card dark:hover:bg-dark-hover border border-slate-700 dark:border-white/10 text-white font-bold text-xs tracking-wide transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>SIMULADOR DE QUESTÕES</span>
            </button>
          </div>
        </div>

        {/* Highlight Key Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300">Legenda Inteligente:</span>
          <div className="flex items-center gap-1.5">
            <mark className="bg-amber-100 dark:bg-amber-400/25 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded border-b-2 border-amber-400 text-[11px]">
              Palavra de Armadilha
            </mark>
            <span>= Termos com risco de troca (*"salvo", "sempre", "vedado"*)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
              🔥 ALTA INCIDÊNCIA
            </span>
            <span>= Cobrado em mais de 60% dos editais</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>= Áudio Copiloto em Português nativo</span>
          </div>
        </div>
      </div>

      {/* PAINEL DO CAÇADOR DE PEGADINHAS (GAMIFICAÇÃO DE LEI SECA) */}
      {isTrapModeActive && (
        <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-slate-100 to-indigo-50 dark:from-rose-950/40 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-rose-200 dark:border-rose-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-200 dark:border-rose-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Swords className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Duelo de Lei Seca: Ache a Adulteração da Banca!
                  </h2>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-black border border-rose-300 dark:border-rose-500/30">
                    Nível Banca {currentChallenge.banca}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Clique diretamente na palavra que a banca adulterou para induzir o concurseiro ao erro.
                </p>
              </div>
            </div>

            {/* Score & Streak Counters */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 font-extrabold text-xs">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-500 fill-amber-500/20" />
                <span>Streak: {trapStreak}🔥</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Score: {trapScore} XP</span>
              </div>
            </div>
          </div>

          {/* Target Article Card with Clickable Words */}
          <div className="bg-white dark:bg-dark-bg/90 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-black">
                {currentChallenge.diploma} — {currentChallenge.numberStr}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Tópico: <strong className="text-slate-800 dark:text-slate-200">{currentChallenge.topic}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                {currentChallenge.frequency}
              </span>
            </div>

            {/* Interactive Text */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 font-serif text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
              {currentChallenge.adulteratedText.split(' ').map((rawWord, idx) => {
                const cleanWord = rawWord.replace(/[,.;:()]/g, '');
                const punctuation = rawWord.replace(/[a-zA-Z0-9À-ÿ]/g, '');
                const isSelected = userSelectedWord?.toUpperCase() === cleanWord.toUpperCase();
                const isTrapWord = currentChallenge.trapWord.toUpperCase() === cleanWord.toUpperCase();
                
                let highlightClass = 'hover:bg-indigo-100 dark:hover:bg-indigo-500/30 hover:text-indigo-700 dark:hover:text-white transition-colors cursor-pointer rounded px-0.5';
                if (challengeResult !== null) {
                  if (isTrapWord) {
                    highlightClass = 'bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-black ring-2 ring-emerald-300 dark:ring-emerald-400 rounded px-1';
                  } else if (isSelected && !isCorrectWord(cleanWord, currentChallenge.trapWord)) {
                    highlightClass = 'bg-rose-100 dark:bg-rose-500/30 text-rose-800 dark:text-rose-300 line-through rounded px-1';
                  } else {
                    highlightClass = 'opacity-60';
                  }
                }

                return (
                  <React.Fragment key={idx}>
                    <span 
                      onClick={() => handleWordClickInChallenge(cleanWord)}
                      className={highlightClass}
                      title={challengeResult === null ? "Clique para indicar como pegadinha" : undefined}
                    >
                      {cleanWord}
                    </span>
                    <span>{punctuation} </span>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Instruction Tip */}
            {challengeResult === null && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Dica: Há 1 palavra adulterada no texto acima que torna a assertiva falsa. Clique nela!
              </p>
            )}

            {/* Resolution Card */}
            {challengeResult !== null && (
              <div className={`p-4 sm:p-5 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 shadow-sm ${
                challengeResult === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-black text-sm mb-2">
                  {challengeResult === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>EXCELENTE! VOCÊ DESARMOU A PEGADINHA! (+25 XP)</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span>ATENÇÃO! VOCÊ CAIU NA ARMADILHA DA BANCA!</span>
                    </>
                  )}
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">Palavra adulterada: </strong>
                    <span className="line-through text-rose-600 dark:text-rose-400 font-bold">{currentChallenge.trapWord}</span>
                    <span className="text-slate-500 dark:text-slate-400"> ➔ Correto na lei: </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-black">{currentChallenge.originalWord}</strong>
                  </p>
                  <p className="leading-relaxed bg-slate-100 dark:bg-black/30 p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
                    {currentChallenge.explanation}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={handleNextChallenge}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-xs shadow-lg transition-all"
                  >
                    <span>PRÓXIMO DESAFIO</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diploma Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {diplomas.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDiploma(d.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDiploma === d.id
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white/5'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-dark-surface/70 border border-slate-200 dark:border-white/5 p-4 rounded-2xl backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por artigo (ex: Art. 5º, Art. 37) ou palavra-chave..."
            className="w-full bg-white dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Incidência:</span>
          <select
            value={selectedIncidence}
            onChange={(e) => setSelectedIncidence(e.target.value)}
            className="bg-white dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas as Frequências</option>
            <option value="Alta">🔥 Alta Incidência</option>
            <option value="Média">⚡ Média Incidência</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Articles Stream */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-surface/40 border border-slate-200 dark:border-white/5 rounded-3xl space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum artigo encontrado</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tente buscar por outro termo ou selecione todos os diplomas.</p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const isSpeakingThis = playingAudioId === art.id;
            return (
              <div
                key={art.id}
                className="rounded-2xl bg-white dark:bg-dark-surface/90 border border-slate-200 dark:border-white/5 hover:border-amber-500/30 p-6 space-y-4 transition-all shadow-lg"
              >
                {/* Article Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-black text-xs">
                      {art.diploma}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {art.numberStr}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {art.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300">
                      🔥 {art.incidence.toUpperCase()} INCIDÊNCIA
                    </span>

                    {/* Audio Reader Button */}
                    <button
                      onClick={() => handleToggleAudio(art)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isSpeakingThis
                          ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse shadow-md shadow-indigo-600/30'
                          : 'bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/30'
                      }`}
                      title={isSpeakingThis ? 'Parar leitura de áudio' : 'Ouvir artigo lido pelo Copiloto'}
                    >
                      {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeakingThis ? 'Pausar Áudio' : 'Ouvir Artigo'}</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyText(art)}
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-dark-bg hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all text-xs"
                      title="Copiar artigo formatado"
                    >
                      {copiedId === art.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Literal Text with Automatic Highlights */}
                <div className="bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/5 rounded-xl p-4 sm:p-5 shadow-inner">
                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-serif leading-relaxed">
                    {renderHighlightedText(art.text, art.trapKeywords)}
                  </p>
                </div>

                {/* Banca Trap Golden Note */}
                <div className="bg-amber-50 dark:bg-gradient-to-r dark:from-amber-950/25 dark:via-dark-bg dark:to-dark-surface border border-amber-200 dark:border-amber-500/25 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>Dica de Ouro da Banca (Como você é testado)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {art.bancaTrapNote}
                  </p>
                </div>

                {/* Footer Tags & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {art.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-transparent">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {art.relatedQuestionId && onGoToQuestion && (
                      <button
                        onClick={() => onGoToQuestion(art.relatedQuestionId!)}
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <span>Resolver Questão Deste Artigo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

// Helper for case-insensitive match
function isCorrectWord(word: string, target: string): boolean {
  return word.toUpperCase() === target.toUpperCase();
}
