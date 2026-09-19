'use client';

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Plus, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink, 
  Zap, 
  ShieldAlert, 
  Lightbulb, 
  Bookmark, 
  Tag, 
  Filter, 
  BrainCircuit,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';
import { SmartSubjectSummary, Flashcard, SubscriptionPlan } from '@/lib/types';
import { INITIAL_MICRO_SUMMARIES } from '@/lib/mockData';

interface SmartSubjectSummariesProps {
  onAddFlashcard?: (card: Flashcard) => void;
  onGoToVadeMecum?: (query?: string) => void;
  onGoToSimulator?: (subjectName?: string) => void;
  userPlan?: SubscriptionPlan;
  onOpenPricing?: () => void;
  showToast: (msg: string) => void;
}

export const SmartSubjectSummaries: React.FC<SmartSubjectSummariesProps> = ({
  onAddFlashcard,
  onGoToVadeMecum,
  onGoToSimulator,
  userPlan = 'pro',
  onOpenPricing,
  showToast
}) => {
  const [summaries, setSummaries] = useState<SmartSubjectSummary[]>(INITIAL_MICRO_SUMMARIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('todos');
  const [selectedBanca, setSelectedBanca] = useState<string>('todas');
  const [selectedIncidence, setSelectedIncidence] = useState<string>('todas');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalSummary, setActiveModalSummary] = useState<SmartSubjectSummary | null>(null);

  // AI Generator Form State
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [genSubject, setGenSubject] = useState('Direito Administrativo');
  const [genTopic, setGenTopic] = useState('');
  const [genBanca, setGenBanca] = useState('Cebraspe / FGV');
  const [isGenerating, setIsGenerating] = useState(false);

  // Available subjects for filtering
  const availableSubjects = useMemo(() => {
    const list = Array.from(new Set(summaries.map(s => s.subjectName)));
    return ['todos', ...list];
  }, [summaries]);

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    return summaries.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.mnemonic && s.mnemonic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.coreConcept && s.coreConcept.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesSubject = selectedSubject === 'todos' || s.subjectName === selectedSubject;
      const matchesBanca = selectedBanca === 'todas' || s.banca.toLowerCase().includes(selectedBanca.toLowerCase());
      const matchesIncidence = selectedIncidence === 'todas' || (s.incidence && s.incidence.toLowerCase().includes(selectedIncidence.toLowerCase()));

      return matchesSearch && matchesSubject && matchesBanca && matchesIncidence;
    });
  }, [summaries, searchQuery, selectedSubject, selectedBanca, selectedIncidence]);

  // Audio Speech Synthesis
  const handleToggleSpeech = (summary: SmartSubjectSummary) => {
    if (typeof window === 'undefined') return;

    if (speakingId === summary.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(summary.id);

    const speechText = `${summary.title}. Disciplina: ${summary.subjectName}. Banca avaliadora: ${summary.banca}. Conceito principal: ${summary.coreConcept || ''}. Pontos-chave cobrados pela banca: ${summary.keyPoints.join('. ')}. Alerta de pegadinha da banca: ${summary.bancaTrapAlert}. Mnemônico de memorização: ${summary.mnemonic || 'Não possui'}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Convert to Flashcard
  const handleConvertToFlashcard = (summary: SmartSubjectSummary) => {
    if (!onAddFlashcard) return;

    const newCard: Flashcard = {
      id: `fc-sum-${Date.now()}`,
      subjectName: summary.subjectName,
      topicName: summary.topicName,
      front: `[${summary.subjectName}] ${summary.title}\n\nQual é a principal pegadinha da banca ${summary.banca}?`,
      back: `⚠️ ALERTA DA BANCA:\n${summary.bancaTrapAlert}\n\n💡 MNEMÔNICO:\n${summary.mnemonic || 'Revise os artigos quentes'}\n\n📌 PONTOS DE OURO:\n${summary.keyPoints.slice(0, 2).join('\n')}`,
      nextReviewDate: new Date().toISOString(),
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5
    };

    onAddFlashcard(newCard);
    showToast(`Resumo transformado em Flashcard SM-2 com sucesso!`);
  };

  // Copy Formatted Summary
  const handleCopySummary = (summary: SmartSubjectSummary) => {
    const text = `📖 RESUMO INTELIGENTE: ${summary.title}\n⚖️ Disciplina: ${summary.subjectName} | Banca: ${summary.banca}\n\n🎯 Conceito Chave:\n${summary.coreConcept || ''}\n\n📌 Pontos-Chave:\n${summary.keyPoints.map(k => `• ${k}`).join('\n')}\n\n⚠️ Pegadinha da Banca:\n${summary.bancaTrapAlert}\n\n🧠 Mnemônico:\n${summary.mnemonic || 'N/A'}\n\n📜 Artigos Quentes:\n${(summary.hotArticles || []).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopiedId(summary.id);
    showToast('Resumo copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Custom Summary using AI
  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);

    try {
      // Simulate AI generation or connect with Gemini Engine
      await new Promise(r => setTimeout(r, 1400));

      const newSummary: SmartSubjectSummary = {
        id: `sum-ai-${Date.now()}`,
        subjectName: genSubject,
        topicName: genTopic.trim(),
        banca: genBanca,
        title: `Síntese Cognitiva: ${genTopic.trim()}`,
        incidence: 'Alta (80/20)',
        coreConcept: `Abordagem direcionada dos pontos de maior cobrança de ${genTopic.trim()} focada nas jurisprudências e literalidade da lei.`,
        keyPoints: [
          `Regra Geral: Adoção do entendimento consolidado do STJ/STF aplicável a ${genTopic.trim()}.`,
          `Exceção de Ouro: Casos especiais onde a norma impõe requisitos estritos de validade.`,
          `Prazos & Procedimentos: Cuidado especial com a contagem de prazos processuais e competências.`,
          `Posicionamento da Banca: A ${genBanca} costuma priorizar a literalidade legal com sutis alterações de advérbios.`
        ],
        bancaTrapAlert: `A ${genBanca} costuma trocar termos como "obrigatoriamente" por "facultativamente", ou inverter as consequências jurídicas para candidatos desatentos.`,
        mnemonic: `D-O-M-I-N-E: Direto, Objetivo, Mapeado, Inteligente, Notório e Eficaz.`,
        hotArticles: ['Consulte o diploma correspondente no Vade Mecum'],
        tags: [genSubject, genTopic.trim(), genBanca, 'Gerado por IA'],
        isCustomAiGenerated: true
      };

      setSummaries(prev => [newSummary, ...prev]);
      setIsGeneratingModalOpen(false);
      setGenTopic('');
      showToast(`Resumo de "${newSummary.topicName}" gerado com sucesso pelo Copiloto IA!`);
    } catch {
      showToast('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* HEADER DE ALTO IMPACTO */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white shadow-xl shadow-blue-500/10 border border-blue-400/20">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-yellow-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Caderno de Sinopses Cognitivas 80/20</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Resumos Inteligentes de Matérias
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Disseque os conceitos mais espinhosos do edital com foco nas pegadinhas das bancas (Cebraspe, FGV, FCC, Vunesp), mnemônicos de fixação rápida e síntese por voz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsGeneratingModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-blue-50 font-black text-xs sm:text-sm shadow-lg shadow-black/15 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Gerar Resumo com IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA & FILTROS MULTIDIMENSIONAIS */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por tema, lei, artigo, palavra-chave ou mnemônico (Ex: Improbidade, STF, Domicílio, P-I-P-O-C-A)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Seletor de Disciplina */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Banca:</span>
            </div>
            <select
              value={selectedBanca}
              onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="todas">Todas as Bancas</option>
              <option value="Cebraspe">Cebraspe</option>
              <option value="FGV">FGV</option>
              <option value="FCC">FCC</option>
              <option value="Vunesp">Vunesp</option>
            </select>
          </div>
        </div>

        {/* Pílulas de Disciplina */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
          <span className="text-[11px] font-black uppercase text-slate-400 shrink-0 mr-1">
            Matérias:
          </span>
          {availableSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubject === subj
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {subj === 'todos' ? 'Todas as Matérias' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS / GRID DE RESUMOS INTELIGENTES */}
      {filteredSummaries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Nenhum resumo encontrado para estes filtros
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Gostaria de criar um resumo inteligente agora mesmo usando o Copiloto IA?
          </p>
          <button
            onClick={() => {
              setGenTopic(searchQuery || 'Tópico Específico');
              setIsGeneratingModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Resumo para &quot;{searchQuery || 'este tema'}&quot;</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSummaries.map((summary) => {
            const isSpeaking = speakingId === summary.id;
            const isCopied = copiedId === summary.id;

            return (
              <div
                key={summary.id}
                className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Linha Superior: Disciplina & Banca */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                      {summary.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                      {summary.banca}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {summary.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                      {summary.topicName}
                    </p>
                  </div>

                  {summary.coreConcept && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      {summary.coreConcept}
                    </p>
                  )}

                  {/* Pontos-Chave */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-blue-500" />
                      Regras de Ouro da Banca:
                    </span>
                    <ul className="space-y-1">
                      {summary.keyPoints.slice(0, 3).map((kp, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 leading-snug">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span className="line-clamp-2">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alerta de Pegadinha da Banca */}
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="flex items-center gap-1 font-black text-[11px] text-amber-600 dark:text-amber-400 uppercase">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Alerta de Pegadinha:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {summary.bancaTrapAlert}
                    </p>
                  </div>

                  {/* Mnemônico */}
                  {summary.mnemonic && (
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-start gap-2 text-xs text-purple-900 dark:text-purple-200">
                      <Lightbulb className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-tight">
                        <span className="font-extrabold text-purple-600 dark:text-purple-300">Mnemônico: </span>
                        <span>{summary.mnemonic}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Linha Inferior: Ações e Botões */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Ouvir Áudio */}
                    <button
                      type="button"
                      onClick={() => handleToggleSpeech(summary)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all ${
                        isSpeaking
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={isSpeaking ? 'Pausar áudio' : 'Ouvir este resumo'}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Copiar Resumo */}
                    <button
                      type="button"
                      onClick={() => handleCopySummary(summary)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      title="Copiar resumo formatado"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Ver no Vade Mecum */}
                    {onGoToVadeMecum && summary.hotArticles && summary.hotArticles.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onGoToVadeMecum(summary.hotArticles![0])}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        title="Ver artigos no Vade Mecum"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Transformar em Flashcard */}
                    <button
                      type="button"
                      onClick={() => handleConvertToFlashcard(summary)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold text-xs transition-all flex items-center gap-1"
                      title="Transformar em Flashcard SM-2"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Flashcard</span>
                    </button>

                    {/* Treinar Questões */}
                    {onGoToSimulator && (
                      <button
                        type="button"
                        onClick={() => onGoToSimulator(summary.subjectName)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1"
                        title="Treinar questões deste tema"
                      >
                        <span>Treinar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DO GERADOR DE RESUMO INTELIGENTE COM IA */}
      {isGeneratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Motor Gemini 1.5 Flash</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Gerar Resumo Inteligente por IA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Digite qualquer assunto ou artigo do seu edital. O Copiloto estruturará regras de ouro, pegadinhas e mnemônicos em segundos.
              </p>
            </div>

            <form onSubmit={handleGenerateSummary} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Disciplina
                </label>
                <select
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Direito Administrativo">Direito Administrativo</option>
                  <option value="Direito Constitucional">Direito Constitucional</option>
                  <option value="Direito Penal">Direito Penal</option>
                  <option value="Processo Penal">Processo Penal</option>
                  <option value="Ética Profissional OAB">Ética Profissional OAB</option>
                  <option value="Direito Tributário">Direito Tributário</option>
                  <option value="Direito Civil">Direito Civil</option>
                  <option value="Legislação Especial">Legislação Especial</option>
                  <option value="Direitos Humanos">Direitos Humanos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Banca Examinadora
                </label>
                <select
                  value={genBanca}
                  onChange={(e) => setGenBanca(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cebraspe / FGV">Cebraspe / FGV (Padrão)</option>
                  <option value="Cebraspe">Cebraspe (Certo / Errado)</option>
                  <option value="FGV">FGV (Casos Práticos)</option>
                  <option value="FCC">FCC (Literalidade & Súmulas)</option>
                  <option value="Vunesp">Vunesp (Lei Seca Estrita)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tema ou Tópico Específico do Edital
                </label>
                <input
                  type="text"
                  required
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="Ex: Controle Difuso de Constitucionalidade, Lei 14.133 Licitações..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGeneratingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !genTopic.trim()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Gerando Síntese Cognitiva...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gerar Resumo Agora</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
