'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Shield, Zap, Volume2 } from 'lucide-react';
import { GuardianAnimal } from '@/lib/types';

interface HolographicAvatar3DProps {
  guardian: GuardianAnimal;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  interactive?: boolean;
  showMotto?: boolean;
  showStats?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const HolographicAvatar3D: React.FC<HolographicAvatar3DProps> = ({
  guardian,
  size = 'md',
  interactive = true,
  showMotto = false,
  showStats = false,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Mouse move handler for 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-15 to 15 degrees)
    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);

    // Calculate glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Speak guardian motto
  const handleSpeakMotto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${guardian.name}. ${guardian.title}. ${guardian.motto}`);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Dimension mapping
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    hero: 'w-64 h-64 sm:w-80 sm:h-80'
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={`relative cursor-pointer select-none group transition-transform duration-200 ease-out ${className}`}
    >
      <div
        style={{
          transform: interactive
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`
            : 'none',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className={`relative rounded-3xl overflow-hidden p-1 transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/40'
            : 'hover:shadow-xl hover:shadow-blue-500/20'
        } ${
          isHovered ? 'border-amber-400/80' : 'border-white/10'
        }`}
      >
        {/* Holographic Dynamic Glare / Sheen Overlay */}
        {interactive && isHovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 215, 0, 0.15) 30%, transparent 70%)`,
              pointerEvents: 'none',
            }}
            className="absolute inset-0 z-30 mix-blend-overlay transition-opacity duration-150"
          />
        )}

        {/* Ambient Glow Aura */}
        <div
          style={{ backgroundColor: guardian.glowColor }}
          className={`absolute -inset-2 rounded-3xl blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 -z-10`}
        />

        {/* Outer Frame with Gold / Cybernetic Borders */}
        <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/15 p-2 flex flex-col items-center">
          
          {/* Avatar Visual Asset: 3D Rendered Art or Fallback */}
          <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center`}>
            {guardian.avatar3dUrl && !imageError ? (
              <img
                src={guardian.avatar3dUrl}
                alt={guardian.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
              />
            ) : (
              /* Fallback 3D-styled Emoji Badge */
              <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${guardian.colorGradient} flex items-center justify-center text-5xl shadow-inner relative`}>
                <span className="transform transition-transform duration-300 group-hover:scale-125">
                  {guardian.emoji}
                </span>
              </div>
            )}

            {/* Glowing Corner Accents (Futuristic HUD feel) */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400/80 rounded-tl pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400/80 rounded-tr pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400/80 rounded-bl pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400/80 rounded-br pointer-events-none" />

            {/* Floating Audio Play Button */}
            {size !== 'sm' && (
              <button
                type="button"
                onClick={handleSpeakMotto}
                className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-amber-300 border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
                title="Ouvir conselho do Guardião"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Details / Labels below avatar */}
          {(showMotto || size === 'lg' || size === 'hero') && (
            <div className="mt-3 text-center space-y-1 px-2 w-full">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xs font-black text-amber-400 tracking-wide uppercase">
                  {guardian.name}
                </span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">
                {guardian.title}
              </p>
              
              {showMotto && (
                <p className="text-[10px] text-slate-300 italic pt-1 border-t border-white/10 line-clamp-2 leading-relaxed">
                  {guardian.motto}
                </p>
              )}
            </div>
          )}

          {/* Stats Bars (Power radar) */}
          {showStats && (
            <div className="w-full mt-3 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] px-1 font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>FOCO:</span>
                <span className="font-bold text-amber-400">{guardian.stats.foco}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>VELOCIDADE:</span>
                <span className="font-bold text-cyan-400">{guardian.stats.velocidade}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>RESILIÊNCIA:</span>
                <span className="font-bold text-emerald-400">{guardian.stats.resiliencia}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>ESTRATÉGIA:</span>
                <span className="font-bold text-purple-400">{guardian.stats.estrategia}%</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
