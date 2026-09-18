'use client';

import React from 'react';
import { 
  Activity, 
  Crosshair, 
  Layers, 
  Scale, 
  Microscope, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Zap,
  BookOpen
} from 'lucide-react';

interface LandingHighPerfHubProps {
  onNavigateTab: (tab: string) => void;
}

export const LandingHighPerfHub: React.FC<LandingHighPerfHubProps> = ({ onNavigateTab }) => {
  const pillars = [
    {
      id: 'dashboard',
      num: '01',
      title: 'Cockpit de Dados (Dashboard)',
      badge: 'HEATMAP 365 DIAS',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      icon: Activity,
      desc: 'Heatmap de consistência diária estilo GitHub, barras duplas de edital verticalizado (revelando o gap de ilusão teórica) e métrica de Blindagem contra FGV e Cebraspe.',
      cta: 'Acessar Cockpit de Dados',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'simulator',
      num: '02',
      title: 'Arena de Combate (Simulador 60/40)',
      badge: 'LEETCODE STYLE',
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      icon: Crosshair,
      desc: 'Layout Split-screen 60/40: enunciado à esquerda, coluna psicométrica independente à direita. Navegação 100% teclado (A-E, Enter), grifo de prova física e Modo Foco Zen (F).',
      cta: 'Entrar na Arena de Combate',
      accent: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'flashcards',
      num: '03',
      title: 'SRS Flashcards (Retenção Ativa)',
      badge: 'FLIP 3D EM 200MS',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
      icon: Layers,
      desc: 'Viragem física 3D instantânea (Espaço ou clique), 4 botões padronizados de esforço cognitivo ([1] Errei a [4] Fácil) e micro-interação séria: "Ciclo de esquecimento quebrado. Memória consolidada."',
      cta: 'Treinar Flashcards 3D',
      accent: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'vademecum',
      num: '04',
      title: 'Smart Vade Mecum & Caderno de Erros',
      badge: 'BACKLINKS BIDIRECIONAIS',
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
      icon: Scale,
      desc: 'Conexão estilo Obsidian/Notion: badge [ 12 Questões Erradas ] que abre gaveta lateral com erros da FGV/Cebraspe vinculados ao artigo, com Revanche Imediata e tipografia híbrida com contraste reduzido.',
      cta: 'Abrir Smart Vade Mecum',
      accent: 'from-rose-500 to-orange-500'
    },
    {
      id: 'psychometrics',
      num: '05',
      title: 'Psicometria Educacional & TRI',
      badge: 'SKELETON NARRATIVO',
      badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
      icon: Microscope,
      desc: 'Skeleton loader narrativo com diagnósticos em tempo real ("A ler histórico...", "A aplicar engenharia reversa...", "A classificar distratores..."), além de empty states utilitárias e agressivas.',
      cta: 'Executar Diagnóstico com IA',
      accent: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>Hub de Teste Imediato • Estudante de Alta Performance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Os 5 Pilares de Combate Calibrados
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Clique diretamente em qualquer um dos módulos abaixo para testar na prática a nova experiência sem bonecos infantis:
        </p>
      </div>

      {/* Grid of 5 Pillars */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              onClick={() => onNavigateTab(p.id)}
              className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-white/90 dark:bg-dark-card/80 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
            >
              {/* Subtle top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.accent}`} />

              <div className="space-y-4">
                {/* Card Top */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.accent} p-[1px] shadow-md`}>
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0c1017] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                    {p.num}
                  </span>
                </div>

                {/* Badge */}
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                    {p.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500">
                <span>{p.cta}</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
