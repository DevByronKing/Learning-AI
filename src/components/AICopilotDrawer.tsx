'use client';

import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  X, 
  Send, 
  Sparkles, 
  Flame, 
  Target, 
  Zap, 
  Compass, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  FileText,
  Clock,
  ShieldAlert,
  Volume2,
  VolumeX,
  Minus,
  Maximize2
} from 'lucide-react';
import { UserMetrics, ExamNotice, MicroSummary, CopilotMessage, StudentProfile } from '@/lib/types';
import { INITIAL_MICRO_SUMMARIES } from '@/lib/mockData';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: UserMetrics;
  selectedExam?: ExamNotice;
  pendingMistakesCount: number;
  profile?: StudentProfile;
  onNavigateTab: (tab: string) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  selectedExam,
  pendingMistakesCount,
  profile,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mission' | 'chat' | 'summaries'>('mission');
  const [isMinimized, setIsMinimized] = useState(false);

  // When isOpen becomes true, ensure it's not minimized
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const guardian = GUARDIAN_ANIMALS.find((a) => a.id === profile?.guardianAnimalId) || GUARDIAN_ANIMALS[0];
  const copilotName = guardian.name;
  const copilotTitle = guardian.title;
  const copilotEmoji = guardian.emoji;
  
  // Chat state
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Olá, ${profile?.name || 'futuro servidor'}! Sou a mentora **${copilotName}** (${copilotTitle}), seu Copiloto Cognitivo. Analisei seu padrão de desempenho e estou monitorando as tendências da banca **${selectedExam?.banca || 'Cebraspe'}**.\n\nComo posso acelerar sua aprovação hoje? Você pode me pedir análises de pegadinhas, mnemônicos ou estratégias para o edital **${selectedExam?.title || 'INSS'}**.`,
      timestamp: 'Agora'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Audio playback state
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (targetId: string, textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Síntese de voz nativa não disponível neste navegador.');
      return;
    }

    if (speakingId === targetId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(targetId);
    window.speechSynthesis.speak(utterance);
  };

  // Micro-summaries state
  const [summaries] = useState<MicroSummary[]>(INITIAL_MICRO_SUMMARIES);
  const [selectedSummary, setSelectedSummary] = useState<MicroSummary | null>(INITIAL_MICRO_SUMMARIES[0]);

  // Daily Priority Mission calculation (Waze dos Estudos)
  const blindSpotSubject = selectedExam?.subjects.find(s => 
    s.topics.some(t => t.status === 'Ponto Cego' || t.status === 'Instável')
  ) || selectedExam?.subjects[0];

  const blindSpotTopic = blindSpotSubject?.topics.find(t => t.status === 'Ponto Cego' || t.status === 'Instável') 
    || blindSpotSubject?.topics[0];

  const quickPrompts = [
    {
      label: '🎯 Pegadinhas Cebraspe vs FGV',
      prompt: 'Qual a principal diferença de malícia entre o modelo C/E do Cebraspe e os casos longos da FGV?'
    },
    {
      label: '💡 Mnemônico Lei 8.112/90',
      prompt: 'Gere os mnemônicos essenciais para não esquecer os prazos de posse e exercício da Lei 8.112/90.'
    },
    {
      label: '⚖️ Súmula Vinculante 57 STF',
      prompt: 'Explique em 3 pontos como o STF aplica a imunidade tributária de livros digitais (SV 57) e como a FGV cobra isso.'
    },
    {
      label: '🛡️ Nova LIA (Lei 14.230)',
      prompt: 'Quais as 3 alterações mais fatais da reforma da Lei de Improbidade Administrativa que as bancas estão usando como distratores?'
    }
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Agora'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Chama a API de IA Real (Gemini) do Copiloto
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          studentProfile: profile,
          examContext: selectedExam,
          history: messages.slice(-4)
        })
      });

      if (!res.ok) {
        throw new Error('Falha ao comunicar com o Copiloto IA');
      }

      const data = await res.json();
      
      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: 'Agora',
        quickAction: data.recommendedAction ? {
          label: data.recommendedAction.label || 'Ver no Simulador',
          actionTab: data.recommendedAction.tab || 'simulator'
        } : undefined
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    } catch (err) {
      console.error('Erro na resposta do copiloto:', err);
      
      // Fallback cognitivo local
      let botResponse = `Pela ótica da banca **${selectedExam?.banca || 'examinadora'}**, a questão fundamental aqui é a precisão na letra da lei e a jurisprudência pacificada dos tribunais superiores.`;
      let actionRecommendation: { label: string; actionTab: string } | undefined = undefined;

      if (query.toLowerCase().includes('posse') || query.toLowerCase().includes('8.112')) {
        botResponse = `📌 **Lei 8.112/90 — Prazos Críticos de Validação:**\n\n1. **Nomeação -> Posse:** 30 dias improrrogáveis (art. 13, § 1º).\n2. **Posse -> Exercício:** 15 dias improrrogáveis (art. 15, § 1º).\n\n⚠️ **Armadilha clássica da banca:** Inverter os prazos (dizer 15 para posse e 30 para exercício) ou dizer que a posse pode ser prorrogada por requerimento. Não caia nisso!`;
        actionRecommendation = { label: 'Praticar Lei 8.112 no Simulador', actionTab: 'simulator' };
      } else if (query.toLowerCase().includes('cebraspe') || query.toLowerCase().includes('fgv')) {
        botResponse = `🔍 **Diferença de Perfil Tático:**\n\n• **Cebraspe (C/E):** Busca a palavra absoluta (*sempre*, *nunca*, *exclusivamente*) para invalidar itens. O erro anula um acerto (Fator de Correção).\n• **FGV (Múltipla Escolha):** Cria enunciados com historinhas fáticas complexas onde 3 alternativas parecem certas, mas uma traz uma exceção doutrinária sutil.\n\n🎯 **Estratégia:** No Cebraspe, chute consciente apenas se eliminar 50% da dúvida. Na FGV, leia primeiro o comando final da questão antes do caso fático.`;
        actionRecommendation = { label: 'Treinar Distratores de Banca', actionTab: 'distratores' };
      }

      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: 'Agora',
        quickAction: actionRecommendation
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  // Minimized Floating Pill View (Ultra unobtrusive companion)
  if (isMinimized) {
    return (
      <aside 
        aria-label="Copiloto de estudos minimizado"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/95 dark:bg-[#0c1427]/95 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 text-slate-800 dark:text-white cursor-pointer hover:scale-105 active:scale-95 transition-all backdrop-blur-xl group"
        title="Clique para expandir o Copiloto Cognitivo"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-lg shadow-xs shrink-0 group-hover:scale-110 transition-transform">
          {copilotEmoji}
        </div>
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 dark:text-white">{copilotName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold">
            {activeSubTab === 'mission' ? '🎯 Missão do Dia Pronta' : activeSubTab === 'chat' ? '💬 Tira-Dúvidas IA' : '⚡ Micro-Resumo'}
          </span>
        </div>
      </aside>
    );
  }

  // Expanded Floating Companion Dock View (Non-blocking, side-by-side with study workflow)
  return (
    <aside 
      aria-label="Copiloto de estudos"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80] w-[94vw] sm:w-[450px] md:w-[480px] h-[640px] max-h-[85vh] bg-white/98 dark:bg-[#0c1427]/98 border border-slate-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/80 flex flex-col backdrop-blur-2xl animate-slideUp overflow-hidden"
    >
      {/* Companion Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-[#0c1427] dark:to-slate-900/40 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-950 border border-blue-400/50 shadow-md shrink-0 flex items-center justify-center relative">
            {guardian.avatar3dUrl ? (
              <img src={guardian.avatar3dUrl} alt={copilotName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">{copilotEmoji}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">{copilotName}</h2>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                COPILOTO IA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {copilotTitle} • Waze dos Estudos
            </p>
          </div>
        </div>

        {/* Header Action Buttons (Minimize & Close) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsMinimized(true)}
            aria-label="Minimizar copiloto"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all cursor-pointer"
            title="Minimizar para pílula flutuante"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Fechar copiloto"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Segmented Pill Selector (3 Core Pillars) */}
      <div className="p-2 border-b border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-white/[0.02] shrink-0">
        <div className="grid grid-cols-3 gap-1 bg-slate-200/60 dark:bg-black/40 p-1 rounded-2xl">
          <button
            onClick={() => setActiveSubTab('mission')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
              activeSubTab === 'mission'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="truncate">Missão</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
              activeSubTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">Tira-Dúvidas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('summaries')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
              activeSubTab === 'summaries'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate">Resumos</span>
          </button>
        </div>
      </div>

      {/* Companion Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* SUBTAB 1: MISSÃO DO DIA (WAZE DOS ESTUDOS) */}
        {activeSubTab === 'mission' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Mission Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 dark:from-blue-950/30 dark:via-[#0c1427] dark:to-slate-900/40 border border-blue-200 dark:border-blue-500/30 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-cyan-400 text-xs font-black uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
                  <span>Ação de Maior Impacto</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                  URGENTE
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                Dominar Ponto Cego: {blindSpotTopic?.name || 'Tópico Prioritário'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Seu índice de acertos neste tópico está abaixo do corte histórico da banca <strong>{selectedExam?.banca || 'Cebraspe'}</strong>. O algoritmo identificou alta probabilidade de armadilhas.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Tempo sugerido:</span>
                  <strong className="text-slate-900 dark:text-white">35 minutos</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Meta de fixação:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">10 questões + 1 micro-resumo</strong>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Ganho estimado:</span>
                  <strong className="text-blue-600 dark:text-cyan-300 font-bold">+4.2 pts líquidos</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('simulator');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-wide shadow-md shadow-blue-600/30 transition-all cursor-pointer hover:scale-101 active:scale-98"
              >
                <Target className="w-4 h-4" />
                <span>INICIAR MISSÃO NO SIMULADOR</span>
              </button>
            </div>

            {/* Daily Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Checklist Cognitivo do Dia
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Revisão SRS SM-2 de Flashcards</span>
                  </div>
                  <button 
                    onClick={() => { onClose(); onNavigateTab('analytics'); }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-black"
                  >
                    Abrir
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border text-[10px] font-black flex items-center justify-center shrink-0 ${
                      pendingMistakesCount > 0 ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    }`}>
                      {pendingMistakesCount > 0 ? '!' : '✓'}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      Caderno de Erros ({pendingMistakesCount} pendências)
                    </span>
                  </div>
                  <button 
                    onClick={() => { onClose(); onNavigateTab('mistakes'); }}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-black"
                  >
                    Revanche
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">5 Artigos da Lei Seca</span>
                  </div>
                  <button 
                    onClick={() => { onClose(); onNavigateTab('vademecum'); }}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-black"
                  >
                    Ler
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 2: CHAT COGNITIVO TIRA-DÚVIDAS */}
        {activeSubTab === 'chat' && (
          <div className="space-y-3 flex flex-col h-full animate-fadeIn">
            
            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">
                Dúvidas Rápidas da Banca:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(qp.prompt)}
                    className="text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/5 hover:border-blue-400/40 text-slate-700 dark:text-slate-200 text-xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{qp.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="space-y-2.5 pt-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {m.text}
                    </div>

                    {m.sender === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleSpeech(m.id, m.text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                            speakingId === m.id
                              ? 'bg-blue-600 text-white border-blue-500 animate-pulse'
                              : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                          }`}
                          title={speakingId === m.id ? 'Pausar áudio' : 'Ouvir resposta'}
                        >
                          {speakingId === m.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          <span>{speakingId === m.id ? 'Pausar' : 'Ouvir'}</span>
                        </button>

                        {m.quickAction && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateTab(m.quickAction!.actionTab);
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-[10px] font-black cursor-pointer"
                          >
                            <span>{m.quickAction.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-cyan-400 p-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{copilotName} analisando banca e jurisprudência...</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* SUBTAB 3: MICRO-RESUMOS TEÓRICOS */}
        {activeSubTab === 'summaries' && (
          <div className="space-y-3 animate-fadeIn">
            
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <span className="text-xs font-black text-blue-900 dark:text-cyan-200">
                Caderno de Sinopses 80/20
              </span>
              <button
                type="button"
                onClick={() => {
                  onNavigateTab('summaries');
                  onClose();
                }}
                className="text-[11px] font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Central Completa</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">
                Micro-Resumos Estratégicos:
              </span>
              <div className="flex flex-col gap-1.5">
                {summaries.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSummary(s)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                      selectedSummary?.id === s.id
                        ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-950 dark:text-white font-bold ring-1 ring-blue-500/30'
                        : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">{s.subjectName}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">{s.banca}</span>
                    </div>
                    <p className="line-clamp-1">{s.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Summary Card */}
            {selectedSummary && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {selectedSummary.title}
                  </h4>
                  <button
                    onClick={() => handleToggleSpeech(selectedSummary.id, `${selectedSummary.title}. Disciplina: ${selectedSummary.subjectName}. Banca: ${selectedSummary.banca}. Pontos chave: ${selectedSummary.keyPoints.join('. ')}. Alerta de armadilha: ${selectedSummary.bancaTrapAlert}. Mnemônico: ${selectedSummary.mnemonic || ''}`)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                      speakingId === selectedSummary.id
                        ? 'bg-blue-600 text-white border-blue-500 animate-pulse'
                        : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                    }`}
                    title={speakingId === selectedSummary.id ? 'Pausar áudio' : 'Ouvir resumo'}
                  >
                    {speakingId === selectedSummary.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{speakingId === selectedSummary.id ? 'Pausar' : 'Ouvir'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Pontos Chave:</span>
                  <ul className="space-y-1">
                    {selectedSummary.keyPoints.map((kp, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-1.5 leading-snug">
                        <span className="text-blue-600 dark:text-cyan-400 font-bold">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-800 dark:text-rose-200 space-y-0.5">
                  <div className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span>Armadilha da Banca:</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">{selectedSummary.bancaTrapAlert}</p>
                </div>

                {selectedSummary.mnemonic && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Mnemônico:</span>
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">{selectedSummary.mnemonic}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Bottom Input Area for Chat */}
      {activeSubTab === 'chat' && (
        <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1427] shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Tire sua dúvida com a banca..."
              className="flex-1 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={!inputQuery.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              title="Enviar pergunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </aside>
  );
};
