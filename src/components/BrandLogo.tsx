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
  const logoSrc = size > 128 ? '/logo.png' : '/logo-512.png';

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-label="Logo Learning AI — Cérebro 3D Ouro e Safira"
    >
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(56,189,248,0.2) 50%, transparent 72%)',
            filter: 'blur(16px)',
            transform: 'scale(1.2)',
          }}
        />
      )}
      <img
        src={logoSrc}
        alt="Learning AI Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(217,119,6,0.32)] transition-transform duration-300"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};

export default BrandLogo;
