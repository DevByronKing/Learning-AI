'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass,
  ScrollText,
  CalendarClock,
  Crosshair,
  ShieldAlert,
  Scale,
  Feather,
  Activity,
  Sun,
  Moon,
  Flame, 
  Crown,
  Zap,
  Sparkles,
  BrainCircuit,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  BookCheck,
  Smartphone,
  Microscope,
  Layers,
  Database,
  Radar,
  Settings,
  HelpCircle,
  CreditCard,
  BookOpen,
  Search,
  Check,
  Sparkle,
  Gift
} from 'lucide-react';
import { SubscriptionPlan, StudentProfile } from '@/lib/types';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import { MobileAppModal } from './MobileAppModal';
import { BrandLogo } from './BrandLogo';
import { GoogleIcon } from './GoogleSignInButton';
import { useAuthStore } from '@/store/useAuthStore';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakDays: number;
  plan: SubscriptionPlan;
  onOpenPricing: () => void;
  selectedExamTitle?: string;
  pendingMistakesCount?: number;
  onOpenCopilot?: () => void;
  isSupabaseConfigured?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  studentProfile?: StudentProfile;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onOpenAdminIngest?: () => void;
  onOpenSettings?: () => void;
  onOpenMobileModal?: () => void;
  onOpenFlashChallenge?: () => void;
  onOpenReferral?: () => void;
  navMode?: 'sidebar' | 'megamenu' | 'dock';
  setNavMode?: (mode: 'sidebar' | 'megamenu' | 'dock') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakDays,
  plan,
  onOpenPricing,
  selectedExamTitle,
  pendingMistakesCount = 0,
  onOpenCopilot,
  isSupabaseConfigured = false,
  theme = 'dark',
  onToggleTheme,
  studentProfile,
  onOpenProfile,
  onOpenAuth,
  onOpenAdminIngest,
  onOpenSettings,
  onOpenMobileModal,
  onOpenFlashChallenge,
  onOpenReferral,
  navMode = 'dock',
  setNavMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuthStore();
  const isGoogleConnected = Boolean(user && user.id !== 'usr_default_demo' && !user.email.includes('argus.app.br') && !user.email.includes('learningai.com.br'));

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pillarMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentGuardian = GUARDIAN_ANIMALS.find((a) => a.id === studentProfile?.guardianAnimalId) || GUARDIAN_ANIMALS[0];

  // Catálogo dos 4 Pilares da Aprovação + Conta & Sistema
  const navTabs = [
    {
      id: 'landing',
      label: 'Início',
      shortLabel: 'Início',
      icon: Compass,
      desc: 'Visão Geral & Apresentação da Plataforma',
      badge: null,
      badgeColor: '',
      category: 'Geral',
      hotkey: 'H'
    },
    // Pilar 1: Praticar
    {
      id: 'simulator',
      label: 'Arena de Combate',
      shortLabel: 'Arena',
      icon: Crosshair,
      desc: 'Simulador 60/40 com Atalhos de Teclado & Modo Zen',
      badge: null,
      badgeColor: '',
      category: 'Praticar',
      hotkey: 'A'
    },
    {
      id: 'mistakes',
      label: 'Caderno de Erros',
      shortLabel: 'Erros',
      icon: ShieldAlert,
      desc: 'Mapeamento de Armadilhas da Banca & Revanche',
      badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
      category: 'Praticar',
      hotkey: 'E'
    },
    {
      id: 'flashcards',
      label: 'SRS Flashcards',
      shortLabel: 'Flashcards',
      icon: Layers,
      desc: 'Repetição Espaçada com Flip 3D (SM-2)',
      badge: null,
      badgeColor: '',
      category: 'Praticar',
      hotkey: 'F'
    },
    {
      id: 'questions',
      label: 'Banco de Questões',
      shortLabel: 'Questões',
      icon: BookCheck,
      desc: 'Banco Extenso com Filtros e Banca',
      badge: null,
      badgeColor: '',
      category: 'Praticar',
      hotkey: 'Q'
    },
    // Pilar 2: Conteúdo
    {
      id: 'vademecum',
      label: 'Smart Vade Mecum',
      shortLabel: 'Vade Mecum',
      icon: Scale,
      desc: 'Lei Seca com Backlinks para Caderno de Erros',
      badge: null,
      badgeColor: '',
      category: 'Conteúdo',
      hotkey: 'V'
    },
    {
      id: 'summaries',
      label: 'Resumos Inteligentes',
      shortLabel: 'Resumos',
      icon: BookOpen,
      desc: 'Sínteses 80/20 com Mnemônicos e Áudio IA',
      badge: null,
      badgeColor: '',
      category: 'Conteúdo',
      hotkey: 'U'
    },
    {
      id: 'discursivas',
      label: 'Discursivas & Peças',
      shortLabel: 'Redação',
      icon: Feather,
      desc: 'Correção de Redações & Peças OAB com IA',
      badge: null,
      badgeColor: '',
      category: 'Conteúdo',
      hotkey: 'O'
    },
    // Pilar 3: Planejar
    {
      id: 'edital',
      label: 'Edital IA',
      shortLabel: 'Edital',
      icon: ScrollText,
      desc: 'Edital Verticalizado & Matriz de Pesos',
      badge: null,
      badgeColor: '',
      category: 'Planejar',
      hotkey: 'D'
    },
    {
      id: 'cycle',
      label: 'Ciclos Meirelles',
      shortLabel: 'Ciclos',
      icon: CalendarClock,
      desc: 'Cronograma Adaptativo de Estudos',
      badge: null,
      badgeColor: '',
      category: 'Planejar',
      hotkey: 'M'
    },
    {
      id: 'radar',
      label: 'Radar Concursos',
      shortLabel: 'Radar',
      icon: Radar,
      desc: 'Concursos Abertos, Previstos, OAB & ENEM',
      badge: null,
      badgeColor: '',
      category: 'Planejar',
      hotkey: 'R'
    },
    // Pilar 4: Evolução
    {
      id: 'dashboard',
      label: 'Cockpit de Dados',
      shortLabel: 'Cockpit',
      icon: Activity,
      desc: 'Heatmap GitHub 365d & Blindagem de Disciplinas',
      badge: null,
      badgeColor: '',
      category: 'Evolução',
      hotkey: 'C'
    },
    {
      id: 'psychometrics',
      label: 'Psicometria TRI',
      shortLabel: 'Psico',
      icon: Microscope,
      desc: 'Skeleton Narrativo & Engenharia Reversa da Banca',
      badge: null,
      badgeColor: '',
      category: 'Evolução',
      hotkey: 'P'
    },
    // Conta & Ajustes
    {
      id: 'settings',
      label: 'Configurações',
      shortLabel: 'Ajustes',
      icon: Settings,
      desc: 'Perfil, Opções de Estudo & LGPD',
      badge: null,
      badgeColor: '',
      category: 'Conta & Sistema',
      hotkey: null
    },
    {
      id: 'subscription',
      label: 'Minha Assinatura',
      shortLabel: 'Assinatura',
      icon: CreditCard,
      desc: 'Faturas, Recibos Fiscais & Upgrade',
      badge: null,
      badgeColor: '',
      category: 'Conta & Sistema',
      hotkey: null
    },
    {
      id: 'pricing-plans',
      label: 'Planos & Preços',
      shortLabel: 'Planos',
      icon: Crown,
      desc: 'Comparativo Detalhado de Assinaturas',
      badge: null,
      badgeColor: '',
      category: 'Conta & Sistema',
      hotkey: 'S'
    },
    {
      id: 'help',
      label: 'Ajuda & Suporte',
      shortLabel: 'Ajuda',
      icon: HelpCircle,
      desc: 'Quem Somos, Segurança & Denuncie Pirataria',
      badge: null,
      badgeColor: '',
      category: 'Conta & Sistema',
      hotkey: null
    }
  ];

  const activeTabInfo = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  // Configuração canônica dos 4 Pilares da Aprovação para o Menu Superior
  const PILLARS_CONFIG = [
    {
      key: 'Praticar',
      name: 'Praticar',
      icon: Crosshair,
      tagline: 'Simulados com IA, Caderno de Erros & Flashcards',
      items: [
        {
          id: 'simulator',
          label: 'Arena de Simulados',
          desc: 'Simulador 60/40 com atalhos de alta velocidade e foco',
          icon: Crosshair
        },
        {
          id: 'mistakes',
          label: 'Caderno de Erros',
          desc: 'Mapeamento de armadilhas da banca com revanche',
          icon: ShieldAlert,
          badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null
        },
        {
          id: 'flashcards',
          label: 'Flashcards Anki (SRS)',
          desc: 'Repetição espaçada com algoritmo SM-2 e flip 3D',
          icon: Layers
        },
        {
          id: 'questions',
          label: 'Banco de Questões',
          desc: 'Filtros avançados por banca, ano, cargo e matéria',
          icon: BookCheck
        }
      ]
    },
    {
      key: 'Conteúdo',
      name: 'Conteúdo',
      icon: BookOpen,
      tagline: 'Legislação Comentada & Sínteses Estratégicas',
      items: [
        {
          id: 'vademecum',
          label: 'Smart Vade Mecum',
          desc: 'Lei seca integrada com artigos mais cobrados',
          icon: Scale
        },
        {
          id: 'summaries',
          label: 'Resumos 80/20 & Mapas',
          desc: 'Sínteses focadas nas pegadinhas com mnemônicos',
          icon: BookOpen
        },
        {
          id: 'discursivas',
          label: 'Discursivas & Redação IA',
          desc: 'Correção de peças com critérios oficiais de banca',
          icon: Feather
        }
      ]
    },
    {
      key: 'Planejar',
      name: 'Planejar',
      icon: ScrollText,
      tagline: 'Verticalização de Edital & Cronograma Meirelles',
      items: [
        {
          id: 'edital',
          label: 'Edital Verticalizado IA',
          desc: 'Mapeamento de tópicos com matriz de peso e relevância',
          icon: ScrollText
        },
        {
          id: 'cycle',
          label: 'Ciclos de Estudo Meirelles',
          desc: 'Cronograma adaptativo balanceado por peso e dificuldade',
          icon: CalendarClock
        },
        {
          id: 'radar',
          label: 'Radar Concursos',
          desc: 'Editais abertos, autorizados, OAB e grandes vestibulares',
          icon: Radar
        }
      ]
    },
    {
      key: 'Evolução',
      name: 'Evolução',
      icon: Activity,
      tagline: 'Métricas Reais & Análise Psicométrica TRI',
      items: [
        {
          id: 'dashboard',
          label: 'Cockpit de Métricas',
          desc: 'Heatmap de constância 365d e radar de matérias',
          icon: Activity
        },
        {
          id: 'psychometrics',
          label: 'Psicometria & Curva TRI',
          desc: 'Imunidade a pegadinhas e previsão de nota de corte',
          icon: Microscope
        }
      ]
    }
  ];

  const currentPillar = PILLARS_CONFIG.find(p => p.items.some(i => i.id === activeTab));

  // Fechar Menus ao clicar fora ou ao apertar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pillarMenuRef.current && !pillarMenuRef.current.contains(e.target as Node)) {
        setOpenPillar(null);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsMegaMenuOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpenPillar(null);
        setIsMegaMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focar o campo de busca quando o mega-menu for aberto
  useEffect(() => {
    if (isMegaMenuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isMegaMenuOpen]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  const filteredTabs = navTabs.filter((t) => 
    t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highPerfTabs = filteredTabs.filter((t) => t.category === 'Alta Performance');
  const prepTabs = filteredTabs.filter((t) => t.category === 'Preparação & Editais');
  const systemTabs = filteredTabs.filter((t) => t.category === 'Sistema' || t.category === 'Geral');

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 overflow-x-clip ${
        isLight 
          ? 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-xs' 
          : 'bg-[#090D16]/95 border-slate-800 dark:border-white/10 backdrop-blur-2xl'
      }`}>
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6">
          
          {/* Header Row: Altura calibrada de 64px, zero transbordamento horizontal */}
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3 min-w-0">
            
            {/* Lado Esquerdo: Marca Argus */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div 
                className="flex items-center gap-2 xl:gap-2.5 cursor-pointer shrink-0 select-none" 
                onClick={() => handleTabClick('landing')}
                title="Ir para o início"
              >
                <BrandLogo size={38} showGlow />
                <div className="flex items-center gap-1.5">
                  <span className={`text-base sm:text-lg xl:text-xl font-black tracking-tight transition-colors ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Argus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">AI</span>
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border transition-colors ${
                    isLight 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    PRO
                  </span>
                </div>
              </div>
            </div>

            {/* Centro: Navegação Completa dos 4 Pilares da Aprovação (Desktop & Tablet) */}
            <div className="hidden md:flex items-center gap-1 shrink-0" ref={pillarMenuRef}>
              
              {/* Botão de Retorno / Início quando estiver navegando dentro de ferramentas */}
              {activeTab !== 'landing' && (
                <button
                  onClick={() => handleTabClick('landing')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isLight ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  title="Voltar à Página Inicial"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Início</span>
                </button>
              )}

              {/* Os 4 Pilares da Aprovação com Dropdowns Interativos */}
              <div className="flex items-center gap-0.5 xl:gap-1 bg-slate-500/5 dark:bg-white/[0.03] p-1 rounded-2xl border border-slate-200/50 dark:border-white/5">
                {PILLARS_CONFIG.map((pillar) => {
                  const isPillarActive = currentPillar?.key === pillar.key;
                  const isDropdownOpen = openPillar === pillar.key;
                  const PillarIcon = pillar.icon;

                  return (
                    <div 
                      key={pillar.key} 
                      className="relative"
                      onMouseEnter={() => setOpenPillar(pillar.key)}
                      onMouseLeave={() => setOpenPillar(null)}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleTabClick(pillar.items[0].id);
                          setOpenPillar(null);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                          isPillarActive
                            ? isLight
                              ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                              : 'bg-blue-600 text-white shadow-xs shadow-blue-600/40'
                            : isLight
                              ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                        aria-expanded={isDropdownOpen}
                        aria-label={`Menu do pilar ${pillar.name}`}
                      >
                        <PillarIcon className={`w-3.5 h-3.5 ${isPillarActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{pillar.name}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          isPillarActive ? 'text-white/80' : 'text-slate-400'
                        } ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu do Pilar */}
                      {isDropdownOpen && (
                        <div className="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn">
                          <div
                            className={`w-72 sm:w-80 rounded-2xl border shadow-2xl p-2.5 ${
                              isLight
                                ? 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-300/60'
                                : 'bg-[#0b1329] border-slate-700/60 text-white shadow-2xl shadow-black/95'
                            }`}
                          >
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                  Pilar: {pillar.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {pillar.items.length} módulos
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                                {pillar.tagline}
                              </p>
                            </div>

                            <div className="space-y-1">
                              {pillar.items.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isItemActive = activeTab === subItem.id;
                                return (
                                  <button
                                    key={subItem.id}
                                    onClick={() => {
                                      setOpenPillar(null);
                                      handleTabClick(subItem.id);
                                    }}
                                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                                      isItemActive
                                        ? isLight
                                          ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                                          : 'bg-blue-600/25 text-white border border-blue-500/40 font-bold'
                                        : isLight
                                          ? 'hover:bg-slate-100 text-slate-700'
                                          : 'hover:bg-white/5 text-slate-200'
                                    }`}
                                  >
                                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                      isItemActive
                                        ? 'bg-blue-600 text-white'
                                        : isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                                    }`}>
                                      <SubIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold truncate">{subItem.label}</span>
                                        {subItem.badge && (
                                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-rose-500 text-white">
                                            {subItem.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-tight">
                                        {subItem.desc}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lado Direito: Status e Ações Globais (Compactos e 100% Responsivos) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              

              {/* Alternador de Tema (Modo Claro / Modo Escuro) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-200 shadow-xs' 
                      : 'bg-white/5 hover:bg-white/10 text-amber-400 border-white/10'
                  }`}
                  title={isLight ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
                  aria-label="Alternar tema de cores"
                >
                  {isLight ? (
                    <Moon className="w-4 h-4 text-blue-600 transition-transform rotate-0 hover:-rotate-12" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
                  )}
                </button>
              )}

              {/* Copiloto Cognitivo IA */}
              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                    isLight 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' 
                      : 'bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-blue-500/15 border-blue-400/35 text-blue-200 hover:border-blue-400 hover:bg-blue-500/25'
                  }`}
                  title="Abrir Copiloto Cognitivo IA"
                  aria-label="Abrir Copiloto Cognitivo IA"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'} animate-pulse`} />
                  <span className="hidden xl:inline whitespace-nowrap">
                    {studentProfile?.guardianAnimalId ? GUARDIAN_ANIMALS.find(a => a.id === studentProfile.guardianAnimalId)?.name : 'Copiloto'}
                  </span>
                  <span className="inline xl:hidden whitespace-nowrap text-[11px]">
                    IA
                  </span>
                </button>
              )}

              {/* Fogo de Ofensiva (Streak Diário) */}
              <div 
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold shrink-0 select-none ${
                  isLight 
                    ? 'bg-amber-50 border-amber-200 text-amber-800' 
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                }`}
                title="Sequência de dias consecutivos de estudo"
                aria-label={`Sequência de estudo: ${streakDays} dias`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 animate-bounce" />
                <span className="whitespace-nowrap">{streakDays}d</span>
              </div>

              {/* App Mobile */}
              <button
                onClick={() => onOpenMobileModal ? onOpenMobileModal() : setIsMobileModalOpen(true)}
                className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                title="Sincronizar com App Mobile (iOS / Android)"
                aria-label="Sincronizar com App Mobile PWA para iOS e Android"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="whitespace-nowrap">App</span>
              </button>

              {/* Desafio Relâmpago das 3 Pegadinhas (Aha Moment D0) */}
              <button
                onClick={() => onOpenFlashChallenge ? onOpenFlashChallenge() : window.dispatchEvent(new CustomEvent('open-flash-challenge'))}
                className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer ${
                  isLight 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300' 
                    : 'bg-blue-500/10 border-blue-500/25 text-cyan-300 hover:bg-blue-500/20'
                }`}
                title="Desafio Relâmpago: 3 Pegadinhas da Banca"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="whitespace-nowrap">3 Pegadinhas</span>
              </button>

              {/* Botão Indicar Colega (Member-Get-Member: +7d PRO) */}
              <button
                onClick={() => onOpenReferral ? onOpenReferral() : window.dispatchEvent(new CustomEvent('open-referral-modal'))}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
                title="Indique um colega e ganhe 7 dias de PRO para ambos"
              >
                <Gift className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="whitespace-nowrap">Indicar (+7d PRO)</span>
              </button>

              {/* Menu da Conta & Perfil do Estudante */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs group shrink-0 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                  title={`Conta de ${studentProfile?.warName || studentProfile?.name || 'Estudante'}`}
                  aria-label="Abrir menu da conta e configurações"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="text-base select-none transition-transform group-hover:scale-110">
                    {currentGuardian.emoji}
                  </span>
                  <div className="hidden xl:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-black truncate max-w-[85px]">
                      {studentProfile?.warName || studentProfile?.name || 'Concurseiro'}
                    </span>
                    <span className="text-[9px] text-blue-500 dark:text-blue-400 font-semibold truncate max-w-[85px]">
                      {currentGuardian.archetype}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </button>

                {/* Dropdown Menu da Conta */}
                {isUserMenuOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-fadeIn ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800 shadow-xl shadow-slate-300/60'
                      : 'bg-[#0b1329] border-slate-700/60 text-white shadow-2xl shadow-black/95'
                  }`}>
                    {/* User Header */}
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1.5">
                      <div className="text-xs font-black truncate">
                        {studentProfile?.warName || studentProfile?.name || 'Concurseiro'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {user?.email || 'concurseiro@argus.app.br'}
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <span>Plano: {plan.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Destaque Login Google se não conectado */}
                    {!isGoogleConnected && (
                      <div className="mb-1.5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            if (onOpenAuth) onOpenAuth();
                            else window.dispatchEvent(new CustomEvent('open-auth-modal'));
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400"
                        >
                          <GoogleIcon className="w-3.5 h-3.5" />
                          <span>Conectar Conta Google</span>
                        </button>
                      </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="space-y-0.5">
                      {onOpenProfile && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenProfile();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
                          }`}
                        >
                          <span className="text-sm">{currentGuardian.emoji}</span>
                          <span>Passaporte Cognitivo</span>
                        </button>
                      )}

                      {onOpenFlashChallenge && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenFlashChallenge();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isLight ? 'hover:bg-blue-50 text-blue-700' : 'hover:bg-blue-500/10 text-cyan-300'
                          }`}
                        >
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span>Desafio 3 Pegadinhas (D0)</span>
                        </button>
                      )}

                      {onOpenReferral && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenReferral();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isLight ? 'hover:bg-emerald-50 text-emerald-800' : 'hover:bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          <Gift className="w-4 h-4 text-emerald-500" />
                          <span>Indicar Colega (+7d PRO)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('settings');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Configurações</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('subscription');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>Minha Assinatura</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('help');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>Ajuda & Suporte</span>
                      </button>
                    </div>

                    {/* Sair / Logout */}
                    {user && (
                      <div className="pt-1 mt-1 border-t border-slate-100 dark:border-white/5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <X className="w-4 h-4" />
                          <span>Desconectar Conta</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão de Conexão / Login Google (Exibido em telas amplas 2xl) */}
              {!isGoogleConnected && (
                <button
                  onClick={() => {
                    if (onOpenAuth) onOpenAuth();
                    else window.dispatchEvent(new CustomEvent('open-auth-modal'));
                  }}
                  className={`hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
                  }`}
                  title="Fazer Login com Google ou E-mail"
                  aria-label="Fazer Login com Google"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Entrar com Google</span>
                </button>
              )}

              {/* Botão de Assinatura */}
              {plan === 'aspirante' ? (
                <button
                  onClick={onOpenPricing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black tracking-wide transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
                  title="Conhecer Planos e Preços"
                  aria-label="Conhecer Planos e Assinar Pro"
                >
                  <Crown className="w-3.5 h-3.5 fill-black shrink-0" />
                  <span className="hidden sm:inline">ASSINAR PRO</span>
                  <span className="inline sm:hidden">PRO</span>
                </button>
              ) : (
                <button
                  onClick={onOpenPricing}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold whitespace-nowrap shrink-0 cursor-pointer ${
                    isLight 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800' 
                      : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  }`}
                  aria-label={`Plano ativo: ${plan.toUpperCase()}`}
                >
                  <Zap className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-blue-600 fill-blue-600/40' : 'text-blue-400 fill-blue-400/40'}`} />
                  <span>{plan.toUpperCase()}</span>
                </button>
              )}

              {/* Botão Menu Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl border transition-colors ${
                  isLight 
                    ? 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900' 
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
                aria-label={isMobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* Menu Mobile Completo (Drawer Slide-Over Lateral) */}
      {isMobileMenuOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] md:hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className={`relative w-full max-w-xs sm:max-w-sm h-full p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 border-l transition-colors ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-900' 
              : 'bg-[#0c1322] border-slate-800 dark:border-white/10 text-white'
          }`}>
            <div>
              {/* Cabeçalho do Drawer */}
              <div className={`flex items-center justify-between pb-4 border-b mb-5 ${
                isLight ? 'border-slate-200' : 'border-slate-800 dark:border-white/10'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black">Argus AI</span>
                    <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Navegação Completa
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onToggleTheme && (
                    <button
                      onClick={onToggleTheme}
                      className={`p-1.5 rounded-lg border ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 dark:border-white/10 text-slate-300'
                      }`}
                      title={isLight ? 'Modo Escuro' : 'Modo Claro'}
                    >
                      {isLight ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-1.5 rounded-lg ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Login com Google Mobile */}
              {!isGoogleConnected && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                    else window.dispatchEvent(new CustomEvent('open-auth-modal'));
                  }}
                  className="w-full mb-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Fazer login com Google</span>
                </button>
              )}

              {/* Perfil do Aluno Mobile */}
              {onOpenProfile && (
                <div 
                  onClick={() => { setIsMobileMenuOpen(false); onOpenProfile(); }}
                  className={`p-3.5 mb-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isLight 
                      ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200 hover:border-blue-300' 
                      : 'bg-gradient-to-r from-blue-950/40 to-slate-900/40 border-blue-500/30 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 rounded-xl bg-black/20">
                      {currentGuardian.emoji}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">
                        Passaporte Cognitivo
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {studentProfile?.name || 'Concurseiro'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currentGuardian.name} • {currentGuardian.archetype}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                </div>
              )}

              {/* Edital Ativo */}
              {selectedExamTitle && (
                <div className={`p-3 mb-4 rounded-2xl border ${
                  isLight 
                    ? 'bg-blue-50 border-blue-200 text-blue-900' 
                    : 'bg-blue-500/10 border-blue-500/25 text-blue-300'
                }`}>
                  <span className="text-[10px] font-bold block mb-0.5">
                    Edital em Foco
                  </span>
                  <span className="text-xs font-extrabold line-clamp-1">
                    {selectedExamTitle}
                  </span>
                </div>
              )}

              {/* Ações de Retenção Rápida Mobile */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenFlashChallenge) onOpenFlashChallenge();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-cyan-400 text-xs font-black cursor-pointer hover:bg-blue-500/20 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>3 Pegadinhas</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenReferral) onOpenReferral();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black cursor-pointer hover:bg-emerald-500/20 transition-all"
                >
                  <Gift className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>Indicar (+7d PRO)</span>
                </button>
              </div>

              {/* Módulos Estruturados nos 4 Pilares da Aprovação */}
              <div className="space-y-4">
                {['Praticar', 'Conteúdo', 'Planejar', 'Evolução', 'Conta & Sistema'].map((pillar) => {
                  const itemsInPillar = navTabs.filter(t => t.category === pillar);
                  if (itemsInPillar.length === 0) return null;
                  return (
                    <div key={pillar} className="space-y-1.5">
                      <span className={`text-[10px] font-bold px-2 block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {pillar === 'Praticar' && '🎯 '}
                        {pillar === 'Conteúdo' && '📚 '}
                        {pillar === 'Planejar' && '🗺️ '}
                        {pillar === 'Evolução' && '📊 '}
                        {pillar === 'Conta & Sistema' && '⚙️ '}
                        {pillar}
                      </span>

                      {itemsInPillar.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isActive
                                ? isLight
                                  ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold shadow-xs'
                                  : 'bg-blue-600/25 border border-blue-500/40 text-white font-bold'
                                : isLight
                                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
                                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`p-1.5 rounded-lg shrink-0 ${
                                isActive 
                                  ? 'bg-blue-600 text-white' 
                                  : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/5 text-slate-400'
                              }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold truncate">{tab.label}</span>
                                  {tab.badge && (
                                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white shrink-0">
                                      {tab.badge}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10px] block truncate ${
                                  isLight ? 'text-slate-500' : 'text-slate-400'
                                }`}>
                                  {tab.desc}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-500' : 'opacity-40'}`} />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rodapé do Menu Mobile */}
            <div className={`mt-6 pt-4 border-t space-y-2 ${isLight ? 'border-slate-200' : 'border-slate-800 dark:border-white/10'}`}>
              <a
                href="/edital/inss-tecnico-seguro-social-2026"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Páginas de Editais (SEO)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>


              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPricing();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Assinar / Gerenciar Plano</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegação Inferior Nativa para Mobile (Sempre visível em smartphones < 768px) */}
      <nav
        aria-label="Navegação móvel inferior por abas"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t py-2 px-1 flex items-center justify-around transition-colors shadow-2xl safe-area-bottom ${
          isLight 
            ? 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-600 shadow-slate-300/60' 
            : 'bg-[#0c1222]/95 backdrop-blur-2xl border-slate-800 text-slate-400 shadow-black/90'
        }`}
      >
        <button
          type="button"
          onClick={() => handleTabClick('simulator')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeTab === 'simulator' 
              ? 'text-blue-600 dark:text-blue-400 font-black' 
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Crosshair className={`w-5 h-5 ${activeTab === 'simulator' ? 'text-blue-600 dark:text-blue-400 scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Simulador</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('flashcards')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeTab === 'flashcards' 
              ? 'text-blue-600 dark:text-blue-400 font-black' 
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'flashcards' ? 'text-blue-600 dark:text-blue-400 scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Flashcards</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('vademecum')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeTab === 'vademecum' 
              ? 'text-amber-600 dark:text-amber-400 font-black' 
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Scale className={`w-5 h-5 ${activeTab === 'vademecum' ? 'text-amber-600 dark:text-amber-400 scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Vade Mecum</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'text-emerald-600 dark:text-emerald-400 font-black' 
              : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Cockpit</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl active:scale-95 transition-all cursor-pointer ${
            isMobileMenuOpen ? 'text-blue-500 font-black' : 'hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5 text-blue-500" />
          <span className="text-[10px] tracking-tight">Mais Abas</span>
        </button>
      </nav>

      {/* Modal de Onboarding Multimodal (fallback local se não controlado pelo pai) */}
      {!onOpenMobileModal && (
        <MobileAppModal 
          isOpen={isMobileModalOpen} 
          onClose={() => setIsMobileModalOpen(false)} 
        />
      )}
    </>
  );
};
