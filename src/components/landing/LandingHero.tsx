import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, Zap, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onStartEdital: () => void;
  onOpenPricing: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartEdital, onOpenPricing }) => {
  return (
    <>
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-32 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/08 rounded-full blur-[160px]" />
      </div>

      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-sm">
          <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>O algoritmo que descobre o que você vai errar antes do dia da prova</span>
          <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Pare de colecionar PDFs. <br />
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 dark:from-blue-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
            Nós desarmamos a banca antes da prova.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Engenharia reversa em editais e caça ativa a bugs de raciocínio. O <strong className="font-bold text-blue-600 dark:text-blue-400">Learning AI</strong> expõe exatamente onde a FGV, Cebraspe, Vunesp e FCC armam pegadinhas semânticas, calibra seu ciclo de estudos em segundos e potencializa sua aprovação com simuladores TRI e espelho oficial.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartEdital}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 glow-brand"
          >
            <BrainCircuit className="w-6 h-6" />
            <span>Iniciar Terminal de Ataque (Grátis)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white dark:bg-dark-surface/80 hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-200 font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>Ver Planos & Preços</span>
          </button>
        </div>

        {/* Micro-trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Sem necessidade de cartão no início
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Processamento em &lt; 20 segundos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Atualizado com jurisprudência
          </span>
        </div>

        {/* Social Proof Counter Banner */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto px-1">
          <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 leading-tight">+14.800</p>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1.5 sm:mt-2">Editais Processados</p>
          </div>
          <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400 leading-tight">1.2M</p>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1.5 sm:mt-2">Erros Diagnosticados</p>
          </div>
          <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">3.4x</p>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1.5 sm:mt-2">Mais Retenção</p>
          </div>
          <div className="glass-panel p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 leading-tight">78.5%</p>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1.5 sm:mt-2">Taxa Média de Acerto</p>
          </div>
        </div>
      </section>
    </>
  );
};
