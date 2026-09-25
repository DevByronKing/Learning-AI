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
  VolumeX
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

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.text) {
          const botMsg: CopilotMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: 'Agora',
            quickAction: data.quickAction
          };
          setMessages(prev => [...prev, botMsg]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error('Falha na resposta da API');
    } catch {
      // Fallback cognitivo resiliente em caso de falha de rede
      let botResponse = '';
      let actionRecommendation: { label: string; actionTab: string } | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('cebraspe') || lower.includes('fgv') || lower.includes('banca')) {
        botResponse = `### Raio-X de Estilo de Banca:\n\n* **Cebraspe (C/E)**: A banca é cirúrgica e semântica. Ela constrói uma afirmativa de 4 linhas perfeitamente correta e troca apenas **uma palavra no final** (ex: trocando "imprescritível" por "prescritível", ou "salvo" por "inclusive"). Além disso, lembre-se: 1 errada anula 1 certa! Se tiver dúvida real, deixe em branco.\n\n* **FGV (A a E)**: Cria um caso prático fictício longo ("O prefeito Tício...", "A empresa Alfa..."). A pegadinha está na premissa: muitas vezes a resposta correta não é a mais justa, mas sim a literalidade do CTN ou a jurisprudência vinculante do STJ/STF.`;
        actionRecommendation = { label: 'Treinar Simulador Cebraspe', actionTab: 'simulator' };
      } else if (lower.includes('8.112') || lower.includes('posse') || lower.includes('exercício')) {
        botResponse = `### Mnemônico de Prazos — Lei 8.112/90:\n\n* **Nomeação ➔ Posse**: **30 dias** (improrrogáveis). Se não tomar posse: ato tornado sem efeito.\n* **Posse ➔ Exercício**: **15 dias** (improrrogáveis). Se não entrar em exercício: **DEMISSÃO? NÃO!** O servidor é **EXONERADO**!\n\n💡 **Mnemônico**: *P-O-S-S-E (30 dias) ➔ E-X-E-R-C-Í-C-I-O (15 dias)*.\n⚠️ *Pegadinha favorita da banca*: Dizer que quem não entra em exercício é demitido. Lembre-se: ainda não é estável nem iniciou, logo é exoneração!`;
        actionRecommendation = { label: 'Ver Artigos no Vade Mecum', actionTab: 'vademecum' };
      } else {
        botResponse = `Olá, **${profile?.warName || profile?.name || 'Guerreiro(a)'}**! Com base nas estatísticas das bancas para concursos federais:\n\n* **Regra de Ouro**: Mais de 70% das assertivas reproduzem fielmente o texto da lei seca com alteração de conectivos restritivos (*"sempre"*, *"nunca"*, *"salvo"*, *"exclusivamente"*).\n* **Estratégia Recomendada para Hoje**: Dedique 20 minutos à resolução de 10 questões do seu tópico vulnerável (**${profile?.weakSubject || blindSpotTopic?.name || 'Direito Administrativo'}**) e revise os flashcards agendados para consolidar a curva de esquecimento.`;
        actionRecommendation = { label: 'Ir para a Missão do Dia', actionTab: 'cycle' };
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div 
        className="w-full max-w-lg bg-white dark:bg-dark-bg/95 border-l border-slate-200 dark:border-indigo-500/20 shadow-2xl h-full flex flex-col backdrop-blur-2xl animate-slideLeft"
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-dark-surface dark:to-dark-bg">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-950 border border-amber-400/50 shadow-md shrink-0 relative">
              {guardian.avatar3dUrl ? (
                <img src={guardian.avatar3dUrl} alt={copilotName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {copilotEmoji}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-slate-900 dark:text-white">{copilotName}</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  COPILOTO 2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {copilotTitle} • Waze dos Estudos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs Header */}
        <div className="flex items-center justify-around border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-dark-surface/40 p-1.5 text-xs">
          <button
            onClick={() => setActiveSubTab('mission')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeSubTab === 'mission'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Missão do Dia</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tira-Dúvidas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('summaries')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${
              activeSubTab === 'summaries'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Micro-Resumos</span>
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: MISSÃO DO DIA (WAZE DOS ESTUDOS) */}
          {activeSubTab === 'mission' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Mission Hero Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 dark:from-blue-950/30 dark:via-dark-surface dark:to-slate-900/40 border border-blue-200 dark:border-blue-500/30 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Ação de Maior Impacto na Nota de Corte</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20">
                    URGENTE
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Dominar Ponto Cego: {blindSpotTopic?.name || 'Tópico Prioritário'}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Seu índice de acertos neste tópico está abaixo do corte histórico da banca <strong>{selectedExam?.banca || 'Cebraspe'}</strong>. O algoritmo identificou alta probabilidade de cobrança com armadilhas doutrinárias.
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Tempo sugerido:</span>
                    <strong className="text-slate-900 dark:text-white">35 minutos</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Meta de fixação:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">10 questões + 1 micro-resumo</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Ganho estimado:</span>
                    <strong className="text-indigo-600 dark:text-indigo-300">+4.2 pts líquidos</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('simulator');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span>INICIAR MISSÃO NO SIMULADOR</span>
                </button>
              </div>

              {/* Status checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Checklist Cognitivo do Dia
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-surface/60 border border-slate-200 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-700 dark:text-slate-200">Revisão SRS SM-2 de Flashcards</span>
                    </div>
                    <button 
                      onClick={() => { onClose(); onNavigateTab('analytics'); }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Abrir
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-surface/60 border border-slate-200 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        pendingMistakesCount > 0 ? 'border-amber-400 text-amber-400' : 'border-emerald-400 text-emerald-400'
                      }`}>
                        {pendingMistakesCount > 0 ? '!' : '✓'}
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">
                        Zerar Caderno de Erros ({pendingMistakesCount} pendências)
                      </span>
                    </div>
                    <button 
                      onClick={() => { onClose(); onNavigateTab('mistakes'); }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                    >
                      Revanche
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-surface/60 border border-slate-200 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-200">Leitura de 5 Artigos Grifados da Lei Seca</span>
                    </div>
                    <button 
                      onClick={() => { onClose(); onNavigateTab('vademecum'); }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold"
                    >
                      Ler Lei
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CHAT COGNITIVO TIRA-DÚVIDAS */}
          {activeSubTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-full animate-fadeIn">
              
              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  Dúvidas Rápidas de Alta Incidência:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickPrompts.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPrompt(qp.prompt)}
                      className="text-left px-3 py-2 rounded-xl bg-white dark:bg-dark-surface/80 hover:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-slate-600 dark:text-slate-300 text-xs transition-all flex items-center justify-between"
                    >
                      <span>{qp.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 pt-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-dark-surface border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {m.text}
                      </div>

                      {m.sender === 'assistant' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleToggleSpeech(m.id, m.text)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              speakingId === m.id
                                ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse shadow-sm shadow-indigo-600/30'
                                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}
                            title={speakingId === m.id ? 'Pausar áudio' : 'Ouvir resposta com o Copiloto'}
                          >
                            {speakingId === m.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            <span>{speakingId === m.id ? 'Pausar Áudio' : 'Ouvir Resposta'}</span>
                          </button>

                          {m.quickAction && (
                            <button
                              onClick={() => {
                                onClose();
                                onNavigateTab(m.quickAction!.actionTab);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold"
                            >
                              <span>{m.quickAction.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{copilotName} analisando jurisprudência e banca...</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: MICRO-RESUMOS TEÓRICOS */}
          {activeSubTab === 'summaries' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40">
                <span className="text-[11px] font-black text-indigo-900 dark:text-indigo-200">
                  Caderno de Sinopses 80/20
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('summaries');
                    onClose();
                  }}
                  className="text-[11px] font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Abrir Central</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  Selecione o Micro-Resumo da Banca:
                </span>
                <div className="flex flex-col gap-2">
                  {summaries.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSummary(s)}
                      className={`text-left p-3 rounded-xl border transition-all text-xs shadow-sm ${
                        selectedSummary?.id === s.id
                          ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-950 dark:text-white font-bold ring-1 ring-indigo-500/20'
                          : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">{s.subjectName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">{s.banca}</span>
                      </div>
                      <p className="line-clamp-1">{s.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Summary Card */}
              {selectedSummary && (
                <div className="p-4 rounded-2xl bg-white dark:bg-dark-surface border border-indigo-200 dark:border-indigo-500/20 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-500/20 pb-2">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {selectedSummary.title}
                    </h4>
                    <button
                      onClick={() => handleToggleSpeech(selectedSummary.id, `${selectedSummary.title}. Disciplina: ${selectedSummary.subjectName}. Banca: ${selectedSummary.banca}. Pontos chave: ${selectedSummary.keyPoints.join('. ')}. Alerta de armadilha: ${selectedSummary.bancaTrapAlert}. Mnemônico: ${selectedSummary.mnemonic || ''}`)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
                        speakingId === selectedSummary.id
                          ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse shadow-sm shadow-indigo-600/30'
                          : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                      }`}
                      title={speakingId === selectedSummary.id ? 'Pausar áudio' : 'Ouvir resumo completo'}
                    >
                      {speakingId === selectedSummary.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{speakingId === selectedSummary.id ? 'Pausar' : 'Ouvir Resumo'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Pontos Chave:</span>
                    <ul className="space-y-1.5">
                      {selectedSummary.keyPoints.map((kp, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-800 dark:text-rose-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                      <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      <span>Alerta de Armadilha da Banca:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">{selectedSummary.bancaTrapAlert}</p>
                  </div>

                  {selectedSummary.mnemonic && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                        <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Mnemônico de Fixação Rápida:</span>
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
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-dark-surface/80">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                placeholder="Pergunte sobre jurisprudência, prazos ou bancas..."
                className="flex-1 bg-slate-50 dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              <button
                onClick={() => handleSendPrompt()}
                disabled={!inputQuery.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
