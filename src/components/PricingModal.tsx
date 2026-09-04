'use client';

import React, { useState } from 'react';
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
  const [pixCode, setPixCode] = useState("00020126580014br.gov.bcb.pix0136aprovalens-ia-concursos-pix-key520400005303986540539.905802BR5925APROVALENS TECNOLOGIA LTDA6009SAO PAULO62070503***6304E8A9");
  const [qrCodeImg, setQrCodeImg] = useState<string | null>(null);

  if (!isOpen) return null;

  const fetchCheckoutData = async (plan: SubscriptionPlan) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan, paymentMethod })
      });
      const data = await res.json();
      if (data.success && data.pix) {
        setPixCode(data.pix.copyPasteCode);
        setQrCodeImg(data.pix.qrCodeUrl);
      }
    } catch {}
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanToBuy(plan);
    fetchCheckoutData(plan);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanToBuy, paymentMethod, status: 'confirmed' })
      });
    } catch {}

    setTimeout(() => {
      setIsProcessing(false);
      onUpgradePlan(selectedPlanToBuy);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-indigo-500/40 relative glow-brand my-8 animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-dark-card border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Cycle Switcher */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>PREPARAÇÃO DE ALTO RENDIMENTO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Escolha o Plano Ideal para Sua Aprovação
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Acesso ilimitado à dissecação de editais, diagnóstico cognitivo de erros e cronogramas dinâmicos.
          </p>

          {/* Billing Switch */}
          <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-dark-surface border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanToBuy === 'pro'
                ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-400/50 glow-brand'
                : 'bg-dark-surface/80 border-white/5 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PLANO PRO
                </span>
                {selectedPlanToBuy === 'pro' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {billingCycle === 'annual' ? 'R$ 24,75' : 'R$ 39,90'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Cobrado anualmente (R$ 297/ano)
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dissecação de editais ilimitada com IA Multimodal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diagnóstico cognitivo dos 4 tipos de falha</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mapeamento analítico de pontos cegos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Geração de cards para repetição espaçada (SRS)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs font-bold text-indigo-300">
              {selectedPlanToBuy === 'pro' ? '✓ Plano Selecionado' : 'Clique para Selecionar'}
            </div>
          </div>

          {/* Plano Elite */}
          <div
            onClick={() => setSelectedPlanToBuy('elite')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanToBuy === 'elite'
                ? 'bg-purple-600/15 border-purple-500 ring-2 ring-purple-400/50'
                : 'bg-dark-surface/80 border-white/5 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PLANO ELITE
                </span>
                {selectedPlanToBuy === 'elite' && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
              </div>

              <div className="mt-4 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {billingCycle === 'annual' ? 'R$ 49,75' : 'R$ 79,90'}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Cobrado anualmente (R$ 597/ano)
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Todos os recursos do Plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Correção analítica de redações e peças OAB por IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulados discursivos com régua de pontuação oficial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Estimativa preditiva de nota de corte por microrregião</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs font-bold text-purple-300">
              {selectedPlanToBuy === 'elite' ? '✓ Plano Selecionado' : 'Clique para Selecionar'}
            </div>
          </div>

        </div>

        {/* Payment Methods Section */}
        <div className="mt-8 p-6 rounded-3xl bg-dark-surface/90 border border-white/10">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs font-bold text-slate-300">Método de Pagamento:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'pix' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pix Instantâneo (Liberação em 3s)</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  paymentMethod === 'card' ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300' : 'text-slate-400 hover:text-white'
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
              
              {/* QR Code Mockup */}
              <div className="w-36 h-36 bg-white p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <div className="w-full h-full border-4 border-black border-dashed flex flex-col items-center justify-center p-2 text-center text-[10px] text-black font-mono font-bold">
                  <QrCode className="w-16 h-16 text-black" />
                  <span>PIX OFICIAL</span>
                </div>
              </div>

              {/* Copy Code & Confirmation */}
              <div className="w-full space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Código Pix Copia e Cola:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixCode}
                      className="w-full p-2.5 rounded-xl glass-input text-xs font-mono text-slate-300 truncate"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all glow-emerald"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirmando Pagamento...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simular Pagamento & Ativar Plano {selectedPlanToBuy.toUpperCase()}</span>
                    </>
                  )}
                </button>
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
                  className="p-3 rounded-xl glass-input text-xs text-white"
                  defaultValue="4532 •••• •••• 8821"
                />
                <input
                  type="text"
                  placeholder="Nome Impresso no Cartão"
                  className="p-3 rounded-xl glass-input text-xs text-white"
                  defaultValue="LUCAS BARBOSA"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Validade (MM/AA)"
                  className="p-3 rounded-xl glass-input text-xs text-white"
                  defaultValue="09/30"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="p-3 rounded-xl glass-input text-xs text-white"
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
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
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
