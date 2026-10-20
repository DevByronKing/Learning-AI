'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  X, 
  Sparkles, 
  Flame, 
  Crown, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analytics } from '@/lib/analytics';
import { StudentProfile } from '@/lib/types';

interface ReferralProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile?: StudentProfile;
  onRewardClaimed?: (rewardTitle: string) => void;
}

export const ReferralProgramModal: React.FC<ReferralProgramModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onRewardClaimed
}) => {
  const [copied, setCopied] = useState(false);
  const [referralsCount, setReferralsCount] = useState(0);

  // Gera código único baseado no perfil
  const rawCode = (studentProfile?.warName || studentProfile?.name || 'GUERREIRO')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
  const referralCode = `ARGUS-${rawCode || 'ELITE'}`;
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}?ref=${referralCode}` 
    : `https://argus.app.br?ref=${referralCode}`;

  useEffect(() => {
    if (isOpen) {
      analytics.track('referral_modal_opened', {
        referralCode
      });
      try {
        const stored = localStorage.getItem('argus_referrals_count');
        setReferralsCount(stored ? parseInt(stored, 10) : 0);
      } catch {}
    }
  }, [isOpen, referralCode]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      analytics.track('referral_link_shared', {
        method: 'clipboard_copy',
        referralCode
      });
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    analytics.track('referral_link_shared', {
      method: 'whatsapp',
      referralCode
    });
    const shareMessage = encodeURIComponent(
      `Fala amigo concurseiro! Estou usando o Argus para estudar com IA e ele expõe as pegadinhas e distratores psicométricos da banca antes da prova. ` +
      `Crie sua conta por esse link para ganhar 7 dias de acesso PRO gratuito e romper a barreira dos 80%: ${referralLink}`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
  };

  const tiers = [
    {
      level: 1,
      required: 1,
      title: '+7 Dias de Acesso PRO',
      desc: 'Para cada colega que entrar, ambos ganham 7 dias de recursos ilimitados.',
      icon: Gift,
      color: 'from-blue-500 to-cyan-500',
      unlocked: referralsCount >= 1
    },
    {
      level: 2,
      required: 3,
      title: 'Módulo de Discursivas com IA',
      desc: 'Desbloqueie correção instantânea de peças e redações por critérios das bancas.',
      icon: FileText,
      color: 'from-indigo-500 to-purple-600',
      unlocked: referralsCount >= 3
    },
    {
      level: 3,
      required: 5,
      title: 'Cofre de Pegadinhas + 30 Dias PRO',
      desc: 'Acesso vitalício ao banco de distratores secretos e 1 mês extra de PRO.',
      icon: Crown,
      color: 'from-amber-500 to-orange-600',
      unlocked: referralsCount >= 5
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Gradiente */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Users className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                Programa Member-Get-Member
              </span>
              <h3 className="text-xl font-black tracking-tight mt-1">
                Indique um Colega • Ganhe Dias PRO
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
            Concurseiro e OABeiro não caminham sozinhos. Ajude um amigo a neutralizar pegadinhas de banca e ganhe recompensas exclusivas no Argus.
          </p>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Caixa de Compartilhamento de Link */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Seu Link Exclusivo de Indicação
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Botão de Disparo 1-Click WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Compartilhar Agora no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progresso de Recompensas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700 dark:text-slate-300">
                Seu Progresso de Indicações
              </span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {referralsCount} {referralsCount === 1 ? 'colega indicado' : 'colegas indicados'}
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${Math.min((referralsCount / 5) * 100, 100)}%` }}
              />
            </div>

            {/* Tiers de Recompensa */}
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.level}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      tier.unlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/10'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 opacity-80'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center text-white shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black truncate">{tier.title}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {tier.required} {tier.required === 1 ? 'amigo' : 'amigos'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {tier.desc}
                      </p>
                    </div>

                    <div>
                      {tier.unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" /> Liberado
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          Faltam {Math.max(tier.required - referralsCount, 0)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé com Garantia */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Benefícios creditados automaticamente
          </span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
