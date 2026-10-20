'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Zap, 
  X, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface InactivityRecoveryBannerProps {
  studentName?: string;
  streakDays?: number;
  onStartPillMode: () => void;
  onDismiss?: () => void;
  forceShowForTesting?: boolean;
}

const INACTIVITY_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 horas em milissegundos
const SNOOZE_PERIOD_MS = 12 * 60 * 60 * 1000; // 12 horas de soneca

export const InactivityRecoveryBanner: React.FC<InactivityRecoveryBannerProps> = ({
  studentName = 'Guerreiro(a)',
  streakDays = 1,
  onStartPillMode,
  onDismiss,
  forceShowForTesting = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inactiveHours, setInactiveHours] = useState(48);

  useEffect(() => {
    try {
      const now = Date.now();
      const lastActiveStr = localStorage.getItem('argus_last_active_timestamp');
      const snoozeUntilStr = localStorage.getItem('argus_inactivity_snooze_until');

      // Se há soneca ativa e não estamos forçando teste, não exibe
      if (!forceShowForTesting && snoozeUntilStr && parseInt(snoozeUntilStr, 10) > now) {
        setIsVisible(false);
        return;
      }

      if (forceShowForTesting) {
        setInactiveHours(52);
        setIsVisible(true);
        analytics.track('inactivity_recovery_triggered', {
          forced: true,
          inactiveHours: 52,
          streakDays
        });
        return;
      }

      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        const diffMs = now - lastActive;

        if (diffMs >= INACTIVITY_THRESHOLD_MS) {
          const hours = Math.floor(diffMs / (60 * 60 * 1000));
          setInactiveHours(hours);
          setIsVisible(true);
          analytics.track('inactivity_recovery_triggered', {
            inactiveHours: hours,
            streakDays
          });
        }
      } else {
        // Inicializa carimbo de tempo no primeiro acesso
        localStorage.setItem('argus_last_active_timestamp', now.toString());
      }
    } catch {
      // Ignora erro em ambientes restritos de storage
    }
  }, [forceShowForTesting, streakDays]);

  if (!isVisible) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem('argus_last_active_timestamp', Date.now().toString());
      localStorage.removeItem('argus_inactivity_snooze_until');
    } catch {}
    analytics.track('inactivity_recovery_accepted', {
      inactiveHours,
      streakDays
    });
    setIsVisible(false);
    onStartPillMode();
  };

  const handleSnooze = () => {
    try {
      const snoozeUntil = Date.now() + SNOOZE_PERIOD_MS;
      localStorage.setItem('argus_inactivity_snooze_until', snoozeUntil.toString());
    } catch {}
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <aside 
      aria-label="Alerta de resgate de ofensiva e modo pílula"
      className="relative z-30 mx-4 sm:mx-6 lg:mx-8 mb-4 mt-2 animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-blue-600/15 border-2 border-amber-500/30 p-4 sm:p-5 shadow-xl backdrop-blur-md dark:bg-slate-900/90">
        {/* Glow de fundo */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Lado Esquerdo: Mensagem e Contexto */}
          <div className="flex items-start gap-3.5 flex-1">
            <div className="relative shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                !
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <Clock className="w-3 h-3" />
                  {inactiveHours}h sem treinar • Ofensiva em Risco
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                  As bancas examinadoras continuam armando distratores
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
                Sentimos sua falta, {studentName}! Salve sua ofensiva com o <span className="text-amber-600 dark:text-amber-400">Modo Pílula</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed max-w-3xl">
                Não quebre seu ritmo de memorização. Não precisa encarar uma sessão pesada de 1 hora: faça apenas <strong>3 flashcards rápidos (2 minutos)</strong> para neutralizar a curva do esquecimento e blindar sua pontuação hoje!
              </p>
            </div>
          </div>

          {/* Lado Direito: Ações */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleSnooze}
              className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Depois
            </button>

            <button
              onClick={handleAccept}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Ativar Modo Pílula (3 Cards)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSnooze}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer ml-1"
              title="Fechar lembrete"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
