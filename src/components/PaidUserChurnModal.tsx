'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  ShieldAlert,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { SubscriptionPlan, PaidUserChurnFeedback } from '@/lib/types';
import { analytics } from '@/lib/analytics';

export interface PaidUserChurnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (feedback: PaidUserChurnFeedback) => void;
  planId: SubscriptionPlan;
  isTrial?: boolean;
  daysActive?: number;
  userId?: string;
}

export const MODULE_OPTIONS = [
  { id: 'copiloto_cognitivo', label: '🤖 Copiloto Cognitivo & Resoluções de IA', description: 'Explicações e desmonte de pegadinhas' },
  { id: 'arena_combate', label: '⚔️ Arena de Combate 60/40', description: 'Duelos gamificados de velocidade e precisão' },
  { id: 'vade_mecum', label: '📜 Smart Vade Mecum Semântico', description: 'Busca de artigos de lei e jurisprudência' },
  { id: 'flashcards_srs', label: '🧠 Flashcards SRS & Curva do Esquecimento', description: 'Repetição espaçada algorítmica' },
  { id: 'discursivas_ia', label: '✍️ Correção de Discursivas & Peças OAB', description: 'Espelho de correção e critérios de banca' },
  { id: 'simulados_tri', label: '🎯 Banco de Questões & Calibragem TRI', description: 'Acervo de questões e nota de corte real' },
  { id: 'ciclo_estudos', label: '📅 Ciclo de Estudos & Planejador Diário', description: 'Cronograma automatizado de disciplinas' },
  { id: 'outro', label: '🔍 Outra Funcionalidade ou Expectativa Geral', description: 'Aspectos gerais da plataforma' },
];

export const CHURN_REASONS = [
  { id: 'explicacao_ia_insuficiente', label: 'Respostas da IA não aprofundaram na banca (FGV/Cebraspe)', category: 'qualidade_produto' },
  { id: 'banco_questoes_desatualizado', label: 'Faltaram questões recentes da minha banca específica', category: 'conteudo' },
  { id: 'preco_mensalidade', label: 'O valor da assinatura pesou no orçamento atual', category: 'preco' },
  { id: 'aprovado_concurso', label: '🎉 Fui aprovado(a) no concurso / Passei na 2ª Fase OAB!', category: 'sucesso' },
  { id: 'dificuldade_plataforma', label: 'Achei a plataforma complexa ou encontrei instabilidade', category: 'usabilidade' },
  { id: 'falta_tempo', label: 'Não estou conseguindo estudar na rotina atual', category: 'rotina' },
  { id: 'outro', label: 'Outro motivo particular', category: 'outro' },
];

export const PaidUserChurnModal: React.FC<PaidUserChurnModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel,
  planId,
  isTrial = false,
  daysActive = 7,
  userId = 'user_current'
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [retentionOfferPresented, setRetentionOfferPresented] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectReason = (reasonId: string) => {
    setSelectedReason(reasonId);
    setValidationError(null);
    if (reasonId === 'preco_mensalidade' || reasonId === 'falta_tempo') {
      setRetentionOfferPresented(true);
    } else {
      setRetentionOfferPresented(false);
    }
  };

  const handleAcceptRetentionOffer = () => {
    const feedback: PaidUserChurnFeedback = {
      userId,
      planId,
      isTrial,
      daysActive,
      failedModule: selectedModule || 'nao_informado',
      churnReason: selectedReason || 'oferta_retencao_aceita',
      feedbackText: feedbackText.trim() || 'Aceitou oferta de permanência',
      retentionOfferPresented: true,
      retentionOfferAccepted: true,
      timestamp: new Date().toISOString(),
    };

    // Disparo para PostHog registrando retenção bem-sucedida
    analytics.track('paid_user_churn_feedback', {
      ...feedback,
      action: 'retention_accepted',
      discount_applied: '50%_off_3_months',
    });

    onClose();
  };

  const handleProceedCancel = () => {
    if (!selectedModule) {
      setValidationError('Por favor, selecione qual módulo ou funcionalidade não atendeu sua expectativa.');
      return;
    }
    if (!selectedReason) {
      setValidationError('Por favor, selecione o motivo principal do cancelamento.');
      return;
    }

    setIsSubmitting(true);

    const feedbackPayload: PaidUserChurnFeedback = {
      userId,
      planId,
      isTrial,
      daysActive,
      failedModule: selectedModule,
      churnReason: selectedReason,
      feedbackText: feedbackText.trim(),
      retentionOfferPresented,
      retentionOfferAccepted: false,
      timestamp: new Date().toISOString(),
    };

    // DISPARO OBRIGATÓRIO PARA O POSTHOG & ANALYTICS:
    // Captura com precisão diagnóstica em qual funcionalidade o produto falhou
    analytics.track('paid_user_churn_feedback', {
      ...feedbackPayload,
      action: 'cancellation_confirmed',
      user_tier: isTrial ? 'card_trial' : 'paying_subscriber',
      failed_module_label: MODULE_OPTIONS.find(m => m.id === selectedModule)?.label,
      churn_reason_label: CHURN_REASONS.find(r => r.id === selectedReason)?.label,
    });

    // Salvar no histórico local para rastreabilidade de produto
    try {
      const storedChurns = JSON.parse(localStorage.getItem('learning_ai_churn_diagnostics') || '[]');
      storedChurns.push(feedbackPayload);
      localStorage.setItem('learning_ai_churn_diagnostics', JSON.stringify(storedChurns));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmCancel(feedbackPayload);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          aria-label="Fechar diagnóstico"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header com Ícone de Alerta */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20">
            <TrendingDown className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-black uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Diagnóstico de Cancelamento de {isTrial ? 'Trial com Cartão' : 'Assinante Pagante'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Sentiremos sua falta no Learning AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Para que nossa equipe de engenharia e produto calibre a plataforma, nos ajude a entender exatamente onde falhamos com sua preparação:
          </p>
        </div>

        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          
          {/* PASSO 1: QUAL MÓDULO FALHOU? */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <span>1. Em qual módulo ou funcionalidade o Learning AI não atendeu suas expectativas?</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODULE_OPTIONS.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => { setSelectedModule(mod.id); setValidationError(null); }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedModule === mod.id
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-extrabold text-xs">{mod.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{mod.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PASSO 2: QUAL O MOTIVO PRINCIPAL? */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <span>2. Qual foi o fator determinante para a decisão?</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-1.5">
              {CHURN_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => handleSelectReason(reason.id)}
                  className={`w-full p-2.5 rounded-xl border text-left font-bold text-xs transition-all flex items-center justify-between ${
                    selectedReason === reason.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{reason.label}</span>
                  {selectedReason === reason.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PROPOSTA DE RETENÇÃO (SE APLICÁVEL) */}
          {retentionOfferPresented && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wide">
                <Sparkles className="w-4 h-4 fill-amber-500" />
                <span>Oferta Especial de Permanência Learning AI</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {isTrial ? (
                  <>Queremos que você tenha mais tempo para desfrutar da inteligência da banca sem pressão. Que tal <strong>mais 7 dias adicionais de trial gratuito</strong> sem qualquer cobrança hoje?</>
                ) : (
                  <>Sabemos o quanto a rotina de concursos exige resiliência financeira. Podemos aplicar <strong>50% de desconto imediato</strong> nas suas próximas 3 faturas para você não interromper seus estudos.</>
                )}
              </p>
              <button
                type="button"
                onClick={handleAcceptRetentionOffer}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{isTrial ? 'Sim! Estender Meu Período de Teste Grátis' : 'Aceitar 50% de Desconto por 3 Meses'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PASSO 3: FEEDBACK QUALITATIVO ABERTO */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>3. O que nossa equipe de engenharia poderia ter feito de diferente? (Opcional)</span>
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Ex: Gostaria de mais simulados específicos da FGV para Auditor Fiscal ou questões comentadas com áudio..."
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </div>

        {/* Ações Finais de Cancelamento */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all text-center"
          >
            Manter Minha Assinatura
          </button>
          <button
            type="button"
            onClick={handleProceedCancel}
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black text-xs transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Registrando Churn no PostHog...</span>
              </>
            ) : (
              <span>Confirmar Cancelamento Definitivo</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
