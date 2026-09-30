import React from 'react';
import { Microscope, BrainCircuit, Target, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPsychometricsProps {
  onOpenPsychometrics?: () => void;
  onStartEdital: () => void;
}

export const LandingPsychometrics: React.FC<LandingPsychometricsProps> = ({
  onOpenPsychometrics,
  onStartEdital
}) => {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-cyan-500/5 to-transparent rounded-3xl pointer-events-none -z-10" />

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400 text-xs sm:text-sm font-bold mb-6 shadow-sm backdrop-blur-md">
          <Microscope className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wider">Metodologia Científica • Teoria de Resposta ao Item (TRI)</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Chega de Resolver Questões por Força Bruta.
        </h2>
        <p className="mt-4 text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
          Aprenda a decodificar a mente do examinador com Engenharia Reversa das Bancas.
        </p>
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Plataformas convencionais vendem volume de questões. O Learning AI decifra a <strong className="text-slate-800 dark:text-white font-bold">Anatomia dos Distratores</strong>: 
          nenhuma alternativa errada é criada ao acaso. Mapeamos os 8 arquétipos mentais que os examinadores utilizam para derrubar candidatos preparados.
        </p>
      </div>

      {/* 3 Pillars of Educational Psychometrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Pillar 1 */}
        <div className="glass-card p-8 rounded-3xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-indigo-500/10">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">8 Arquétipos de Distratores</h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Generalização indevida, armadilhas semânticas, meias-verdades e inversões de competência. Ao errar, você não vê apenas a resposta certa: você entende <em className="italic font-bold">por que a banca queria que você errasse</em>.
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Anatomia cognitiva completa</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="glass-card p-8 rounded-3xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-cyan-500/10">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assinatura das Bancas</h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Descubra a assinatura dos examinadores: <strong>Cebraspe</strong> (42% indução a absolutos), <strong>FGV</strong> (44% casos concretos ambíguos), <strong>FCC</strong> (36% prazos) e <strong>Vunesp</strong> (38% meias-verdades).
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>Cebraspe • FGV • FCC • Vunesp</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-emerald-500/10">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Vacinas Cognitivas (Antídotos)</h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Para cada distrator detectado, o sistema aplica um protocolo de defesa mental e gera flashcards adaptativos no algoritmo SRS para você nunca mais cair no mesmo truque.
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Fixação em longo prazo (SRS)</span>
          </div>
        </div>
      </div>

      {/* Interactive Showcase Banner */}
      <div className="preserve-dark p-8 sm:p-12 rounded-[2.5rem] border-2 border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Glow behind */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 text-center sm:text-left flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Módulo Inédito no Brasil</span>
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-sm">
            Conheça o Laboratório de Psicometria das Bancas
          </h4>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed font-medium">
            Compare a distribuição dos distratores, visualize sua taxa de vulnerabilidade pessoal e veja os antídotos em ação com análise preditiva.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-bold text-slate-200 justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <span>🔬</span> <strong className="text-cyan-300">18.400+</strong> Itens Classificados
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <span>⚡</span> <strong className="text-amber-300">8</strong> Tipos Decodificados
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-sm">
              <span>🛡️</span> <strong className="text-emerald-300">-34%</strong> Erros por Desatenção
            </span>
          </div>
        </div>

        {/* Live Visual Preview & CTA on the right */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0 w-full sm:w-auto relative z-10">
          <div className="w-full sm:w-72 p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-cyan-400/30 text-xs space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MODELO TRI 3PL
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-bold">CALIBRADO</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-slate-300 text-xs font-medium">Score Psicométrico:</span>
              <span className="text-xl font-black text-white font-mono">842.5 <span className="text-[11px] text-cyan-300 font-normal">pts</span></span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full w-[88%]" />
            </div>
            <div className="text-[11px] text-slate-300 flex justify-between pt-0.5">
              <span>Distratores Decodificados</span>
              <span className="font-bold text-emerald-400">100% Imunizado</span>
            </div>
          </div>

          <button
            onClick={onOpenPsychometrics || onStartEdital}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Microscope className="w-5 h-5 text-cyan-200" />
            <span>Explorar Psicometria</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
