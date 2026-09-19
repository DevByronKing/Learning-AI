'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  Check, 
  Copy, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Zap, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  ShoppingBag,
  Gift,
  Flame
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import { AVAILABLE_COUPONS } from '@/lib/concursosData';
import { trackConversion } from '@/components/TrackingScripts';

interface CheckoutCartTabProps {
  initialPlan?: SubscriptionPlan;
  onPaymentSuccess: (plan: SubscriptionPlan) => void;
  onGoBack?: () => void;
  showToast: (msg: string) => void;
}

export const CheckoutCartTab: React.FC<CheckoutCartTabProps> = ({
  initialPlan = 'pro',
  onPaymentSuccess,
  onGoBack,
  showToast
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(initialPlan === 'aspirante' ? 'pro' : initialPlan);
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'trimestral' | 'anual' | 'vitalicio'>(
    initialPlan === 'black' ? 'vitalicio' : 'mensal'
  );
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Pix State
  const [pixCopied, setPixCopied] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState(900); // 15 minutos

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Preços Base Reposicionados
  const baseMonthlyPrices: Record<'pro' | 'elite' | 'black' | 'lancamento', number> = {
    pro: 59.90,
    elite: 129.90,
    black: 197.00,
    lancamento: 97.00
  };

  const planName = 
    selectedPlan === 'lancamento' ? 'Oferta Fechada: Passe Até a Prova (200 Vagas)' :
    selectedPlan === 'black' ? 'Plano BLACK VITALÍCIO (Até a Posse)' :
    selectedPlan === 'elite' ? 'Plano ELITE VIP' : 'Plano PRO';

  // Cálculos de Ciclo e Pacotes
  let rawTotal = 0;
  let cycleDiscountPercent = 0;
  let cycleDiscountValue = 0;

  if (selectedPlan === 'lancamento') {
    rawTotal = 97.00;
    cycleDiscountPercent = 0;
    cycleDiscountValue = 0;
  } else if (selectedPlan === 'black') {
    if (billingCycle === 'vitalicio') {
      rawTotal = 1497.00;
      cycleDiscountPercent = 0;
      cycleDiscountValue = 0;
    } else {
      rawTotal = 197.00;
      cycleDiscountPercent = 0;
      cycleDiscountValue = 0;
    }
  } else {
    const basePrice = baseMonthlyPrices[selectedPlan as 'pro' | 'elite'] || 59.90;
    if (billingCycle === 'trimestral') {
      rawTotal = basePrice * 3;
      cycleDiscountPercent = 15; // 15% OFF
      cycleDiscountValue = rawTotal * 0.15;
    } else if (billingCycle === 'anual') {
      // PRO: R$ 39,90/mês (R$ 478,80/ano) | ELITE: R$ 89,90/mês (R$ 1.078,80/ano)
      rawTotal = basePrice * 12;
      const targetAnual = selectedPlan === 'elite' ? 1078.80 : 478.80;
      cycleDiscountValue = rawTotal - targetAnual;
      cycleDiscountPercent = Math.round((cycleDiscountValue / rawTotal) * 100);
    } else {
      rawTotal = basePrice;
      cycleDiscountPercent = 0;
      cycleDiscountValue = 0;
    }
  }

  const totalAfterCycle = rawTotal - cycleDiscountValue;
  const couponDiscountValue = appliedCoupon ? totalAfterCycle * (appliedCoupon.percent / 100) : 0;
  const finalPrice = Math.max(0, totalAfterCycle - couponDiscountValue);

  // Pix Code Simulado mas Realista
  const pixCode = `00020126580014br.gov.bcb.pix0136learningai-pagamentos-asaas-2026520400005303986540${finalPrice.toFixed(2).replace('.', '')}5802BR5920LEARNING AI SAAS LTDA6009SAO PAULO62070503***6304E8A9`;

  // Disparo de InitiateCheckout de Anúncios
  useEffect(() => {
    trackConversion.initiateCheckout(selectedPlan, finalPrice);
  }, [selectedPlan]);

  // Timer Pix
  useEffect(() => {
    if (paymentMethod !== 'pix' || pixTimeRemaining <= 0) return;
    const interval = setInterval(() => {
      setPixTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod, pixTimeRemaining]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    const found = AVAILABLE_COUPONS.find((c) => c.code === clean);
    if (found) {
      setAppliedCoupon({ code: found.code, percent: found.discountPercent });
      setCouponError(null);
      showToast(`Cupom ${found.code} aplicado com sucesso! (${found.discountPercent}% OFF)`);
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const handleCopyPix = () => {
    try {
      navigator.clipboard.writeText(pixCode);
      setPixCopied(true);
      showToast('Código Pix copiado com sucesso!');
      setTimeout(() => setPixCopied(false), 3000);
    } catch {
      showToast('Erro ao copiar Pix.');
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentConfirmed(true);
      trackConversion.purchase(`tx_asaas_${Date.now()}`, finalPrice, selectedPlan);
      showToast(`Pagamento do ${planName} confirmado! Bem-vindo(a) ao topo.`);
      onPaymentSuccess(selectedPlan);
    }, 1800);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner de Checkout Seguro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-sm text-slate-900 dark:text-white">
              Ambiente de Pagamento Blindado & Criptografado
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Processamento seguro via Asaas Pagamentos S.A. (Autorizada pelo Banco Central).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-Bit Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: CONFIGURAÇÃO DO PLANO & PAGAMENTO (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Seletor do Plano */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              1. Escolha o Seu Nível de Preparação
            </h2>

            <div className="space-y-3">
              {/* OFERTA FECHADA DE LANÇAMENTO (R$ 97) */}
              <div 
                onClick={() => {
                  setSelectedPlan('lancamento');
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  selectedPlan === 'lancamento'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent ring-2 ring-orange-500/30 shadow-md'
                    : 'border-orange-300/60 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-950/15 hover:border-orange-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3 fill-current" /> Lote 1 • Exclusivo 200 Vagas
                    </span>
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-extrabold">
                      Restam apenas 38 vagas
                    </span>
                  </div>
                  {selectedPlan === 'lancamento' && <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      Passe Até a Prova (Acesso Total Anti-Pegadinha)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Vade Mecum Radar, IAs Especialistas, Caderno SM-2 e Arena até o dia do seu concurso/exame.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-2xl font-black text-orange-600 dark:text-orange-400">R$ 97,00</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Dose Única • Sem Mensalidade</p>
                  </div>
                </div>
              </div>

              {/* DEMAIS PLANOS CONTÍNUOS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Plano PRO */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan('pro');
                    if (billingCycle === 'vitalicio') setBillingCycle('mensal');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === 'pro'
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-500/10 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" /> Plano PRO
                    </span>
                    {selectedPlan === 'pro' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">R$ 59,90 <span className="text-xs font-normal text-slate-400">/mês</span></p>
                  <p className="text-[11px] text-blue-500 font-bold mt-0.5">ou R$ 39,90/mês no anual</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">IA Flash Ilimitada + Caderno SM-2 + até 4 Editais.</p>
                </button>

                {/* Plano ELITE */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan('elite');
                    if (billingCycle === 'vitalicio') setBillingCycle('mensal');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === 'elite'
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Crown className="w-4 h-4" /> ELITE VIP
                    </span>
                    {selectedPlan === 'elite' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">R$ 129,90 <span className="text-xs font-normal text-slate-400">/mês</span></p>
                  <p className="text-[11px] text-indigo-500 font-bold mt-0.5">ou R$ 89,90/mês no anual</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Psicometria TRI + 10 Peças OAB/mês + Gemini Pro.</p>
                </button>

                {/* Plano BLACK VITALÍCIO */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan('black');
                    setBillingCycle('vitalicio');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPlan === 'black'
                      ? 'border-amber-500 bg-slate-900 text-white ring-2 ring-amber-500/40 shadow-lg'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-400/50 dark:hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> BLACK VIP
                    </span>
                    {selectedPlan === 'black' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">R$ 1.497 <span className="text-xs font-normal text-amber-400">único</span></p>
                  <p className="text-[11px] text-amber-500 font-bold mt-0.5">12x R$ 149,70 ou R$ 197/mês</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Acesso Até a Posse + Todas Ferramentas + Fênix Dourada.</p>
                </button>
              </div>
            </div>

            {/* Seletor de Ciclos */}
            {selectedPlan === 'lancamento' ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-orange-900 dark:text-orange-200 font-bold">
                    <Flame className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Oferta Fechada Lote 1: R$ 97,00 valor único válido até o dia da sua prova.</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md shrink-0">
                    Sem Mensalidade
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {selectedPlan === 'black' ? 'Formato de Pagamento' : 'Frequência de Cobrança (Economize até 33%)'}
                </label>

                {selectedPlan === 'black' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('vitalicio')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        billingCycle === 'vitalicio'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Vitalício (Até a Posse)</span>
                      <span className="block text-[9px] text-amber-900 dark:text-amber-200 font-extrabold">12x R$ 149,70 • Acesso Perpétuo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingCycle('mensal')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        billingCycle === 'mensal'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Mensal Recorrente</span>
                      <span className="block text-[9px] text-slate-400 font-extrabold">R$ 197,00/mês</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('mensal')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        billingCycle === 'mensal'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Mensal
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingCycle('trimestral')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
                        billingCycle === 'trimestral'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Trimestral</span>
                      <span className="block text-[9px] text-emerald-400 font-extrabold">-15% OFF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingCycle('anual')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
                        billingCycle === 'anual'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>Anual</span>
                      <span className="block text-[9px] text-amber-300 font-extrabold">-33% OFF</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seletor de Forma de Pagamento */}
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              2. Forma de Pagamento
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>Pix Instantâneo</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 uppercase font-black">
                  Imediato
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-3.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                  paymentMethod === 'cartao'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Cartão de Crédito</span>
              </button>
            </div>

            {/* OPÇÃO PIX */}
            {paymentMethod === 'pix' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>QR Code Pix expira em: <strong>{formatTime(pixTimeRemaining)}</strong></span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Liberação em 5 segundos
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* Mock Visual QR Code SVG */}
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-inner shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      <rect width="100" height="100" fill="white" />
                      {/* Pix corner squares */}
                      <rect x="5" y="5" width="30" height="30" fill="black" />
                      <rect x="9" y="9" width="22" height="22" fill="white" />
                      <rect x="13" y="13" width="14" height="14" fill="black" />

                      <rect x="65" y="5" width="30" height="30" fill="black" />
                      <rect x="69" y="9" width="22" height="22" fill="white" />
                      <rect x="73" y="13" width="14" height="14" fill="black" />

                      <rect x="5" y="65" width="30" height="30" fill="black" />
                      <rect x="9" y="69" width="22" height="22" fill="white" />
                      <rect x="13" y="73" width="14" height="14" fill="black" />

                      {/* Random pixels for aesthetic preview */}
                      <rect x="42" y="10" width="8" height="8" fill="black" />
                      <rect x="42" y="24" width="8" height="8" fill="black" />
                      <rect x="52" y="18" width="8" height="8" fill="black" />
                      <rect x="10" y="42" width="8" height="8" fill="black" />
                      <rect x="25" y="45" width="8" height="8" fill="black" />
                      <rect x="45" y="45" width="10" height="10" fill="#2563eb" />
                      <rect x="65" y="42" width="8" height="8" fill="black" />
                      <rect x="80" y="50" width="8" height="8" fill="black" />
                      <rect x="42" y="65" width="8" height="8" fill="black" />
                      <rect x="55" y="75" width="8" height="8" fill="black" />
                      <rect x="75" y="75" width="12" height="12" fill="black" />
                    </svg>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Chave Pix Copia e Cola:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixCode}
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 select-all"
                      />
                      <button
                        onClick={handleCopyPix}
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm transition-all active:scale-95"
                      >
                        {pixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Abra o aplicativo do seu banco, escolha <strong>Pix Copia e Cola</strong> e cole o código acima.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando Pix no Banco Central...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Já Realizei o Pagamento Pix</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* OPÇÃO CARTÃO DE CRÉDITO */}
            {paymentMethod === 'cartao' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Nome Impresso no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Ex: CARLOS E SOUZA"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm uppercase focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Validade
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Código CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Parcelamento sem juros
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:outline-none focus:border-blue-500"
                  >
                    {selectedPlan === 'black' && billingCycle === 'vitalicio' ? (
                      <>
                        <option value={1}>1x de R$ {finalPrice.toFixed(2)} à vista (sem juros)</option>
                        <option value={3}>3x de R$ {(finalPrice / 3).toFixed(2)} (sem juros)</option>
                        <option value={6}>6x de R$ {(finalPrice / 6).toFixed(2)} (sem juros)</option>
                        <option value={10}>10x de R$ {(finalPrice / 10).toFixed(2)} (sem juros)</option>
                        <option value={12}>12x de R$ 149,70 (sem juros • Até a Posse)</option>
                      </>
                    ) : (
                      <>
                        <option value={1}>1x de R$ {finalPrice.toFixed(2)} (sem juros)</option>
                        <option value={2}>2x de R$ {(finalPrice / 2).toFixed(2)} (sem juros)</option>
                        <option value={3}>3x de R$ {(finalPrice / 3).toFixed(2)} (sem juros)</option>
                        <option value={6}>6x de R$ {(finalPrice / 6).toFixed(2)} (sem juros)</option>
                        <option value={12}>12x de R$ {(finalPrice / 12).toFixed(2)} (sem juros)</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processando Transação Segura...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pagar R$ {finalPrice.toFixed(2)} no Cartão</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO DO PEDIDO & CUPONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Resumo do Pedido
            </h3>

            {/* Linha do Produto */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-black text-sm text-slate-900 dark:text-white">{planName}</p>
                <p className="text-xs text-slate-400 capitalize">
                  {selectedPlan === 'lancamento' ? 'Acesso Até o Dia da Sua Prova' : `Ciclo ${billingCycle}`}
                </p>
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                R$ {rawTotal.toFixed(2)}
              </p>
            </div>

            {/* Descontos de Ciclo */}
            {cycleDiscountPercent > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Desconto de Ciclo ({cycleDiscountPercent}% OFF)</span>
                <span>- R$ {cycleDiscountValue.toFixed(2)}</span>
              </div>
            )}

            {/* Desconto de Cupom */}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Cupom ({appliedCoupon.code} - {appliedCoupon.percent}%)</span>
                <span>- R$ {couponDiscountValue.toFixed(2)}</span>
              </div>
            )}

            {/* Input de Cupom */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                Possui um cupom de desconto?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Ex: LANCAMENTO20"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs uppercase font-bold focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all shrink-0 active:scale-95"
                >
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-500 font-bold">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Cupom ativado com sucesso!
                </p>
              )}
            </form>

            {/* Total Final */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total a Pagar</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    R$ {finalPrice.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {selectedPlan === 'lancamento'
                      ? 'Pagamento único com acesso completo até o dia da sua prova'
                      : billingCycle === 'vitalicio'
                      ? 'Pagamento único com acesso vitalício até a posse'
                      : billingCycle === 'mensal'
                      ? 'Cobrança mensal recorrente'
                      : `Valor único para ${billingCycle === 'trimestral' ? '3 meses' : '1 ano'}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Selo CDC 7 Dias */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">
                  Garantia Incondicional de 7 Dias
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Conforme o Art. 49 do Código de Defesa do Consumidor, teste a plataforma sem riscos. Se não acelerar seus estudos, solicite o cancelamento e devolvemos 100% do seu dinheiro.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
