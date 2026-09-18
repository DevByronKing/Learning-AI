'use client';

import React, { useState } from 'react';
import { 
  Crown, 
  Zap, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  CreditCard,
  ChevronDown,
  Gift
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';

interface PricingPlansTabProps {
  currentPlan: SubscriptionPlan;
  onSelectPlanForCheckout: (plan: SubscriptionPlan) => void;
  showToast: (msg: string) => void;
}

export const PricingPlansTab: React.FC<PricingPlansTabProps> = ({
  currentPlan,
  onSelectPlanForCheckout,
  showToast
}) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const plans = [
    {
      id: 'aspirante' as SubscriptionPlan,
      name: 'Aspirante',
      badge: 'Gratuito',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      priceMonthly: 0,
      priceAnnualPerMonth: 0,
      description: 'Ideal para conhecer o método e resolver baterias iniciais de questões.',
      features: [
        '5 Diagnósticos de IA por dia',
        '1 Edital Verticalizado pré-carregado',
        '20 Questões / dia no simulador',
        'Caderno de Erros (modo leitura)',
        'Radar de Concursos Nacional & Mapa',
        'Vade Mecum com 3 consultas / dia',
        '1 Correção de Peça/Redação de teste'
      ],
      notIncluded: [
        'Caderno de Erros com repetição espaçada SM-2',
        'Exportação de Cronograma em PDF',
        'Módulo de Psicometria TRI da Banca',
        'Correções de Peças OAB regulares',
        'Suporte Prioritário VIP'
      ],
      ctaText: 'Plano Gratuito Ativo',
      isPopular: false
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Plano PRO',
      badge: 'Mais Escolhido',
      badgeColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30',
      priceMonthly: 59.90,
      priceAnnualPerMonth: 39.90,
      description: 'Para o concurseiro que quer consistência, velocidade e diagnósticos ilimitados.',
      features: [
        'Diagnósticos Cognitivos Ilimitados (Flash)',
        'Até 4 Editais Simultâneos mapeados',
        'Banco Completo com 25.000+ Questões',
        'Caderno de Erros com Algoritmo SM-2',
        'Exportação de Cronogramas em PDF',
        'Radar Completo com Alertas de Bancas',
        'Vade Mecum Completo (Artigos Quentes)',
        'Suporte Prioritário por E-mail'
      ],
      notIncluded: [
        'Psicometria Reversa TRI de Distratores',
        'Correção Regular de Peças OAB',
        'Simulador de Prova Oral com IA',
        'Suporte VIP via WhatsApp'
      ],
      ctaText: 'Assinar Plano PRO',
      isPopular: true
    },
    {
      id: 'elite' as SubscriptionPlan,
      name: 'ELITE VIP',
      badge: 'Alta Performance',
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30',
      priceMonthly: 129.90,
      priceAnnualPerMonth: 89.90,
      description: 'Para quem busca os primeiros lugares em carreiras fiscais, policiais, tribunais e OAB.',
      features: [
        'Tudo do Plano PRO liberado sem restrições',
        'Módulo Exclusivo de Psicometria TRI',
        '10 Correções de Peças OAB & Redações / mês',
        'Editais Simultâneos Ilimitados',
        'Banco com Filtros Psicométricos TRI',
        'Vade Mecum com Súmulas & Jurisprudência',
        'Motor de IA de Alta Temperatura (Gemini 1.5 Pro)',
        'Suporte Prioritário VIP no WhatsApp'
      ],
      notIncluded: [
        'Simulador de Prova Oral com IA',
        'Acesso Perpétuo Vitalício'
      ],
      ctaText: 'Assinar Plano ELITE',
      isPopular: false
    },
    {
      id: 'black' as SubscriptionPlan,
      name: 'BLACK VITALÍCIO',
      badge: '👑 Acesso Até a Posse',
      badgeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black border-amber-400/50',
      priceMonthly: 197.00,
      priceAnnualPerMonth: 124.75, // 1.497 / 12 = 124.75
      description: 'Pague uma única vez e tenha acesso perpétuo irrestrito até ser nomeado no Diário Oficial.',
      features: [
        'Acesso Perpétuo Vitalício (Sem mensalidades)',
        'Correções ILIMITADAS de Peças OAB & Redações',
        'Simulador Cognitivo de Prova Oral com IA',
        'Questões Inéditas geradas por IA da Banca',
        'Importação Custom de Qualquer PDF de Edital',
        'Vade Mecum com Áudio-Artigos IA',
        'Previsão Neuroestatística de Retenção e Corte',
        'Animal Guardião Mítico: Fênix Dourada 🔥',
        'Gerente de Sucesso & Suporte 1-a-1 Dedicado'
      ],
      notIncluded: [],
      ctaText: 'Garantir Acesso Vitalício Black',
      isPopular: false,
      isBlack: true
    }
  ];

  // Matriz Comparativa Detalhada com os 4 Planos
  const comparisonMatrix = [
    {
      category: 'Inteligência Artificial & Diagnóstico',
      items: [
        { name: 'Diagnósticos Cognitivos de Erros', aspirante: '5 / dia', pro: 'Ilimitado (Flash)', elite: 'Ilimitado (Pro)', black: 'Ilimitado Prioritário' },
        { name: 'Classificação de Tipo de Erro (4 tipos)', aspirante: 'Básica', pro: 'Completa', elite: 'Avançada', black: 'Deep Neural' },
        { name: 'Motor de IA Cognitivo', aspirante: 'Padrão', pro: 'Gemini 1.5 Flash', elite: 'Gemini 1.5 Pro', black: 'Gemini 1.5 Pro + Áudio' },
        { name: 'Geração Instantânea de Flashcards', aspirante: false, pro: true, elite: true, black: true },
        { name: 'Simulador Cognitivo de Prova Oral', aspirante: false, pro: false, elite: false, black: true }
      ]
    },
    {
      category: 'Editais & Planejamento de Estudos',
      items: [
        { name: 'Editais Verticalizados Simultâneos', aspirante: '1 Edital', pro: 'Até 4 Editais', elite: 'Ilimitados', black: 'Ilimitados + Custom' },
        { name: 'Matriz de Relevância e Pesos da Banca', aspirante: true, pro: true, elite: true, black: true },
        { name: 'Ciclo de Estudos Adaptativo Meirelles', aspirante: 'Básico', pro: 'Dinâmico', elite: 'Personalizado', black: 'IA Auto-Calibrada' },
        { name: 'Exportação de Cronograma em PDF', aspirante: false, pro: true, elite: true, black: true }
      ]
    },
    {
      category: 'Questões & Caderno de Erros',
      items: [
        { name: 'Acesso ao Banco Oficial de Questões', aspirante: '20 / dia', pro: '25.000+ questões', elite: 'Completo + TRI', black: 'Completo + Inéditas IA' },
        { name: 'Caderno de Erros com Algoritmo SM-2', aspirante: 'Leitura apenas', pro: 'Completo Ativo', elite: 'Completo + Distratores', black: 'Completo + Previsão' },
        { name: 'Filtros por Banca, Disciplina e Ano', aspirante: true, pro: true, elite: true, black: true },
        { name: 'Vade Mecum com Incidência Real de Artigos', aspirante: '3 consultas/dia', pro: 'Completo', elite: 'Súmulas & Jurisprudência', black: 'Áudio-Artigos IA' }
      ]
    },
    {
      category: 'Discursivas, OAB & Psicometria TRI',
      items: [
        { name: 'Psicometria Reversa de Distratores (TRI)', aspirante: false, pro: false, elite: true, black: true },
        { name: 'Correção de Peças OAB & Redações', aspirante: '1 teste', pro: false, elite: '10 correções / mês', black: 'Ilimitadas (Até a Posse)' },
        { name: 'Espelho Oficial de Critérios da Banca', aspirante: false, pro: false, elite: true, black: true }
      ]
    },
    {
      category: 'Suporte & Benefícios Exclusivos',
      items: [
        { name: 'Garantia Incondicional de 7 Dias (CDC)', aspirante: '-', pro: true, elite: true, black: true },
        { name: 'Canal de Atendimento ao Aluno', aspirante: 'FAQ / Plataforma', pro: 'E-mail Prioritário', elite: 'WhatsApp VIP', black: 'Gerente 1-a-1 Dedicado' },
        { name: 'Animal Guardião Exclusivo', aspirante: 'Padrão', pro: 'Todos os 6', elite: 'Todos os 6 + Evolução', black: 'Fênix Dourada Mítica 🔥' },
        { name: 'Vigência do Acesso', aspirante: 'Gratuito', pro: 'Mensal / Anual', elite: 'Mensal / Anual', black: 'Vitalício (Até a Posse)' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Como funciona a garantia incondicional de 7 dias?',
      a: 'Conforme o Artigo 49 do Código de Defesa do Consumidor (CDC), você pode assinar qualquer plano pago do Learning AI e testar todos os recursos por até 7 dias corridos. Se achar que a plataforma não acelerou seus estudos, basta solicitar o reembolso e devolvemos 100% do seu dinheiro sem burocracia.'
    },
    {
      q: 'Posso cancelar minha assinatura a qualquer momento?',
      a: 'Sim! Não cobramos fidelidade ou multas de rescisão. Você pode cancelar a renovação com 1 clique diretamente na aba "Minha Assinatura" ou pelo nosso suporte.'
    },
    {
      q: 'Quais as formas de pagamento disponíveis?',
      a: 'Aceitamos Pix Instantâneo (com liberação imediata da conta em 5 segundos) e Cartão de Crédito com parcelamento em até 12x através da instituição de pagamento segura Asaas.'
    },
    {
      q: 'Como o plano anual me faz economizar?',
      a: 'Na cobrança anual, você ganha 30% de desconto real no valor total das mensalidades, economizando até R$ 240,00 por ano e garantindo acesso contínuo durante toda a sua preparação até a posse.'
    },
    {
      q: 'A IA substitui a leitura da lei seca ou livros?',
      a: 'Não! O Learning AI funciona como um copiloto e potencializador. Ele aponta exatamente quais artigos da lei seca possuem 80% de incidência nas provas e disseca os conceitos que você errou, eliminando perda de tempo com leituras inúteis.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 animate-fadeIn">
      
      {/* Header com Toggle Anual / Mensal */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Planos Transparentes Sem Pegadinhas</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Invista na Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Aprovação Definitiva</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Escolha o plano ideal para o seu momento de estudos. Cancele a qualquer momento ou receba 100% de reembolso nos primeiros 7 dias.
        </p>

        {/* Toggle de Faturamento */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 mt-4">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isAnnual
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cobrança Mensal
          </button>

          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAnnual
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Cobrança Anual</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
              30% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Grid de Cards de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {plans.map((p) => {
          const isBlack = p.id === 'black';
          const price = isAnnual ? p.priceAnnualPerMonth : p.priceMonthly;
          const isCurrent = currentPlan === p.id;
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
                isBlack
                  ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/40 border-2 border-amber-400 ring-2 ring-amber-400/20 shadow-2xl text-white'
                  : p.isPopular
                  ? 'bg-white dark:bg-dark-surface border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : p.id === 'elite'
                  ? 'bg-white dark:bg-dark-surface border-amber-500/80 shadow-lg'
                  : 'bg-white/80 dark:bg-dark-surface/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                  Mais Escolhido
                </div>
              )}

              {isBlack && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <span>👑 Até a Posse</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Atual
                      </span>
                    )}
                  </div>

                  <h3 className={`text-2xl font-black mt-3 ${
                    isBlack 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {p.name}
                  </h3>
                  <p className={`text-xs mt-1 min-h-[36px] ${
                    isBlack ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {p.description}
                  </p>
                </div>

                {/* Preço */}
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  {isBlack ? (
                    isAnnual ? (
                      <div>
                        <span className="text-3xl font-black text-amber-400">12x R$ 124,75</span>
                        <p className="text-[11px] text-amber-300 font-bold mt-1">
                          R$ 1.497 à vista • Acesso Perpétuo
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white">R$ 197</span>
                          <span className="text-xs font-bold text-slate-400">/mês</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Sem fidelidade ou carência</p>
                      </div>
                    )
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">
                          R$ {price.toFixed(price % 1 === 0 ? 0 : 2)}
                        </span>
                        {p.priceMonthly > 0 && (
                          <span className="text-xs font-bold text-slate-400">/mês</span>
                        )}
                      </div>
                      {isAnnual && p.priceMonthly > 0 && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          Faturado anualmente (30% OFF)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Lista de Recursos */}
                <div className="space-y-2.5 text-xs">
                  <p className={`font-bold uppercase tracking-wider text-[11px] ${
                    isBlack ? 'text-amber-400' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    Recursos Inclusos:
                  </p>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className={`flex items-start gap-2 ${
                      isBlack ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isBlack ? 'text-amber-400' : 'text-emerald-500'
                      }`} />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {p.notIncluded.length > 0 && (
                    <>
                      <div className="pt-1" />
                      {p.notIncluded.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-400 dark:text-slate-500">
                          <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-through">{feat}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                  >
                    Seu Plano Atual
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlanForCheckout(p.id)}
                    className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                      isBlack
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/25 hover:brightness-110'
                        : p.id === 'elite'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                    }`}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela de Comparação Completa */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Comparativo Completo dos 4 Planos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mais de 20 funcionalidades detalhadas para você comparar lado a lado:
          </p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black">
                <th className="py-4 px-4 w-2/5">Funcionalidade</th>
                <th className="py-4 px-3 text-center">Aspirante</th>
                <th className="py-4 px-3 text-center text-blue-600 dark:text-blue-400">PRO</th>
                <th className="py-4 px-3 text-center text-amber-500">ELITE VIP</th>
                <th className="py-4 px-3 text-center text-amber-400 bg-amber-500/10 rounded-t-xl font-black">👑 BLACK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {comparisonMatrix.map((cat, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    <td colSpan={5} className="py-3 px-4 font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.items.map((item, itemIdx) => (
                    <tr key={itemIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{item.name}</td>
                      <td className="py-3 px-3 text-center text-slate-500">
                        {typeof item.aspirante === 'boolean' ? (
                          item.aspirante ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          item.aspirante
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-blue-600 dark:text-blue-400">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          item.pro
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-600 dark:text-amber-400">
                        {typeof item.elite === 'boolean' ? (
                          item.elite ? <Check className="w-4 h-4 text-amber-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          item.elite
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-amber-500 dark:text-amber-400 bg-amber-500/5">
                        {typeof (item as any).black === 'boolean' ? (
                          (item as any).black ? <Check className="w-4 h-4 text-amber-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />
                        ) : (
                          (item as any).black
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de Dúvidas Frequentes (FAQ) */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            Perguntas Frequentes sobre os Planos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tudo o que você precisa saber antes de iniciar sua preparação de elite.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selo de Garantia CDC 7 Dias */}
      <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            Garantia Incondicional de 7 Dias do Código de Defesa do Consumidor
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Assine com total tranquilidade. Se dentro de 7 dias você entender que a inteligência cognitiva da plataforma não é para você, basta nos enviar um e-mail ou mensagem no WhatsApp que reembolsamos 100% do valor pago.
          </p>
        </div>
      </div>

    </div>
  );
};
