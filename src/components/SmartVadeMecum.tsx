'use client';

import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { VadeMecumArticle } from '@/lib/types';
import { INITIAL_VADE_MECUM } from '@/lib/mockData';

interface SmartVadeMecumProps {
  onGoToQuestion?: (questionId: string) => void;
  onGoToSimulator: () => void;
}

export const SmartVadeMecum: React.FC<SmartVadeMecumProps> = ({
  onGoToQuestion,
  onGoToSimulator
}) => {
  const [articles] = useState<VadeMecumArticle[]>(INITIAL_VADE_MECUM);
  const [selectedDiploma, setSelectedDiploma] = useState<string>('all');
  const [selectedIncidence, setSelectedIncidence] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  // Helper to highlight trap keywords in the text
  const renderHighlightedText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;

    // Create regex matching any of the keywords
    const regex = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isKeyword) {
        return (
          <mark 
            key={i} 
            className="bg-amber-400/25 text-amber-200 font-bold px-1 py-0.5 rounded border-b-2 border-amber-400"
            title="Palavra com altíssimo índice de troca pelas bancas!"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/30 via-dark-surface to-indigo-950/30 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <BookMarked className="w-3.5 h-3.5" />
              Lei Seca Esquematizada com IA
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Vade Mecum Inteligente & Grifos de Risco
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Mais de <strong>75% das questões</strong> em concursos federais, estaduais e OAB são resolvidas exclusivamente pela literalidade da lei. O AprovaLens destaca automaticamente os termos que os examinadores adulteram para te induzir ao erro.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToSimulator}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs tracking-wide shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>TESTAR QUESTÕES DE LEI SECA</span>
            </button>
          </div>
        </div>

        {/* Highlight Key Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-600 dark:text-slate-300">Legenda de Grifos:</span>
          <div className="flex items-center gap-1.5">
            <mark className="bg-amber-400/25 text-amber-200 font-bold px-1.5 py-0.5 rounded border-b-2 border-amber-400 text-[11px]">
              Palavra de Armadilha
            </mark>
            <span>= Termos restritivos (*"salvo", "sempre", "vedado"*)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
              🔥 ALTA INCIDÊNCIA
            </span>
            <span>= Cobrado em mais de 60% das provas do cargo</span>
          </div>
        </div>
      </div>

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
            className="w-full bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Incidência:</span>
          <select
            value={selectedIncidence}
            onChange={(e) => setSelectedIncidence(e.target.value)}
            className="bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-amber-500"
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
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="rounded-2xl bg-white dark:bg-dark-surface/90 border border-slate-200 dark:border-white/5 hover:border-amber-500/30 p-6 space-y-4 transition-all shadow-lg"
            >
              {/* Article Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-black text-xs">
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 border border-rose-500/30 text-rose-300">
                    🔥 {art.incidence.toUpperCase()} INCIDÊNCIA
                  </span>

                  <button
                    onClick={() => handleCopyText(art)}
                    className="p-1.5 rounded-lg bg-dark-bg hover:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all text-xs"
                    title="Copiar artigo formatado"
                  >
                    {copiedId === art.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Literal Text with Automatic Highlights */}
              <div className="bg-dark-bg/80 border border-slate-200 dark:border-white/5 rounded-xl p-4 sm:p-5">
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-serif leading-relaxed">
                  {renderHighlightedText(art.text, art.trapKeywords)}
                </p>
              </div>

              {/* Banca Trap Golden Note */}
              <div className="bg-gradient-to-r from-amber-950/25 via-dark-bg to-dark-surface border border-amber-500/25 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Dica de Ouro da Banca (Como você é testado)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {art.bancaTrapNote}
                </p>
              </div>

              {/* Footer Tags & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {art.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 dark:text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {art.relatedQuestionId && onGoToQuestion && (
                    <button
                      onClick={() => onGoToQuestion(art.relatedQuestionId!)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Resolver Questão Deste Artigo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
