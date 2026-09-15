import React from 'react';
import { FileText, PenTool, BrainCircuit, BarChart3, ChevronRight } from 'lucide-react';

interface LandingFeaturesProps {
  onStartEdital: () => void;
  onStartDiscursivas?: () => void;
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({
  onStartEdital,
  onStartDiscursivas
}) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
          Recursos Projetados para Aprovação
        </h2>
        <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Engenharia de Alto Rendimento para Concursos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Card 1: Edital RAG */}
        <div 
          onClick={onStartEdital}
          className="glass-card p-8 rounded-3xl flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all group shadow-sm"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Analisador Inteligente de Editais
            </h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Faça o upload do edital e receba em segundos a árvore verticalizada, o peso de cada matéria e os artigos de lei mais cobrados.
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/5 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 group-hover:translate-x-2 transition-transform">
            <span>Mapear Edital</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Estúdio de Discursivas & Redações */}
        <div 
          onClick={onStartDiscursivas}
          className="glass-card p-8 rounded-3xl flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all group border-emerald-500/30 glow-emerald shadow-md"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <PenTool className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Estúdio de Discursivas & Peças
            </h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Treine na folha pautada de 30 linhas com correção imediata por IA baseada na régua oficial de pontuação (Cebraspe, FGV e OAB).
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/5 text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-2 transition-transform">
            <span>Treinar Discursiva</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Diagnóstico de Erros */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between border-purple-500/30 glow-brand shadow-md">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Diagnóstico Cognitivo de Erro</h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Ao errar uma questão, a IA analisa os distratores da banca e identifica a raiz da falha: pegadinha, lacuna teórica ou desatenção.
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/5 text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <span>Classificação em 4 Tipos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Heatmaps & SRS */}
        <div className="glass-card p-8 rounded-3xl flex flex-col justify-between shadow-sm border-slate-200 dark:border-white/5 hover:border-cyan-500/40 transition-colors">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mapa de Calor & SRS</h3>
            <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Mapeamento visual de pontos críticos e geração de flashcards inteligentes para fixação definitiva na memória de longo prazo.
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/5 text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <span>Previsor de Corte</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </section>
  );
};
