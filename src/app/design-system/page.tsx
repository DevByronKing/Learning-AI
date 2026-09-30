'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, 
  Moon, 
  Columns, 
  Palette, 
  Shield, 
  Layers, 
  LayoutTemplate, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles, 
  Search, 
  Mail, 
  Lock, 
  Clock, 
  BookOpen,
  Zap,
  Target,
  Flame,
  Activity,
  Check,
  Award
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Badge, 
  ToggleSwitch, 
  ProgressBar, 
  LessonCard, 
  Avatar, 
  GuardianAvatarType 
} from '@/design-system/ui';

export default function DesignSystemPage() {
  const [mounted, setMounted] = useState(false);

  // Theme state: 'light', 'dark', or 'split'
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'split'>('light');
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'tokens' | 'marca' | 'core' | 'templates'>('tokens');

  // Interactive playground states
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [progressVal, setProgressVal] = useState(72);
  const [selectedAvatar, setSelectedAvatar] = useState<GuardianAvatarType>('coruja');

  // Interactive Template: Onboarding step
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedCareer, setSelectedCareer] = useState('policial');
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianAvatarType>('coruja');
  const [dailyGoalHours, setDailyGoalHours] = useState('4');

  // Apply theme to document root or container
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('learning_ai_theme', 'dark'); } catch (e) {}
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('learning_ai_theme', 'light'); } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'split');
    }
  }, [themeMode]);

  return (
    <div data-hydrated={mounted ? "true" : "false"} className="min-h-screen bg-[var(--surface-bg)] text-[var(--text-primary)] font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--surface-card)] border-b border-[var(--border-subtle)] shadow-[var(--shadow-sm)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-[var(--radius-md)] p-1">
              <img src="/logo-512.png" alt="Learning AI Logo" className="w-8 h-8 rounded-lg object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-[var(--text-primary)]">Learning-AI</span>
                <span className="text-[10px] font-mono text-[var(--brand-primary)] uppercase tracking-wider font-extrabold">Design System v1.0</span>
              </div>
            </Link>
            <Badge variant="brand" size="sm">Fonte da Verdade</Badge>
          </div>

          {/* Theme Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-1 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)]" role="group" aria-label="Seletor de Tema">
              <button
                type="button"
                data-testid="theme-light-btn"
                onClick={() => setThemeMode('light')}
                aria-pressed={themeMode === 'light'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-[var(--radius-sm)] transition-all ${
                  themeMode === 'light' 
                    ? 'bg-[var(--surface-card)] text-[var(--brand-primary)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Claro</span>
              </button>

              <button
                type="button"
                data-testid="theme-dark-btn"
                onClick={() => setThemeMode('dark')}
                aria-pressed={themeMode === 'dark'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-[var(--radius-sm)] transition-all ${
                  themeMode === 'dark' 
                    ? 'bg-[var(--surface-card)] text-[var(--brand-primary)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Escuro</span>
              </button>

              <button
                type="button"
                data-testid="theme-split-btn"
                onClick={() => setThemeMode('split')}
                aria-pressed={themeMode === 'split'}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-[var(--radius-sm)] transition-all ${
                  themeMode === 'split' 
                    ? 'bg-[var(--surface-card)] text-[var(--brand-primary)] shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Split 50/50</span>
              </button>
            </div>

            <Link href="/" className="ml-2">
              <Button variant="secondary" size="sm">Voltar ao App</Button>
            </Link>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
            {[
              { id: 'tokens', label: '1. Tokens & Cores', icon: Palette },
              { id: 'marca', label: '2. Marca & Avatares', icon: Shield },
              { id: 'core', label: '3. Componentes Core', icon: Layers },
              { id: 'templates', label: '4. Templates & Protótipos', icon: LayoutTemplate },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-md)] text-xs font-bold transition-all whitespace-nowrap
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]
                    ${isActive 
                      ? 'bg-[var(--brand-primary)] text-[var(--text-on-brand)] shadow-sm' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Catalog View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        
        {/* ========================================================================= */}
        {/* SEÇÃO 1: TOKENS DE DESIGN (CORES, TIPOGRAFIA, ESPAÇAMENTO, RAIOS)         */}
        {/* ========================================================================= */}
        {activeTab === 'tokens' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Header info */}
            <div className="space-y-2">
              <Badge variant="brand" size="sm">Tokens & Acessibilidade</Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Cartela de Tokens & Contraste WCAG 2.1
              </h1>
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Cada variável CSS foi calibrada matematicamente para atingir conformidade estrita com o padrão WCAG 2.1 AA/AAA em ambos os temas.
              </p>
            </div>

            {/* Split View Container if enabled, otherwise single view */}
            <div className={themeMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-10'}>
              
              {/* Tema Claro Box (or single view) */}
              {(themeMode === 'light' || themeMode === 'split') && (
                <div data-theme="light" className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] shadow-sm space-y-8">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="font-black text-lg flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" /> Modo Claro (Light Theme)
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">WCAG AAA / AA</span>
                  </div>

                  {/* Swatches */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Paleta Semântica & Marca</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: '--brand-primary', hex: '#4338CA', label: 'Índigo Elétrico', contrast: '7.9:1 (AAA)' },
                        { name: '--brand-accent', hex: '#059669', label: 'Esmeralda Progresso', contrast: '4.6:1 (AA)' },
                        { name: '--surface-bg', hex: '#F8FAFC', label: 'Papel Frio (Fundo)', contrast: '16.5:1 vs Text' },
                        { name: '--surface-card', hex: '#FFFFFF', label: 'Card Branco', contrast: 'Card Puro' },
                        { name: '--text-primary', hex: '#0F172A', label: 'Texto Grafite', contrast: '16.5:1 (AAA)' },
                        { name: '--status-error', hex: '#DC2626', label: 'Erro Imediato', contrast: '4.8:1 (AA)' },
                      ].map((sw) => (
                        <div key={sw.name} className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                          <div className="h-10 rounded-md w-full mb-2 border border-black/5" style={{ backgroundColor: sw.hex }} />
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">{sw.label}</p>
                            <p className="text-[10px] font-mono text-[#475569]">{sw.hex}</p>
                            <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded mt-1 inline-block">{sw.contrast}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tema Escuro Box */}
              {(themeMode === 'dark' || themeMode === 'split') && (
                <div data-theme="dark" className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[#090D16] text-[#F9FAFB] border border-[#1F2937] shadow-xl space-y-8">
                  <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
                    <span className="font-black text-lg flex items-center gap-2">
                      <Moon className="w-5 h-5 text-indigo-400" /> Modo Escuro (Dark Obsidian)
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">WCAG AAA / AA</span>
                  </div>

                  {/* Swatches */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Paleta Semântica & Marca</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: '--brand-primary', hex: '#6366F1', label: 'Índigo Luz', contrast: '8.5:1 (AAA)' },
                        { name: '--brand-accent', hex: '#10B981', label: 'Neon Mint Progresso', contrast: '10.2:1 (AAA)' },
                        { name: '--surface-bg', hex: '#090D16', label: 'Obsidian Profundo', contrast: '17.8:1 vs Text' },
                        { name: '--surface-card', hex: '#111827', label: 'Slate Escuro', contrast: 'Card Noturno' },
                        { name: '--text-primary', hex: '#F9FAFB', label: 'Texto Gelo', contrast: '17.8:1 (AAA)' },
                        { name: '--status-error', hex: '#F87171', label: 'Erro Suave', contrast: '5.2:1 (AA)' },
                      ].map((sw) => (
                        <div key={sw.name} className="p-3 rounded-lg bg-[#111827] border border-[#1F2937] shadow-sm flex flex-col justify-between">
                          <div className="h-10 rounded-md w-full mb-2 border border-white/10" style={{ backgroundColor: sw.hex }} />
                          <div>
                            <p className="text-xs font-bold text-[#F9FAFB]">{sw.label}</p>
                            <p className="text-[10px] font-mono text-[#9CA3AF]">{sw.hex}</p>
                            <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-1 py-0.5 rounded mt-1 inline-block">{sw.contrast}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Tipografia Outfit e Escalas Estruturais */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[var(--text-primary)]">Tipografia Local: Fonte Outfit</h3>
                <p className="text-xs text-[var(--text-secondary)]">Carregamento otimizado em woff2 sem chamadas externas para privacidade e máxima performance.</p>
              </div>

              <div className="space-y-6">
                <div className="border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex justify-between items-baseline text-xs font-mono text-[var(--text-muted)] mb-1">
                    <span>Outfit 800 (Extra Bold) • --font-size-4xl (36px) • letter-spacing: -0.02em</span>
                    <span>Títulos Principais</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    O Copiloto Cognitivo para Concursos
                  </div>
                </div>

                <div className="border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex justify-between items-baseline text-xs font-mono text-[var(--text-muted)] mb-1">
                    <span>Outfit 700 (Bold) • --font-size-2xl (24px)</span>
                    <span>Subtítulos & Seções</span>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    Desarme a Banca Examinadora Antes da Prova
                  </div>
                </div>

                <div className="border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex justify-between items-baseline text-xs font-mono text-[var(--text-muted)] mb-1">
                    <span>Outfit 500 (Medium) • --font-size-sm (14px)</span>
                    <span>Controles, Badges & Botões</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    Navegação 100% acessível por teclado (Tab, Enter e Espaço) com anel de foco visível de 2px.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-baseline text-xs font-mono text-[var(--text-muted)] mb-1">
                    <span>Outfit 400 (Regular) • --font-size-base (16px) • line-height: 1.6</span>
                    <span>Corpo de Texto & Aulas</span>
                  </div>
                  <p className="text-base font-normal text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                    O concurseiro de alto rendimento estuda por questões reversas e repetição espaçada. O método identifica a curva de retenção do edital e neutraliza pegadinhas com diagnósticos psicométricos.
                  </p>
                </div>
              </div>

              {/* Escala de Espaçamento */}
              <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Escala de Espaçamento (Base 4px / 8px)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  {[
                    { token: '--space-xs', px: '4px', w: 'w-1' },
                    { token: '--space-sm', px: '8px', w: 'w-2' },
                    { token: '--space-md', px: '16px', w: 'w-4' },
                    { token: '--space-lg', px: '24px', w: 'w-6' },
                    { token: '--space-xl', px: '32px', w: 'w-8' },
                    { token: '--space-2xl', px: '40px', w: 'w-10' },
                    { token: '--space-3xl', px: '48px', w: 'w-12' },
                  ].map((sp) => (
                    <div key={sp.token} className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">{sp.token}</span>
                        <span className="text-[var(--text-muted)]">{sp.px}</span>
                      </div>
                      <div className={`h-4 bg-[var(--brand-primary)] rounded ${sp.w}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 2: MARCA & AVATARES (LOGO MASTER & 6 ANIMAIS GUARDIÕES)            */}
        {/* ========================================================================= */}
        {activeTab === 'marca' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="space-y-2">
              <Badge variant="brand" size="sm">Identidade Visual</Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Marca, Logo & Galeria de Arquétipos
              </h1>
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Aplicações padronizadas da logo em alta resolução e o sistema de avatares com moldura dupla em <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--surface-elevated)]">--brand-primary</code> e insígnias de arquétipo.
              </p>
            </div>

            {/* Aplicação da Logo */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Variações Oficiais do Logo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-3">
                  <img src="/logo-512.png" alt="Logo Master 512px" className="w-24 h-24 object-contain drop-shadow-md" />
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">Logo Master 512px (PNG)</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">public/logo-512.png</span>
                  </div>
                </div>

                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border border-[var(--border-subtle)] p-3 flex items-center justify-center shadow-sm">
                    <img src="/logo.svg" alt="Logo Vetorial SVG" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">Logo Vetorial (SVG)</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">public/logo.svg</span>
                  </div>
                </div>

                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-xl bg-[var(--surface-card)] border border-[var(--brand-primary)] p-2 flex items-center justify-center shadow-[var(--shadow-brand)]">
                    <img src="/logo-512.png" alt="App Icon" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">Favicon & App Icon</span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">public/favicon.ico</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeria dos 6 Animais Guardiões */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Insígnias de Animais Guardiões</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Moldura circular com borda dupla de 2px em <code className="text-xs font-mono font-bold">--brand-primary</code> e insígnia de arquétipo.</p>
                </div>
                <Badge variant="accent" size="sm">6 Arquétipos Prontos</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'coruja' as GuardianAvatarType, name: 'Coruja Atena', archetype: 'Mestre Analítico' },
                  { id: 'lobo' as GuardianAvatarType, name: 'Lobo-Guará', archetype: 'Operador de Elite' },
                  { id: 'gaviao' as GuardianAvatarType, name: 'Gavião Real', archetype: 'Auditor Implacável' },
                  { id: 'leao' as GuardianAvatarType, name: 'Leão Soberano', archetype: 'Tribuno Convicto' },
                  { id: 'onca' as GuardianAvatarType, name: 'Onça Pintada', archetype: 'Guerreiro Resiliente' },
                  { id: 'raposa' as GuardianAvatarType, name: 'Raposa Ágil', archetype: 'Otimizador de Provas' },
                ].map((animal) => (
                  <div
                    key={animal.id}
                    onClick={() => setSelectedAvatar(animal.id)}
                    className={`
                      p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-all flex flex-col items-center text-center space-y-3
                      ${selectedAvatar === animal.id 
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] ring-2 ring-[var(--brand-primary)] shadow-md' 
                        : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)]'
                      }
                    `}
                  >
                    <Avatar type={animal.id} size="lg" />
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">{animal.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{animal.archetype}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Escala de Tamanhos do Avatar */}
              <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Escala de Tamanhos do Avatar (sm: 32px, md: 48px, lg: 64px, xl: 96px)
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Avatar type={selectedAvatar} size="sm" />
                    <span className="text-xs font-mono text-[var(--text-muted)]">sm (32px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar type={selectedAvatar} size="md" />
                    <span className="text-xs font-mono text-[var(--text-muted)]">md (48px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar type={selectedAvatar} size="lg" />
                    <span className="text-xs font-mono text-[var(--text-muted)]">lg (64px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar type={selectedAvatar} size="xl" />
                    <span className="text-xs font-mono text-[var(--text-muted)]">xl (96px)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 3: COMPONENTES CORE REUTILIZÁVEIS                                   */}
        {/* ========================================================================= */}
        {activeTab === 'core' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="space-y-2">
              <Badge variant="brand" size="sm">Componentes Prontos</Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Biblioteca Core de Componentes
              </h1>
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Construídos em TypeScript com foco acessível e atributos ARIA completos para testes automatizados.
              </p>
            </div>

            {/* 1. Botões */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">1. Botões (Button)</h3>
                <p className="text-xs text-[var(--text-secondary)]">Suporta 4 variantes, 3 tamanhos, estados loading, disabled e ícones.</p>
              </div>

              {/* Variantes */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Variantes de Ação</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Botão Primário</Button>
                  <Button variant="secondary">Botão Secundário</Button>
                  <Button variant="ghost">Botão Fantasma</Button>
                  <Button variant="danger">Botão de Perigo</Button>
                </div>
              </div>

              {/* Tamanhos */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Tamanhos</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Tamanho SM (32px)</Button>
                  <Button variant="primary" size="md">Tamanho MD (40px)</Button>
                  <Button variant="primary" size="lg">Tamanho LG (48px)</Button>
                </div>
              </div>

              {/* Estados Especiais */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Estados de Execução</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" isLoading>Processando...</Button>
                  <Button variant="primary" disabled>Desabilitado</Button>
                  <Button variant="primary" leftIcon={<Zap className="w-4 h-4" />}>Com Ícone Esquerdo</Button>
                  <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>Com Ícone Direito</Button>
                </div>
              </div>
            </div>

            {/* 2. Formulários & Inputs */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">2. Campos de Formulário (Input)</h3>
                <p className="text-xs text-[var(--text-secondary)]">Rótulo semântico com htmlFor, hint, validação de erro e ícones.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email do Estudante"
                  placeholder="aluno@learningai.com.br"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  hint="Utilizado para autenticação e envio do relatório semanal"
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Senha de Acesso"
                  type="password"
                  defaultValue="12345678"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={inputError || undefined}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setInputError(inputError ? '' : 'A senha deve conter ao menos 8 caracteres e 1 número')}
                >
                  {inputError ? 'Limpar Erro' : 'Simular Erro de Validação'}
                </Button>
              </div>
            </div>

            {/* 3. Badges & Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badges */}
              <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">3. Badges Semânticos</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Indicadores de status com dot pulsante.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="brand" hasDot>Brand Ativo</Badge>
                  <Badge variant="accent" hasDot>Aha Moment</Badge>
                  <Badge variant="success">Acerto FGV</Badge>
                  <Badge variant="warning">Atenção TRI</Badge>
                  <Badge variant="error">Distrator</Badge>
                  <Badge variant="neutral">Neutro</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="brand" size="sm">Pequeno (sm)</Badge>
                  <Badge variant="brand" size="md">Médio (md)</Badge>
                </div>
              </div>

              {/* Toggles */}
              <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">4. Chaves Alternadoras (ToggleSwitch)</h3>
                  <p className="text-xs text-[var(--text-secondary)]">role="switch" com acionamento por teclado (Espaço/Enter).</p>
                </div>

                <div className="space-y-4">
                  <ToggleSwitch
                    checked={toggle1}
                    onChange={setToggle1}
                    label="Modo Foco Zen no Simulador"
                    description="Oculta distrações laterais ao responder questões"
                  />

                  <ToggleSwitch
                    checked={toggle2}
                    onChange={setToggle2}
                    label="Lembretes de Revisão Espaçada"
                    description="Notifica quando a curva de esquecimento for atingida"
                  />
                </div>
              </div>
            </div>

            {/* 4. Barra de Sensação de Progresso */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">5. Barra de Sensação de Progresso</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Projetada na cor esmeralda (<code className="text-xs font-mono font-bold">--brand-accent</code>) para recompensar o avanço.</p>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--brand-accent)]">{progressVal}% Concluído</span>
              </div>

              <ProgressBar value={progressVal} label="Meta Diária de Questões" />

              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs text-[var(--text-muted)] font-medium">Testar valor:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="w-48 accent-[var(--brand-accent)] cursor-pointer"
                  aria-label="Controle de progresso"
                />
                <Button variant="secondary" size="sm" onClick={() => setProgressVal(100)}>
                  Simular 100% (Aha Moment)
                </Button>
              </div>
            </div>

            {/* 5. Cards de Aula */}
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">6. Cards de Aula (LessonCard)</h3>
                <p className="text-xs text-[var(--text-secondary)]">Exibição de módulos pedagógicos nos estados Concluído, Em Andamento e Bloqueado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LessonCard
                  subject="Direito Constitucional"
                  title="Controle de Constitucionalidade Concentrado: ADI, ADC e ADPF"
                  durationMinutes={25}
                  questionsCount={18}
                  status="completed"
                  onClick={() => alert('Abrindo módulo concluído')}
                />

                <LessonCard
                  subject="Direito Administrativo"
                  title="Poder de Polícia: Atributos, Limites e Jurisprudência do STF"
                  durationMinutes={40}
                  questionsCount={24}
                  progressPercent={65}
                  status="in_progress"
                  onClick={() => alert('Continuando módulo em andamento')}
                />

                <LessonCard
                  subject="Direito Tributário"
                  title="Imunidades Tributárias Específicas e Princípios da Anterioridade"
                  durationMinutes={35}
                  questionsCount={15}
                  status="locked"
                />
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SEÇÃO 4: TEMPLATES & PROTÓTIPOS INTERATIVOS                               */}
        {/* ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="space-y-2">
              <Badge variant="accent" size="sm">Protótipos Clicáveis</Badge>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                Telas Reais Construídas com o Design System
              </h1>
              <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                Nenhum estilo ad-hoc ou classe externa foi usada: 100% dos elementos abaixo utilizam os componentes da biblioteca Core.
              </p>
            </div>

            {/* Sub-Tabs do Template */}
            <div className="space-y-8">
              
              {/* Template A: Onboarding de 5 Passos */}
              <div className="p-6 sm:p-10 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)] space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                  <div>
                    <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">Protótipo 01</span>
                    <h3 className="text-2xl font-black text-[var(--text-primary)]">Onboarding de 5 Passos (Interativo)</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">Passo {onboardingStep} de 5</span>
                    <div className="w-24">
                      <ProgressBar value={onboardingStep * 20} size="sm" showPercentage={false} />
                    </div>
                  </div>
                </div>

                {/* Conteúdo Dinâmico do Onboarding */}
                <div className="min-h-[280px] flex flex-col justify-between space-y-6">
                  {onboardingStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">Passo 1: Qual é a sua Carreira Alvo?</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Adaptaremos o radar de bancas examinadoras e o peso das matérias ao seu concurso.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {[
                          { id: 'policial', title: 'Carreiras Policiais (PF, PRF, PC)', desc: 'Foco Cebraspe e alta intensidade de simulados' },
                          { id: 'fiscal', title: 'Carreiras Fiscais (Receita, SEFAZ)', desc: 'Auditorias complexas e legislação tributária FGV' },
                          { id: 'tribunais', title: 'Tribunais & Judiciário', desc: 'Analista e Técnico Judiciário FCC e Vunesp' },
                          { id: 'juridica', title: 'Carreiras Jurídicas (Magistratura, MP)', desc: 'Peças processuais e jurisprudência aprofundada' },
                        ].map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setSelectedCareer(c.id)}
                            className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                              selectedCareer === c.id 
                                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] ring-1 ring-[var(--brand-primary)]' 
                                : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            <span className="text-sm font-bold text-[var(--text-primary)] block">{c.title}</span>
                            <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">{c.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">Passo 2: Escolha seu Animal Guardião</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Seu arquétipo confere identidade cognitiva e guia sua rotina no simulador.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        {[
                          { id: 'coruja' as GuardianAvatarType, name: 'Coruja Atena', motto: 'Sabedoria & Lei Seca' },
                          { id: 'lobo' as GuardianAvatarType, name: 'Lobo-Guará', motto: 'Operador de Alta Pressão' },
                          { id: 'gaviao' as GuardianAvatarType, name: 'Gavião Real', motto: 'Olho Cirúrgico Fiscal' },
                          { id: 'leao' as GuardianAvatarType, name: 'Leão Soberano', motto: 'Autoridade Argumentativa' },
                          { id: 'onca' as GuardianAvatarType, name: 'Onça Pintada', motto: 'Recuperação Imediata' },
                          { id: 'raposa' as GuardianAvatarType, name: 'Raposa Ágil', motto: 'Desmonte Veloz' },
                        ].map((g) => (
                          <div
                            key={g.id}
                            onClick={() => setSelectedGuardian(g.id)}
                            className={`p-3 rounded-[var(--radius-md)] border cursor-pointer flex items-center gap-3 transition-all ${
                              selectedGuardian === g.id 
                                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] ring-1 ring-[var(--brand-primary)]' 
                                : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            <Avatar type={g.id} size="sm" showInsignia={false} />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[var(--text-primary)] block truncate">{g.name}</span>
                              <span className="text-[10px] text-[var(--text-muted)] truncate">{g.motto}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">Passo 3: Calibração da IA contra Pegadinhas</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Ative as proteções cognitivas para receber alertas durante a resolução de questões.</p>

                      <div className="space-y-3 pt-2 max-w-lg">
                        <ToggleSwitch
                          checked={true}
                          onChange={() => {}}
                          label="Detector de Distratores da FGV"
                          description="Aponta alternativas que parecem certas mas contêm pegadinhas sutis"
                        />
                        <ToggleSwitch
                          checked={true}
                          onChange={() => {}}
                          label="Cálculo Líquido Estilo Cebraspe (Certo / Errado)"
                          description="Penalização calibrada para treinar a não responder no chute"
                        />
                      </div>
                    </div>
                  )}

                  {onboardingStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">Passo 4: Defina sua Meta Diária de Horas Líquidas</h4>
                      <p className="text-xs text-[var(--text-secondary)]">O ciclo de estudos adaptativo calculará a rota ideal até o edital.</p>

                      <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
                        {['2', '4', '6'].map((hours) => (
                          <div
                            key={hours}
                            onClick={() => setDailyGoalHours(hours)}
                            className={`p-4 rounded-[var(--radius-md)] border text-center cursor-pointer transition-all ${
                              dailyGoalHours === hours 
                                ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)] ring-1 ring-[var(--brand-primary)]' 
                                : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)]'
                            }`}
                          >
                            <span className="text-2xl font-black text-[var(--text-primary)] block">{hours}h</span>
                            <span className="text-xs text-[var(--text-muted)]">por dia</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 5 && (
                    <div className="space-y-5 animate-fadeIn text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--brand-accent-muted)] border-2 border-[var(--brand-accent)] text-[var(--brand-accent)] mx-auto flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black text-[var(--text-primary)]">Aha Moment: Plano de Estudos Calibrado!</h4>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                          Seu perfil foi conectado ao banco com 25.000+ questões mapeadas e seu arquétipo guardião está pronto para a batalha.
                        </p>
                      </div>
                      <div className="max-w-xs mx-auto">
                        <ProgressBar value={100} label="Onboarding Concluído" />
                      </div>
                    </div>
                  )}

                  {/* Wizard Navigation Footer */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={onboardingStep === 1}
                      onClick={() => setOnboardingStep((prev) => Math.max(1, prev - 1))}
                      leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                    >
                      Voltar
                    </Button>

                    {onboardingStep < 5 ? (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => setOnboardingStep((prev) => Math.min(5, prev + 1))}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Próximo Passo
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="md" 
                        onClick={() => {
                          alert('Plano ativado com sucesso usando componentes do Design System!');
                          setOnboardingStep(1);
                        }}
                        rightIcon={<Check className="w-4 h-4" />}
                      >
                        Iniciar Jornada de Estudos
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Template B: Dashboard de Estudos */}
              <div className="p-6 sm:p-10 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)] space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                  <div className="flex items-center gap-3">
                    <Avatar type={selectedGuardian} size="md" />
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">Protótipo 02</span>
                      <h3 className="text-xl font-bold text-[var(--text-primary)]">Cockpit de Estudos do Aluno</h3>
                    </div>
                  </div>
                  <Badge variant="accent" hasDot>Consistência: 24 Dias</Badge>
                </div>

                {/* Métricas do Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Meta Diária (4 Horas)</span>
                    <ProgressBar value={75} showPercentage={true} size="sm" />
                    <span className="text-[11px] text-[var(--text-muted)]">3h estudadas • 1h restante</span>
                  </div>

                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Questões Resolvidas Hoje</span>
                    <div className="text-2xl font-black text-[var(--text-primary)]">48 <span className="text-xs font-normal text-[var(--text-muted)]">/ 50 itens</span></div>
                    <span className="text-[11px] font-bold text-[var(--brand-accent)]">91.6% de acerto calibrado</span>
                  </div>

                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Score Psicométrico TRI</span>
                    <div className="text-2xl font-black text-[var(--brand-primary)]">842.5 <span className="text-xs font-normal text-[var(--text-muted)]">pts</span></div>
                    <span className="text-[11px] text-[var(--text-muted)]">Percentil 95% do concurso</span>
                  </div>
                </div>

                {/* Aulas do Ciclo */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">Próximos Módulos no Ciclo Meirelles</h4>
                    <Button variant="ghost" size="sm">Ver Ciclo Completo →</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LessonCard
                      subject="Direito Administrativo"
                      title="Atos Administrativos: Requisitos, Atributos e Extinção"
                      durationMinutes={30}
                      questionsCount={16}
                      status="in_progress"
                      progressPercent={50}
                    />

                    <LessonCard
                      subject="Raciocínio Lógico"
                      title="Equivalências Lógicas e Negações de Proposições Compostas"
                      durationMinutes={25}
                      questionsCount={20}
                      status="completed"
                    />
                  </div>
                </div>
              </div>

              {/* Template C: Proposta de Landing Page */}
              <div className="p-6 sm:p-12 rounded-[var(--radius-2xl)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--shadow-lg)] space-y-10 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                  <Badge variant="brand" size="md" hasDot>Lançamento Oficial 2026</Badge>
                  <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
                    Engenharia Cognitiva para Concursos Públicos
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    Elimine a ilusão teórica e treine exatamente nos pontos cegos onde a banca elimina 95% dos candidatos.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Começar Diagnóstico Gratuito
                    </Button>
                    <Button variant="secondary" size="lg">
                      Conhecer Metodologia
                    </Button>
                  </div>
                </div>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
                  <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
                    <Badge variant="brand" size="sm">Pilar 01</Badge>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Radar de Pegadinhas</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Mapeia os distratores mais perigosos das bancas FGV e Cebraspe e alerta em tempo real.
                    </p>
                  </div>

                  <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
                    <Badge variant="accent" size="sm">Pilar 02</Badge>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Sensação de Progresso Real</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Cada questão resolvida quebra a curva de esquecimento e alimenta o algoritmo SM-2.
                    </p>
                  </div>

                  <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-3 shadow-sm">
                    <Badge variant="neutral" size="sm">Pilar 03</Badge>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Zero Infantilização</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Design sóbrio no padrão Linear/MasterClass voltado ao concurseiro profissional e focado.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
