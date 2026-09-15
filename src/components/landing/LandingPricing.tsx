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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Plano Aspirante (Free) */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Aspirante</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Para quem está conhecendo o método</p>
            
            <div className="mt-8 mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white">R$ 0</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ sempre grátis</span>
            </div>

            <ul className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-white/10 pt-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>1 Edital processado por mês</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>15 Questões diárias (gabarito simples)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Cronograma estático básico</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span className="line-through decoration-slate-300 dark:decoration-slate-600">Diagnóstico Cognitivo de Erros</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('aspirante')}
            className="mt-10 w-full py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-extrabold text-base transition-colors shadow-sm"
          >
            Começar Gratuitamente
          </button>
        </div>

        {/* Plano Gabarito Pro (Mais Popular) */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-indigo-500 relative glow-brand shadow-2xl shadow-indigo-600/20 transform md:-translate-y-4 transition-transform z-10 bg-white/60 dark:bg-[#131E35]/90">
          
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-indigo-500/30 whitespace-nowrap">
            ★ RECOMENDADO POR APROVADOS
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Gabarito Pro</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-bold">O Copiloto Cognitivo de Alta Performance</p>
            
            <div className="mt-8 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white">R$ 69,90</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ mês</span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-2 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-3 py-1 rounded-lg">
                ou R$ 497/ano no Pix (R$ 41,41/mês • -40% OFF)
              </p>
            </div>

            <ul className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-white/10 pt-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Editais ilimitados:</strong> Análise verticalizada e rota 80/20</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Diagnóstico Cognitivo:</strong> Classificação dos 4 tipos de falha</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cronograma Adaptativo:</strong> Recalibra carga horária sem quebra</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Heatmap Analítico</strong> de pontos cegos e lei seca cobrada</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Flashcards SRS Automáticos</strong> (Repetição Espaçada)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              onSelectPlan('pro');
              onOpenPricing();
            }}
            className="mt-10 w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-lg tracking-wide transition-all shadow-xl shadow-indigo-600/30 glow-brand transform hover:-translate-y-1"
          >
            Assinar Plano Pro
          </button>
        </div>

        {/* Plano Elite / Mentoria IA */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Elite & Discursivas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Carreiras Jurídicas, Fiscais, OAB e Tribunais</p>
            
            <div className="mt-8 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white">R$ 119,90</span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/ mês</span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-2 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-3 py-1 rounded-lg">
                ou R$ 897/ano no Pix (R$ 74,75/mês)
              </p>
            </div>

            <ul className="space-y-4 text-sm font-medium text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-white/10 pt-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tudo do Plano Pro incluído</strong> com acesso irrestrito</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Estúdio de Discursivas:</strong> Correção de peças e redações por IA</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Espelho Oficial da Banca:</strong> Critérios Cebraspe, FGV, FCC, OAB</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Previsor Preditivo</strong> de nota de corte por microrregião</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Acesso Mobile VIP:</strong> Sincronização offline no app nativo</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              onSelectPlan('elite');
              onOpenPricing();
            }}
            className="mt-10 w-full py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-extrabold text-base transition-colors shadow-sm"
          >
            Assinar Plano Elite
          </button>
        </div>

      </div>
    </section>
  );
};
