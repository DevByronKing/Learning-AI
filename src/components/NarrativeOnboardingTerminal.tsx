'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  ShieldAlert,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
  X,
} from 'lucide-react';
import { StudentProfile } from '@/lib/types';

interface NarrativeOnboardingTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<StudentProfile>) => void;
}

export const NarrativeOnboardingTerminal: React.FC<NarrativeOnboardingTerminalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [targetExam, setTargetExam] = useState<string>('Polícia Federal - Agente');
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [weakSubject, setWeakSubject] = useState<string>('Direito Penal');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'KERNEL v2.4 INITIALIZED...',
    'INIMIGO EM COMUM MAPEADO: Bancas Examinadoras (Cebraspe, FGV, Vunesp, FCC).',
    'OBJETIVO: Encontrar os bugs do seu raciocínio antes do fiscal entregar a prova.',
  ]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilationProgress, setCompilationProgress] = useState<number>(0);

  if (!isOpen) return null;

  const handleSelectExam = (exam: string) => {
    setTargetExam(exam);
    setTerminalLogs((prev) => [
      ...prev,
      `> Alvo selecionado: [${exam}]. Aplicando engenharia reversa no edital...`,
    ]);
    setStep(2);
  };

  const handleSelectHours = (hours: number) => {
    setDailyHours(hours);
    setTerminalLogs((prev) => [
      ...prev,
      `> Disponibilidade diária: [${hours}h líquidas]. Calibrando ciclos adaptativos de Alexandre Meirelles...`,
    ]);
    setStep(3);
  };

  const handleSelectWeakSubject = (subject: string) => {
    setWeakSubject(subject);
    setTerminalLogs((prev) => [
      ...prev,
      `> Bug mental prioritário localizado: [${subject}]. Alocando bateria de desmonte de pegadinhas...`,
      'Compilando stack de aprovação...',
    ]);
    setStep(4);
    startCompilation(subject);
  };

  const startCompilation = (subject: string) => {
    setIsCompiling(true);
    let progress = 10;
    const interval = setInterval(() => {
      progress += 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsCompiling(false);
        setTerminalLogs((prev) => [
          ...prev,
          `> [OK] Matriz de pesos do edital sincronizada.`,
          `> [OK] Banco de questões calibrado para desarmar pegadinhas de ${subject}.`,
          `> [DEPLOY CONCLUÍDO]: Seu ciclo de estudos inteligente está pronto para execução.`,
        ]);
      }
      setCompilationProgress(progress);
    }, 180);
  };

  const handleFinalDeploy = () => {
    const careerMap: Record<string, any> = {
      'Polícia Federal - Agente': 'policial',
      'PRF - Policial Rodoviário': 'policial',
      'Receita Federal - Auditor': 'fiscal',
      'TJ-SP - Escrevente': 'tribunais',
      'OAB - 1ª Fase Unificada': 'juridica',
      'INSS - Técnico do Seguro': 'administrativa',
    };

    onComplete({
      targetExamTitle: targetExam,
      targetCareer: careerMap[targetExam] || 'policial',
      dailyHoursGoal: dailyHours,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl bg-[#090D16] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        
        {/* Terminal Header Bar */}
        <div className="px-4 py-3 bg-[#0D1322] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-400 font-mono text-[11px] ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              learning-ai-kernel://onboarding-copilot
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Screen / Log Feed */}
        <div className="p-4 sm:p-6 space-y-3 bg-[#070A12] border-b border-slate-800/80 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.includes('DEPLOY')
                  ? 'text-emerald-400 font-bold'
                  : log.includes('INIMIGO')
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Interactive Query Section */}
        <div className="p-6 space-y-6 bg-[#090D16]">
          
          {/* PASSO 1: CONCURSO ALVO */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  [QUERY 01 / 03]
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                  Qual concurso nós vamos invadir e desarmar juntos?
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  O algoritmo carregará a matriz de pesos e o estilo de pegadinhas da banca correspondente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: 'Polícia Federal - Agente', banca: 'Cebraspe' },
                  { name: 'PRF - Policial Rodoviário', banca: 'Cebraspe' },
                  { name: 'Receita Federal - Auditor', banca: 'FGV' },
                  { name: 'TJ-SP - Escrevente', banca: 'Vunesp' },
                  { name: 'OAB - 1ª Fase Unificada', banca: 'FGV' },
                  { name: 'INSS - Técnico do Seguro', banca: 'Cebraspe' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleSelectExam(item.name)}
                    className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Banca: {item.banca}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 2: HORAS LIVRES POR DIA */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  [QUERY 02 / 03]
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                  Qual a sua disponibilidade de processamento (horas livres por dia)?
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Calculamos o ciclo para garantir retenção máxima sem estresse cognitivo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { hours: 2, label: '2 horas / dia', badge: 'Constância Cirúrgica' },
                  { hours: 4, label: '4 horas / dia', badge: 'Alta Performance' },
                  { hours: 6, label: '6 horas / dia', badge: 'Modo Guerra' },
                  { hours: 8, label: '8h+ / dia', badge: 'Dedicação Exclusiva' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    onClick={() => handleSelectHours(item.hours)}
                    className="p-4 rounded-xl bg-slate-900/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-bold text-slate-200 group-hover:text-white block">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-semibold">
                        {item.badge}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 3: O MAIOR BUG MENTAL (PIOR MATÉRIA) */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  [QUERY 03 / 03]
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                  Onde está o seu maior bug mental hoje? (Sua pior matéria)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  A matéria que o algoritmo vai priorizar no seu ciclo e desarmar as armadilhas primeiro.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Direito Penal',
                  'Direito Constitucional',
                  'Direito Administrativo',
                  'Direito Tributário',
                  'Processo Penal',
                  'Processo Civil',
                  'Língua Portuguesa',
                  'Raciocínio Lógico',
                  'Informática / TI',
                ].map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSelectWeakSubject(subject)}
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/50 text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-amber-300 transition-colors">
                      {subject}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 4: COMPILAÇÃO E DEPLOY */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  [COMPILAÇÃO & DEPLOY]
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                  {isCompiling ? 'Compilando seu plano de ataque...' : 'Deploy Concluído com Sucesso!'}
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Status da Engenharia Reversa</span>
                  <span className="font-bold text-emerald-400">{compilationProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-200"
                    style={{ width: `${compilationProgress}%` }}
                  />
                </div>
              </div>

              {!isCompiling && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Algoritmo de Estudos Inicializado!</span>
                  </div>
                  <p className="text-emerald-200/80 text-[11px] leading-relaxed font-mono">
                    Concurso: {targetExam} • Ritmo: {dailyHours}h/dia • Ponto de Ataque: {weakSubject}.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  disabled={isCompiling}
                  onClick={handleFinalDeploy}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  <Zap className="w-4 h-4" />
                  <span>Executar Meu Ciclo de Estudos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
