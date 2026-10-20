'use client';

import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  className = '',
  showGlow = false,
}) => {
  const logoSrc = '/argus-logo.png';
  const borderRadius = size <= 32 ? 'rounded-lg' : size <= 48 ? 'rounded-xl' : 'rounded-2xl';

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Logo Argus — A Lente Cognitiva da Aprovação"
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(99,102,241,0.25) 50%, transparent 72%)',
            filter: 'blur(16px)',
            transform: 'scale(1.25)',
          }}
        />
      )}
      <div className={`relative w-full h-full overflow-hidden ${borderRadius} shadow-lg shadow-cyan-500/10 border border-slate-700/20 dark:border-cyan-500/30 bg-slate-950 flex items-center justify-center group`}>
        <img
          src={logoSrc}
          alt="Argus Logo — Íris Neural"
          width={size}
          height={size}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          decoding="sync"
        />
        {/* Reflexo sutil de lente */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/10 pointer-events-none" />
      </div>
    </div>
  );
};

export default BrandLogo;

