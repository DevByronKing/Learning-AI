'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Flame, 
  Filter, 
  RotateCcw, 
  ChevronRight,
  BrainCircuit,
  Award,
  Layers,
  Trophy,
  Maximize2,
  Minimize2,
  Highlighter,
  Scissors,
  Keyboard,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Question, QuestionAttempt, Flashcard, UserMetrics } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { CognitiveDiagnosisCard } from './CognitiveDiagnosisCard';
import { FullMockExamSimulator } from './FullMockExamSimulator';
import { ExamNotice, SubscriptionPlan } from '@/lib/types';
import { useStudyStore } from '@/store/useStudyStore';

interface QuizSimulatorProps {
  onAddFlashcard: (flashcard: Flashcard) => void;
  onAddFlashcardsBatch?: (flashcards: Flashcard[]) => void;
  onRecordAttempt: (attempt: QuestionAttempt) => void;
  metrics: UserMetrics;
  exams?: ExamNotice[];
  selectedExam?: ExamNotice;
  onSelectExam?: (exam: ExamNotice) => void;
  userPlan?: SubscriptionPlan;
  dailyAiCount?: number;
  onOpenPricing?: () => void;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({
  onAddFlashcard,
  onAddFlashcardsBatch,
  onRecordAttempt,
  metrics,
  exams = [],
  selectedExam,
  onSelectExam,
  userPlan = 'aspirante',
  dailyAiCount = 0,
  onOpenPricing
}) => {
  const [simulatorMode, setSimulatorMode] = useState<'quick' | 'full_mock' | 'ai_generator'>('quick');
  const [bonusAiCredits, setBonusAiCredits] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<'alta' | 'media' | 'chute'>('alta');
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('todas');

  // Zen Mode & Prova Física Highlighting
  const [isZenMode, setIsZenMode] = useState(false);
  const [highlightedSnippets, setHighlightedSnippets] = useState<string[]>([]);
  const [strikethroughSnippets, setStrikethroughSnippets] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState<string>('');

  // AI Generator specific states
  const [aiBanca, setAiBanca] = useState<'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp'>('Cebraspe');
  const [aiSubject, setAiSubject] = useState<string>('Direito Constitucional');
  const [aiDifficulty, setAiDifficulty] = useState<string>('Alta Maldade (Nível Auditor / Juiz)');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<Question | null>(null);
  const [aiSelectedOptionId, setAiSelectedOptionId] = useState<string | null>(null);
  const [aiIsAnswered, setAiIsAnswered] = useState<boolean>(false);

  // Filter questions
  const filteredByExam = selectedExam 
    ? questions.filter(q => q.banca === selectedExam.banca) // Simulação: filtra por banca do concurso
    : questions;

  const filteredQuestions = selectedSubjectFilter === 'todas'
    ? filteredByExam
    : filteredByExam.filter((q) => q.subjectId === selectedSubjectFilter || q.subjectName.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Timer effect
  useEffect(() => {
    if (isAnswered) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnswered, currentIndex]);

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;

    const selectedOpt = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    setIsAnswered(true);

    const attempt: QuestionAttempt = {
      id: `attempt-${Date.now()}`,
      questionId: currentQuestion.id,
      selectedOptionId,
      isCorrect,
      answeredAt: new Date().toISOString(),
      timeSpentSeconds,
      diagnostic: {
        confidenceLevel: confidence,
        feedback: isCorrect ? 'Acerto consistente' : 'Erro diagnosticado pela IA',
        actionableAdvice: currentQuestion.cognitiveAnalysis.commonTrap,
        suggestedReviewTopic: currentQuestion.topicName,
        flashcardFront: currentQuestion.statement,
        flashcardBack: currentQuestion.explanation
      }
    };

    onRecordAttempt(attempt);

    // Sincronização automática com a Store Global
    const store = useStudyStore.getState();
    store.selectAnswer(currentQuestion.id, selectedOptionId);
    store.revealAnswer(currentQuestion.id);
    store.addStudyMinutes(Math.max(1, Math.round(timeSpentSeconds / 60)));
    store.updateAccuracy(1, isCorrect ? 1 : 0);

    if (!isCorrect) {
      store.addMistake({
        id: `mistake-${Date.now()}`,
        question: currentQuestion,
        attemptDate: new Date().toISOString().split('T')[0],
        userSelectedOptionId: selectedOptionId,
        errorType: 'pegadinha_banca',
        confidenceLevel: confidence,
        feedback: 'Erro registrado durante o treino cognitivo',
        actionableAdvice: currentQuestion.cognitiveAnalysis.commonTrap,
        userPersonalNote: '',
        isOvercome: false,
        revancheAttemptsCount: 0,
      });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOptionId(null);
    setTimeSpentSeconds(0);
    setConfidence('alta');
    setHighlightedSnippets([]);
    setStrikethroughSnippets([]);
    setPersonalNotes('');
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Keyboard Shortcuts: A-E to select, Enter to confirm, ArrowRight/N to next, F for Zen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const key = e.key.toUpperCase();

      // F for Zen Mode
      if (key === 'F' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsZenMode(prev => !prev);
        return;
      }

      if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
        return;
      }

      if (isAnswered) {
        if (e.key === 'Enter' || e.key === 'ArrowRight' || key === 'N') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (currentQuestion) {
        const optionKeys = ['A', 'B', 'C', 'D', 'E'];
        const numberKeys = ['1', '2', '3', '4', '5'];

        let optIdx = optionKeys.indexOf(key);
        if (optIdx === -1) optIdx = numberKeys.indexOf(key);

        if (optIdx !== -1 && optIdx < currentQuestion.options.length) {
          e.preventDefault();
          setSelectedOptionId(currentQuestion.options[optIdx].id);
          return;
        }

        if (e.key === 'Enter' && selectedOptionId) {
          e.preventDefault();
          handleConfirmAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQuestion, selectedOptionId, isZenMode]);

  // Highlighting de Prova Física
  const handleHighlightSelection = (type: 'mark' | 'strike') => {
    const selection = window.getSelection()?.toString().trim();
    if (!selection || selection.length < 2) return;

    if (type === 'mark') {
      setHighlightedSnippets(prev => Array.from(new Set([...prev, selection])));
    } else {
      setStrikethroughSnippets(prev => Array.from(new Set([...prev, selection])));
    }
  };

  const handleClearHighlights = () => {
    setHighlightedSnippets([]);
    setStrikethroughSnippets([]);
  };

  // AI Question Generation Handler
  const handleGenerateQuestion = () => {
    setIsGeneratingAI(true);
    setGeneratedQuestion(null);
    setAiSelectedOptionId(null);
    setAiIsAnswered(false);

    setTimeout(() => {
      let q: Question;

      if (aiBanca === 'Cebraspe') {
        q = {
          id: `ai-gen-${Date.now()}`,
          subjectId: 'sub-ai',
          subjectName: aiSubject,
          topicId: 'top-ai',
          topicName: `${aiSubject} — Tópico Preditivo`,
          banca: 'Cebraspe',
          year: 2026,
          institution: 'Inédita por IA',
          statement: `Julgue o item subsequente à luz da jurisprudência consolidada dos Tribunais Superiores e da ordem constitucional vigente:\n\nA nulidade decorrente da ausência de intimação do investigado para prestar esclarecimentos prévios à instauração formal de processo disciplinar administrativo possui natureza absoluta, invalidando ab initio qualquer ato punitivo subsequente, independentemente de demonstração de prejuízo concreto à ampla defesa.`,
          codeCitation: 'Súmula Vinculante 5 do STF e Princípio do Pas de Nullité Sans Grief',
          options: [
            { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Achar que qualquer falta procedimental prévia acarreta nulidade absoluta automática.' },
            { id: 'opt-e', text: 'ERRADO', isCorrect: true }
          ],
          explanation: `GABARITO: ERRADO. No direito processual e administrativo sancionador, vige o princípio pás de nullité sans grief (não há nulidade sem prejuízo). Ademais, a fase prévia de sindicância ou investigação preliminar possui natureza meramente inquisitorial, na qual não é obrigatório o contraditório prévio pleno (Súmula Vinculante 5 do STF e jurisprudência pacificada do STJ).`,
          lawArticles: ['Súmula Vinculante 5/STF', 'Art. 5º, LV da CF/88'],
          cognitiveAnalysis: {
            commonTrap: 'O Cebraspe adora afirmar categoricamente "possui natureza absoluta e prescinde de demonstração de prejuízo". Quase sempre que o Cebraspe usa termos absolutos em nulidades administrativas, o item está ERRADO.',
            keyConcept: 'Natureza inquisitorial da investigação preliminar e necessidade de prova de prejuízo.',
            bancaTendency: 'Cobrança da relativização das nulidades formais pela banca examinadora.'
          }
        };
      } else if (aiBanca === 'FGV') {
        q = {
          id: `ai-gen-${Date.now()}`,
          subjectId: 'sub-ai',
          subjectName: aiSubject,
          topicId: 'top-ai',
          topicName: `${aiSubject} — Caso Hipotético FGV`,
          banca: 'FGV',
          year: 2026,
          institution: 'Inédita por IA',
          statement: `Determinada concessionária de serviço público federal celebrou aditivo contratual para reequilíbrio econômico-financeiro em razão de oscilações cambiais extraordinárias e imprevisíveis decorrentes de conflito geopolítico internacional. O Tribunal de Contas da União (TCU) expediu medida cautelar monocrática determinando a imediata retenção de pagamentos das faturas mensais devidas à concessionária.\n\nInconformada, a empresa contratada impetrou Mandado de Segurança perante o Supremo Tribunal Federal.\n\nCom base na jurisprudência vinculante do STF e no regime jurídico das concessões de serviço público, assinale a opção correta:`,
          codeCitation: 'Súmula Vinculante 3 do STF e Art. 71 da CF/88',
          options: [
            { id: 'opt-a', text: 'O TCU possui competência cautelar implícita para determinar retenções patrimoniais cautelares sem prévio contraditório quando demonstrado perigo de dano irreparável ao erário.', isCorrect: true },
            { id: 'opt-b', text: 'A decisão do TCU é nula, visto que a Corte de Contas não integra o Poder Judiciário e é desprovida de qualquer poder geral de cautela constitucional.', isCorrect: false },
            { id: 'opt-c', text: 'O mandado de segurança deveria ter sido impetrado perante o Superior Tribunal de Justiça, órgão competente para atos do TCU.', isCorrect: false },
            { id: 'opt-d', text: 'O reequilíbrio econômico-financeiro por variação cambial é vedado em qualquer hipótese pelas normas gerais de direito financeiro.', isCorrect: false },
            { id: 'opt-e', text: 'A retenção de pagamentos exige prévia autorização judicial do juiz federal da seção judiciária da sede da concessionária.', isCorrect: false }
          ],
          explanation: `GABARITO: A. O STF fixou (MS 24.510 e MS 26.547) que o Tribunal de Contas da União possui PODER GERAL DE CAUTELA com assento implícito no art. 71 da CF/88 (Teoria dos Poderes Implícitos), podendo determinar medidas cautelares inaudita altera parte para resguardar o erário contra danos irreparáveis.`,
          lawArticles: ['Art. 71 da CF/88', 'MS 24.510/STF'],
          cognitiveAnalysis: {
            commonTrap: 'Assumir que por não ser Judiciário, o Tribunal de Contas não pode deferir cautelares restritivas.',
            keyConcept: 'Poder Geral de Cautela do Tribunal de Contas da União e Teoria dos Poderes Implícitos.',
            bancaTendency: 'A FGV constrói enunciados com conflitos entre direito regulatório, contratos administrativos e controle externo.'
          }
        };
      } else {
        q = {
          id: `ai-gen-${Date.now()}`,
          subjectId: 'sub-ai',
          subjectName: aiSubject,
          topicId: 'top-ai',
          topicName: `${aiSubject} — Literalidade FCC`,
          banca: aiBanca,
          year: 2026,
          institution: 'Inédita por IA',
          statement: `Nos termos da Nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021), a vigência dos contratos de serviços e fornecimentos contínuos poderá ser prorrogada sucessivamente, respeitada a vigência máxima decenal (10 anos), desde que:`,
          codeCitation: 'Art. 106 e Art. 107 da Lei 14.133/2021',
          options: [
            { id: 'opt-a', text: 'Haja autorização expressa do Tribunal de Contas respectivo em cada exercício financeiro.', isCorrect: false },
            { id: 'opt-b', text: 'A autoridade competente ateste que as condições e os preços permanecem vantajosos para a Administração, permitida a negociação com o contratado.', isCorrect: true },
            { id: 'opt-c', text: 'O valor total acumulado não ultrapasse 20% do orçamento anual do órgão licitante.', isCorrect: false },
            { id: 'opt-d', text: 'O contratado seja microempresa ou empresa de pequeno porte sediada no local da prestação.', isCorrect: false },
            { id: 'opt-e', text: 'O prazo inicial de contratação tenha sido de no mínimo 60 meses ininterruptos.', isCorrect: false }
          ],
          explanation: `GABARITO: B. Conforme o Art. 106 e 107 da Lei nº 14.133/2021, a prorrogação sucessiva de contratos de serviços e fornecimentos contínuos até o limite de 10 anos depende de atesto da autoridade de que os preços e condições permanecem vantajosos, admitida expressamente a negociação contratual.`,
          lawArticles: ['Art. 106 da Lei 14.133/2021', 'Art. 107 da Lei 14.133/2021'],
          cognitiveAnalysis: {
            commonTrap: 'Confundir o regramento antigo da Lei 8.666/93 (limite de 60 meses + 12 extraordinários) com a nova regra decenal (até 10 anos da Lei 14.133).',
            keyConcept: 'Duração dos contratos de serviços contínuos na Lei 14.133.',
            bancaTendency: 'A FCC cobra com rigor literal as novidades da Nova Lei de Licitações.'
          }
        };
      }

      setGeneratedQuestion(q);
      setIsGeneratingAI(false);
    }, 900);
  };

  const handleConfirmAIAnswer = () => {
    if (!aiSelectedOptionId || !generatedQuestion) return;

    setAiIsAnswered(true);
    const selectedOpt = generatedQuestion.options.find(o => o.id === aiSelectedOptionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    const attempt: QuestionAttempt = {
      id: `ai-attempt-${Date.now()}`,
      questionId: generatedQuestion.id,
      selectedOptionId: aiSelectedOptionId,
      isCorrect,
      answeredAt: new Date().toISOString(),
      timeSpentSeconds: 30,
      diagnostic: {
        confidenceLevel: 'alta',
        feedback: isCorrect ? 'Acerto na questão gerada por IA' : 'Erro na questão inédita',
        actionableAdvice: generatedQuestion.cognitiveAnalysis.commonTrap,
        suggestedReviewTopic: generatedQuestion.topicName,
        flashcardFront: generatedQuestion.statement,
        flashcardBack: generatedQuestion.explanation
      }
    };

    onRecordAttempt(attempt);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Mode Switcher Bar */}
      <div className="flex items-center justify-center sm:justify-start mb-6">
        <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-300 dark:border-white/10 text-xs shadow-lg gap-1">
          <button
            onClick={() => setSimulatorMode('quick')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              simulatorMode === 'quick'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Treino Rápido por Matéria</span>
          </button>
          
          <button
            onClick={() => setSimulatorMode('ai_generator')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              simulatorMode === 'ai_generator'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold shadow-md shadow-blue-600/25'
                : 'text-blue-500 hover:text-blue-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Gerador Inédito com IA</span>
          </button>

          <button
            onClick={() => setSimulatorMode('full_mock')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
              simulatorMode === 'full_mock'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md shadow-amber-500/30 glow-emerald'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Provas Anteriores & Simulados Oficiais</span>
          </button>
        </div>
      </div>

      {simulatorMode === 'full_mock' ? (
        <FullMockExamSimulator
          onAddFlashcardsBatch={onAddFlashcardsBatch}
          onGoBackToQuickQuiz={() => setSimulatorMode('quick')}
          userPlan={userPlan}
          onOpenPricing={onOpenPricing}
        />
      ) : simulatorMode === 'ai_generator' ? (
        /* AI GENERATOR VIEW */
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* AI Generator Control Box */}
          <div className="glass-panel p-6 rounded-[2rem] bg-white/70 dark:bg-dark-card/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-spin-slow" />
              <span>Simulador de Questões Inéditas com IA Preditiva</span>
            </div>
            
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Gere Questões Nunca Vistas no Estilo Exato da Banca
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Já decorou as questões anteriores? Nossa IA replica a semântica do Cebraspe, os casos práticos da FGV e a literalidade da FCC.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Banca Alvo:</label>
                <select
                  value={aiBanca}
                  onChange={(e) => setAiBanca(e.target.value as any)}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Cebraspe">Cebraspe (Certo / Errado)</option>
                  <option value="FGV">FGV (Casos Práticos A-E)</option>
                  <option value="FCC">FCC (Literalidade e Prazos)</option>
                  <option value="Vunesp">Vunesp (Direito Geral)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Disciplina:</label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Direito Constitucional">Direito Constitucional</option>
                  <option value="Direito Administrativo">Direito Administrativo</option>
                  <option value="Direito Tributário">Direito Tributário</option>
                  <option value="Direito Previdenciário">Direito Previdenciário</option>
                  <option value="Direito Penal">Direito Penal</option>
                  <option value="Informática e Segurança">Informática e Segurança</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Nível de Rigor:</label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full bg-white dark:bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Moderado (Nível Técnico/Analista)">Moderado (Técnico/Analista)</option>
                  <option value="Alta Maldade (Nível Auditor / Juiz)">Alta Maldade (Auditor / Juiz)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateQuestion}
                disabled={isGeneratingAI}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs tracking-wide shadow-xl shadow-blue-600/25 active:scale-95 transition-all"
              >
                {isGeneratingAI ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Engenharia Reversa da Banca em Execução...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GERAR QUESTÃO INÉDITA COM IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Question Display */}
          {generatedQuestion && (
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-blue-500/20 shadow-2xl space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-500/30">
                    QUESTÃO INÉDITA IA
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {generatedQuestion.banca} • {generatedQuestion.subjectName}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{generatedQuestion.topicName}</span>
              </div>

              {/* Statement */}
              <div className="bg-slate-50 dark:bg-dark-bg p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                  {generatedQuestion.statement}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {generatedQuestion.options.map((option) => {
                  const isSelected = aiSelectedOptionId === option.id;
                  let style = 'bg-white dark:bg-dark-bg/60 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-white/20 hover:shadow-sm';

                  if (aiIsAnswered) {
                    if (option.isCorrect) {
                      style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200';
                    } else if (isSelected && !option.isCorrect) {
                      style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500 text-rose-800 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-blue-50 dark:bg-blue-600/20 border-blue-400 dark:border-blue-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-blue-300 dark:ring-transparent';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={aiIsAnswered}
                      onClick={() => setAiSelectedOptionId(option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-medium flex items-center justify-between gap-3 ${style}`}
                    >
                      <span>{option.text}</span>
                      {aiIsAnswered && option.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Confirm or Cognitive Feedback */}
              {!aiIsAnswered ? (
                <div className="flex justify-end pt-2">
                  <button
                    disabled={!aiSelectedOptionId}
                    onClick={handleConfirmAIAnswer}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-blue-600/25 disabled:opacity-40 text-white font-bold text-xs tracking-wide shadow-lg transition-all"
                  >
                    Confirmar Resposta
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300">
                      <span>Fundamentação e Justificativa da IA:</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{generatedQuestion.codeCitation}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{generatedQuestion.explanation}</p>
                    <div className="bg-indigo-100/50 dark:bg-dark-bg/80 p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/10 text-indigo-800 dark:text-indigo-200">
                      💡 <strong>Pegadinha Evitada:</strong> {generatedQuestion.cognitiveAnalysis.commonTrap}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => onAddFlashcard({
                        id: `fc-ai-${Date.now()}`,
                        subjectName: generatedQuestion.subjectName,
                        topicName: generatedQuestion.topicName,
                        front: generatedQuestion.statement,
                        back: generatedQuestion.explanation,
                        nextReviewDate: new Date().toISOString().split('T')[0],
                        intervalDays: 1,
                        repetitions: 0,
                        easeFactor: 2.5
                      })}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      + Salvar no Deck Anki (SRS)
                    </button>

                    <button
                      onClick={handleGenerateQuestion}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                    >
                      Gerar Outra Questão
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-300 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
                  Simulador Cognitivo
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Questões Comentadas por IA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Treino Adaptativo de Questões
              </h1>
            </div>

        {/* Filter Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Exam Selector */}
          {exams.length > 0 && onSelectExam && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Concurso:</span>
              <select
                value={selectedExam?.id || ''}
                onChange={(e) => {
                  const exam = exams.find(ex => ex.id === e.target.value);
                  if (exam) onSelectExam(exam);
                  setCurrentIndex(0);
                  setIsAnswered(false);
                  setSelectedOptionId(null);
                }}
                className="px-3 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white font-medium cursor-pointer"
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Matéria:</span>
          </div>
          <select
            value={selectedSubjectFilter}
            onChange={(e) => {
              setSelectedSubjectFilter(e.target.value);
              setCurrentIndex(0);
              setIsAnswered(false);
              setSelectedOptionId(null);
            }}
            className="px-3 py-2 rounded-xl glass-input text-xs text-slate-900 dark:text-white font-medium cursor-pointer"
          >
            <option value="todas">Todas as Disciplinas</option>
            <option value="sub-dir-prev">Direito Previdenciário (Peso 3)</option>
            <option value="sub-dir-adm">Direito Administrativo</option>
            <option value="sub-oab-etica">Ética da OAB</option>
          </select>
        </div>
      </div>

      {currentQuestion ? (
        <div className="mt-6">
          
          {/* Main 60/40 Split-Screen Grid (Estilo LeetCode) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUNA ESQUERDA: ARENA DE COMBATE & ENUNCIADO (60% - 7 COLS) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Question Meta Bar with Zen Mode Trigger */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-300 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/30">
                    {currentQuestion.banca} • {currentQuestion.year}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                    {currentQuestion.subjectName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {currentQuestion.topicName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono font-bold bg-white dark:bg-dark-surface px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formatTimer(timeSpentSeconds)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsZenMode(true)}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                    title="Modo Foco Zen (Atalho: F)"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Foco [F]</span>
                  </button>

                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    {currentIndex + 1} / {filteredQuestions.length}
                  </span>
                </div>
              </div>

              {/* Statement Box with Physical Exam Highlighter */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 space-y-4 relative shadow-sm">
                
                {/* Physical Exam Toolbar (Grifar e Riscar) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Keyboard className="w-3.5 h-3.5" />
                      Ferramentas de Prova Física:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleHighlightSelection('mark')}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-500/30 flex items-center gap-1 transition-all"
                      title="Selecione o texto e clique para grifar em amarelo"
                    >
                      <Highlighter className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Grifar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightSelection('strike')}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-800 dark:text-rose-300 font-bold text-[11px] border border-rose-300 dark:border-rose-500/30 flex items-center gap-1 transition-all"
                      title="Selecione o texto e clique para riscar termos proibidos"
                    >
                      <Scissors className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>Riscar</span>
                    </button>
                  </div>

                  {(highlightedSnippets.length > 0 || strikethroughSnippets.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearHighlights}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                    >
                      Limpar Marcações
                    </button>
                  )}
                </div>

                {/* Reference tag if available */}
                {currentQuestion.codeCitation && (
                  <div className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
                    <span>Artigo / Referência:</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
                      {currentQuestion.codeCitation}
                    </span>
                  </div>
                )}

                {/* Enunciado Interativo */}
                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-normal leading-relaxed whitespace-pre-line select-text">
                  {currentQuestion.statement.split(/(\s+)/).map((word, idx) => {
                    const clean = word.replace(/[.,;?!:()]/g, '');
                    const isMarked = clean.length > 1 && highlightedSnippets.some(s => s.toLowerCase().includes(clean.toLowerCase()));
                    const isStriked = clean.length > 1 && strikethroughSnippets.some(s => s.toLowerCase().includes(clean.toLowerCase()));

                    if (isStriked) {
                      return (
                        <span key={idx} className="line-through decoration-rose-500 decoration-2 text-rose-500/80 font-medium">
                          {word}
                        </span>
                      );
                    }
                    if (isMarked) {
                      return (
                        <mark key={idx} className="bg-amber-200 dark:bg-yellow-400/30 text-slate-900 dark:text-yellow-200 px-0.5 rounded font-medium border-b-2 border-amber-400">
                          {word}
                        </mark>
                      );
                    }
                    return <React.Fragment key={idx}>{word}</React.Fragment>;
                  })}
                </div>

                {/* Options List with Keyboard Hints [A, B, C, D, E] */}
                <div className="mt-8 space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOptionId === option.id;
                    const letter = String.fromCharCode(65 + idx);
                    let optionStyle = 'bg-white dark:bg-dark-surface/80 border-slate-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 text-slate-700 dark:text-slate-200 shadow-sm';

                    if (isSelected && !isAnswered) {
                      optionStyle = 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-white ring-2 ring-indigo-500/30 shadow-md';
                    } else if (isAnswered) {
                      if (option.isCorrect) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30';
                      } else {
                        optionStyle = 'opacity-40 bg-white dark:bg-dark-surface/40 border-transparent text-slate-400';
                      }
                    }

                    return (
                      <div
                        key={option.id}
                        onClick={() => {
                          if (!isAnswered) setSelectedOptionId(option.id);
                        }}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${optionStyle}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-400'
                        }`}>
                          <span>{letter}</span>
                        </div>
                        <span className="text-xs sm:text-sm leading-relaxed flex-1 pt-1">{option.text}</span>
                        <kbd className="hidden sm:inline px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">
                          {letter}
                        </kbd>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Actions Bar (Confidence & Confirm with Keyboard Shortcut) */}
                <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {!isAnswered ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                          Grau de Convicção (Calibragem da IA):
                        </label>
                        <div className="flex items-center gap-2">
                          {[
                            { id: 'alta', label: 'Alta Convicção' },
                            { id: 'media', label: 'Dúvida Parcial' },
                            { id: 'chute', label: 'Palpite / Intuição' }
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setConfidence(c.id as any)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                                confidence === c.id
                                  ? 'bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmAnswer}
                        disabled={!selectedOptionId}
                        className={`px-7 py-3.5 rounded-xl font-black text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                          selectedOptionId
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-600/25 active:scale-95'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Resposta</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] text-white/90 font-mono">
                          Enter ↵
                        </kbd>
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Resposta registrada. Inspecione a análise ao lado.
                      </span>
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                      >
                        <span>Próxima Questão</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] text-white font-mono">
                          → ou Enter
                        </kbd>
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* COLUNA DIREITA: STATS, COGNITIVE COPILOT & VADE MECUM (40% - 5 COLS) */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-1 scrollbar-thin">
              
              {/* Card 1: Raio-X Psicométrico da Questão */}
              <div className="glass-panel p-5 rounded-3xl bg-white/80 dark:bg-dark-card/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyan-500" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Raio-X Psicométrico da Banca
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-[10px] font-black">
                    TRI Nível B
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Taxa de Acerto</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">52%</span>
                    <span className="text-[10px] text-amber-500 block">Pegadinha Frequente</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-surface/80 border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tempo Médio</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">1m 45s</span>
                    <span className="text-[10px] text-emerald-500 block">Ritmo Recomendado</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 text-xs space-y-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 block">Armadilha Mapeada da Banca:</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentQuestion.cognitiveAnalysis.commonTrap}
                  </p>
                </div>
              </div>

              {/* Card 2: AI Cognitive Diagnosis Card (When Answered) */}
              {isAnswered && selectedOptionId ? (
                <div className="animate-fadeIn">
                  <CognitiveDiagnosisCard
                    question={currentQuestion}
                    selectedOptionId={selectedOptionId}
                    isCorrect={!!currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect}
                    confidence={confidence}
                    onAddFlashcard={onAddFlashcard}
                    onNextQuestion={handleNext}
                    userPlan={userPlan}
                    quotaExceeded={userPlan === 'aspirante' && (dailyAiCount - bonusAiCredits) >= 5}
                    onOpenPricing={onOpenPricing}
                    onRewardGranted={(bonus) => setBonusAiCredits((prev) => prev + bonus)}
                  />
                </div>
              ) : (
                <div className="p-6 rounded-3xl border border-dashed border-slate-300 dark:border-white/15 text-center space-y-2 bg-white/40 dark:bg-dark-surface/40">
                  <Sparkles className="w-6 h-6 text-indigo-500 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Copiloto Cognitivo em Standby
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Selecione sua alternativa e aperte [Enter ↵]. A IA desvendará instantaneamente o distrator da banca e o artigo de lei aplicável.
                  </p>
                </div>
              )}

              {/* Card 3: Anotações Táticas do Concurseiro */}
              <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-card/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    Anotação Pessoal da Questão:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Auto-save</span>
                </div>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Escreva seu mnemônico, pegadinha anotada ou artigo relacionado..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          Nenhuma questão encontrada para este filtro.
        </div>
      )}

      {/* OVERLAY DO MODO FOCO TOTAL (ZEN MODE) */}
      {isZenMode && currentQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/98 text-white p-6 sm:p-12 overflow-y-auto flex flex-col justify-between animate-fadeIn backdrop-blur-xl">
          
          {/* Zen Mode Header */}
          <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MODO FOCO ZEN • ARENA DE COMBATE</span>
              <span>•</span>
              <span className="text-slate-500">Pressione [F] ou [ESC] para sair</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 font-bold bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeSpentSeconds)}</span>
              </div>
              <button
                onClick={() => setIsZenMode(false)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
                title="Sair do Modo Zen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zen Mode Body */}
          <div className="max-w-3xl w-full mx-auto my-auto py-8 space-y-8">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {currentQuestion.banca} • {currentQuestion.year}
              </span>
              <span>{currentQuestion.subjectName}</span>
            </div>

            <p className="text-lg sm:text-xl text-slate-100 font-normal leading-relaxed whitespace-pre-line">
              {currentQuestion.statement}
            </p>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      if (!isAnswered) setSelectedOptionId(option.id);
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 text-white ring-2 ring-indigo-400/40 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {letter}
                      </div>
                      <span className="text-sm leading-relaxed">{option.text}</span>
                    </div>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-500 border border-slate-700">
                      {letter}
                    </kbd>
                  </div>
                );
              })}
            </div>

            {/* Zen Bottom Action */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Navegação: [A-E] seleciona • [Enter] confirma • [→] avança
              </span>

              {!isAnswered ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar [Enter ↵]</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>Próxima Questão [→]</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-600 max-w-4xl mx-auto w-full pt-4 border-t border-slate-800">
            Arena de Combate Zen • Learning AI
          </div>

        </div>
      )}

        </div>
      )}

    </div>
  );
};
