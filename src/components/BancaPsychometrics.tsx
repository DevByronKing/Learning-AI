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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner de Apresentação */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-cyan-400" />
                Psicometria Educacional & TRI
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold">
                Engenharia Reversa de Distratores
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                45.720 Questões Mapeadas
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              A Mente do Examinador Decodificada
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              As bancas não criam alternativas erradas ao acaso. Em psicometria, cada erro é um <strong className="text-white">distrator intencional</strong> calibrado para explorar uma armadilha cognitiva específica. Não estude no escuro: aprenda a desarmar os 8 arquétipos favoritos de cada banca.
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block font-semibold">Eficiência de Discriminação</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">{bancaProfile.discriminationEfficiency}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Parâmetro 'a' da TRI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Bancas Examinadoras */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-400" />
            Selecione a Banca Alvo para o Raio-X Psicométrico:
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">Análise baseada em dados reais de editais oficiais</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BANCA_PSYCHOMETRIC_PROFILES.map((bp) => {
            const isSelected = selectedBancaName === bp.banca;
            return (
              <button
                key={bp.banca}
                onClick={() => handleSelectBanca(bp.banca)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 flex items-center justify-center rounded-bl-xl shadow">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-base sm:text-lg font-black block text-white">{bp.banca}</span>
                <span className="text-xs text-slate-400 block mt-1 line-clamp-1">{bp.tagline}</span>
                <span className="text-[11px] font-semibold text-indigo-400 block mt-2">
                  {bp.totalQuestionsMapped.toLocaleString('pt-BR')} questões analisadas
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção 1: Anatomia dos Distratores da Banca Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico Visual da Distribuição dos Distratores */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
                    Raio-X da Banca
                  </span>
                  <span className="text-xs text-slate-400">Assinatura Psicométrica</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Distribuição de Distratores na {bancaProfile.banca}
                </h3>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>

            {/* Descrição do Perfil do Examinador */}
            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <strong className="text-indigo-400 block mb-1">Como a banca pensa:</strong>
              {bancaProfile.examinerPsychologicalProfile}
            </p>

            {/* Barras de Frequência dos Distratores */}
            <div className="mt-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Incidência dos Tipos de Pegadinhas nas Questões:
              </span>

              {bancaProfile.distractorDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="font-mono font-black" style={{ color: item.color }}>{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
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
          <div className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-amber-400 block">
                Regra de Ouro do Antídoto para a {bancaProfile.banca}:
              </span>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-1 leading-relaxed">
                {bancaProfile.antidoteGoldenRule}
              </p>
            </div>
          </div>
        </div>

        {/* Card de Vulnerabilidade Pessoal do Aluno */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black uppercase">
                  Diagnóstico Pessoal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Sua Vulnerabilidade na {bancaProfile.banca}
                </h3>
              </div>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>

            <div className="mt-6 text-center bg-slate-950/70 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs text-slate-400 block font-medium">Taxa de Vulnerabilidade a Pegadinhas</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <TrendingDown className="w-6 h-6 text-rose-400" />
                <span className="text-4xl font-black text-rose-400">{bancaProfile.studentVulnerabilityRate}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                De cada 10 erros cometidos nesta banca, 6.4 decorrem de distratores de relaxamento e indução, não de falta de estudo da matéria.
              </p>
            </div>

            {/* Análise Cognitiva do Aluno */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Domínio da Matéria:</strong> 82% de retenção na letra seca da CF/88 e leis estatutárias.</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Ponto Cego Psicométrico:</strong> 65% de queda em alternativas com advérbios absolutistas (*"sempre"* / *"nunca"*).</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Potencial Imediato:</strong> Desarmando este distrator, sua nota líquida sobe +7.4 pontos no simulado.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onGoToSimulator?.(bancaProfile.banca)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Treinar Simulado Contra a {bancaProfile.banca}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Seção 2: O Catálogo dos 8 Arquétipos de Distratores Psicométricos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase">
                Biblioteca de Engenharia Reversa
              </span>
              <span className="text-xs text-slate-400">8 Arquétipos Universais</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Catálogo dos 8 Distratores Psicométricos
            </h2>
          </div>

          <span className="text-xs text-slate-400">
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
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  {renderIcon(d.icon, 'w-4 h-4')}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold block text-white truncate">{d.shortName}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{d.bancaSpecialty}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalhes Expansivos do Distrator Selecionado */}
        <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                {renderIcon(activeDistractor.icon, 'w-5 h-5')}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                  Bancas Especialistas: {activeDistractor.bancaSpecialty}
                </span>
                <h3 className="text-lg font-black text-white">
                  {activeDistractor.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Letalidade:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                activeDistractor.severity === 'Crítica'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {activeDistractor.severity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Como o Examinador Constrói */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-400">
                  Como o Examinador Constrói Esta Pegadinha:
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeDistractor.examinerLogic}
              </p>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Exemplo de Aplicação Real:</span>
                <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                  {activeDistractor.exampleSnippet}
                </p>
              </div>
            </div>

            {/* O Antídoto Estratégico da IA */}
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    O Antídoto Cognitivo da IA:
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-2 leading-relaxed bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
                  {activeDistractor.antidoteStrategy}
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onGoToSimulator?.()}
                  className="w-full py-2.5 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
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
