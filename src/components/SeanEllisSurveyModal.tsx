'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check, HeartHandshake, ShieldCheck, ArrowRight, MessageSquareText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeanEllisSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (result: SeanEllisResult) => void;
}

export interface SeanEllisResult {
  disappointmentLevel: 'very_disappointed' | 'somewhat_disappointed' | 'not_disappointed';
  primaryBenefit: string;
  targetAudienceOpinion: string;
  improvementSuggestion: string;
  submittedAt: string;
}

const BENEFIT_OPTIONS = [
  'Predição estatística e pegadinhas da banca',
  'Caderno de Erros inteligente com diagnóstico de IA',
  'Economia brutal de tempo (menos PDFs longos, mais questões)',
  'Ciclo de estudos adaptativo e Repetição Espaçada',
  'Simulações com psicometria e nível de convicção'
];

export const SeanEllisSurveyModal: React.FC<SeanEllisSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmitted
}) => {
  const [disappointmentLevel, setDisappointmentLevel] = useState<
    'very_disappointed' | 'somewhat_disappointed' | 'not_disappointed' | null
  >(null);
  const [primaryBenefit, setPrimaryBenefit] = useState<string>('');
  const [customBenefit, setCustomBenefit] = useState<string>('');
  const [targetAudienceOpinion, setTargetAudienceOpinion] = useState<string>('');
  const [improvementSuggestion, setImprovementSuggestion] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disappointmentLevel) return;

    const result: SeanEllisResult = {
      disappointmentLevel,
      primaryBenefit: primaryBenefit === 'outro' ? customBenefit : primaryBenefit,
      targetAudienceOpinion: targetAudienceOpinion.trim(),
      improvementSuggestion: improvementSuggestion.trim(),
      submittedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('learning_ai_sean_ellis_survey_completed', 'true');
      localStorage.setItem('learning_ai_sean_ellis_survey_result', JSON.stringify(result));
    } catch {}

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    setIsSuccess(true);
    if (onSubmitted) onSubmitted(result);

    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 2000);
  };

  const handleRemindLater = () => {
    try {
      const skipUntil = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 dias
      localStorage.setItem('learning_ai_sean_ellis_skip_until', skipUntil.toString());
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 dark:bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Obrigado pelo seu feedback!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Suas respostas foram registradas e serão analisadas diretamente pela nossa equipe de produto para priorizar as próximas melhorias.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="space-y-2 text-left pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Pesquisa de Ajuste de Produto (Sean Ellis PMF)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Como está sendo sua preparação com o AprovaLens?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Leva apenas 45 segundos e ajuda a moldar a plataforma para garantir que você passe na frente da concorrência.
              </p>
            </div>

            {/* Pergunta 1: Sean Ellis Core */}
            <div className="space-y-2.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                1. Como você se sentiria se NÃO pudesse mais usar o AprovaLens amanhã? *
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'very_disappointed' as const,
                    label: 'Muito desapontado(a)',
                    desc: 'A plataforma já se tornou essencial para minha aprovação.'
                  },
                  {
                    id: 'somewhat_disappointed' as const,
                    label: 'Um pouco desapontado(a)',
                    desc: 'Sentiria falta, mas buscaria outro banco de questões.'
                  },
                  {
                    id: 'not_disappointed' as const,
                    label: 'Não faria falta / Indiferente',
                    desc: 'Ainda não senti a diferença na minha preparação.'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDisappointmentLevel(opt.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      disappointmentLevel === opt.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                        disappointmentLevel === opt.id
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 dark:border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${
                        disappointmentLevel === opt.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 2: Principal Benefício */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                2. Qual o principal valor ou diferencial que você mais aproveita?
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {BENEFIT_OPTIONS.map((benefit) => (
                  <button
                    key={benefit}
                    type="button"
                    onClick={() => setPrimaryBenefit(benefit)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      primaryBenefit === benefit
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{benefit}</span>
                    {primaryBenefit === benefit && <Check className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pergunta 3: Sugestão de Melhoria */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200">
                3. O que falta para a plataforma ser 10/10 para você?
              </label>
              <textarea
                value={improvementSuggestion}
                onChange={(e) => setImprovementSuggestion(e.target.value)}
                placeholder="Ex: mais simulados da banca FGV, aplicativo offline, mais jurisprudência..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={handleRemindLater}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium px-2 py-1"
              >
                Lembrar mais tarde
              </button>

              <button
                type="submit"
                disabled={!disappointmentLevel}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  disappointmentLevel
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Enviar Avaliação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default SeanEllisSurveyModal;
