'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { EditalParser } from '@/components/EditalParser';
import { StudyCycleManager } from '@/components/StudyCycleManager';
import { QuizSimulator } from '@/components/QuizSimulator';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { DiscursiveStudio } from '@/components/DiscursiveStudio';
import { PricingModal } from '@/components/PricingModal';
import { MistakesNotebook } from '@/components/MistakesNotebook';
import { SmartVadeMecum } from '@/components/SmartVadeMecum';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { 
  ExamNotice, 
  QuestionAttempt, 
  Flashcard, 
  UserMetrics, 
  SubscriptionPlan,
  MistakeEntry 
} from '@/lib/types';
import { SupabaseService } from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { 
  INITIAL_EXAMS, 
  INITIAL_METRICS, 
  INITIAL_FLASHCARDS,
  INITIAL_MISTAKES,
  MOCK_QUESTIONS 
} from '@/lib/mockData';

export function AprovaLensApp() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [exams, setExams] = useState<ExamNotice[]>(INITIAL_EXAMS);
  const [selectedExam, setSelectedExam] = useState<ExamNotice>(INITIAL_EXAMS[0]);
  const [metrics, setMetrics] = useState<UserMetrics>(INITIAL_METRICS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(INITIAL_MISTAKES);
  const [plan, setPlan] = useState<SubscriptionPlan>('aspirante');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('aprovalens_plan');
      if (savedPlan) setPlan(savedPlan as SubscriptionPlan);

      const savedMetrics = localStorage.getItem('aprovalens_metrics');
      if (savedMetrics) setMetrics(JSON.parse(savedMetrics));

      const savedMistakes = localStorage.getItem('aprovalens_mistakes');
      if (savedMistakes) setMistakes(JSON.parse(savedMistakes));

      // Carregar preferência de tema (Claro / Escuro)
      const savedTheme = localStorage.getItem('learning_ai_theme') as 'dark' | 'light';
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        if (savedTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }

      // Captura de parâmetros de URL originados de Landing Pages de SEO (?edital=...&tab=...)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const editalSlug = params.get('edital');
        const tabParam = params.get('tab');

        if (tabParam) {
          setActiveTab(tabParam);
        }

        if (editalSlug) {
          const matchingExam = INITIAL_EXAMS.find(e => 
            e.id.toLowerCase().includes(editalSlug.toLowerCase()) || 
            e.title.toLowerCase().includes(editalSlug.toLowerCase())
          );
          if (matchingExam) {
            setSelectedExam(matchingExam);
            showToast(`Edital carregado: ${matchingExam.title}`);
          }
        }
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('learning_ai_theme', nextTheme);
    } catch {}
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    showToast(nextTheme === 'light' ? '☀️ Modo Claro ativado!' : '🌙 Modo Escuro ativado!');
  };

  const handleSelectExam = (exam: ExamNotice) => {
    setSelectedExam(exam);
    showToast(`Edital selecionado: ${exam.title}`);
  };

  const handleGenerateCycle = (exam: ExamNotice) => {
    setSelectedExam(exam);
    setActiveTab('cycle');
    showToast(`Ciclo de estudos gerado para ${exam.title}!`);
  };

  const handleAddCustomExam = (newExam: ExamNotice) => {
    setExams((prev) => [newExam, ...prev]);
    setSelectedExam(newExam);
    showToast(`Novo edital "${newExam.title}" processado com sucesso!`);
  };

  const handleAddFlashcard = (newFlashcard: Flashcard) => {
    setFlashcards((prev) => {
      const updated = [newFlashcard, ...prev];
      SupabaseService.syncFlashcards('user-demo', updated);
      return updated;
    });
    showToast('Flashcard salvo no Deck de Repetição Espaçada!');
  };

  const handleAddFlashcardsBatch = (newCards: Flashcard[]) => {
    setFlashcards((prev) => {
      const updated = [...newCards, ...prev];
      SupabaseService.syncFlashcards('user-demo', updated);
      return updated;
    });
    showToast(`${newCards.length} flashcards adicionados ao Deck de Repetição Espaçada!`);
  };

  const handleUpdateMistakeNote = (mistakeId: string, note: string) => {
    setMistakes((prev) => {
      const updated = prev.map((m) => (m.id === mistakeId ? { ...m, userPersonalNote: note } : m));
      try {
        localStorage.setItem('aprovalens_mistakes', JSON.stringify(updated));
      } catch {}
      SupabaseService.syncMistakes('user-demo', updated);
      return updated;
    });
    showToast('Anotação pessoal salva no Caderno de Erros!');
  };

  const handleResolveMistakeInRevanche = (mistakeId: string, isCorrect: boolean) => {
    setMistakes((prev) => {
      const updated = prev.map((m) => {
        if (m.id !== mistakeId) return m;
        return {
          ...m,
          isOvercome: isCorrect ? true : m.isOvercome,
          overcomeAt: isCorrect ? new Date().toISOString() : m.overcomeAt,
          revancheAttemptsCount: m.revancheAttemptsCount + 1
        };
      });
      try {
        localStorage.setItem('aprovalens_mistakes', JSON.stringify(updated));
      } catch {}
      SupabaseService.syncMistakes('user-demo', updated);
      return updated;
    });
    if (isCorrect) {
      showToast('🎉 Erro superado com sucesso no Modo Revanche!');
    }
  };

  const handleRecordAttempt = (attempt: QuestionAttempt) => {
    SupabaseService.recordAttempt('user-demo', attempt);
    setMetrics((prev) => {
      const newTotal = prev.totalAnswered + 1;
      const newCorrect = attempt.isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect;
      const newAccuracy = Math.round((newCorrect / newTotal) * 1000) / 10;
      
      const newDistribution = { ...prev.errorDistribution };
      if (!attempt.isCorrect && attempt.diagnostic?.errorType) {
        newDistribution[attempt.diagnostic.errorType] = (newDistribution[attempt.diagnostic.errorType] || 0) + 1;
      }

      const updated = {
        ...prev,
        totalAnswered: newTotal,
        totalCorrect: newCorrect,
        globalAccuracy: newAccuracy,
        probabilityOfPassing: Math.min(96, Math.max(30, Math.round(newAccuracy * 0.95))),
        errorDistribution: newDistribution
      };

      try {
        localStorage.setItem('aprovalens_metrics', JSON.stringify(updated));
      } catch {}
      SupabaseService.syncMetrics('user-demo', updated);
      return updated;
    });

    // If incorrect, record into Mistakes Notebook automatically
    if (!attempt.isCorrect) {
      const questionData = MOCK_QUESTIONS.find((q) => q.id === attempt.questionId) || {
        id: attempt.questionId,
        subjectId: 'sub-geral',
        subjectName: 'Conhecimentos Específicos',
        topicId: 'top-geral',
        topicName: attempt.diagnostic?.suggestedReviewTopic || 'Tópico da Questão',
        banca: selectedExam?.banca || 'Cebraspe',
        year: 2026,
        institution: selectedExam?.institution || 'Banca Examinadora',
        statement: attempt.diagnostic?.flashcardFront || 'Questão do Simulado',
        options: [
          { id: 'opt-c', text: 'Opção Marcada', isCorrect: false },
          { id: 'opt-e', text: 'Gabarito Oficial', isCorrect: true }
        ],
        explanation: attempt.diagnostic?.feedback || 'Explicação do gabarito.',
        lawArticles: [],
        cognitiveAnalysis: {
          commonTrap: attempt.diagnostic?.actionableAdvice || 'Atenção aos distratores.',
          keyConcept: 'Revisão Necessária',
          bancaTendency: 'Frequente'
        }
      };

      const newMistake: MistakeEntry = {
        id: `mistake-${Date.now()}`,
        question: questionData,
        attemptDate: new Date().toISOString().split('T')[0],
        userSelectedOptionId: attempt.selectedOptionId,
        errorType: attempt.diagnostic?.errorType || 'pegadinha_banca',
        confidenceLevel: attempt.diagnostic?.confidenceLevel || 'media',
        feedback: attempt.diagnostic?.feedback || 'Atenção à regra cobrada pela banca.',
        actionableAdvice: attempt.diagnostic?.actionableAdvice || 'Revise o artigo de lei correlato.',
        isOvercome: false,
        revancheAttemptsCount: 0
      };

      setMistakes((prev) => {
        const existing = prev.find((m) => m.question.id === attempt.questionId);
        if (existing) return prev;
        const updated = [newMistake, ...prev];
        try {
          localStorage.setItem('aprovalens_mistakes', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    // Also update the topic accuracy in the current exam
    if (selectedExam) {
      setExams((prevExams) =>
        prevExams.map((exam) => {
          if (exam.id !== selectedExam.id) return exam;
          return {
            ...exam,
            subjects: exam.subjects.map((sub) => ({
              ...sub,
              topics: sub.topics.map((top) => {
                if (attempt.isCorrect) {
                  return {
                    ...top,
                    accuracyRate: Math.min(100, (top.accuracyRate || 50) + 5),
                    status: (top.accuracyRate || 50) + 5 >= 75 ? 'Dominado' : 'Instável'
                  };
                } else {
                  return {
                    ...top,
                    accuracyRate: Math.max(10, (top.accuracyRate || 50) - 8),
                    status: (top.accuracyRate || 50) - 8 < 50 ? 'Ponto Cego' : 'Instável'
                  };
                }
              })
            }))
          };
        })
      );
    }
  };

  const handleReviewFlashcard = (flashcardId: string, rating: 'facil' | 'bom' | 'dificil' | 'errei') => {
    setFlashcards((prev) =>
      prev.map((fc) => {
        if (fc.id !== flashcardId) return fc;
        const multiplier = rating === 'facil' ? 2.5 : rating === 'bom' ? 1.8 : 1.2;
        const newInterval = Math.max(1, Math.round(fc.intervalDays * multiplier));
        return {
          ...fc,
          intervalDays: newInterval,
          repetitions: fc.repetitions + 1,
          nextReviewDate: new Date(Date.now() + newInterval * 86400000).toISOString().split('T')[0]
        };
      })
    );
    showToast(`Flashcard revisado! Próxima revisão em dias calibrados.`);
  };

  const handleUpgradePlan = (newPlan: SubscriptionPlan) => {
    setPlan(newPlan);
    try {
      localStorage.setItem('aprovalens_plan', newPlan);
    } catch {}
    showToast(`🎉 Parabéns! Plano ${newPlan.toUpperCase()} ativado com sucesso!`);
  };

  const pendingMistakesCount = mistakes.filter((m) => !m.isOvercome).length;

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-300 ${
      theme === 'light' ? 'app-bg-light text-slate-900 light' : 'app-bg-dark text-slate-100 dark'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-2xl shadow-indigo-600/40 border border-indigo-400/40 animate-fadeIn flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar com alternância de tema */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakDays={metrics.streakDays}
        plan={plan}
        onOpenPricing={() => setIsPricingOpen(true)}
        selectedExamTitle={selectedExam?.title}
        pendingMistakesCount={pendingMistakesCount}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        isSupabaseConfigured={isSupabaseConfigured()}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 sm:pb-8">
        {activeTab === 'landing' && (
          <LandingPage
            onStartEdital={() => setActiveTab('edital')}
            onStartDiscursivas={() => setActiveTab('discursivas')}
            onOpenPricing={() => setIsPricingOpen(true)}
            onSelectPlan={(p) => {
              setPlan(p);
              setIsPricingOpen(true);
            }}
          />
        )}

        {activeTab === 'edital' && (
          <EditalParser
            exams={exams}
            selectedExam={selectedExam}
            onSelectExam={handleSelectExam}
            onGenerateCycle={handleGenerateCycle}
            onAddCustomExam={handleAddCustomExam}
          />
        )}

        {activeTab === 'cycle' && (
          <StudyCycleManager
            selectedExam={selectedExam}
            onGoToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <QuizSimulator
            onAddFlashcard={handleAddFlashcard}
            onAddFlashcardsBatch={handleAddFlashcardsBatch}
            onRecordAttempt={handleRecordAttempt}
            metrics={metrics}
          />
        )}

        {activeTab === 'mistakes' && (
          <MistakesNotebook
            mistakes={mistakes}
            onUpdateMistakeNote={handleUpdateMistakeNote}
            onResolveMistakeInRevanche={handleResolveMistakeInRevanche}
            onGoToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'vademecum' && (
          <SmartVadeMecum
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToQuestion={(qid) => {
              setActiveTab('simulator');
              showToast(`Carregando questão de prova vinculada: ${qid}`);
            }}
          />
        )}

        {activeTab === 'discursivas' && (
          <DiscursiveStudio
            onRecordSubmission={(sub) => {
              showToast(`Redação avaliada! Nota: ${sub.evaluation.finalScore.toFixed(1)} pts`);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            metrics={metrics}
            selectedExam={selectedExam}
            flashcards={flashcards}
            onReviewFlashcard={handleReviewFlashcard}
            onAddNewFlashcard={handleAddFlashcard}
            onGoToSimulator={() => setActiveTab('simulator')}
          />
        )}
      </main>

      {/* Omnipresent AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        metrics={metrics}
        selectedExam={selectedExam}
        pendingMistakesCount={pendingMistakesCount}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Pricing & Checkout Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentPlan={plan}
        onUpgradePlan={handleUpgradePlan}
      />

    </div>
  );
}
export default AprovaLensApp;
