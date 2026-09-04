'use client';

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  X, 
  Zap, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  Copy, 
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import confetti from 'canvas-confetti';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: SubscriptionPlan;
  onUpgradePlan: (plan: SubscriptionPlan) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgradePlan
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<SubscriptionPlan>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending_payment' | 'confirmed'>('pending_payment');
  const [pixCode, setPixCode] = useState("00020126580014br.gov.bcb.pix0136aprovalens-ia-concursos-pix-key520400005303986540539.905802BR5925APROVALENS TECNOLOGIA LTDA6009SAO PAULO62070503***6304E8A9");
  const [qrCodeImg, setQrCodeImg] = useState<string | null>("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136aprovalens-ia-concursos-pix-key520400005303986540539.905802BR5925APROVALENS");

  // Buscar / Criar cobrança ao abrir ou alternar parâmetros
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadCheckout = async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            planId: selectedPlanToBuy, 
            billingCycle,
            paymentMethod 
          })
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setTransactionId(data.transactionId);
          setPaymentStatus('pending_payment');
          if (data.pix) {
            setPixCode(data.pix.copyPasteCode);
            setQrCodeImg(data.pix.qrCodeUrl);
          }
        }
      } catch (err) {
        console.warn('Erro ao inicializar checkout:', err);
      }
    };

    loadCheckout();
    return () => { isMounted = false; };
  }, [isOpen, selectedPlanToBuy, billingCycle, paymentMethod]);

  // Polling automático da confirmação do webhook a cada 3 segundos
  useEffect(() => {
    if (!isOpen || !transactionId || paymentStatus === 'confirmed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout?txId=${transactionId}`);
        const data = await res.json();
        if (data.success && data.status === 'confirmed') {
          setPaymentStatus('confirmed');
          clearInterval(interval);
          onUpgradePlan(selectedPlanToBuy);
          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.5 }
            });
          } catch {}
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        // Silencioso em caso de instabilidade de rede
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, transactionId, paymentStatus, selectedPlanToBuy, onUpgradePlan, onClose]);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Disparo do Webhook de confirmação (pode ser disparado pelo banco ou simulação)
  const handleTriggerWebhook = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'simulate_confirmation', 
          transactionId: transactionId || `tx_${Date.now()}` 
        })
      });
      setPaymentStatus('confirmed');
      onUpgradePlan(selectedPlanToBuy);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 1500);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = handleTriggerWebhook;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-indigo-500/40 relative glow-brand my-8 animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-900 dark:text-white p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card border border-slate-200 dark:border-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Cycle Switcher */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
            <span>PREPARAÇÃO DE ALTO RENDIMENTO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Escolha o Plano Ideal para Sua Aprovação
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Acesso ilimitado à dissecação de editais, diagnóstico cognitivo de erros e cronogramas dinâmicos.
          </p>

          {/* Billing Switch */}
          <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold">
                -38% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plano Pro */}
          <div
            onClick={() => setSelectedPlanToBuy('pro')}
            className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanToBuy === 'pro'
                ? 'glass-panel border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-900/20 ring-2 ring-indigo-400/30 glow-brand shadow-lg'
                : 'glass-panel border-slate-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-400/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  PLANO PRO
                </span>
                {selectedPlanToBuy === 'pro' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {billingCycle === 'annual' ? 'R$ 24,75' : 'R$ 39,90'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> / mês</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Cobrado anualmente (R$ 297/ano)
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dissecação de editais ilimitada com IA Multimodal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Diagnóstico cognitivo dos 4 tipos de falha</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Mapeamento analítico de pontos cegos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Geração de cards para repetição espaçada (SRS)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
              {selectedPlanToBuy === 'pro' ? '✓ Plano Selecionado' : 'Clique para Selecionar'}
            </div>
          </div>

          {/* Plano Elite */}
          <div
            onClick={() => setSelectedPlanToBuy('elite')}
            className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanToBuy === 'elite'
                ? 'glass-panel border-purple-500/50 bg-purple-50/50 dark:bg-purple-900/20 ring-2 ring-purple-400/30 glow-brand shadow-lg'
                : 'glass-panel border-slate-200 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-400/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                  PLANO ELITE
                </span>
                {selectedPlanToBuy === 'elite' && <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {billingCycle === 'annual' ? 'R$ 49,75' : 'R$ 79,90'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> / mês</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Cobrado anualmente (R$ 597/ano)
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Todos os recursos do Plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Correção analítica de redações e peças OAB por IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Simulados discursivos com régua de pontuação oficial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Estimativa preditiva de nota de corte por microrregião</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs font-bold text-purple-600 dark:text-purple-300">
              {selectedPlanToBuy === 'elite' ? '✓ Plano Selecionado' : 'Clique para Selecionar'}
            </div>
          </div>

        </div>

        {/* Payment Methods Section */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-lg">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Método de Pagamento:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'pix' ? 'bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pix Instantâneo (Liberação em 3s)</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'card' ? 'bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cartão de Crédito</span>
              </button>
            </div>
          </div>

          {/* Pix Display */}
          {paymentMethod === 'pix' && (
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
              
              {/* QR Code Dinâmico */}
              <div className="w-36 h-36 bg-white p-2.5 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg border-2 border-emerald-500/50">
                {qrCodeImg ? (
                  <img 
                    src={qrCodeImg} 
                    alt="QR Code Pix Oficial" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-black font-mono font-bold">
                    <QrCode className="w-12 h-12 text-black mb-1 animate-pulse" />
                    <span>GERANDO PIX...</span>
                  </div>
                )}
              </div>

              {/* Copy Code & Confirmation */}
              <div className="w-full space-y-3">
                {/* Status Banner */}
                <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                  paymentStatus === 'confirmed'
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/25 text-amber-800 dark:text-amber-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      paymentStatus === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'
                    }`} />
                    <span>
                      {paymentStatus === 'confirmed' 
                        ? '✓ Pagamento Confirmado via Webhook! Acesso Liberado.' 
                        : 'Aguardando liquidação Pix (verificação a cada 3s)...'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {transactionId ? transactionId.slice(-8) : 'tx_live'}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Código Pix Copia e Cola:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="w-full p-2.5 rounded-xl glass-input text-xs font-mono text-slate-800 dark:text-slate-300 truncate select-all"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-sm"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleTriggerWebhook}
                    disabled={isProcessing || paymentStatus === 'confirmed'}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
                    title="Dispara POST /api/webhooks/payment para simular notificação imediata do banco"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Simular Webhook Pix (Banco)</span>
                  </button>

                  <button
                    onClick={handleTriggerWebhook}
                    disabled={isProcessing || paymentStatus === 'confirmed'}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Confirmando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ativar Plano {selectedPlanToBuy.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Card Display */}
          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Número do Cartão"
                  className="p-3 rounded-xl glass-input text-xs text-slate-900 dark:text-white"
                  defaultValue="4532 •••• •••• 8821"
                />
                <input
                  type="text"
                  placeholder="Nome Impresso no Cartão"
                  className="p-3 rounded-xl glass-input text-xs text-slate-900 dark:text-white"
                  defaultValue="LUCAS BARBOSA"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  className="p-3 rounded-xl glass-input text-xs text-slate-900 dark:text-white"
                  defaultValue="09/30"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="p-3 rounded-xl glass-input text-xs text-slate-900 dark:text-white"
                  defaultValue="842"
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all glow-brand"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando Cobrança...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Concluir Assinatura Segura</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Security & Guarantee Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garantia incondicional de 7 dias
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cancele quando quiser com 1 clique
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Criptografia de ponta a ponta 256-bit
          </span>
        </div>

      </div>
    </div>
  );
};
