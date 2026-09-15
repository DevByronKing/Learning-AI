import React from 'react';
import { Microscope, BrainCircuit, Target, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent rounded-3xl pointer-events-none -z-10" />

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400 text-xs sm:text-sm font-bold mb-6 shadow-sm backdrop-blur-md">
          <Microscope className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wider">Metodologia Científica • Teoria de Resposta ao Item (TRI)</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Chega de Resolver Questões por Força Bruta.
        </h2>
        <p className="mt-4 text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
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
      <div className="glass-panel p-8 sm:p-12 rounded-[2rem] border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/50 to-slate-900/90 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-10">
        <div className="space-y-4 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            ★ Módulo Inédito no Brasil
          </div>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            Conheça o Laboratório de Psicometria das Bancas
          </h4>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Compare a distribuição dos distratores, visualize sua taxa de vulnerabilidade pessoal e veja os antídotos em ação com análise preditiva.
          </p>
          <div className="flex flex-wrap items-center gap-5 pt-4 text-sm font-medium text-slate-400 justify-center sm:justify-start">
            <span className="flex items-center gap-1.5"><span className="text-xl">🔬</span> <strong className="text-white">18.400+</strong> Itens Classificados</span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1.5"><span className="text-xl">⚡</span> <strong className="text-white">8</strong> Tipos Decodificados</span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1.5"><span className="text-xl">🛡️</span> <strong className="text-white">-34%</strong> Erros por Desatenção</span>
          </div>
        </div>

        <button
          onClick={onOpenPsychometrics || onStartEdital}
          className="shrink-0 px-8 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-lg flex items-center gap-3 shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] glow-brand"
        >
          <Microscope className="w-5 h-5" />
          <span>Explorar Psicometria</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
