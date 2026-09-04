'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  BrainCircuit, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Flame, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  Layers,
  Crown,
  PenTool
} from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import { INITIAL_EXAMS } from '@/lib/mockData';

interface LandingPageProps {
  onStartEdital: () => void;
  onStartDiscursivas?: () => void;
  onOpenPricing: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEdital,
  onStartDiscursivas,
  onOpenPricing,
  onSelectPlan
}) => {
  const [leadInput, setLeadInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('INSS 2026');
  const [isCalculating, setIsCalculating] = useState(false);
  const [leadResult, setLeadResult] = useState<{
    totalHoursNeeded: number;
    topTopics: string[];
    bancaTrapIndex: string;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);

      // Search for an exam matching the input
      const searchTerms = leadInput.toLowerCase().trim();
      const matchedExam = INITIAL_EXAMS.find(exam => 
        exam.title.toLowerCase().includes(searchTerms) ||
        exam.role.toLowerCase().includes(searchTerms)
      ) || INITIAL_EXAMS[0]; // fallback to first (INSS) if none matches

      // Get top 3 topics by accuracyRate (simulating the most difficult ones or highest weight)
      const allTopics = matchedExam.subjects.flatMap(sub => 
        sub.topics.map(topic => `${sub.name} (${topic.name} - Peso ${sub.weight})`)
      );

      const topTopics = allTopics.slice(0, 3);
      if (topTopics.length === 0) {
        topTopics.push('Conteúdo base do edital', 'Conhecimentos Específicos', 'Língua Portuguesa');
      }

      setLeadResult({
        totalHoursNeeded: matchedExam.daysRemaining * 3, // mock 3h a day
        topTopics,
        bancaTrapIndex: `Alta probabilidade de pegadinhas da banca ${matchedExam.banca} em temas de jurisprudência recente`
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-32 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Nova IA 2.0: Detecção de Pegadinhas das Bancas FGV, Cebraspe e FCC</span>
          <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Pare de colecionar PDFs. <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Deixe a IA mapear seus pontos cegos.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          O <strong className="font-bold text-indigo-600 dark:text-indigo-400">Learning AI</strong> disseca o edital do seu concurso em segundos, gera um cronograma dinâmico que não quebra no primeiro imprevisto e diagnostica a causa psicológica exata de cada erro nas questões.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartEdital}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 glow-brand"
          >
            <BrainCircuit className="w-5 h-5" />
            <span>Dissecar Meu Edital com IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white dark:bg-dark-surface/80 hover:bg-slate-50 dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-200 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Ver Planos & Preços</span>
          </button>
        </div>

        {/* Micro-trust indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Sem necessidade de cartão no início
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Processamento em &lt; 20 segundos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Atualizado com jurisprudência de 2026
          </span>
        </div>

        {/* Social Proof Counter Banner */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">+14.800</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Editais Processados</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">1.2 Milhão</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Erros Diagnosticados</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">3.4x</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Mais Retenção de Memória</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border border-slate-200/80 dark:border-white/10 shadow-sm">
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">78.5%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Taxa Média de Acerto</p>
          </div>
        </div>

      </section>

      {/* ISCA GRATUITA / LEAD MAGNET INTERATIVO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/30 relative overflow-hidden glow-brand">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 fill-emerald-400" />
              <span>FERRAMENTA 100% GRATUITA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Calculadora de Edital Verticalizado & Rota de Carga Horária
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Descubra quantas horas você realmente precisa estudar e quais matérias têm 80% do peso do seu concurso.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Ex: Técnico do Seguro Social - INSS 2026 ou Escrevente TJ-SP"
                value={leadInput}
                onChange={(e) => setLeadInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl glass-input text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculando Carga...</span>
                </>
              ) : (
                <>
                  <span>Calcular Rota Grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Sugestões rápidas:</span>
            {['INSS 2026', 'OAB 43º Exame', 'TJ-SP Escrevente', 'Polícia Federal Agente'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setLeadInput(preset);
                  setSelectedPreset(preset);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Lead Result Card */}
          {leadResult && (
            <div className="mt-6 p-5 rounded-2xl bg-white dark:bg-dark-surface/90 border border-emerald-500/40 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-white/10">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  ✓ Diagnóstico do Edital Gerado
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Tempo estimado: ~{leadResult.totalHoursNeeded}h de estudo líquido</span>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Matérias com 80% do Peso no Ponto de Corte:</p>
                  <ul className="space-y-1">
                    {leadResult.topTopics.map((top, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {top}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-dark-card/60 p-3 rounded-xl border border-indigo-500/20">
                  <p className="text-xs font-semibold text-indigo-300">Índice de Pegadinhas da Banca:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{leadResult.bancaTrapIndex}</p>
                  <button
                    onClick={onStartEdital}
                    className="mt-3 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Cronograma Completo no App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* O MÉTODO ANTIGO VS O MÉTODO APROVALENS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            A Diferença na Sua Rotina de Estudos
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Por que 95% dos candidatos não alcançam a nota de corte?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* O Método Tradicional */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/20 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Método Convencional (Estudo Passivo)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Planejamento manual rígido e resolução sem diagnóstico</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Cronogramas inflexíveis:</strong> Diante de imprevistos do dia a dia, a planilha inteira se desorganiza e quebra a constância do candidato.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Feedback disperso:</strong> O estudante perde horas em fóruns com comentários conflitantes, sem identificar a verdadeira raiz jurídica do seu erro.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>Ilusão de produtividade:</strong> Resolver apenas questões confortáveis mascara vulnerabilidades graves nos temas de maior cobrança da banca.</span>
              </li>
            </ul>
          </div>

          {/* O Método AprovaLens */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 relative glow-emerald">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Método AprovaLens AI</h3>
                <p className="text-xs text-emerald-400 font-medium">Preparação Adaptativa e Engenharia Cognitiva</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ciclos autoajustáveis:</strong> Se você perder um dia de estudo, a IA recalibra o cronograma redistribuindo as matérias de maior peso.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Diagnóstico cognitivo imediato:</strong> Discrimina com exatidão se o erro decorreu de armadilha semântica da banca, lacuna doutrinária ou desatenção.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Mapeamento cirúrgico de pontos cegos:</strong> Visualize com clareza analítica exatamente quais artigos de lei e tópicos exigem intervenção imediata.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* CORE FEATURES SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Recursos Projetados para Aprovação
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Engenharia de Alto Rendimento para Concursos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Edital RAG */}
          <div 
            onClick={onStartEdital}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-indigo-400/50 hover:shadow-indigo-500/10 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-300 transition-colors">Dissecador de Editais em PDF</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Faça o upload do edital e receba em segundos a árvore verticalizada, o peso de cada matéria e os artigos de lei mais cobrados.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Dissecar Edital</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Estúdio de Discursivas & Redações */}
          <div 
            onClick={onStartDiscursivas}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-emerald-400/50 hover:shadow-emerald-500/10 transition-all group border-emerald-500/30 glow-emerald"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-300 transition-colors">Estúdio de Discursivas & Peças</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Treine na folha pautada de 30 linhas com correção imediata por IA baseada na régua oficial de pontuação (Cebraspe, FGV e OAB).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Treinar Discursiva</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Diagnóstico de Erros */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-indigo-500/40 glow-brand">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnóstico Cognitivo de Erro</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ao errar uma questão, a IA analisa os distratores da banca e identifica a raiz da falha: pegadinha, lacuna teórica ou desatenção.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-purple-400 font-semibold flex items-center gap-1">
              <span>Classificação em 4 Tipos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Heatmaps & SRS */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mapa de Calor & SRS</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mapeamento visual de pontos críticos e geração de flashcards inteligentes para fixação definitiva na memória de longo prazo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-xs text-cyan-400 font-semibold flex items-center gap-1">
              <span>Previsor de Corte</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="pricing">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>INVESTIMENTO NO SEU CARGO PÚBLICO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            Planos Simples e Transparentes
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Cancele a qualquer momento com 1 clique. Garantia incondicional de 7 dias com reembolso integral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plano Aspirante (Free) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aspirante</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para quem está conhecendo o método</p>
              
              <div className="mt-6 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">R$ 0</span>
                <span className="text-xs text-slate-500 dark:text-slate-400"> / sempre grátis</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/5 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 Edital processado por mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>15 Questões diárias com gabarito simples</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cronograma estático básico</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Sem Diagnóstico Cognitivo de Erros</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('aspirante')}
              className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors shadow-sm"
            >
              Começar Gratuitamente
            </button>
          </div>

          {/* Plano Gabarito Pro (Mais Popular) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between border-indigo-500 relative glow-brand shadow-2xl shadow-indigo-600/20 transform md:-translate-y-2">
            
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-black tracking-wider uppercase shadow-md">
              ★ RECOMENDADO POR APROVADOS
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gabarito Pro</h3>
              <p className="text-xs text-indigo-300 mt-1">O pacote completo de alta performance</p>
              
              <div className="mt-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">R$ 39,90</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> / mês</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  ou R$ 297/ano (Economize 38%)
                </p>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 border-t border-slate-300 dark:border-white/10 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Editais ilimitados</strong> com IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Diagnóstico Cognitivo de Erros</strong> em 100% das questões</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Cronograma Dinâmico</strong> com reajuste automático</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Heatmap Completo</strong> de Pontos Cegos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exportação instantânea para Flashcards Anki</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectPlan('pro');
                onOpenPricing();
              }}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-indigo-600/30 glow-brand"
            >
              Assinar Plano Pro
            </button>
          </div>

          {/* Plano Elite / Mentoria IA */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Elite & Discursivas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para carreiras jurídicas, fiscais e OAB</p>
              
              <div className="mt-6 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">R$ 79,90</span>
                <span className="text-xs text-slate-500 dark:text-slate-400"> / mês</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/5 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tudo incluído no Plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Corretor de Redação e Peças OAB por IA</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulados discursivos com régua de pontuação da banca</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Previsor preditivo de nota de corte por microrregião</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onSelectPlan('elite');
                onOpenPricing();
              }}
              className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-50 dark:hover:bg-dark-hover border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors shadow-sm"
            >
              Assinar Plano Elite
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-600 dark:text-slate-300">AprovaLens AI</span>
          <span>• Acelerador Cognitivo de Aprovação</span>
        </div>
        <p>© 2026 AprovaLens AI Inc. Todos os direitos reservados. Feito para concurseiros de alta performance.</p>
      </footer>

    </div>
  );
};
