'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  ChevronRight, 
  Award,
  Zap,
  Target,
  Activity,
  CheckCircle2,
  Sword,
  Swords,
  ChevronLeft
} from 'lucide-react';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import { GuardianAnimal, StudentProfile } from '@/lib/types';
import confetti from 'canvas-confetti';

interface AvatarOnboardingModalProps {
  isOpen: boolean;
  onComplete: (guardianId: string, warName: string) => void;
}

export const AvatarOnboardingModal: React.FC<AvatarOnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [warName, setWarName] = useState('');
  
  const selectedAvatar = GUARDIAN_ANIMALS.find(a => a.id === selectedAvatarId) || null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAvatar = (id: string) => {
    setSelectedAvatarId(id);
    setStep(2);
  };

  const handleConfirmAvatar = () => {
    if (warName.trim().length < 2) return;
    
    // Confetti effect for successful onboarding
    try {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    } catch {}

    setStep(3);
    
    // Auto close after success screen
    setTimeout(() => {
      onComplete(selectedAvatarId!, warName);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 dark:bg-black/90 backdrop-blur-xl animate-fadeIn p-4 sm:p-6 overflow-y-auto">
      
      {/* Background ambient glow based on selected avatar */}
      {selectedAvatar && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000"
          style={{ background: `radial-gradient(circle at 50% 50%, ${selectedAvatar.glowColor}, transparent 70%)` }}
        />
      )}

      <div className="relative w-full max-w-5xl min-h-[600px] flex flex-col bg-white/90 dark:bg-dark-card/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* PROGRESS BAR */}
        {step < 3 && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        )}

        {/* STEP 1: CHOOSE AVATAR */}
        {step === 1 && (
          <div className="p-8 sm:p-10 flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Protocolo de Iniciação
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Escolha o seu Guardião de Aprovação
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                No campo de batalha dos concursos, cada mente funciona de forma única. Seu Animal Guardião define a estratégia do algoritmo de Inteligência Artificial para mapear seus pontos cegos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl mx-auto">
              {GUARDIAN_ANIMALS.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => handleSelectAvatar(animal.id)}
                  className="group relative flex flex-col text-left p-6 rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${animal.colorGradient} transition-opacity duration-500 pointer-events-none`} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-4xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {animal.emoji}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {animal.archetype}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                    {animal.name}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {animal.title}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {animal.cognitiveStyle}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase">
                          <span>Foco</span> <span>{animal.stats.foco}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${animal.stats.foco}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase">
                          <span>Estratégia</span> <span>{animal.stats.estrategia}</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${animal.stats.estrategia}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PERSONALIZE & CONFIRM */}
        {step === 2 && selectedAvatar && (
          <div className="flex-1 flex flex-col md:flex-row h-full animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* Left Column - Hero Avatar */}
            <div className={`md:w-1/2 p-8 sm:p-12 flex flex-col items-center justify-center relative bg-gradient-to-br ${selectedAvatar.colorGradient}`}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              
              <button 
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative z-10 text-center space-y-6 w-full">
                <div className="text-8xl md:text-9xl drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                  {selectedAvatar.emoji}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
                    {selectedAvatar.name}
                  </h2>
                  <p className="text-sm md:text-base font-bold text-white/80 uppercase tracking-widest">
                    {selectedAvatar.archetype}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-left mt-8">
                  <div className="flex items-center gap-2 mb-2 text-white/90">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs uppercase tracking-wider">Superpoder de Estudo</span>
                  </div>
                  <p className="text-sm md:text-base font-black text-white">
                    {selectedAvatar.superpower}
                  </p>
                  <p className="text-xs text-white/70 italic mt-3 border-t border-white/10 pt-3">
                    {selectedAvatar.motto}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Setup Form */}
            <div className="md:w-1/2 p-8 sm:p-12 bg-white dark:bg-dark-card flex flex-col justify-center relative z-10 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="max-w-md w-full mx-auto space-y-8">
                
                <div>
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-3">
                    Personalização do Perfil
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    Qual o seu Nome de Guerra?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Como nosso Copiloto de IA deve te chamar durante a correção das pegadinhas e planejamento de rotas?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={warName}
                      onChange={(e) => setWarName(e.target.value)}
                      placeholder="Ex: Delegado Silva, Futuro Auditor..."
                      className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      autoFocus
                    />
                    {warName.trim().length >= 2 && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs text-indigo-800 dark:text-indigo-300">
                    <strong>Alerta da Inteligência:</strong> A biometria comportamental da sua IA será calibrada focando nas carreiras de: <strong className="text-indigo-600 dark:text-indigo-400">{selectedAvatar.bestForCareers.join(', ')}</strong>.
                  </div>
                </div>

                <button
                  onClick={handleConfirmAvatar}
                  disabled={warName.trim().length < 2}
                  className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                    warName.trim().length >= 2
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-xl shadow-indigo-500/20 glow-brand'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  <span>ASSINAR COMPROMISSO DE APROVAÇÃO</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: SUCCESS ANIMATION */}
        {step === 3 && selectedAvatar && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Bem-vindo, {warName}!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              Seu passaporte cognitivo foi emitido. O <strong className="text-indigo-500 dark:text-indigo-400">{selectedAvatar.name}</strong> está sincronizando a base de dados de pegadinhas das bancas.
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-mono text-indigo-500 dark:text-indigo-400 animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              CARREGANDO DASHBOARD ESTRATÉGICO...
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
