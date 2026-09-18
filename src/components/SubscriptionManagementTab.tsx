'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  Download, 
  Crown, 
  Zap, 
  ArrowUpRight, 
  FileText, 
  ShieldAlert, 
  X, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { SubscriptionPlan, SubscriptionDetail } from '@/lib/types';
import { INITIAL_SUBSCRIPTION_DETAIL } from '@/lib/concursosData';

interface SubscriptionManagementTabProps {
  currentPlan: SubscriptionPlan;
  onUpgradePlan: (plan: SubscriptionPlan) => void;
  onOpenPricing: () => void;
  showToast: (msg: string) => void;
}

export const SubscriptionManagementTab: React.FC<SubscriptionManagementTabProps> = ({
  currentPlan,
  onUpgradePlan,
  onOpenPricing,
  showToast
}) => {
  const [subscription, setSubscription] = useState<SubscriptionDetail>({
    ...INITIAL_SUBSCRIPTION_DETAIL,
    planId: currentPlan
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isRetentionOfferVisible, setIsRetentionOfferVisible] = useState(false);

  const planTitle = 
    currentPlan === 'black' ? 'Plano BLACK VITALÍCIO (Até a Posse)' :
    currentPlan === 'elite' ? 'Plano ELITE VIP' : 
    currentPlan === 'pro' ? 'Plano PRO' : 'Plano Aspirante (Freemium)';

  const handleToggleAutoRenew = () => {
    const nextVal = !subscription.autoRenew;
    setSubscription(prev => ({ ...prev, autoRenew: nextVal }));
    showToast(nextVal ? 'Renovação automática ativada.' : 'Renovação automática pausada.');
  };

  const handleDownloadReceipt = (receiptCode: string, amount: number) => {
    const dummyReceipt = `
============================================================
              LEARNING AI SAAS - RECIBO DE PAGAMENTO
============================================================
Código de Autenticação: ${receiptCode}
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}
Plano: ${planTitle}
Valor Pago: R$ ${amount.toFixed(2)}
Forma de Pagamento: Pix / Cartão (Asaas Pagamentos S.A.)
Status: LIQUIDADO / CONFIRMADO
Instituição: Learning AI Tecnologia da Educação Ltda.
CNPJ: 54.892.102/0001-90
Garantia Legal: Art. 49 da Lei nº 8.078/1990 (CDC)
============================================================
Este comprovante é válido como recibo de prestação de serviços.
    `;
    const blob = new Blob([dummyReceipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo_${receiptCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Recibo ${receiptCode} baixado com sucesso!`);
  };

  const handleStartCancel = () => {
    setIsCancelModalOpen(true);
    setIsRetentionOfferVisible(false);
  };

  const handleSelectReason = (reason: string) => {
    setCancelReason(reason);
    if (reason === 'financeiro') {
      setIsRetentionOfferVisible(true);
    } else {
      setIsRetentionOfferVisible(false);
    }
  };

  const handleAcceptDiscount = () => {
    showToast('🎉 Oferta de permanência ativada! 50% de desconto aplicado nas próximas 3 mensalidades.');
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = () => {
    setSubscription(prev => ({
      ...prev,
      status: 'cancelada',
      autoRenew: false
    }));
    setIsCancelModalOpen(false);
    showToast('Assinatura cancelada com sucesso. Seu acesso continuará ativo até o fim do período vigente.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner de Status da Assinatura */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                subscription.status === 'ativa'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${subscription.status === 'ativa' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {subscription.status === 'ativa' ? 'Assinatura Ativa' : 'Cancelada (Acesso até o fim do ciclo)'}
              </span>

              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Ciclo {subscription.billingCycle}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-2">
              {currentPlan === 'black' ? (
                <Sparkles className="w-7 h-7 text-amber-400" />
              ) : currentPlan === 'elite' ? (
                <Crown className="w-7 h-7 text-amber-500" />
              ) : (
                <Zap className="w-7 h-7 text-blue-500" />
              )}
              {planTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {currentPlan === 'black' && subscription.billingCycle === 'vitalicio' ? (
                <span>Acesso Vitalício Permanente • Válido até a posse oficial</span>
              ) : (
                <>Próxima renovação em: <strong>{subscription.currentPeriodEnd}</strong> via {subscription.paymentMethodDesc}</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {currentPlan !== 'black' && (
              <button
                onClick={() => onUpgradePlan('black')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade para Black Vitalício</span>
              </button>
            )}

            {currentPlan === 'aspirante' && (
              <button
                onClick={() => onUpgradePlan('elite')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade para Elite</span>
              </button>
            )}

            <button
              onClick={onOpenPricing}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Matriz de Recursos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Detalhes da Cobrança */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Renovação */}
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Data de Expiração / Ciclo</h3>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{subscription.currentPeriodEnd}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subscription.autoRenew ? 'Renovação automática ligada.' : 'Assinatura não será cobrada novamente.'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Renovação Automática</span>
            <button
              onClick={handleToggleAutoRenew}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                subscription.autoRenew 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {subscription.autoRenew ? 'Ativada' : 'Desativada'}
            </button>
          </div>
        </div>

        {/* Card 2: Método de Pagamento */}
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Forma de Pagamento</h3>
            <p className="text-sm font-black text-slate-900 dark:text-white mt-1">{subscription.paymentMethodDesc}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gateway Asaas com suporte a Pix e Cartão.</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenPricing}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Alterar forma de pagamento</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Cancelamento */}
        <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-4">Cancelar Assinatura</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Cancele a qualquer momento sem burocracia ou multas rescisórias.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {subscription.status === 'ativa' ? (
              <button
                onClick={handleStartCancel}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Solicitar cancelamento da assinatura
              </button>
            ) : (
              <span className="text-xs font-bold text-slate-400">Assinatura já cancelada</span>
            )}
          </div>
        </div>

      </div>

      {/* Tabela de Histórico de Cobranças e Faturas */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Histórico de Cobranças & Recibos Fiscais
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprovantes emitidos automaticamente para prestação de contas ou declaração.
          </p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {subscription.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{inv.paidAt}</td>
                  <td className="py-3 px-4 uppercase font-extrabold text-blue-600 dark:text-blue-400">{inv.planId} ({inv.billingCycle})</td>
                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white">R$ {inv.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 uppercase font-bold text-slate-500">{inv.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Paga
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDownloadReceipt(inv.receiptCode, inv.amount)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-300 text-blue-600 dark:text-blue-400 font-bold text-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Recibo</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CANCELAMENTO & RETENÇÃO */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Sentiremos sua falta no Learning AI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conta para a gente o que aconteceu para melhorarmos a plataforma:
              </p>
            </div>

            {/* Opções de Motivo */}
            <div className="space-y-2 text-xs">
              {[
                { id: 'aprovado', label: '🎉 Fui aprovado(a) no meu concurso / Passei na OAB!' },
                { id: 'financeiro', label: '💰 O valor da mensalidade pesou no momento' },
                { id: 'tempo', label: '⏳ Não estou conseguindo estudar na rotina atual' },
                { id: 'outro', label: '🔍 Outro motivo' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectReason(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                    cancelReason === opt.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Oferta de Retenção (se motivo financeiro) */}
            {isRetentionOfferVisible && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-500 font-black text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Proposta Especial de Permanência</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sabemos que a vida de concurseiro é desafiadora. Que tal continuar seus estudos com <strong>50% de desconto</strong> durante os próximos 3 meses?
                </p>
                <button
                  onClick={handleAcceptDiscount}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  Sim! Quero 50% de Desconto por 3 Meses
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
              >
                Voltar e Manter Assinatura
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20"
              >
                Confirmar Cancelamento
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
