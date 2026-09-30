'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BrandLogo } from './BrandLogo';

interface InitialLoadingScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const InitialLoadingScreen: React.FC<InitialLoadingScreenProps> = ({
  onFinish,
  durationMs = 3000,
}) => {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  // Partículas suaves de fundo geradas uma única vez
  const particles = useMemo(() => 
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2.5,
      opacity: Math.random() * 0.45 + 0.15,
    })), []
  );

  useEffect(() => {
    // Em testes automatizados, pula instantaneamente
    const isAutomated = typeof window !== 'undefined' && Boolean(
      window.navigator.webdriver ||
      window.location.search.includes('test=1') ||
      (window as any).__E2E__
    );

    if (isAutomated) {
      setTimeout(onFinish, 80);
      return;
    }

    // Fase 1: Logo surge (0 → 700ms)
    const holdTimer = setTimeout(() => setPhase('hold'), 700);

    // Fase 2: Logo sai (duration - 600ms)
    const exitTimer = setTimeout(() => setPhase('exit'), Math.max(durationMs - 600, 1000));

    // Fase 3: Callback final
    const finishTimer = setTimeout(onFinish, durationMs);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhase('exit');
        setTimeout(onFinish, 250);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      role="dialog"
      aria-label="Tela de carregamento inicial"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#eef2ff] overflow-hidden select-none"
    >
      {/* ═══ CSS Animações ═══ */}
      <style>{`
        @keyframes splashLogoEnter {
          0% { opacity: 0; transform: scale(0.65); filter: blur(16px); }
          60% { opacity: 1; filter: blur(0px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        @keyframes splashLogoExit {
          0% { opacity: 1; transform: scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: scale(1.08); filter: blur(12px); }
        }
        @keyframes splashGlowPulseLight {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.75; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes splashRingExpandLight {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          40% { opacity: 0.45; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.4); }
        }
        @keyframes splashParticleFloatLight {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-14px) translateX(8px); }
          50% { transform: translateY(-8px) translateX(-6px); }
          75% { transform: translateY(-20px) translateX(4px); }
        }
        @keyframes splashAuroraDriftLight {
          0% { transform: translateX(-20%) rotate(-6deg); opacity: 0.35; }
          50% { transform: translateX(15%) rotate(4deg); opacity: 0.55; }
          100% { transform: translateX(-20%) rotate(-6deg); opacity: 0.35; }
        }
        @keyframes splashTextEnterLight {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        .splash-enter-light { animation: splashLogoEnter 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .splash-exit-light { animation: splashLogoExit 0.55s cubic-bezier(0.55, 0, 1, 0.45) forwards; }
        .splash-text-enter-light { animation: splashTextEnterLight 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
      `}</style>

      {/* ═══ CAMADA 1: Auroras Claras & Suaves ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Aurora superior violeta/índigo suave */}
        <div
          className="absolute -top-1/4 left-1/4 w-[110%] h-[60%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 45%, transparent 75%)',
            animation: 'splashAuroraDriftLight 9s ease-in-out infinite',
            filter: 'blur(70px)',
          }}
        />
        {/* Aurora inferior ciano/azul suave */}
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[110%] h-[60%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 50%, transparent 80%)',
            animation: 'splashAuroraDriftLight 11s ease-in-out 2s infinite reverse',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ═══ CAMADA 2: Padrão pontilhado sutil de fundo claro ═══ */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ═══ CAMADA 3: Partículas flutuantes claras ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.id % 3 === 0
                ? 'rgba(124, 58, 237, 0.45)'
                : p.id % 3 === 1
                ? 'rgba(6, 182, 212, 0.5)'
                : 'rgba(79, 70, 229, 0.45)',
              boxShadow: `0 0 ${p.size * 2}px ${
                p.id % 3 === 0 ? 'rgba(124,58,237,0.3)' :
                p.id % 3 === 1 ? 'rgba(6,182,212,0.3)' :
                'rgba(79,70,229,0.3)'
              }`,
              opacity: p.opacity,
              animation: `splashParticleFloatLight ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ═══ CAMADA 4: Glow central pulsante suave ═══ */}
      <div 
        className="absolute top-1/2 left-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(6,182,212,0.08) 50%, transparent 75%)',
          animation: 'splashGlowPulseLight 3s ease-in-out infinite',
        }}
      />

      {/* ═══ CENTRO: Logo + Nome (Tema Claro) ═══ */}
      <div className={`relative flex flex-col items-center ${
        phase === 'enter' ? 'splash-enter-light' :
        phase === 'exit' ? 'splash-exit-light' : ''
      }`}>

        {/* Anéis expansivos suaves */}
        <div className="absolute top-1/2 left-1/2 pointer-events-none">
          <div 
            className="absolute rounded-full border border-indigo-400/25"
            style={{ 
              inset: '-3.2rem',
              animation: 'splashRingExpandLight 3.2s ease-out infinite',
            }}
          />
          <div 
            className="absolute rounded-full border border-cyan-400/20"
            style={{ 
              inset: '-3.2rem',
              animation: 'splashRingExpandLight 3.2s ease-out 1.2s infinite',
            }}
          />
        </div>

        {/* Halo de sombra dourada suave atrás do logo */}
        <div 
          className="absolute rounded-3xl pointer-events-none"
          style={{ 
            width: '140px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.25), rgba(2,132,199,0.2), transparent 70%)',
            filter: 'blur(35px)',
          }}
        />

        {/* ═══ LOGO OFICIAL: CÉREBRO 3D METÁLICO OURO & SAFIRA ═══ */}
        <div className="relative transform hover:scale-105 transition-transform duration-300">
          <BrandLogo size={144} showGlow />
        </div>

        {/* Nome da plataforma (Tema Claro: Alto Contraste) */}
        <div className={`mt-6 text-center ${phase === 'enter' ? 'splash-text-enter-light' : ''}`}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
            <span>Learning</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500">
              AI
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default InitialLoadingScreen;
