'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Crown, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: (bonusCount: number) => void;
  onOpenPricing?: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
  onOpenPricing
}) => {
  const [countdown, setCountdown] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [adStage, setAdStage] = useState<'playing' | 'reward_ready'>('playing');

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setCountdown(15);
      setIsCompleted(false);
      setAdStage('playing');
    }
  }, [isOpen]);

  // 15 seconds timer simulation
  useEffect(() => {
    if (!isOpen || adStage !== 'playing') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdStage('reward_ready');
          setIsCompleted(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, adStage]);

  if (!isOpen) return null;

  const handleClaimReward = () => {
    onRewardGranted(2);
    onClose();
  };

  const progressPercentage = Math.round(((15 - countdown) / 15) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/40 relative glow-brand shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2 text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Patrocinador do Learning AI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close button only enabled if finished or with confirmation */}
            {isCompleted && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Video Ad Player Simulation Box */}
        <div className="my-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-purple-950 p-6 border border-white/10 relative overflow-hidden flex flex-col items-center text-center">
          
          {/* Ambient Video Glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Ad Creative Sponsor Content */}
          <div className="relative z-10 w-full flex flex-col items-center">
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-3 animate-pulse-slow">
              <Zap className="w-7 h-7 text-amber-300" />
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono uppercase mb-2">
              Anúncio Patrocinado • Google AdSense Rewarded
            </span>

            <h3 className="text-base font-black text-white">
              Cursos Preparatórios & Tecnologia para Concursos
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
              Descubra métodos acelerados de memorização e simulados de alto rendimento para carreiras federais e estaduais.
            </p>

            {/* Countdown or Completed Badge */}
            <div className="mt-5 w-full">
              {adStage === 'playing' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                    <span>Recompensa desbloqueada em:</span>
                    <strong className="text-white text-sm font-black">{countdown}s</strong>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>🎉 Vídeo concluído! +2 Diagnósticos de IA prontos para uso!</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Claim Reward Button or Information */}
        {isCompleted ? (
          <button
            onClick={handleClaimReward}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Resgatar +2 Diagnósticos Gratuitos de IA</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Assista até o fim para receber seus 2 créditos gratuitos de diagnóstico.</span>
          </div>
        )}

        {/* Upgrade Call to Action (Upsell to Pro) */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Cansado de ver vídeos?</span>
          {onOpenPricing && (
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Assinar Concurseiro PRO (100% Sem Anúncios)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
