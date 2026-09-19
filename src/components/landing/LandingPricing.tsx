import React from 'react';
import { Crown, CheckCircle2, XCircle, Flame, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
      <div className="text-center mb-16">
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

      {/* BANNER VIP OFERTA FECHADA DE LANÇAMENTO (R$ 97) */}
      <div className="mb-14 relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white shadow-2xl shadow-orange-500/25 border border-orange-400/40">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Flame className="w-4 h-4 fill-current text-yellow-300" />
                Lote 1 Exclusivo • Primeiros 200 Alunos
              </span>
              <span className="text-xs text-yellow-200 font-extrabold bg-black/30 px-3 py-1 rounded-full">
                Restam apenas 38 vagas
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Oferta Fechada: Passe Até a Prova
            </h3>
            <p className="text-orange-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Feito para concurseiros de <strong className="text-white">Tribunais, Carreiras Policiais e OAB 1ª Fase</strong> que estão há meses estudando e se sentem travados por pegadinhas da banca. Pague uma única vez e tenha acesso total até a data da prova.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold pt-1 text-orange-200">
              <div className="w-48 sm:w-60 bg-black/30 rounded-full h-3 overflow-hidden border border-white/20">
                <div className="bg-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: '81%' }} />
              </div>
              <span>162 / 200 vagas preenchidas</span>
            </div>
          </div>

          <div className="text-left lg:text-right shrink-0 space-y-3 pt-2 lg:pt-0">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-orange-200">Taxa Única Sem Mensalidade</p>
              <div className="flex items-baseline lg:justify-end gap-1">
                <span className="text-5xl font-black text-white">R$ 97</span>
                <span className="text-xs font-bold text-orange-200">/ dose única</span>
              </div>
              <p className="text-xs text-orange-200 font-medium">Acesso total irrestrito até o dia da sua prova</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectPlan('lancamento');
                onOpenPricing();
              }}
              className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-black text-base tracking-wide shadow-xl shadow-black/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Garantir Vaga por R$ 97</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
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

      {/* CARD VIP: PLANO BLACK VITALÍCIO */}
      <div className="mt-12 relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>Acesso Até a Posse • Edição Black</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Plano BLACK VITALÍCIO
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Pague uma única vez e nunca mais compre cursos ou plataformas. Tenha acesso perpétuo irrestrito a todas as ferramentas, IAs e atualizações até ser nomeado no Diário Oficial.
            </p>
          </div>

          <div className="text-left lg:text-right shrink-0 space-y-3">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-amber-400">12x de R$ 149,70 sem juros</p>
              <div className="flex items-baseline lg:justify-end gap-1">
                <span className="text-4xl font-black text-white">R$ 1.497</span>
                <span className="text-xs font-bold text-amber-400">/ único</span>
              </div>
              <p className="text-[11px] text-slate-400">ou R$ 197/mês no plano recorrente</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectPlan('black');
                onOpenPricing();
              }}
              className="w-full lg:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Garantir Acesso Vitalício Black</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
