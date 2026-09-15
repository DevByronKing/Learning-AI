'use client';

import React, { useState } from 'react';
import { 
  Microscope, 
  Brain, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  ChevronRight, 
  HelpCircle, 
  Clock, 
  AlertOctagon, 
  Split, 
  GitCompare, 
  History, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  TrendingDown,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  PSYCHOMETRIC_DISTRACTORS, 
  BANCA_PSYCHOMETRIC_PROFILES 
} from '@/lib/psychometricsData';
import { 
  BancaPsychometricProfile, 
  PsychometricDistractorDef, 
  PsychometricDistractorType 
} from '@/lib/types';
import { analytics } from '@/lib/analytics';

interface BancaPsychometricsProps {
  onGoToSimulator?: (banca?: string) => void;
}

export const BancaPsychometrics: React.FC<BancaPsychometricsProps> = ({ onGoToSimulator }) => {
  const [selectedBancaName, setSelectedBancaName] = useState<'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp'>('Cebraspe');
  const [selectedDistractorId, setSelectedDistractorId] = useState<PsychometricDistractorType>('generalizacao_indevida');

  const bancaProfile: BancaPsychometricProfile = 
    BANCA_PSYCHOMETRIC_PROFILES.find(b => b.banca === selectedBancaName) || BANCA_PSYCHOMETRIC_PROFILES[0];

  const activeDistractor: PsychometricDistractorDef = 
    PSYCHOMETRIC_DISTRACTORS.find(d => d.id === selectedDistractorId) || PSYCHOMETRIC_DISTRACTORS[0];

  const handleSelectBanca = (banca: 'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp') => {
    setSelectedBancaName(banca);
    analytics.track('mascot_strategy_interacted', { action: 'select_psychometric_banca', banca });
  };

  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'AlertOctagon': return <AlertOctagon className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Split': return <Split className={className} />;
      case 'HelpCircle': return <HelpCircle className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'GitCompare': return <GitCompare className={className} />;
      case 'History': return <History className={className} />;
      default: return <Brain className={className} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner de Apresentação */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-8 sm:p-10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-sm">
                <Microscope className="w-4 h-4 text-cyan-300" />
                Psicometria Educacional & TRI
              </span>
              <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/40 text-xs font-bold shadow-sm">
                Engenharia Reversa de Distratores
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-sm">
                45.720 Questões Mapeadas
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              A Mente do Examinador Decodificada
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl">
              As bancas não criam alternativas erradas ao acaso. Em psicometria, cada erro é um <strong className="text-cyan-300 font-bold">distrator intencional</strong> calibrado para explorar uma armadilha cognitiva específica. Aprenda a desarmar os 8 arquétipos favoritos de cada banca.
            </p>
          </div>

          <div className="flex sm:flex-col gap-4 shrink-0">
            <div className="bg-slate-900/60 backdrop-blur-md border border-indigo-400/40 p-5 rounded-3xl text-center shadow-xl flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-widest mb-2">Discriminação (A)</span>
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{bancaProfile.discriminationEfficiency}%</span>
              <span className="text-[11px] text-cyan-300 block mt-2 font-medium bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">Alta Previsibilidade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Bancas Examinadoras */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-500" />
            Selecione a Banca Alvo para o Raio-X Psicométrico:
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">
            Análise baseada em dados reais de editais oficiais
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BANCA_PSYCHOMETRIC_PROFILES.map((bp) => {
            const isSelected = selectedBancaName === bp.banca;
            return (
              <button
                key={bp.banca}
                onClick={() => handleSelectBanca(bp.banca)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden shadow-sm ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-7 h-7 bg-indigo-600 flex items-center justify-center rounded-bl-xl shadow">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-base sm:text-lg font-black block text-slate-900 dark:text-white">{bp.banca}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 line-clamp-1">{bp.tagline}</span>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block mt-2">
                  {bp.totalQuestionsMapped.toLocaleString('pt-BR')} questões analisadas
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção 1: Anatomia dos Distratores da Banca Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Gráfico Visual da Distribuição dos Distratores */}
        <div className="glass-panel lg:col-span-7 bg-white/70 dark:bg-dark-card/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-xs font-black uppercase shadow-sm">
                    Raio-X da Banca
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Assinatura Psicométrica</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Distribuição de Distratores na {bancaProfile.banca}
                </h3>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            {/* Descrição do Perfil do Examinador */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-white/5">
              <strong className="text-indigo-600 dark:text-indigo-400 block mb-1 text-xs uppercase tracking-wide">
                Como a banca pensa:
              </strong>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {bancaProfile.examinerPsychologicalProfile}
              </p>
            </div>

            {/* Barras de Frequência dos Distratores */}
            <div className="mt-6 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Incidência dos Tipos de Pegadinhas nas Questões:
              </span>

              {bancaProfile.distractorDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>{item.name}</span>
                    <span className="font-mono" style={{ color: item.color }}>{item.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regra de Ouro do Antídoto */}
          <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 block">
                Regra de Ouro do Antídoto para a {bancaProfile.banca}:
              </span>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 mt-1 leading-relaxed">
                {bancaProfile.antidoteGoldenRule}
              </p>
            </div>
          </div>
        </div>

        {/* Card de Vulnerabilidade Pessoal do Aluno */}
        <div className="glass-panel lg:col-span-5 bg-white/70 dark:bg-dark-card/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-black uppercase shadow-sm">
                  Diagnóstico Pessoal
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  Sua Vulnerabilidade na {bancaProfile.banca}
                </h3>
              </div>
              <ShieldAlert className="w-6 h-6 text-rose-500" />
            </div>

            <div className="mt-6 text-center bg-rose-50/50 dark:bg-dark-surface border border-rose-100 dark:border-white/5 p-5 rounded-2xl">
              <span className="text-xs text-slate-600 dark:text-slate-400 block font-bold">Taxa de Vulnerabilidade a Pegadinhas</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <TrendingDown className="w-6 h-6 text-rose-500" />
                <span className="text-4xl font-black text-rose-600 dark:text-rose-400">{bancaProfile.studentVulnerabilityRate}%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                De cada 10 erros cometidos nesta banca, 6.4 decorrem de distratores de relaxamento e indução, não de falta de estudo da matéria.
              </p>
            </div>

            {/* Análise Cognitiva do Aluno */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Domínio da Matéria:</strong> 82% de retenção na letra seca da CF/88 e leis estatutárias.</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Ponto Cego Psicométrico:</strong> 65% de queda em alternativas com advérbios absolutistas (*"sempre"* / *"nunca"*).</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Potencial Imediato:</strong> Desarmando este distrator, sua nota líquida sobe +7.4 pontos no simulado.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => onGoToSimulator?.(bancaProfile.banca)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Treinar Simulado Contra a {bancaProfile.banca}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Seção 2: O Catálogo dos 8 Arquétipos de Distratores Psicométricos */}
      <div className="glass-panel bg-white/70 dark:bg-dark-card/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 text-xs font-black uppercase shadow-sm">
                Biblioteca de Engenharia Reversa
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">8 Arquétipos Universais</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Catálogo dos 8 Distratores Psicométricos
            </h2>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Toque em um distrator para ver a mecânica e o antídoto da IA
          </span>
        </div>

        {/* Grade de Seleção dos 8 Distratores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PSYCHOMETRIC_DISTRACTORS.map((d) => {
            const isSelected = selectedDistractorId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistractorId(d.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-sm ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-dark-surface/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {renderIcon(d.icon, 'w-4 h-4')}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold block text-slate-900 dark:text-white truncate">{d.shortName}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">{d.bancaSpecialty}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalhes Expansivos do Distrator Selecionado */}
        <div className="bg-slate-50 dark:bg-slate-950/80 border border-indigo-200 dark:border-blue-500/30 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {renderIcon(activeDistractor.icon, 'w-5 h-5')}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  Bancas Especialistas: {activeDistractor.bancaSpecialty}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeDistractor.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Letalidade:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                activeDistractor.severity === 'Crítica'
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                  : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
              }`}>
                {activeDistractor.severity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Como o Examinador Constrói */}
            <div className="space-y-3 bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Como o Examinador Constrói Esta Pegadinha:
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeDistractor.examinerLogic}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Exemplo de Aplicação Real:</span>
                <p className="text-xs text-slate-700 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/60">
                  {activeDistractor.exampleSnippet}
                </p>
              </div>
            </div>

            {/* O Antídoto Estratégico da IA */}
            <div className="space-y-3 bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    O Antídoto Cognitivo da IA:
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200/90 mt-2 leading-relaxed bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  {activeDistractor.antidoteStrategy}
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onGoToSimulator?.()}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 border border-indigo-200 dark:border-blue-500/40 text-indigo-700 dark:text-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-300" />
                  <span>Simular Questão com {activeDistractor.shortName}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
