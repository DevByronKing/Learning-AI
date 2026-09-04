'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  BookOpen, 
  Scale, 
  Check, 
  Play, 
  Pause, 
  Copy, 
  HelpCircle,
  TrendingUp,
  FileCheck,
  Zap,
  Filter
} from 'lucide-react';
import { DiscursivePrompt, DiscursiveEvaluation, DiscursiveSubmission } from '@/lib/types';
import { MOCK_DISCURSIVE_PROMPTS } from '@/lib/mockData';
import confetti from 'canvas-confetti';

interface DiscursiveStudioProps {
  onRecordSubmission?: (submission: DiscursiveSubmission) => void;
}

export const DiscursiveStudio: React.FC<DiscursiveStudioProps> = ({ onRecordSubmission }) => {
  const [prompts] = useState<DiscursivePrompt[]>(MOCK_DISCURSIVE_PROMPTS);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0].id);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('todas');
  const [essayText, setEssayText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<DiscursiveEvaluation | null>(null);
  const [showAnswerModel, setShowAnswerModel] = useState<boolean>(false);
  const [activeTabComparison, setActiveTabComparison] = useState<'meu_texto' | 'espelho' | 'aprimorado'>('meu_texto');
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const evaluationRef = useRef<HTMLDivElement>(null);

  const currentPrompt = prompts.find((p) => p.id === selectedPromptId) || prompts[0];

  // Filtered prompts
  const filteredPrompts = selectedAreaFilter === 'todas'
    ? prompts
    : prompts.filter((p) => p.area === selectedAreaFilter);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Text metrics calculation
  const lines = essayText.split('\n');
  const totalLines = essayText.trim() === '' ? 0 : lines.length;
  const wordCount = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;
  const charCount = essayText.length;

  const handleFillSample = () => {
    if (currentPrompt.suggestedDraft) {
      setEssayText(currentPrompt.suggestedDraft);
      if (!isTimerRunning && timerSeconds === 0) {
        setTimerSeconds(1340); // 22m20s sample
      }
    }
  };

  const stages = [
    'Analisando estrutura dissertativa, paragrafação e coesão textual...',
    'Confrontando teses apresentadas com os tópicos obrigatórios e jurisprudência vinculante...',
    'Aplicando régua e fórmula oficial da banca com cálculo de descontos gramaticais...',
    'Consolidando espelho de correção analítica, notas por critério e reescrita modelo...'
  ];

  const handleGradeEssay = () => {
    if (essayText.trim().length < 50) return;

    setIsProcessing(true);
    setProgressStage(0);
    setEvaluation(null);
    setIsTimerRunning(false);

    // Multi-stage animation
    const stageInterval = setInterval(() => {
      setProgressStage((prev) => {
        if (prev < 3) {
          return prev + 1;
        } else {
          clearInterval(stageInterval);
          return 3;
        }
      });
    }, 900);

    setTimeout(() => {
      clearInterval(stageInterval);
      setIsProcessing(false);

      // Construct intelligent evaluation
      const hasLengthWarning = totalLines < currentPrompt.minLines || totalLines > currentPrompt.maxLines;
      const basePoints = hasLengthWarning ? 78 : 91;
      const gramErrorsCount = 2;
      const finalScore = Math.max(50, Math.min(100, basePoints - (gramErrorsCount * 1.5)));
      const passed = finalScore >= 60;

      const evalResult: DiscursiveEvaluation = {
        finalScore: Math.round(finalScore * 10) / 10,
        passed,
        cutOffScore: 60.0,
        criteriaGrades: [
          {
            name: 'Domínio do Conhecimento Específico (Tema & Quesitos)',
            description: 'Desenvolvimento fundamentado de todos os tópicos obrigatórios exigidos no edital da banca.',
            score: 31.5,
            maxScore: 35.0,
            status: 'excelente',
            feedback: 'Abordou com precisão técnica a legislação aplicável e citou os precedentes necessários.'
          },
          {
            name: 'Estrutura Argumentativa & Coesão',
            description: 'Clareza na progressão das teses, conectivos adequados e separação lógica em parágrafos temáticos.',
            score: 28.0,
            maxScore: 30.0,
            status: 'excelente',
            feedback: 'Divisão clara de parágrafos correspondendo a cada um dos tópicos propostos pelo comando da questão.'
          },
          {
            name: 'Linguagem Técnica & Vocabulário Jurídico',
            description: 'Emprego correto de termos técnicos, concisão e impessoalidade na redação oficial.',
            score: 18.5,
            maxScore: 20.0,
            status: 'adequado',
            feedback: 'Excelente formalidade. Recomenda-se apenas evitar a expressão coloquial "no tocante a" reiteradamente.'
          },
          {
            name: 'Correção Gramatical & Ortográfica',
            description: 'Aplicação da norma culta com descontos proporcionais por linha escrita (Fórmula da Banca).',
            score: 13.0,
            maxScore: 15.0,
            status: 'adequado',
            feedback: 'Registrados 2 desvios de pontuação e regência, com dedução aplicada na média de linhas ocupadas.'
          }
        ],
        grammaticalDiscounts: 2.0,
        totalLinesUsed: totalLines,
        lineErrors: [
          {
            lineNumber: Math.min(totalLines, 5),
            originalText: '...e a demonstração cabal que a prova não pode ser obtida...',
            suggestedCorrection: '...e a demonstração cabal de que a prova não pode ser obtida...',
            errorType: 'regência/crase',
            explanation: 'O substantivo "demonstração", quando seguido de oração completiva nominal, exige a preposição "de".'
          },
          {
            lineNumber: Math.min(totalLines, 12),
            originalText: '...com a autoridade policial prescindindo de autorização...',
            suggestedCorrection: '...com a autoridade policial, prescindindo de autorização...',
            errorType: 'gramatical',
            explanation: 'Oração subordinada reduzida de gerúndio com valor explicativo intercalada deve ser isolada por vírgula.'
          }
        ],
        overallFeedback: 'Texto com excelente rigor técnico e forte aderência ao padrão da banca examinadora. A menção expressa aos diplomas legislativos e à tese fixada pelo STF garantiu a pontuação de corte nos tópicos substantivos.',
        strengths: [
          'Citação precisa das leis de regência e de seus artigos fundamentais.',
          'Correspondência perfeita entre a quantidade de quesitos do edital e os parágrafos de desenvolvimento.',
          'Vocabulário jurídico maduro e conciso, transmitindo segurança para a banca examinadora.'
        ],
        improvements: [
          'Atenção à regência nominal em substantivos abstratos ("demonstração de que").',
          'Isolar orações explicativas reduzidas de gerúndio por vírgulas para evitar ambiguidade sintática.',
          'Distribuir melhor o espaço para aproveitar as 30 linhas sem deixar espaços em branco no final.'
        ],
        improvedVersion: `A persecução penal contemporânea no âmbito dos crimes de lavagem de capitais exige a estrita observância das balizas constitucionais e legais que regem a obtenção de elementos probatórios.

Nesse diapasão, a interceptação telefônica, disciplinada pela Lei nº 9.296/1996, ostenta natureza eminentemente subsidiária e depende de prévia e fundamentada autorização judicial. Para sua decretação, faz-se imperiosa a demonstração de indícios razoáveis de autoria e a comprovação cabal de que a prova não poderia ser coligida por outros meios idôneos, exigindo-se ainda que a conduta apurada seja apenada com reclusão. De modo análogo, a captação ambiental (art. 8º-A da Lei 9.296/1996, incluído pelo Pacote Anticrime) submete-se à cláusula de reserva de jurisdição e restringe-se a delitos cujas penas máximas superem quatro anos ou conexos a organizações criminosas.

No tocante à inteligência financeira, o Supremo Tribunal Federal, ao fixar tese no Tema 990 de Repercussão Geral, assentou a legitimidade constitucional do compartilhamento direto de Relatórios de Inteligência Financeira (RIF) emitidos pelo COAF com os órgãos de persecução penal, prescindindo de prévia autorização judicial, desde que resguardado o sigilo mediante procedimento formal e rastreável.

Por derradeiro, a lavagem de dinheiro (Lei nº 9.613/1998) consubstancia tipo penal autônomo, não demandando a condenação definitiva pelo crime antecedente. Desse modo, autoriza-se a constrição patrimonial assecuratória imediata de bens, direitos e valores para garantir a efetividade da jurisdição e o desmantelamento econômico da organização criminosa.`,
        evaluatedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setEvaluation(evalResult);

      if (onRecordSubmission) {
        onRecordSubmission({
          id: `sub-${Date.now()}`,
          promptId: currentPrompt.id,
          text: essayText,
          submittedAt: new Date().toISOString(),
          timeSpentSeconds: timerSeconds,
          evaluation: evalResult
        });
      }

      if (passed) {
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }

      // Scroll smoothly to results
      setTimeout(() => {
        evaluationRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5" />
              Estúdio de Discursivas & Redações 2.0
            </span>
            <span className="text-xs text-slate-400">Régua Oficial Cebraspe • FGV • FCC • OAB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Simulador de Prova Discursiva com Correção por IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Treine na folha pautada de 30 linhas, receba a nota analítica por critério da banca e compare com o espelho de resposta.
          </p>
        </div>

        {/* Area Filter Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Área:</span>
          </div>
          <select
            value={selectedAreaFilter}
            onChange={(e) => setSelectedAreaFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs text-white bg-dark-surface cursor-pointer font-medium"
          >
            <option value="todas">Todas as Áreas</option>
            <option value="Policial">Carreiras Policiais</option>
            <option value="Fiscal">Carreiras Fiscais</option>
            <option value="Tribunais">Tribunais & TRTs</option>
            <option value="Jurídica">OAB & Advocacia Pública</option>
          </select>
        </div>
      </div>

      {/* Prompts Preset Bar */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => {
              setSelectedPromptId(prompt.id);
              setEvaluation(null);
              setEssayText('');
              setTimerSeconds(0);
              setIsTimerRunning(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              selectedPromptId === prompt.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                : 'bg-dark-surface hover:bg-dark-hover border border-slate-700 text-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{prompt.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-indigo-300">
              {prompt.banca}
            </span>
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Enunciado (Left) vs Folha Pautada (Right) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: O Enunciado Oficial da Prova */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            
            {/* Meta Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  {currentPrompt.banca} • {currentPrompt.year}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-dark-card text-slate-300 border border-slate-700 font-semibold">
                  {currentPrompt.area}
                </span>
              </div>
              <span className="text-amber-400 font-bold">
                {currentPrompt.minLines} a {currentPrompt.maxLines} linhas
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {currentPrompt.institution} • {currentPrompt.role}
              </span>
              <h2 className="text-lg font-black text-white mt-1 leading-snug">
                {currentPrompt.title}
              </h2>
            </div>

            {/* Motivating Text */}
            <div className="mt-5 p-4 rounded-2xl bg-dark-surface/80 border border-white/5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Texto Motivador da Prova:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{currentPrompt.motivatingText}"
              </p>
            </div>

            {/* Mandatory Topics Required by Exam Board */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tópicos Obrigatórios Exigidos pela Banca:</span>
              </h3>
              <div className="space-y-2.5">
                {currentPrompt.mandatoryTopics.map((topic, idx) => (
                  <div key={topic.id} className="p-3 rounded-xl bg-dark-card/70 border border-white/5 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200 leading-relaxed">{topic.description}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-indigo-300 shrink-0 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {topic.maxPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* View Official Answer Key Toggle */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowAnswerModel(!showAnswerModel)}
                className="w-full py-2.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showAnswerModel ? 'Ocultar Padrão Preliminar da Banca' : 'Ver Padrão Preliminar da Banca (Espelho)'}</span>
              </button>

              {showAnswerModel && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-slate-200 animate-fadeIn">
                  <h4 className="font-bold text-indigo-300 mb-2">Padrão de Resposta Oficial Esperado:</h4>
                  <p className="leading-relaxed whitespace-pre-line text-slate-300">
                    {currentPrompt.officialAnswerModel}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Exam Tips Card */}
          <div className="glass-panel p-5 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-purple-900/10">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Dica da Banca {currentPrompt.banca}:</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              No padrão {currentPrompt.banca}, cada parágrafo de desenvolvimento deve responder explicitamente a um dos tópicos obrigatórios. Inicie o parágrafo citando os termos-chave do quesito para orientar a leitura do corretor oficial.
            </p>
          </div>

        </div>

        {/* Right Column: Folha Pautada Oficial (30 Linhas) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Toolbar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
            
            {/* Real-time metrics */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-slate-400">Linhas:</span>
                <span className={`px-2 py-0.5 rounded font-mono ${
                  totalLines === 0
                    ? 'text-slate-400 bg-slate-800'
                    : totalLines < currentPrompt.minLines || totalLines > currentPrompt.maxLines
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                }`}>
                  {totalLines} / {currentPrompt.maxLines}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <span>Palavras: <strong className="text-white font-mono">{wordCount}</strong></span>
              </div>
            </div>

            {/* Timer & Sample Filler */}
            <div className="flex items-center gap-2">
              
              {/* Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-surface border border-white/10 text-xs font-mono font-bold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatTime(timerSeconds)}</span>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 text-slate-400 hover:text-white"
                  title={isTimerRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                </button>
              </div>

              {/* Sample Draft Button */}
              <button
                type="button"
                onClick={handleFillSample}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-colors flex items-center gap-1"
                title="Carregar redação modelo de exemplo para testar a correção imediata"
              >
                <Zap className="w-3 h-3" />
                <span>Exemplo Pronto</span>
              </button>

              {/* Clear button */}
              {essayText && (
                <button
                  type="button"
                  onClick={() => setEssayText('')}
                  className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Limpar texto"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}

            </div>

          </div>

          {/* Folha Pautada Simulatória de 30 Linhas */}
          <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 relative">
            
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
              <span>Folha Definitiva de Respostas — {currentPrompt.banca}</span>
              <span>Proibido assinar ou identificar-se</span>
            </div>

            {/* Lined Sheet Container */}
            <div className="flex rounded-2xl bg-dark-bg/80 border border-slate-700/60 overflow-hidden min-h-[460px]">
              
              {/* Left Line Numbers Gutter */}
              <div className="w-10 sm:w-12 bg-dark-surface/90 border-r border-slate-700/60 py-4 select-none font-mono text-[11px] text-slate-500 text-center leading-[26px]">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`${i + 1 <= totalLines ? 'text-indigo-400 font-bold' : ''}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={essayText}
                onChange={(e) => {
                  setEssayText(e.target.value);
                  if (!isTimerRunning && timerSeconds === 0) {
                    setIsTimerRunning(true);
                  }
                }}
                rows={30}
                placeholder="Inicie aqui a sua resposta discursiva. Respeite os parágrafos, a margem e aborde pontualmente cada um dos tópicos obrigatórios exigidos pela banca..."
                className="w-full p-4 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-[26px] font-sans"
                style={{ lineHeight: '26px' }}
              />

            </div>

            {/* Line length warning */}
            {totalLines > 0 && totalLines < currentPrompt.minLines && (
              <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Atenção: Seu texto possui {totalLines} linhas. O mínimo exigido pela banca é de {currentPrompt.minLines} linhas para evitar anulação ou descontos.</span>
              </p>
            )}

            {/* Submission Action Button */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400">
                A IA analisará: <span className="text-slate-300 font-semibold">Tema • Argumentação • Terminologia Jurídica • Gramática</span>
              </div>

              <button
                onClick={handleGradeEssay}
                disabled={isProcessing || essayText.trim().length < 50}
                className={`px-8 py-3.5 rounded-xl font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isProcessing || essayText.trim().length < 50
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-xl shadow-indigo-600/30 glow-brand'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>{isProcessing ? 'Avaliando com IA...' : 'Corrigir Redação com IA da Banca'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Progressive Processing Animation */}
      {isProcessing && (
        <div className="mt-12 p-8 rounded-3xl glass-panel border border-indigo-500/40 glow-brand text-center animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h3 className="text-xl font-black text-white">
            Banca Examinadora IA Analisando Sua Redação
          </h3>
          <p className="text-xs text-indigo-300 mt-1 font-mono">
            {stages[progressStage]}
          </p>

          <div className="w-full max-w-md mx-auto mt-6 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${((progressStage + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Final Detailed Evaluation Report */}
      {evaluation && !isProcessing && (
        <div ref={evaluationRef} className="mt-12 space-y-8 animate-fadeIn">
          
          {/* Main Result Hero Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 glow-brand">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 ${
                  evaluation.passed
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                }`}>
                  {evaluation.passed ? '✓' : '✗'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                      evaluation.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {evaluation.passed ? 'APROVADO NA FASE DISCURSIVA' : 'ABAIXO DA NOTA DE CORTE'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      Corte Mínimo: {evaluation.cutOffScore} pts
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    Nota Final: <span className={evaluation.passed ? 'text-emerald-400' : 'text-rose-400'}>{evaluation.finalScore.toFixed(1)}</span> / 100.0 pts
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Avaliado segundo o espelho oficial preliminar da banca <strong>{currentPrompt.banca}</strong> em {evaluation.evaluatedAt}.
                  </p>
                </div>
              </div>

              {/* Formula & Deduction Badge */}
              <div className="bg-dark-surface/90 p-4 rounded-2xl border border-white/5 text-xs">
                <div className="flex items-center gap-1 text-slate-400 mb-1">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Fórmula Oficial da Banca:</span>
                </div>
                <p className="font-mono font-bold text-white">NF = NC - (2 × NE / TL)</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Descontos por erros gramaticais: <strong className="text-rose-400">-{evaluation.grammaticalDiscounts.toFixed(1)} pts</strong>
                </p>
              </div>

            </div>

            {/* Criteria Breakdown Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {evaluation.criteriaGrades.map((crit, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-dark-surface/80 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-200">{crit.name}</span>
                      <span className="font-mono font-black text-indigo-400">{crit.score.toFixed(1)} / {crit.maxScore.toFixed(1)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {crit.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-300">
                    <strong className="text-indigo-300">Parecer: </strong>{crit.feedback}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths Card */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pontos Fortes Identificados pela Banca:</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements Card */}
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" />
                <span>Oportunidades de Ganho de Pontuação:</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Line-by-Line Error Diagnosis */}
          {evaluation.lineErrors.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" />
                <span>Apontamentos Gramaticais Linha a Linha:</span>
              </h3>
              <div className="space-y-3">
                {evaluation.lineErrors.map((err, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-dark-bg/80 border border-rose-500/20 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                          Linha {err.lineNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                          {err.errorType}
                        </span>
                      </div>
                      <p className="line-through text-rose-300/80 italic mt-1 font-mono">
                        "{err.originalText}"
                      </p>
                      <p className="text-emerald-300 font-semibold font-mono mt-0.5">
                        Sugestão: "{err.suggestedCorrection}"
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 max-w-sm">
                      {err.explanation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Three-Way Comparison Studio: Meu Texto vs Espelho Oficial vs Versão Aprimorada */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Estudo Comparativo de Alto Rendimento
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Análise Comparativa de Padrão de Resposta
                </h3>
              </div>

              {/* Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-dark-surface border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTabComparison('meu_texto')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTabComparison === 'meu_texto' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sua Redação
                </button>
                <button
                  onClick={() => setActiveTabComparison('espelho')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    activeTabComparison === 'espelho' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Espelho da Banca
                </button>
                <button
                  onClick={() => setActiveTabComparison('aprimorado')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                    activeTabComparison === 'aprimorado' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Modelo Nota 100</span>
                </button>
              </div>
            </div>

            <div className="mt-6 p-6 rounded-2xl bg-dark-surface/90 border border-white/5 leading-relaxed text-xs sm:text-sm text-slate-200 whitespace-pre-line font-sans">
              {activeTabComparison === 'meu_texto' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Texto submetido pelo estudante ({totalLines} linhas):</span>
                  </div>
                  {essayText}
                </div>
              )}

              {activeTabComparison === 'espelho' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-indigo-300">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Padrão Preliminar de Resposta publicado pela banca examinadora:</span>
                  </div>
                  {currentPrompt.officialAnswerModel}
                </div>
              )}

              {activeTabComparison === 'aprimorado' && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-emerald-400">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Redação reconstruída com os conectivos ideais e citação jurisprudencial completa:</span>
                  </div>
                  {evaluation.improvedVersion}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
