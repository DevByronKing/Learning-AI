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
  Trophy
} from 'lucide-react';
import { Question, QuestionAttempt, Flashcard, UserMetrics } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { CognitiveDiagnosisCard } from './CognitiveDiagnosisCard';
import { FullMockExamSimulator } from './FullMockExamSimulator';
import { ExamNotice } from '@/lib/types';

interface QuizSimulatorProps {
  onAddFlashcard: (flashcard: Flashcard) => void;
  onAddFlashcardsBatch?: (flashcards: Flashcard[]) => void;
  onRecordAttempt: (attempt: QuestionAttempt) => void;
  metrics: UserMetrics;
  exams?: ExamNotice[];
  selectedExam?: ExamNotice;
  onSelectExam?: (exam: ExamNotice) => void;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({
  onAddFlashcard,
  onAddFlashcardsBatch,
  onRecordAttempt,
  metrics,
  exams = [],
  selectedExam,
  onSelectExam
}) => {
  const [simulatorMode, setSimulatorMode] = useState<'quick' | 'full_mock' | 'ai_generator'>('quick');
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<'alta' | 'media' | 'chute'>('alta');
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('todas');

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
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOptionId(null);
    setTimeSpentSeconds(0);
    setConfidence('alta');
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
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
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold shadow-md shadow-purple-600/30'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
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
            <span>Simulado Oficial (Modo Prova & Ranking)</span>
          </button>
        </div>
      </div>

      {simulatorMode === 'full_mock' ? (
        <FullMockExamSimulator
          onAddFlashcardsBatch={onAddFlashcardsBatch}
          onGoBackToQuickQuiz={() => setSimulatorMode('quick')}
        />
      ) : simulatorMode === 'ai_generator' ? (
        /* AI GENERATOR VIEW */
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* AI Generator Control Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-dark-surface to-indigo-950/40 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
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
                  className="w-full bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
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
                  className="w-full bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
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
                  className="w-full bg-dark-bg border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
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
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wide shadow-xl shadow-purple-600/30 active:scale-95 transition-all"
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
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-surface border border-purple-500/20 shadow-2xl space-y-6 animate-fadeIn">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                    QUESTÃO INÉDITA IA
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {generatedQuestion.banca} • {generatedQuestion.subjectName}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{generatedQuestion.topicName}</span>
              </div>

              {/* Statement */}
              <div className="bg-dark-bg p-5 rounded-2xl border border-slate-200 dark:border-white/5">
                <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed font-medium">
                  {generatedQuestion.statement}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {generatedQuestion.options.map((option) => {
                  const isSelected = aiSelectedOptionId === option.id;
                  let style = 'bg-dark-bg/60 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-white/20';

                  if (aiIsAnswered) {
                    if (option.isCorrect) {
                      style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    } else if (isSelected && !option.isCorrect) {
                      style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-purple-600/20 border-purple-500 text-white';
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
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs tracking-wide shadow-lg transition-all"
                  >
                    Confirmar Resposta
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-indigo-300">
                      <span>Fundamentação e Justificativa da IA:</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{generatedQuestion.codeCitation}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{generatedQuestion.explanation}</p>
                    <div className="bg-dark-bg/80 p-3 rounded-xl border border-indigo-500/10 text-indigo-200">
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
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
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
        <div className="max-w-5xl mx-auto">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-300 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
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
        <div className="mt-8">
          
          {/* Question Meta Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-300 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                {currentQuestion.banca} • {currentQuestion.year}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                {currentQuestion.subjectName}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-dark-card text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {currentQuestion.topicName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono font-bold bg-white dark:bg-dark-surface px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatTimer(timeSpentSeconds)}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Questão {currentIndex + 1} de {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Statement Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10">
            
            {currentQuestion.codeCitation && (
              <div className="mb-4 text-[11px] font-mono text-indigo-400 flex items-center gap-1.5">
                <span>Ref. Legal:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {currentQuestion.codeCitation}
                </span>
              </div>
            )}

            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-normal leading-relaxed whitespace-pre-line">
              {currentQuestion.statement}
            </p>

            {/* Options List */}
            <div className="mt-8 space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'bg-white dark:bg-dark-surface/80 border-slate-200 dark:border-white/5 hover:border-indigo-500/50 text-slate-700 dark:text-slate-200';

                if (isSelected && !isAnswered) {
                  optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-400/50';
                } else if (isAnswered) {
                  if (option.isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400/40';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-400/40';
                  } else {
                    optionStyle = 'opacity-40 bg-white dark:bg-dark-surface/40 border-transparent text-slate-500 dark:text-slate-400';
                  }
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      if (!isAnswered) setSelectedOptionId(option.id);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed">{option.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Confidence Selector & Confirm Button (Before Answering) */}
            {!isAnswered && (
              <div className="mt-8 pt-6 border-t border-slate-300 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Confidence Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                    Grau de Convicção na Resposta (Calibragem do Diagnóstico):
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          confidence === c.id
                            ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-300'
                            : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOptionId}
                  className={`px-8 py-3.5 rounded-xl font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                    selectedOptionId
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 glow-brand'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Resposta</span>
                </button>

              </div>
            )}

          </div>

          {/* AI Cognitive Diagnosis Card (When Answered) */}
          {isAnswered && selectedOptionId && (
            <CognitiveDiagnosisCard
              question={currentQuestion}
              selectedOptionId={selectedOptionId}
              isCorrect={!!currentQuestion.options.find((o) => o.id === selectedOptionId)?.isCorrect}
              confidence={confidence}
              onAddFlashcard={onAddFlashcard}
              onNextQuestion={handleNext}
            />
          )}

        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          Nenhuma questão encontrada para este filtro.
        </div>
      )}
        </div>
      )}

    </div>
  );
};
