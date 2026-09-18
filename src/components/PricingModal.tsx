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
  ArrowRight,
  ArrowLeft,
  Lock,
  BadgeCheck
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import confetti from 'canvas-confetti';
import { trackConversion } from '@/components/TrackingScripts';

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
  const [activeTab, setActiveTab] = useState<'plans' | 'checkout'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<SubscriptionPlan>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending_payment' | 'confirmed'>('pending_payment');
  const [pixCode, setPixCode] = useState("00020126580014br.gov.bcb.pix0136learning-ai-concursos-pix-key520400005303986540539.905802BR5925LEARNING AI TECNOLOGIA LTDA6009SAO PAULO62070503***6304E8A9");
  const [qrCodeImg, setQrCodeImg] = useState<string | null>("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136learning-ai-concursos-pix-key520400005303986540539.905802BR5925LEARNINGAI");

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
          trackConversion.initiateCheckout(selectedPlanToBuy, data.amount || (selectedPlanToBuy === 'pro' ? 29.90 : 49.90));
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
          trackConversion.purchase(transactionId, data.amount || 29.90, selectedPlanToBuy);
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

  const handleSelectPlanAndGoToCheckout = (plan: SubscriptionPlan) => {
    setSelectedPlanToBuy(plan);
    if (plan === 'aspirante') {
      onUpgradePlan('aspirante');
      onClose();
    } else {
      setActiveTab('checkout');
    }
  };

  // Disparo do Webhook de confirmação (simulação de retorno bancário)
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

  const planPrices: Record<SubscriptionPlan, { price: string; period: string; annualTotal: string }> = {
    aspirante: { price: 'R$ 0', period: '/ sempre', annualTotal: 'Totalmente gratuito' },
    pro: {
      price: billingCycle === 'annual' ? 'R$ 39,90' : 'R$ 59,90',
      period: '/ mês',
      annualTotal: billingCycle === 'annual' ? 'R$ 478,80/ano no Pix/Cartão' : 'Cobrança mensal sem fidelidade'
    },
    elite: {
      price: billingCycle === 'annual' ? 'R$ 89,90' : 'R$ 129,90',
      period: '/ mês',
      annualTotal: billingCycle === 'annual' ? 'R$ 1.078,80/ano no Pix/Cartão' : 'Cobrança mensal sem fidelidade'
    },
    black: {
      price: 'R$ 1.497',
      period: 'único',
      annualTotal: 'Acesso Vitalício até a posse (12x R$ 149,70 ou R$ 197/mês)'
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-indigo-500/30 relative shadow-2xl my-auto overflow-hidden bg-white/95 dark:bg-dark-surface/95 transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-white/5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header with Segmented Navigation Tabs */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Crown className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Planos & Acesso Ilimitado
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Desmonte a banca com o Copiloto Cognitivo e banco de questões TRI
              </p>
            </div>
          </div>

          {/* Tab Pill Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'plans'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Escolher Plano</span>
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'checkout'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>2. Checklist & Pagamento</span>
              {selectedPlanToBuy !== 'aspirante' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: COMPARADOR DE PLANOS */}
        {activeTab === 'plans' && (
          <div className="p-6 sm:p-8 animate-fadeIn">
            {/* Billing Cycle Switcher */}
            <div className="text-center max-w-md mx-auto mb-8">
              <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Anual</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black">
                    -40% OFF
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* PLANO ASPIRANTE (FREEMIUM) */}
              <div
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  selectedPlanToBuy === 'aspirante'
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 ring-2 ring-slate-400/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-dark-card/50 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      ASPIRANTE • GRATUITO
                    </span>
                    {currentPlan === 'aspirante' && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Ativo</span>
                    )}
                  </div>

                  <div className="mt-4 mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">R$ 0</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/ sempre</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Acesso básico gratuito para iniciar a rotina
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>10 questões / dia</strong> no Banco</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>5 diagnósticos IA / dia</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>3 perguntas / dia</strong> ao Copiloto</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Vade Mecum & Desafios Básicos</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Discursivas com IA bloqueadas</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => handleSelectPlanAndGoToCheckout('aspirante')}
                    className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    {currentPlan === 'aspirante' ? 'Plano Atual Ativo' : 'Usar Versão Gratuita'}
                  </button>
                </div>
              </div>

              {/* PLANO PRO (COPILOTO COGNITIVO) */}
              <div
                className="p-6 rounded-3xl border-2 border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 relative shadow-xl shadow-indigo-600/10 flex flex-col justify-between glow-brand"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  Mais Recomendado
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      PRO • COPILOTO COGNITIVO
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  <div className="mt-4 mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        {planPrices.pro.price}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/ mês</span>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {planPrices.pro.annualTotal}
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Banco de Questões Ilimitado</strong> com TRI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>100 Diagnósticos IA / dia</strong> nas pegadinhas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>50 interações / dia</strong> com o Copiloto</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Editais & Ciclos Ilimitados</strong> (Meirelles 80/20)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Provas Anteriores Oficiais</strong> Cebraspe/FGV/Vunesp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>3 correções de Discursivas / mês</strong> com IA</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-500/20">
                  <button
                    onClick={() => handleSelectPlanAndGoToCheckout('pro')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Checklist & Assinar Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PLANO ELITE (CARREIRAS JURÍDICAS) */}
              <div
                className="p-6 rounded-3xl border border-amber-300 dark:border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between hover:border-amber-400 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                      ELITE • CARREIRAS JURÍDICAS
                    </span>
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>

                  <div className="mt-4 mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        {planPrices.elite.price}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/ mês</span>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {planPrices.elite.annualTotal}
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Tudo do Plano Pro</strong> incluído</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Comparador de Nota de Corte Real</strong> histórico</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>20 correções de Discursivas / mês</strong> com espelho</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Diagnóstico Cognitivo IA</strong> de prova real</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Prioridade Máxima</strong> na fila de IA e App VIP</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-500/20">
                  <button
                    onClick={() => handleSelectPlanAndGoToCheckout('elite')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Checklist & Assinar Elite</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CHECKLIST DE PAGAMENTO & CHECKOUT */}
        {activeTab === 'checkout' && (
          <div className="p-6 sm:p-8 animate-fadeIn space-y-6">
            
            {/* Selected Plan Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {selectedPlanToBuy === 'elite' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      Plano Selecionado: {selectedPlanToBuy.toUpperCase()}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                      {billingCycle === 'annual' ? 'Anual (-40% OFF)' : 'Mensal'}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {planPrices[selectedPlanToBuy].price} {planPrices[selectedPlanToBuy].period} • {planPrices[selectedPlanToBuy].annualTotal}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('plans')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trocar Plano</span>
              </button>
            </div>

            {/* Grid 2 Columns: Checklist (Left) & Payment Form (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Guarantee & Activation Checklist */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                    Checklist de Ativação & Garantias
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Liberação Instantânea em 3 segundos:</strong>
                      <span>Seu acesso ao Copiloto e simuladores é ativado imediatamente após o Pix.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Engenharia Reversa nas Bancas:</strong>
                      <span>Desmonte de pegadinhas atualizado para Cebraspe, FGV, Vunesp e FCC.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Garantia Incondicional de 7 Dias:</strong>
                      <span>Se não se adaptar, devolvemos 100% do valor pago sem burocracia.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Sem Contrato de Fidelidade:</strong>
                      <span>Você pode cancelar a qualquer momento em 1 clique direto no painel.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Ambiente protegido com criptografia bancária SSL de 256 bits.</span>
                </div>
              </div>

              {/* Right Column: Payment Methods (Pix / Card) */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                
                {/* Method selector */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Forma de Pagamento:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        paymentMethod === 'pix'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pix (Imediato)</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Cartão</span>
                    </button>
                  </div>
                </div>

                {/* PIX FLOW */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* QR Code Container */}
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md border-2 border-emerald-500">
                        {qrCodeImg ? (
                          <img 
                            src={qrCodeImg} 
                            alt="QR Code Pix Oficial" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <QrCode className="w-12 h-12 text-black animate-pulse" />
                        )}
                      </div>

                      {/* Pix Info & Copy */}
                      <div className="w-full space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          Código Pix Copia e Cola:
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixCode}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-300 truncate select-all"
                          />
                          <button
                            onClick={handleCopyPix}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-sm"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>

                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>Aguardando liquidação (verificação a cada 3s)</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={handleTriggerWebhook}
                        disabled={isProcessing || paymentStatus === 'confirmed'}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
                        title="Simula a aprovação bancária instantânea para teste"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Simular Webhook Pix</span>
                      </button>

                      <button
                        onClick={handleTriggerWebhook}
                        disabled={isProcessing || paymentStatus === 'confirmed'}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Confirmando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ativar Plano Agora</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* CARD FLOW */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Número do Cartão"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        defaultValue="4532 •••• •••• 8821"
                      />
                      <input
                        type="text"
                        placeholder="Nome no Cartão"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        defaultValue="LUCAS BARBOSA"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Validade (MM/AA)"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                          defaultValue="09/30"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                          defaultValue="842"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleTriggerWebhook}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Crown className="w-4 h-4" />
                      <span>Concluir Assinatura Segura</span>
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* Security & Guarantee Footer */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-dark-card/50 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Garantia incondicional de 7 dias
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cancele quando quiser em 1 clique
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" /> Criptografia de ponta a ponta 256-bit
          </span>
        </div>

      </div>
    </div>
  );
};
