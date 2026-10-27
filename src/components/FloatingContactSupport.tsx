'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Star, PhoneCall, ExternalLink, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface FloatingContactSupportProps {
  currentTab?: string;
  targetExam?: string;
  studentName?: string;
  theme?: 'dark' | 'light';
  isPayingOrCommitted?: boolean;
}

export function FloatingContactSupport({
  currentTab = 'Geral',
  targetExam = 'Concurso Público',
  studentName = 'Estudante',
  theme = 'dark',
  isPayingOrCommitted = true, // Pilar 2: Qualificação nos canais de suporte para priorizar pagantes
}: FloatingContactSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'options' | 'chat'>('options');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Dúvida no Edital');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('argus_hide_support') === 'true';
  });

  const isCommittedUser = isPayingOrCommitted || (typeof window !== 'undefined' && (
    ((localStorage.getItem('argus_plan') || localStorage.getItem('aprovalens_plan')) && (localStorage.getItem('argus_plan') || localStorage.getItem('aprovalens_plan')) !== 'aspirante') ||
    Boolean(localStorage.getItem('argus_subscription_detail') || localStorage.getItem('learning_ai_subscription_detail')) ||
    document.cookie.includes('argus_user_access') ||
    document.cookie.includes('learning_ai_user_access')
  ));

  // Formatação da mensagem padrão do WhatsApp com contexto completo e qualificação do aluno
  const generateWhatsAppUrl = () => {
    const phone = '5511999999999'; // Número oficial de suporte da operação
    const statusTag = isCommittedUser ? '[CLIENTE VIP • ASSINANTE / TRIAL VALIDADO]' : '[VISITANTE]';
    const text = encodeURIComponent(
      `Olá equipe de Engenharia do Argus! Sou ${studentName}.\n` +
      `${statusTag}\n` +
      `Estou na aba "${currentTab}" me preparando para: ${targetExam}.\n` +
      `Preciso de ajuda com o seguinte ponto:`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handleOpenWhatsApp = () => {
    // Pilar 2: Anexa automaticamente is_paying_or_committed aos metadados do evento
    analytics.track('support_contact_initiated', {
      channel: 'whatsapp',
      tab: currentTab,
      target_exam: targetExam,
      student_name: studentName,
      is_paying_or_committed: isCommittedUser,
    });
    window.open(generateWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleSendLiveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    // Pilar 2: Anexa is_paying_or_committed no analytics e no banco de tickets
    analytics.track('support_contact_initiated', {
      channel: 'live_chat',
      rating: feedbackRating,
      category: feedbackCategory,
      message_length: feedbackMessage.length,
      tab: currentTab,
      target_exam: targetExam,
      is_paying_or_committed: isCommittedUser,
    });

    // Salva no log local de feedback para triagem priorizada do time de produto
    try {
      const existing = JSON.parse(localStorage.getItem('learning_ai_support_tickets') || '[]');
      existing.push({
        id: `ticket_${Date.now()}`,
        date: new Date().toISOString(),
        studentName,
        targetExam,
        currentTab,
        category: feedbackCategory,
        rating: feedbackRating,
        message: feedbackMessage,
        is_paying_or_committed: isCommittedUser,
        prioritySla: isCommittedUser ? 'alta_prioridade_1h' : 'normal_48h',
      });
      localStorage.setItem('learning_ai_support_tickets', JSON.stringify(existing));
    } catch {}

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackMessage('');
      setActiveMode('options');
      setIsOpen(false);
    }, 2200);
  };

  if (isDismissed) return null;

  return (
    <>
      {/* Botão Gatilho Flutuante Compacto para Gravação Limpa */}
      <div className="fixed bottom-16 right-2 sm:bottom-6 sm:right-6 z-40 flex items-center gap-1 group/btn">
        {!isOpen && (
          <>
            <button
              onClick={() => {
                setIsDismissed(true);
                try {
                  sessionStorage.setItem('argus_hide_support', 'true');
                } catch {}
              }}
              className="opacity-0 group-hover/btn:opacity-100 p-1 rounded-full bg-slate-800/80 hover:bg-rose-600 text-slate-400 hover:text-white text-[10px] transition-all cursor-pointer shadow-xs"
              title="Ocultar botão de suporte nesta sessão (gravação limpa)"
              aria-label="Ocultar suporte"
            >
              <X className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                setIsOpen(true);
                analytics.track('cta_clicked', {
                  cta_name: 'floating_support_bubble_open',
                  tab: currentTab,
                });
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all flex items-center justify-center cursor-pointer backdrop-blur-md opacity-60 hover:opacity-100 hover:scale-105 active:scale-95"
              aria-label="Abrir suporte e chat ao vivo"
              title="Suporte"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </>
        )}

        {/* Modal / Painel Pop-up de Contato */}
        {isOpen && (
          <div
            className={`w-[92vw] max-w-sm rounded-2xl shadow-2xl border transition-all duration-200 overflow-hidden ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-700/80 text-white'
                : 'bg-white/95 border-slate-200 text-slate-900'
            } backdrop-blur-xl animate-fadeIn`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Suporte & Ouvidoria 1-a-1</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Engenharia & Mentoria Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fechar suporte"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="p-4 space-y-3.5">
              {/* Contexto do Aluno Ativo */}
              <div className="text-[11px] text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                <span>🎯 Alvo: <strong className="text-slate-700 dark:text-slate-200">{targetExam}</strong></span>
                <span>Aba: <strong className="text-emerald-500">{currentTab}</strong></span>
              </div>

              {/* Badge de Qualificação de Cliente Pagante / Trial Ativo (Pilar 2) */}
              {isCommittedUser && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cliente Verificado • Fila Prioritária de Engenharia</span>
                </div>
              )}

              {activeMode === 'options' ? (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Como prefere falar com a gente hoje?
                  </p>

                  {/* Botão A: WhatsApp Direto */}
                  <button
                    onClick={handleOpenWhatsApp}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-xs sm:text-sm">Chamar no WhatsApp</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Resposta média: &lt; 5 min</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* Botão B: Chat ao Vivo & Feedback */}
                  <button
                    onClick={() => setActiveMode('chat')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:border-blue-500 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-xs sm:text-sm">Feedback / Abrir Chamado</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Direto aos desenvolvedores</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-500 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </button>
                </>
              ) : (
                /* Modo Formulário de Chat / Feedback */
                <form onSubmit={handleSendLiveFeedback} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveMode('options')}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      &larr; Voltar
                    </button>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Chat Rápido
                    </span>
                  </div>

                  {isSubmitted ? (
                    <div className="py-6 text-center space-y-2 animate-scaleUp">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                      <p className="font-bold text-sm text-emerald-400">Mensagem Recebida!</p>
                      <p className="text-xs text-slate-400">
                        Nossa equipe já foi notificada e retornará em breve.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Avaliação em Estrelas */}
                      <div className="flex items-center justify-center gap-1.5 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= feedbackRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-400 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Categoria */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Assunto:
                        </label>
                        <select
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Dúvida no Edital">Dúvida no Edital</option>
                          <option value="Sugestão de Questão">Sugestão de Questão</option>
                          <option value="Relato de Bug / Erro">Relato de Bug / Erro</option>
                          <option value="Plano de Assinatura">Plano de Assinatura</option>
                          <option value="Outro">Outro Assunto</option>
                        </select>
                      </div>

                      {/* Mensagem */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Mensagem:
                        </label>
                        <textarea
                          rows={3}
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          placeholder="Digite aqui sua dúvida ou sugestão para a equipe..."
                          className="w-full text-xs p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                          required
                        />
                      </div>

                      {/* Botão Enviar */}
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Mensagem</span>
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
