'use client';

import React from 'react';

export type GuardianAvatarType = 'coruja' | 'gaviao' | 'leao' | 'lobo' | 'onca' | 'raposa';

export interface AvatarProps {
  type?: GuardianAvatarType;
  src?: string;
  name?: string;
  archetype?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  showInsignia?: boolean;
  className?: string;
}

const GUARDIAN_META: Record<GuardianAvatarType, { name: string; archetype: string; file: string; emoji: string }> = {
  coruja: {
    name: 'Coruja Atena',
    archetype: 'Mestre Analítico',
    file: '/avatars/coruja.jpg',
    emoji: '🦉'
  },
  gaviao: {
    name: 'Gavião Real',
    archetype: 'Auditor Implacável',
    file: '/avatars/gaviao.jpg',
    emoji: '🦅'
  },
  leao: {
    name: 'Leão Soberano',
    archetype: 'Tribuno Convicto',
    file: '/avatars/leao.jpg',
    emoji: '🦁'
  },
  lobo: {
    name: 'Lobo-Guará',
    archetype: 'Operador de Elite',
    file: '/avatars/lobo.jpg',
    emoji: '🐺'
  },
  onca: {
    name: 'Onça Pintada',
    archetype: 'Guerreiro de Longo Prazo',
    file: '/avatars/onca.jpg',
    emoji: '🐆'
  },
  raposa: {
    name: 'Raposa Ágil',
    archetype: 'Otimizador de Provas',
    file: '/avatars/raposa.jpg',
    emoji: '🦊'
  },
};

export const Avatar: React.FC<AvatarProps> = ({
  type = 'coruja',
  src,
  name,
  archetype,
  size = 'md',
  shape = 'circle',
  showInsignia = true,
  className = '',
}) => {
  const meta = GUARDIAN_META[type] || GUARDIAN_META.coruja;
  const imageSrc = src || meta.file;
  const displayName = name || meta.name;
  const displayArchetype = archetype || meta.archetype;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-[var(--radius-xl)]',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 font-sans select-none ${className}`}>
      {/* Moldura dupla com borda de 2px usando a cor --brand-primary e brilho sutil */}
      <div 
        className={`
          relative overflow-hidden p-[2px] bg-gradient-to-tr from-[var(--brand-primary)] via-[var(--border-strong)] to-[var(--brand-primary)]
          shadow-[var(--shadow-brand)]
          ${shapeClasses[shape]}
          ${sizeClasses[size]}
        `}
      >
        <div className={`w-full h-full overflow-hidden bg-[var(--surface-card)] ${shapeClasses[shape]} relative`}>
          <img
            src={imageSrc}
            alt={`Avatar do Arquétipo ${displayName} — ${displayArchetype}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              // Fallback para emoji caso a imagem falhe
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Insígnia de Arquétipo opcional */}
      {showInsignia && size !== 'sm' && (
        <span 
          title={`${displayName}: ${displayArchetype}`}
          className={`
            absolute -bottom-1 -right-1 rounded-full bg-[var(--surface-card)]
            border border-[var(--brand-primary)] p-0.5 shadow-sm text-xs
            flex items-center justify-center
          `}
          aria-hidden="true"
        >
          <span>{meta.emoji}</span>
        </span>
      )}
    </div>
  );
};
