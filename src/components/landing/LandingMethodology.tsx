import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const LandingMethodology: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
          A Diferença na Sua Rotina de Estudos
        </h2>
        <p className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Por que 95% dos candidatos não alcançam a nota de corte?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* O Método Tradicional */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-rose-500/20 relative shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Método Convencional</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Planejamento rígido e estudo passivo</p>
            </div>
          </div>

          <ul className="space-y-6 text-base font-medium text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <span><strong>Cronogramas inflexíveis:</strong> Diante de imprevistos do dia a dia, a planilha inteira se desorganiza e quebra a constância do candidato.</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <span><strong>Feedback disperso:</strong> O estudante perde horas em fóruns com comentários conflitantes, sem identificar a verdadeira raiz jurídica do seu erro.</span>
            </li>
            <li className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <span><strong>Ilusão de produtividade:</strong> Resolver apenas questões confortáveis mascara vulnerabilidades graves nos temas de maior cobrança da banca.</span>
            </li>
          </ul>
        </div>

        {/* O Método AprovaLens */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/40 relative glow-emerald shadow-xl shadow-emerald-500/5 md:-translate-y-2 transition-transform">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Método Learning AI</h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">Preparação Adaptativa e Cognitiva</p>
            </div>
          </div>

          <ul className="space-y-6 text-base font-medium text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Ciclos autoajustáveis:</strong> Se você perder um dia de estudo, a IA recalibra o cronograma redistribuindo as matérias de maior peso.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Diagnóstico cognitivo imediato:</strong> Discrimina com exatidão se o erro decorreu de armadilha semântica da banca, lacuna teórica ou desatenção.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Mapeamento cirúrgico de pontos cegos:</strong> Visualize com clareza analítica exatamente quais artigos de lei e tópicos exigem intervenção imediata.</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};
