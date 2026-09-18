'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  BrainCircuit, 
  ScrollText, 
  CalendarClock, 
  BookCheck, 
  Crosshair, 
  ShieldAlert, 
  Scale, 
  Feather, 
  Microscope, 
  Sparkles, 
  Zap, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Keyboard, 
  HelpCircle, 
  Target, 
  Lightbulb,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface PlatformGuideTabProps {
  onGoToTab: (tab: string) => void;
  showToast: (msg: string) => void;
}

export const PlatformGuideTab: React.FC<PlatformGuideTabProps> = ({
  onGoToTab,
  showToast
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      number: 1,
      id: 'edital',
      title: '1. Mapeie o Edital com IA',
      subtitle: 'Matriz de Pesos & Priorização',
      icon: ScrollText,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      description: 'Nunca estude um edital de forma linear do início ao fim. O Learning AI analisa o peso das matérias e a frequência histórica da banca examinadora.',
      actionLabel: 'Ir para Edital IA',
      tips: [
        'Faça upload do PDF ou selecione um edital pronto no nosso banco oficial.',
        'Observe o índice de relevância: tópicos com relevância acima de 70% devem consumir 80% do seu tempo inicial.',
        'Identifique seus Pontos Cegos antes de começar a resolver simulados.'
      ]
    },
    {
      number: 2,
      id: 'cycle',
      title: '2. Ative o Ciclo de Estudos Adaptativo',
      subtitle: 'Método Meirelles Dinâmico',
      icon: CalendarClock,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      description: 'Estudar a mesma matéria o dia inteiro fadiga a memória de trabalho. O método de ciclos alterna matérias de exatas, direito e língua portuguesa.',
      actionLabel: 'Ver Meus Ciclos',
      tips: [
        'Defina sua meta diária de horas líquidas no painel de configurações.',
        'Blocos ideais variam de 50 a 90 minutos para manter o foco ininterrupto.',
        'Ao concluir um bloco, o sistema recalcula os próximos tópicos com base no seu percentual de acertos.'
      ]
    },
    {
      number: 3,
      id: 'simulator',
      title: '3. Resolva Questões com Diagnóstico Cognitivo',
      subtitle: 'Simulador com IA Reversa',
      icon: Crosshair,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Acertar é bom, mas o aprendizado de longo prazo acontece no diagnóstico do erro. Nosso motor disseca se você errou por desatenção, lacuna de teoria ou pegadinha.',
      actionLabel: 'Abrir Simulador',
      tips: [
        'Indique seu nível de certeza ao responder (Certeza, Dúvida ou Chute).',
        'Se errar, a IA gera automaticamente um Flashcard de reforço em 1 segundo.',
        'Entenda o motivo exato de cada alternativa errada (distrator).'
      ]
    },
    {
      number: 4,
      id: 'mistakes',
      title: '4. Supere Seus Erros no Caderno Antidistrator',
      subtitle: 'Repetição Espaçada Ebbinghaus (SM-2)',
      icon: ShieldAlert,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      description: 'Todo erro cometido em simulados é enviado para o Caderno de Erros. Ele programa revisões automáticas no 1º, 7º e 30º dia para blindar sua retenção.',
      actionLabel: 'Acessar Caderno de Erros',
      tips: [
        'Revise seus erros pendentes diariamente antes de iniciar os blocos de estudo.',
        'O algoritmo SM-2 aumenta o intervalo quando você acerta a questão na revisão.',
        'Transforme seus maiores tropeços em pontos fortes no dia da prova.'
      ]
    },
    {
      number: 5,
      id: 'discursivas',
      title: '5. Domine Peças & Redações com Espelho de Banca',
      subtitle: 'Studio de Discursivas & OAB',
      icon: Feather,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      description: 'A prova discursiva e a peça prático-profissional da OAB eliminam até 60% dos candidatos. Treine com temas oficiais e receba correção linha a linha.',
      actionLabel: 'Treinar Discursivas',
      tips: [
        'Escreva sua peça ou redação respeitando o limite oficial de linhas.',
        'A IA avalia estrutura gramatical, vocabulário técnico e o espelho oficial de quesitos da banca.',
        'Compare seu rascunho com o Modelo de Resposta Padrão.'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950 border border-blue-200/80 dark:border-blue-500/30 p-8 sm:p-12 overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Manual Cognitivo de Maestria • Learning AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Como Sair do Zero e Atingir <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300">85%+ em 90 Dias</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Bem-vindo ao método que substitui o estudo passivo e exaustivo por neurociência aplicada, repetição espaçada e engenharia reversa das bancas examinadoras.
          </p>
        </div>
      </div>

      {/* Roteiro Passo a Passo Interativo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Os 5 Pilares da Aprovação</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Clique em cada etapa para explorar o fluxo de estudo comprovado:</p>
          </div>
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-500/20">
            Passo {activeStep} de 5
          </span>
        </div>

        {/* Barra de Seleção de Passos */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {steps.map((step) => {
            const isSelected = activeStep === step.number;
            const Icon = step.icon;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-500 bg-white dark:bg-dark-surface ring-2 ring-blue-500/20 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {step.number}
                  </div>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`text-xs font-black truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {step.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalhe do Passo Ativo */}
        {(() => {
          const current = steps[activeStep - 1];
          const Icon = current.icon;
          return (
            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${current.color} shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Pilar Cognitivo nº {current.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onGoToTab(current.id)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-95 transition-all shrink-0"
                >
                  <span>{current.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Boas Práticas & Instruções de Uso:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {current.tips.map((tip, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  ← Passo Anterior
                </button>

                <button
                  disabled={activeStep === 5}
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 hover:opacity-90 transition-all"
                >
                  Próximo Passo →
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Seção Extra: Dicas de Prompts para o Copiloto IA */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Engenharia de Prompt para Concurseiros: Como Extrair o Máximo da IA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Copie estes modelos de perguntas ao conversar com o Copiloto no canto direito da tela:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
              Desconstrução de Pegadinha
            </span>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
              "Como a banca FGV costuma tentar confundir o candidato ao cobrar o Art. 37 da CF/88? Dê um exemplo de questão com distrator semântico."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded">
              Jurisprudência Comparada
            </span>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
              "Resuma a divergência recente entre o STJ e o STF quanto à prescrição intercorrente na Lei de Improbidade Administrativa."
            </p>
          </div>
        </div>
      </div>

      {/* Seção de Atalhos de Teclado */}
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-blue-500" />
          Atalhos de Teclado (Velocidade Extrema)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500">Alternar Abas:</span>
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border text-[11px] font-mono font-bold">1 a 6</kbd>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500">Próxima Questão:</span>
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border text-[11px] font-mono font-bold">Espaço</kbd>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500">Caderno de Erros:</span>
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border text-[11px] font-mono font-bold">Alt + E</kbd>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-500">Fechar Modais:</span>
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border text-[11px] font-mono font-bold">Esc</kbd>
          </div>
        </div>
      </div>

    </div>
  );
};
