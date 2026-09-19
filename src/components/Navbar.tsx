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
  Sparkle
} from 'lucide-react';
import { SubscriptionPlan, StudentProfile } from '@/lib/types';
import { GUARDIAN_ANIMALS } from '@/lib/guardianAnimals';
import { MobileAppModal } from './MobileAppModal';

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
  onOpenAdminIngest?: () => void;
  onOpenSettings?: () => void;
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
  onOpenAdminIngest,
  onOpenSettings,
  navMode = 'sidebar',
  setNavMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentGuardian = GUARDIAN_ANIMALS.find((a) => a.id === studentProfile?.guardianAnimalId) || GUARDIAN_ANIMALS[0];

  // Catálogo Completo de Módulos com Atalhos de Teclado
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
    {
      id: 'dashboard',
      label: 'Cockpit de Dados',
      shortLabel: 'Cockpit',
      icon: Activity,
      desc: 'Heatmap GitHub 365d, Edital Verticalizado & Blindagem',
      badge: 'HEATMAP',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      category: 'Alta Performance',
      hotkey: 'C'
    },
    {
      id: 'simulator',
      label: 'Arena de Combate',
      shortLabel: 'Arena',
      icon: Crosshair,
      desc: 'Simulador 60/40 com Atalhos de Teclado & Modo Zen (F)',
      badge: '60/40',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      category: 'Alta Performance',
      hotkey: 'A'
    },
    {
      id: 'flashcards',
      label: 'SRS Flashcards',
      shortLabel: 'Flashcards',
      icon: Layers,
      desc: 'Repetição Espaçada com Flip 3D (SM-2)',
      badge: '3D',
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      category: 'Alta Performance',
      hotkey: 'F'
    },
    {
      id: 'vademecum',
      label: 'Smart Vade Mecum',
      shortLabel: 'Vade Mecum',
      icon: Scale,
      desc: 'Lei Seca com Backlinks para Caderno de Erros',
      badge: 'LINKS',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      category: 'Alta Performance',
      hotkey: 'V'
    },
    {
      id: 'mistakes',
      label: 'Caderno de Erros',
      shortLabel: 'Erros',
      icon: ShieldAlert,
      desc: 'Mapeamento de Armadilhas da Banca & Revanche',
      badge: pendingMistakesCount > 0 ? `${pendingMistakesCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
      category: 'Alta Performance',
      hotkey: 'E'
    },
    {
      id: 'psychometrics',
      label: 'Psicometria TRI',
      shortLabel: 'Psico',
      icon: Microscope,
      desc: 'Skeleton Narrativo & Engenharia Reversa da Banca',
      badge: 'IA',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
      category: 'Alta Performance',
      hotkey: 'P'
    },
    {
      id: 'radar',
      label: 'Radar 2026',
      shortLabel: 'Radar',
      icon: Radar,
      desc: 'Concursos Abertos, Previstos, OAB & ENEM',
      badge: 'NOVO',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      category: 'Preparação & Editais',
      hotkey: 'R'
    },
    {
      id: 'edital',
      label: 'Edital IA',
      shortLabel: 'Edital',
      icon: ScrollText,
      desc: 'Análise Estratégica & Matriz de Pesos',
      badge: null,
      badgeColor: '',
      category: 'Preparação & Editais',
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
      category: 'Preparação & Editais',
      hotkey: 'M'
    },
    {
      id: 'questions',
      label: 'Banco de Questões',
      shortLabel: 'Questões',
      icon: BookCheck,
      desc: 'Banco Extenso com Filtros e Banca',
      badge: null,
      badgeColor: '',
      category: 'Preparação & Editais',
      hotkey: 'Q'
    },
    {
      id: 'summaries',
      label: 'Resumos Inteligentes',
      shortLabel: 'Resumos',
      icon: BookOpen,
      desc: 'Sínteses 80/20 com Mnemônicos e Áudio IA',
      badge: '80/20',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      category: 'Preparação & Editais',
      hotkey: 'R'
    },
    {
      id: 'discursivas',
      label: 'Discursivas & Peças',
      shortLabel: 'Redação',
      icon: Feather,
      desc: 'Correção de Redações & Peças OAB com IA',
      badge: null,
      badgeColor: '',
      category: 'Preparação & Editais',
      hotkey: 'O'
    },
    {
      id: 'guide',
      label: 'Guia do Aluno',
      shortLabel: 'Guia',
      icon: BookOpen,
      desc: 'Manual Cognitivo de 5 Fases para os 85%+',
      badge: 'PRO',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      category: 'Sistema',
      hotkey: 'G'
    },
    {
      id: 'pricing-plans',
      label: 'Planos & Assinaturas',
      shortLabel: 'Planos',
      icon: Crown,
      desc: 'Comparativo Detalhado de Assinaturas',
      badge: null,
      badgeColor: '',
      category: 'Sistema',
      hotkey: 'S'
    },
    {
      id: 'subscription',
      label: 'Minha Assinatura',
      shortLabel: 'Assinatura',
      icon: CreditCard,
      desc: 'Faturas, Recibos Fiscais & Upgrade',
      badge: null,
      badgeColor: '',
      category: 'Sistema',
      hotkey: null
    },
    {
      id: 'settings',
      label: 'Configurações',
      shortLabel: 'Ajustes',
      icon: Settings,
      desc: 'Perfil, Opções Freemium/Pro/Elite & LGPD',
      badge: null,
      badgeColor: '',
      category: 'Sistema',
      hotkey: null
    },
    {
      id: 'help',
      label: 'Ajuda & Suporte',
      shortLabel: 'Ajuda',
      icon: HelpCircle,
      desc: 'Quem Somos, Segurança & Denuncie Pirataria',
      badge: null,
      badgeColor: '',
      category: 'Sistema',
      hotkey: null
    }
  ];

  const activeTabInfo = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  // Fechar Mega-Menu ao clicar fora ou ao apertar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsMegaMenuOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
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
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        isLight 
          ? 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-xs' 
          : 'bg-[#090D16]/95 border-slate-800 dark:border-white/10 backdrop-blur-2xl'
      }`}>
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6">
          
          {/* Header Row: Altura equilibrada de 68px, zero transbordamento horizontal */}
          <div className="flex items-center justify-between h-17 gap-3">
            
            {/* Lado Esquerdo: Marca / Breadcrumb + Mega-Menu Seletor */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              
              {navMode === 'sidebar' ? (
                /* Modo Sidebar: Breadcrumbs limpos no topo */
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-400">
                  <span 
                    onClick={() => handleTabClick('landing')}
                    className="cursor-pointer hover:text-blue-500 transition-colors hidden sm:inline"
                  >
                    Learning AI
                  </span>
                  <span className="opacity-40 hidden sm:inline">/</span>
                  <span className="text-slate-900 dark:text-white flex items-center gap-1.5 font-black">
                    <activeTabInfo.icon className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                    {activeTabInfo.label}
                  </span>
                </div>
              ) : (
                /* Logo: Learning AI */
                <div 
                  className="flex items-center gap-2 xl:gap-2.5 cursor-pointer shrink-0 select-none" 
                  onClick={() => handleTabClick('landing')}
                  title="Ir para o início"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1.5px] glow-brand shadow-sm">
                    <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                      isLight ? 'bg-white' : 'bg-[#0d1322]'
                    }`}>
                      <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-base sm:text-lg xl:text-xl font-black tracking-tight transition-colors ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">AI</span>
                    </span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border transition-colors ${
                      isLight 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      PRO
                    </span>
                  </div>
                </div>
              )}

              {/* Botão Gatilho do Mega-Menu Suspenso (Opção 2 - Glassmorphism) */}
              {(navMode === 'megamenu' || navMode === 'dock') && (
                <div className="relative" ref={megaMenuRef}>
                  <button
                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                    className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-bold transition-all shadow-sm select-none cursor-pointer group ${
                      isMegaMenuOpen
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                        : isLight
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 border-blue-200 shadow-xs'
                          : 'bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-white border-blue-500/30 hover:border-blue-400/50'
                    }`}
                    title="Abrir Central de Módulos & Ferramentas (Ctrl + K)"
                  >
                  <activeTabInfo.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isMegaMenuOpen ? 'text-white' : 'text-blue-500 dark:text-cyan-400'
                  }`} />
                  
                  <span className="font-black tracking-tight max-w-[130px] sm:max-w-[190px] truncate">
                    {activeTabInfo.label}
                  </span>

                  {activeTabInfo.badge && (
                    <span className={`hidden sm:inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-black shrink-0 ${
                      activeTabInfo.badgeColor || 'bg-blue-500 text-white'
                    }`}>
                      {activeTabInfo.badge}
                    </span>
                  )}

                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />

                  <kbd className="hidden xl:inline-flex items-center text-[9px] font-mono px-1 py-0.2 rounded bg-black/10 dark:bg-white/10 text-slate-400 font-semibold ml-0.5">
                    ⌘K
                  </kbd>
                </button>

                {/* PAINEL SUSPENSO MEGA-MENU GLASSMORPHISM (Estilo Stripe / Vercel) */}
                {isMegaMenuOpen && (
                  <>
                    {/* Backdrop escuro para isolar o menu e impedir que o texto da página vaze por trás */}
                    <div 
                      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity cursor-pointer"
                      onClick={() => setIsMegaMenuOpen(false)}
                      title="Clique para fechar"
                    />

                    {/* Container do Mega-Menu 100% Opaco com borda brilhante e sombra profunda */}
                    <div 
                      style={{ backgroundColor: isLight ? '#ffffff' : '#0b101e' }}
                      className={`absolute top-full left-0 mt-3 w-[calc(100vw-24px)] sm:w-[680px] lg:w-[740px] max-w-[740px] rounded-3xl border shadow-2xl p-4 sm:p-5 z-50 animate-fadeIn transition-all select-none ${
                        isLight 
                          ? 'border-slate-200 shadow-slate-400/50 text-slate-900' 
                          : 'border-blue-500/30 dark:border-white/15 shadow-black/95 text-white ring-1 ring-blue-500/20'
                      }`}
                    >
                    
                    {/* Barra Superior do Mega-Menu com Campo de Busca Rápida */}
                    <div className={`flex items-center justify-between pb-3.5 border-b mb-4 ${
                      isLight ? 'border-slate-100' : 'border-white/10'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                            Central de Módulos & Ferramentas
                          </h3>
                          <p className="text-[10px] text-slate-400">
                            Selecione uma ferramenta ou use o teclado
                          </p>
                        </div>
                      </div>

                      {/* Campo de Busca Fluido */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs w-48 sm:w-60 transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                      }`}>
                        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar módulo..."
                          className="bg-transparent outline-none text-xs w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Grade de Duas Colunas do Mega-Menu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-h-[60vh] overflow-y-auto pr-1">
                      
                      {/* COLUNA 1: ALTA PERFORMANCE (Os 6 Pilares) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Alta Performance
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/15 border border-blue-500/20 font-bold">
                            Pilar de Elite
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {highPerfTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all group cursor-pointer border ${
                                  isSelected
                                    ? isLight
                                      ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-xs'
                                      : 'bg-blue-600/20 border-blue-500/40 text-white shadow-md shadow-blue-600/10'
                                    : isLight
                                      ? 'hover:bg-slate-50 border-transparent text-slate-700'
                                      : 'hover:bg-white/5 border-transparent text-slate-200'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                    : isLight
                                      ? 'bg-slate-100 text-blue-600 border-slate-200'
                                      : 'bg-white/5 text-blue-300 border-white/10'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-black truncate ${isSelected ? 'text-blue-600 dark:text-cyan-400' : ''}`}>
                                      {tab.label}
                                    </span>
                                    {tab.badge && (
                                      <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase shrink-0 ${tab.badgeColor || 'bg-blue-500/20 text-blue-400'}`}>
                                        {tab.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {tab.desc}
                                  </p>
                                </div>

                                {tab.hotkey && (
                                  <kbd className="hidden sm:inline-flex text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/5 border border-slate-700/30 text-slate-400 shrink-0">
                                    {tab.hotkey}
                                  </kbd>
                                )}

                                {isSelected && (
                                  <Check className="w-4 h-4 text-blue-500 shrink-0 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* COLUNA 2: PREPARAÇÃO & EDITAIS */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <Radar className="w-3.5 h-3.5" />
                            Editais & Preparação
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/20 font-bold">
                            Oficial 2026
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {prepTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all group cursor-pointer border ${
                                  isSelected
                                    ? isLight
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs'
                                      : 'bg-emerald-600/20 border-emerald-500/40 text-white shadow-md shadow-emerald-600/10'
                                    : isLight
                                      ? 'hover:bg-slate-50 border-transparent text-slate-700'
                                      : 'hover:bg-white/5 border-transparent text-slate-200'
                                }`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                    : isLight
                                      ? 'bg-slate-100 text-emerald-600 border-slate-200'
                                      : 'bg-white/5 text-emerald-300 border-white/10'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-black truncate ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                                      {tab.label}
                                    </span>
                                    {tab.badge && (
                                      <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase shrink-0 ${tab.badgeColor || 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {tab.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {tab.desc}
                                  </p>
                                </div>

                                {tab.hotkey && (
                                  <kbd className="hidden sm:inline-flex text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/5 border border-slate-700/30 text-slate-400 shrink-0">
                                    {tab.hotkey}
                                  </kbd>
                                )}

                                {isSelected && (
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Rodapé Integrado do Mega-Menu com Acesso Rápido a Ajustes e Planos */}
                    <div className={`mt-4 pt-3.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
                      isLight ? 'border-slate-100 text-slate-600' : 'border-white/10 text-slate-400'
                    }`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleTabClick('guide')}
                          className="hover:text-blue-500 font-semibold transition-colors flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Guia do Aluno
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleTabClick('settings')}
                          className="hover:text-blue-500 font-semibold transition-colors flex items-center gap-1"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Configurações
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleTabClick('pricing-plans')}
                          className="hover:text-amber-500 font-semibold transition-colors flex items-center gap-1 text-amber-500"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          Planos de Assinatura
                        </button>
                      </div>

                      {onOpenAdminIngest && (
                        <button
                          onClick={() => {
                            setIsMegaMenuOpen(false);
                            onOpenAdminIngest();
                          }}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 transition-all flex items-center gap-1"
                        >
                          <Database className="w-3 h-3" />
                          Extrator Oficial (Admin)
                        </button>
                      )}
                    </div>

                  </div>
                </>
              )}
            </div>
          )}

            </div>

            {/* Lado Direito: Status e Ações Globais (Compactos e 100% Responsivos) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Seletor de Estilo de Navegação: Sidebar ◨ | Topo ◪ | Dock ◫ */}
              {setNavMode && (
                <div className="hidden sm:flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-white/5 text-[10px] font-bold mr-1">
                  <button
                    onClick={() => setNavMode('sidebar')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      navMode === 'sidebar'
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Opção 1: Sidebar Lateral Retrátil (Estilo Linear / Notion)"
                  >
                    Sidebar
                  </button>
                  <button
                    onClick={() => setNavMode('megamenu')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      navMode === 'megamenu'
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Opção 2: Mega-Menu Glassmorphism no Topo (Estilo Stripe / Vercel)"
                  >
                    Topo
                  </button>
                  <button
                    onClick={() => setNavMode('dock')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      navMode === 'dock'
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Opção 3: Dock Flutuante Inferior (Estilo Apple VisionOS / macOS)"
                  >
                    Dock
                  </button>
                </div>
              )}

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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                    isLight 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700' 
                      : 'bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-blue-500/15 border-blue-400/35 text-blue-200 hover:border-blue-400 hover:bg-blue-500/25'
                  }`}
                  title="Abrir Copiloto Cognitivo IA"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'} animate-pulse`} />
                  <span className="hidden sm:inline whitespace-nowrap">
                    {studentProfile?.guardianAnimalId ? GUARDIAN_ANIMALS.find(a => a.id === studentProfile.guardianAnimalId)?.name : 'Copiloto'}
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
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 animate-bounce" />
                <span className="whitespace-nowrap">{streakDays}d</span>
              </div>

              {/* App Mobile */}
              <button
                onClick={() => setIsMobileModalOpen(true)}
                className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                title="Sincronizar com App Mobile (iOS / Android)"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="whitespace-nowrap">App</span>
              </button>

              {/* Perfil do Guardião do Aluno */}
              {onOpenProfile && (
                <button
                  onClick={onOpenProfile}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs group shrink-0 cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                  title={`Passaporte Cognitivo: ${studentProfile?.name || 'Estudante'} (${currentGuardian.name})`}
                >
                  <span className="text-base select-none transition-transform group-hover:scale-110">
                    {currentGuardian.emoji}
                  </span>
                  <div className="hidden 2xl:flex flex-col text-left leading-none">
                    <span className="text-[11px] font-black truncate max-w-[85px]">
                      {studentProfile?.warName || studentProfile?.name || 'Concurseiro'}
                    </span>
                    <span className="text-[9px] text-blue-500 dark:text-blue-400 font-semibold truncate max-w-[85px]">
                      {currentGuardian.archetype}
                    </span>
                  </div>
                </button>
              )}

              {/* Botão de Assinatura */}
              {plan === 'aspirante' ? (
                <button
                  onClick={onOpenPricing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black tracking-wide transition-all shadow-md shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
                  title="Conhecer Planos e Preços"
                >
                  <Crown className="w-3.5 h-3.5 fill-black" />
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
                >
                  <Zap className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600 fill-blue-600/40' : 'text-blue-400 fill-blue-400/40'}`} />
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
                aria-label="Abrir menu de navegação"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* Menu Mobile Completo (Drawer Slide-Over Lateral) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
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
                    <span className="text-sm font-black">Learning AI</span>
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
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
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
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                    Edital em Foco
                  </span>
                  <span className="text-xs font-extrabold line-clamp-1">
                    {selectedExamTitle}
                  </span>
                </div>
              )}

              {/* Todos os Módulos de Estudo */}
              <div className="space-y-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 block mb-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Módulos de Estudo
                </span>

                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? isLight
                            ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold shadow-xs'
                            : 'bg-blue-600/25 border border-blue-500/40 text-white font-bold'
                          : isLight
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
                            : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-white/5 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{tab.label}</span>
                            {tab.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] block mt-0.5 ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {tab.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'opacity-40'}`} />
                    </button>
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>Assinar / Gerenciar Plano</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegação Inferior para Telas Pequenas (Polegar) */}
      <nav className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-1.5 px-2 flex items-center justify-around transition-colors ${
        isLight 
          ? 'bg-white/95 backdrop-blur-2xl border-slate-200 text-slate-600' 
          : 'bg-[#0c1222]/95 backdrop-blur-2xl border-slate-800 dark:border-white/10 text-slate-400'
      }`}>
        <button
          onClick={() => handleTabClick('simulator')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl active:scale-90 transition-all duration-150 cursor-pointer ${
            activeTab === 'simulator' ? 'text-blue-600 font-extrabold' : ''
          }`}
        >
          <Crosshair className="w-4 h-4" />
          <span className="text-[10px]">Arena</span>
        </button>

        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl active:scale-90 transition-all duration-150 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-blue-600 font-extrabold' : ''
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px]">Cockpit</span>
        </button>

        <button
          onClick={() => handleTabClick('mistakes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl relative active:scale-90 transition-all duration-150 cursor-pointer ${
            activeTab === 'mistakes' ? 'text-rose-600 font-extrabold' : ''
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px]">Erros</span>
          {pendingMistakesCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
              {pendingMistakesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabClick('vademecum')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl active:scale-90 transition-all duration-150 cursor-pointer ${
            activeTab === 'vademecum' ? 'text-amber-600 font-extrabold' : ''
          }`}
        >
          <Scale className="w-4 h-4" />
          <span className="text-[10px]">Vade</span>
        </button>

        <button
          onClick={() => setIsMegaMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl hover:opacity-100 active:scale-90 transition-all duration-150 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-[10px]">Módulos</span>
        </button>
      </nav>

      {/* Modal de Onboarding Multimodal */}
      <MobileAppModal 
        isOpen={isMobileModalOpen} 
        onClose={() => setIsMobileModalOpen(false)} 
      />
    </>
  );
};
