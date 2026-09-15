import React from 'react';
import { Crown, CheckCircle2, XCircle } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';

interface LandingPricingProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onOpenPricing: () => void;
}

export const LandingPricing: React.FC<LandingPricingProps> = ({
  onSelectPlan,
  onOpenPricing
}) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="pricing">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-sm font-bold mb-4 shadow-sm">
          <Crown className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
          <span className="uppercase tracking-widest">INVESTIMENTO NO SEU CARGO PÚBLICO</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
          Planos Simples e Transparentes
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Cancele a qualquer momento com 1 clique. Garantia incondicional de 7 dias com reembolso integral.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
        
        {/* Glow de Fundo (Atrás dos cards) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 dark:bg-indigo-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        {/* Plano Aspirante (Free) */}
        <div className="group bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] flex flex-col justify-between border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Aspirante</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Para quem está conhecendo o método</p>
            
            <div className="mt-8 mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white">R$ 0</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ sempre grátis</span>
            </div>

            <ul className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-white/5 pt-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                <span>1 Edital processado por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                <span>15 Questões diárias (gabarito simples)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Cronograma estático básico</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400/60 dark:text-slate-500/60">
                <XCircle className="w-5 h-5 text-slate-300/50 dark:text-slate-600/50 shrink-0" />
                <span className="line-through decoration-slate-300/50 dark:decoration-slate-600/50">Diagnóstico Cognitivo de Erros</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('aspirante')}
            className="mt-10 w-full py-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-extrabold text-base transition-all duration-300 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shadow-sm group-hover:shadow-md"
          >
            Começar Gratuitamente
          </button>
        </div>

        {/* Plano Gabarito Pro (Mais Popular) */}
        <div className="relative bg-white dark:bg-[#0b101b] p-8 sm:p-10 rounded-[2rem] flex flex-col justify-between transform lg:-translate-y-6 z-20 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.15)] transition-transform duration-500 hover:-translate-y-8">
          
          {/* Borda Gradiente via Pseudo-elemento */}
          <div className="absolute inset-0 rounded-[2rem] p-[2px] bg-gradient-to-b from-indigo-500 via-blue-500 to-cyan-400 -z-10" />
          <div className="absolute inset-[2px] rounded-[calc(2rem-2px)] bg-white dark:bg-[#0d1321] -z-10" />

          {/* Badge Recomendado */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.5)] whitespace-nowrap flex items-center gap-1.5 border border-white/20">
            <Crown className="w-3.5 h-3.5" />
            RECOMENDADO POR APROVADOS
          </div>

          <div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">
              Gabarito Pro
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-semibold">O Copiloto Cognitivo de Alta Performance</p>
            
            <div className="mt-8 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">R$ 69<span className="text-3xl text-slate-400">,90</span></span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">/ mês</span>
              </div>
              <div className="inline-flex items-center gap-2 mt-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  ou R$ 497/ano no Pix (R$ 41,41/mês)
                </p>
              </div>
            </div>

            <ul className="space-y-4 text-sm font-semibold text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-white/5 pt-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Editais ilimitados:</strong> Análise verticalizada e rota 80/20</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Diagnóstico Cognitivo:</strong> Classificação dos 4 tipos de falha</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Cronograma Adaptativo:</strong> Recalibra carga horária sem quebra</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Heatmap Analítico</strong> de pontos cegos e lei seca cobrada</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Flashcards SRS Automáticos</strong> (Repetição Espaçada)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              onSelectPlan('pro');
              onOpenPricing();
            }}
            className="mt-10 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 text-white font-black text-base tracking-wide transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_15px_40px_-10px_rgba(99,102,241,0.8)] transform hover:scale-[1.02]"
          >
            Assinar Plano Pro
          </button>
        </div>

        {/* Plano Elite / Mentoria IA */}
        <div className="group bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] flex flex-col justify-between border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">Elite & Discursivas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Carreiras Jurídicas, Fiscais, OAB e Tribunais</p>
            
            <div className="mt-8 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">R$ 119<span className="text-3xl text-slate-400">,90</span></span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">/ mês</span>
              </div>
              <div className="inline-flex items-center gap-2 mt-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                  ou R$ 897/ano no Pix
                </p>
              </div>
            </div>

            <ul className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300 border-t border-slate-200/60 dark:border-white/5 pt-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Tudo do Plano Pro incluído</strong> com acesso irrestrito</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Estúdio de Discursivas:</strong> Correção de peças e redações por IA</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Espelho Oficial da Banca:</strong> Critérios Cebraspe, FGV, FCC, OAB</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Previsor Preditivo</strong> de nota de corte por microrregião</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Acesso Mobile VIP:</strong> Sincronização offline no app nativo</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              onSelectPlan('elite');
              onOpenPricing();
            }}
            className="mt-10 w-full py-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-extrabold text-base transition-all duration-300 group-hover:border-amber-400 dark:group-hover:border-amber-500/50 group-hover:text-amber-600 dark:group-hover:text-amber-400 shadow-sm group-hover:shadow-md"
          >
            Assinar Plano Elite
          </button>
        </div>

      </div>
    </section>
  );
};
