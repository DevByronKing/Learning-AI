'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Compass,
  Activity,
  Crosshair,
  Layers,
  ShieldAlert,
  Scale,
  BookCheck,
  ScrollText,
  CalendarClock,
  Feather,
  BookOpen,
  Microscope,
  Radar,
  GraduationCap,
  Crown,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface FloatingDockNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: 'dark' | 'light';
  pendingMistakesCount?: number;
}

interface DockItem {
  id: string;
  label: string;
  fullName: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeColor?: string;
}

export const FloatingDockNavigation: React.FC<FloatingDockNavigationProps> = ({
  activeTab,
  setActiveTab,
  theme = 'dark',
  pendingMistakesCount = 0
}) => {
  const isLight = theme === 'light';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Catálogo completo com as 16 abas em ordem natural e intuitiva (Início primeiro)
  const dockGroups: { groupName: string; items: DockItem[] }[] = [
    {
      groupName: 'Visão Geral',
      items: [
        {
          id: 'landing',
          label: 'Início',
          fullName: 'Página Inicial & Apresentação',
          category: 'Visão Geral',
          icon: Compass,
          badge: null
        },
        {
          id: 'dashboard',
          label: 'Cockpit',
          fullName: 'Cockpit de Dados & Heatmap',
          category: 'Visão Geral',
          icon: Activity,
          badge: 'HEATMAP',
          badgeColor: 'bg-emerald-500 text-white'
        }
      ]
    },
    {
      groupName: 'Núcleo de Estudo',
      items: [
        {
          id: 'simulator',
          label: 'Arena',
          fullName: 'Arena de Combate 60/40',
          category: 'Núcleo de Estudo',
          icon: Crosshair,
          badge: '60/40',
          badgeColor: 'bg-blue-500 text-white'
        },
        {
          id: 'flashcards',
          label: 'Cards 3D',
          fullName: 'SRS Flashcards 3D',
          category: 'Núcleo de Estudo',
          icon: Layers,
          badge: '3D',
          badgeColor: 'bg-purple-500 text-white'
        },
        {
          id: 'mistakes',
          label: 'Erros',
          fullName: 'Caderno de Erros Cognitivo',
          category: 'Núcleo de Estudo',
          icon: ShieldAlert,
          badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null,
          badgeColor: 'bg-rose-500 text-white shadow-rose-500/50'
        },
        {
          id: 'vademecum',
          label: 'Vade Mecum',
          fullName: 'Smart Vade Mecum & Links',
          category: 'Núcleo de Estudo',
          icon: Scale,
          badge: 'LINKS',
          badgeColor: 'bg-amber-500 text-white'
        },
        {
          id: 'questions',
          label: 'Questões',
          fullName: 'Banco de Questões Comentadas',
          category: 'Núcleo de Estudo',
          icon: BookCheck,
          badge: null
        }
      ]
    },
    {
      groupName: 'Estratégia & IA',
      items: [
        {
          id: 'edital',
          label: 'Edital IA',
          fullName: 'Edital Verticalizado IA',
          category: 'Estratégia & IA',
          icon: ScrollText,
          badge: 'IA',
          badgeColor: 'bg-cyan-500 text-white'
        },
        {
          id: 'cycle',
          label: 'Ciclos',
          fullName: 'Ciclos de Estudo Dinâmicos',
          category: 'Estratégia & IA',
          icon: CalendarClock,
          badge: null
        },
        {
          id: 'discursivas',
          label: 'Redação',
          fullName: 'Estúdio Discursivo & Feedback',
          category: 'Estratégia & IA',
          icon: Feather,
          badge: null
        },
        {
          id: 'summaries',
          label: 'Resumos',
          fullName: 'Resumos Sintéticos 80/20',
          category: 'Estratégia & IA',
          icon: BookOpen,
          badge: '80/20',
          badgeColor: 'bg-indigo-500 text-white'
        },
        {
          id: 'psychometrics',
          label: 'Psico TRI',
          fullName: 'Psicometria & Teoria TRI',
          category: 'Estratégia & IA',
          icon: Microscope,
          badge: 'TRI',
          badgeColor: 'bg-teal-500 text-white'
        },
        {
          id: 'radar',
          label: 'Radar 2026',
          fullName: 'Radar de Concursos 2026',
          category: 'Estratégia & IA',
          icon: Radar,
          badge: 'NOVO',
          badgeColor: 'bg-emerald-500 text-white'
        }
      ]
    },
    {
      groupName: 'Plataforma',
      items: [
        {
          id: 'guide',
          label: 'Guia',
          fullName: 'Guia & Metodologia do Aluno',
          category: 'Plataforma',
          icon: GraduationCap,
          badge: null
        },
        {
          id: 'pricing-plans',
          label: 'Planos',
          fullName: 'Planos & Assinatura PRO',
          category: 'Plataforma',
          icon: Crown,
          badge: 'PRO',
          badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black'
        },
        {
          id: 'settings',
          label: 'Ajustes',
          fullName: 'Configurações da Conta & Sistema',
          category: 'Plataforma',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  // Verificar estado de rolagem para telas menores
  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const isOverflowing = el.scrollWidth > el.clientWidth + 4;
      setCanScrollLeft(isOverflowing && el.scrollLeft > 10);
      setCanScrollRight(isOverflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, []);

  // Rolar suavemente somente quando houver overflow real no container
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el && el.scrollWidth > el.clientWidth && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
    checkScrollState();
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollState, 250);
    }
  };

  return (
    <nav
      aria-label="Navegação principal da plataforma"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 select-none w-auto max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] lg:max-w-fit animate-fadeIn"
    >
      {/* Container Principal do Dock com altura adequada para NUNCA cortar badges */}
      <div
        className={`dock-nav relative flex items-center px-1.5 py-1.5 sm:px-2.5 sm:py-2 rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-slate-400/30 text-slate-800 ring-1 ring-slate-900/5'
            : 'bg-[#080d1a]/95 border-white/10 shadow-black/90 text-white ring-1 ring-white/15'
        }`}
      >
        {/* Botão de Scroll Esquerda (aparece em telas estreitas quando houver overflow) */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-xl border shrink-0 mr-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white shadow-xs'
            }`}
            title="Rolar abas para a esquerda"
            aria-label="Rolar abas para a esquerda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Trilho de Abas: Em desktop (lg+) exibe todas as abas sem corte e sem scroll forçado */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-orientation="horizontal"
          onScroll={checkScrollState}
          onWheel={(e) => {
            if (e.deltaY !== 0 && scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth) {
              scrollContainerRef.current.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar scroll-smooth pt-2.5 pb-2 px-1 sm:px-1.5"
        >
          {dockGroups.map((group, groupIndex) => (
            <React.Fragment key={group.groupName}>
              {/* Separador vertical elegante entre clusters funcionais */}
              {groupIndex > 0 && (
                <div
                  className={`w-px h-8 sm:h-9 mx-0.5 sm:mx-1 shrink-0 ${
                    isLight ? 'bg-slate-200' : 'bg-white/10'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Botões do Grupo */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    ref={isActive ? activeItemRef : null}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${item.fullName}${item.badge ? ` - ${item.badge}` : ''}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex flex-col items-center justify-center min-w-[50px] sm:min-w-[56px] lg:min-w-[58px] xl:min-w-[62px] px-1.5 sm:px-2 pt-1.5 pb-1.5 sm:pt-2 sm:pb-2 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 shrink-0 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                      isActive
                        ? isLight
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/35 font-black ring-1 ring-white/30'
                          : 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 font-black ring-1 ring-cyan-400/30'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 hover:-translate-y-0.5'
                          : 'text-slate-400 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Ícone com Micro-interação de Escala */}
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : isLight
                            ? 'text-slate-600 group-hover:text-slate-900'
                            : 'text-slate-400 group-hover:text-white'
                      }`}
                    />

                    {/* Label com tipografia nítida */}
                    <span
                      className={`text-[9px] sm:text-[10px] mt-1 font-bold tracking-tight transition-all duration-150 whitespace-nowrap ${
                        isActive
                          ? 'text-white font-black drop-shadow-xs'
                          : isLight
                            ? 'text-slate-600 group-hover:text-slate-900 font-bold'
                            : 'text-slate-400 group-hover:text-slate-200 font-medium'
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Badge de Destaque Flutuante */}
                    {item.badge && (
                      <span
                        className={`absolute -top-1.5 -right-1 z-10 px-1 py-0.2 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-wider shadow-md ${
                          item.badgeColor ||
                          (isLight ? 'bg-indigo-600 text-white' : 'bg-cyan-500 text-slate-950')
                        } ring-1 ${isLight ? 'ring-white' : 'ring-black/50'} animate-pulse`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Indicador Ativo Luminoso na base */}
                    {isActive && (
                      <span
                        className={`absolute -bottom-0.5 w-5 sm:w-6 h-0.5 rounded-full ${
                          isLight ? 'bg-white shadow-xs' : 'bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        }`}
                      />
                    )}

                    {/* Tooltip Hover Explicativo de Alta Precisão */}
                    <div className="absolute bottom-full mb-2.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 transition-all opacity-0 group-hover:opacity-100 duration-150 transform group-hover:translate-y-0 translate-y-1">
                      <div
                        className={`px-3 py-1.5 rounded-xl shadow-xl border text-center whitespace-nowrap backdrop-blur-md ${
                          isLight
                            ? 'bg-slate-900 text-white border-slate-800'
                            : 'bg-slate-950 text-white border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="text-[11px] font-bold tracking-wide text-white">
                            {item.fullName}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                                item.badgeColor || 'bg-blue-500 text-white'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {item.category}
                        </span>
                      </div>
                      {/* Triângulo indicador do Tooltip */}
                      <div
                        className={`w-2 h-2 rotate-45 -mt-1 ${
                          isLight ? 'bg-slate-900' : 'bg-slate-950'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Botão de Scroll Direita (aparece em telas estreitas quando houver overflow) */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className={`hidden sm:flex items-center justify-center w-7 h-7 rounded-xl border shrink-0 ml-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white shadow-xs'
            }`}
            title="Rolar abas para a direita"
            aria-label="Rolar abas para a direita"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
};
