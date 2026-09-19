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
import { QuestionBank } from '@/components/QuestionBank';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { BancaPsychometrics } from '@/components/BancaPsychometrics';
import { SRSFlashcardPlayer } from '@/components/SRSFlashcardPlayer';
import { StudentProfileModal } from '@/components/StudentProfileModal';
import { AdminQuestionIngestModal } from '@/components/AdminQuestionIngestModal';
import { NarrativeOnboardingTerminal } from '@/components/NarrativeOnboardingTerminal';
import { AvatarOnboardingModal } from '@/components/AvatarOnboardingModal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { UserSettingsTab } from '@/components/UserSettingsTab';
import { SidebarNavigation } from '@/components/SidebarNavigation';
import { FloatingDockNavigation } from '@/components/FloatingDockNavigation';
import { CheckoutCartTab } from '@/components/CheckoutCartTab';
import { SubscriptionManagementTab } from '@/components/SubscriptionManagementTab';
import { ConcursosRadarTab } from '@/components/ConcursosRadarTab';
import { PlatformGuideTab } from '@/components/PlatformGuideTab';
import { HelpAndAboutTab } from '@/components/HelpAndAboutTab';
import { PricingPlansTab } from '@/components/PricingPlansTab';
import { SmartSubjectSummaries } from '@/components/SmartSubjectSummaries';
import { 
  ExamNotice, 
  QuestionAttempt, 
  UserMetrics, 
  Flashcard, 
  SubscriptionPlan,
  MistakeEntry,
  StudentProfile,
  ParsedExamQuestion
} from '@/lib/types';
import { GUARDIAN_ANIMALS, DEFAULT_STUDENT_PROFILE } from '@/lib/guardianAnimals';
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
  const [isAdminIngestOpen, setIsAdminIngestOpen] = useState(false);
  const [isOnboardingTerminalOpen, setIsOnboardingTerminalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Profile & Daily AI Quota tracking
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dailyAiCount, setDailyAiCount] = useState<number>(0);
  // Navigation Style Mode: 'sidebar' (Opção 1) | 'megamenu' (Opção 2) | 'dock' (Opção 3)
  const [navMode, setNavMode] = useState<'sidebar' | 'megamenu' | 'dock'>('sidebar');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('aprovalens_plan');
      if (savedPlan) setPlan(savedPlan as SubscriptionPlan);

      const savedMetrics = localStorage.getItem('aprovalens_metrics');
      if (savedMetrics) setMetrics(JSON.parse(savedMetrics));

      const savedMistakes = localStorage.getItem('aprovalens_mistakes');
      if (savedMistakes) setMistakes(JSON.parse(savedMistakes));

      // Carregar Passaporte Cognitivo do Estudante
      const savedProfile = localStorage.getItem('aprovalens_student_profile');
      if (savedProfile) {
        try {
          setStudentProfile(JSON.parse(savedProfile));
        } catch {}
      }

      // Carregar cota de IA diária utilizada hoje
      const todayKey = `aprovalens_ai_count_${new Date().toISOString().split('T')[0]}`;
      const savedCount = localStorage.getItem(todayKey);
      if (savedCount) {
        setDailyAiCount(parseInt(savedCount, 10) || 0);
      }

      // Carregar preferência de tema (Claro / Escuro)
      const savedTheme = (localStorage.getItem('learning_ai_theme') as 'dark' | 'light') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(savedTheme);
      }

      // Carregar preferência de estilo de navegação
      const savedNavMode = localStorage.getItem('learning_ai_nav_mode') as 'sidebar' | 'megamenu' | 'dock';
      if (savedNavMode) setNavMode(savedNavMode);

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

  const handleSetNavMode = (mode: 'sidebar' | 'megamenu' | 'dock') => {
    setNavMode(mode);
    try {
      localStorage.setItem('learning_ai_nav_mode', mode);
    } catch {}
    const label = mode === 'sidebar' ? 'Sidebar Lateral (Opção 1)' : mode === 'megamenu' ? 'Mega-Menu Topo (Opção 2)' : 'Dock Flutuante (Opção 3)';
    showToast(`Estilo alterado para: ${label}`);
  };

  // Transição de abas: Rolagem suave automática para o topo ao trocar de módulo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

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
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      if (document.body) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      }
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

  const handleSaveProfile = (updated: StudentProfile) => {
    setStudentProfile(updated);
    try {
      localStorage.setItem('aprovalens_student_profile', JSON.stringify(updated));
    } catch {}
    SupabaseService.syncStudentProfile('user-demo', updated);
    showToast(`Passaporte Cognitivo atualizado: Guardião ${GUARDIAN_ANIMALS.find(a => a.id === updated.guardianAnimalId)?.name}!`);
  };

  const handleOnboardingComplete = (data: Partial<StudentProfile>) => {
    const updated: StudentProfile = {
      ...studentProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setStudentProfile(updated);
    try {
      localStorage.setItem('aprovalens_student_profile', JSON.stringify(updated));
    } catch {}
    SupabaseService.syncStudentProfile('user-demo', updated);
    showToast(`⚡ Deploy do ciclo de estudos de ${data.targetExamTitle || 'concurso'} realizado com sucesso!`);
    setActiveTab('cycle');
  };

  const handleRecordAttempt = (attempt: QuestionAttempt) => {
    SupabaseService.recordAttempt('user-demo', attempt);

    // Track daily AI request count
    const todayKey = `aprovalens_ai_count_${new Date().toISOString().split('T')[0]}`;
    setDailyAiCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(todayKey, String(next));
      } catch {}
      return next;
    });

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
    <div className={`min-h-screen flex flex-col items-center w-full selection:bg-blue-500/25 selection:text-blue-900 dark:selection:bg-blue-500/30 dark:selection:text-blue-100 transition-colors duration-300 relative overflow-x-hidden ${
      theme === 'light' ? 'app-bg-light text-slate-900 light' : 'app-bg-dark text-slate-100 dark'
    }`}>
      
      {/* Ambient Background Glow Mesh Layer (Visível em ambos os modos) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
        {theme === 'dark' ? (
          <>
            <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-blue-600/18 blur-[140px] animate-pulse-slow" />
            <div className="absolute top-10 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-500/12 blur-[150px]" />
            <div className="absolute bottom-10 left-1/3 w-[700px] h-[500px] rounded-full bg-emerald-600/10 blur-[160px]" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-blue-500/10 blur-[130px]" />
            <div className="absolute top-10 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-500/08 blur-[140px]" />
            <div className="absolute bottom-10 left-1/3 w-[700px] h-[500px] rounded-full bg-emerald-500/08 blur-[150px]" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
          </>
        )}
      </div>

      {/* Wrapper Constraint for Ultra-wide screens */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-row flex-1 relative z-10 min-w-0">

        {/* Sidebar Lateral Retrátil (Opção 1) */}
        {navMode === 'sidebar' && (
          <SidebarNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            pendingMistakesCount={pendingMistakesCount}
            studentProfile={studentProfile}
            streakDays={metrics.streakDays}
            plan={plan}
            onOpenPricing={() => setActiveTab('pricing-plans')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Global Navbar com alternância de tema e seletor de estilo */}
          <div className="relative z-20">
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              streakDays={metrics.streakDays}
              plan={plan}
              onOpenPricing={() => setActiveTab('pricing-plans')}
              selectedExamTitle={selectedExam?.title}
              pendingMistakesCount={pendingMistakesCount}
              onOpenCopilot={() => setIsCopilotOpen(true)}
              isSupabaseConfigured={isSupabaseConfigured()}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              studentProfile={studentProfile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenSettings={() => setActiveTab('settings')}
              onOpenAdminIngest={() => setIsAdminIngestOpen(true)}
              navMode={navMode}
              setNavMode={handleSetNavMode}
            />
          </div>

      {/* Main Content Area com Transição Suave */}
      <main className={`flex-1 relative z-10 ${navMode === 'dock' ? 'pb-28 sm:pb-32' : 'pb-20 sm:pb-8'}`}>
        <div key={activeTab} className="tab-page-wrapper">
          {activeTab === 'landing' && (
          <LandingPage
            onStartEdital={() => setIsOnboardingTerminalOpen(true)}
            onStartDiscursivas={() => setActiveTab('discursivas')}
            onOpenPricing={() => setIsPricingOpen(true)}
            onSelectPlan={(p) => {
              setPlan(p);
              setIsPricingOpen(true);
            }}
            onOpenPsychometrics={() => setActiveTab('psychometrics')}
            onNavigateTab={(tab) => setActiveTab(tab)}
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
            exams={exams}
            selectedExam={selectedExam}
            onSelectExam={handleSelectExam}
            userPlan={plan}
            dailyAiCount={dailyAiCount}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeTab === 'flashcards' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <SRSFlashcardPlayer
              flashcards={flashcards}
              onReviewCard={handleReviewFlashcard}
              onAddNewCard={handleAddFlashcard}
            />
          </div>
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

        {(activeTab === 'summaries' || activeTab === 'resumos') && (
          <SmartSubjectSummaries
            onAddFlashcard={handleAddFlashcard}
            onGoToVadeMecum={(query) => {
              setActiveTab('vademecum');
              if (query) showToast(`Buscando no Vade Mecum: ${query}`);
            }}
            onGoToSimulator={(subj) => {
              setActiveTab('simulator');
              if (subj) showToast(`Iniciando bateria de questões: ${subj}`);
            }}
            userPlan={plan}
            onOpenPricing={() => setIsPricingOpen(true)}
            showToast={showToast}
          />
        )}

        {activeTab === 'discursivas' && (
          <DiscursiveStudio
            userPlan={plan}
            onOpenPricing={() => setIsPricingOpen(true)}
            onRecordSubmission={(sub) => {
              showToast(`Redação avaliada! Nota: ${sub.evaluation.finalScore.toFixed(1)} pts`);
            }}
          />
        )}

        {(activeTab === 'analytics' || activeTab === 'dashboard') && (
          <AnalyticsDashboard
            metrics={metrics}
            selectedExam={selectedExam}
            flashcards={flashcards}
            onReviewFlashcard={handleReviewFlashcard}
            onAddNewFlashcard={handleAddFlashcard}
            onGoToSimulator={() => setActiveTab('simulator')}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            onAddFlashcard={handleAddFlashcard}
            onRecordAttempt={handleRecordAttempt}
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToMistakes={() => setActiveTab('mistakes')}
          />
        )}

          {activeTab === 'psychometrics' && (
            <BancaPsychometrics
              onGoToSimulator={(banca) => {
                setActiveTab('simulator');
                if (banca) showToast(`Carregando simulado calibrado para a banca: ${banca}`);
              }}
            />
          )}

          {activeTab === 'radar' && (
            <ConcursosRadarTab
              onSelectExamNotice={(noticeId) => {
                const matched = exams.find((e) => e.id === noticeId);
                if (matched) {
                  setSelectedExam(matched);
                  setActiveTab('edital');
                  showToast(`Edital ${matched.title} carregado na Matriz de Pesos!`);
                } else {
                  setActiveTab('edital');
                }
              }}
              onGoToDiscursivas={() => setActiveTab('discursivas')}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <UserSettingsTab
              studentProfile={studentProfile}
              onSaveProfile={handleSaveProfile}
              currentPlan={plan}
              onOpenPricing={() => setActiveTab('pricing-plans')}
              onOpenCheckout={(p) => {
                setPlan(p);
                setActiveTab('checkout');
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckoutCartTab
              initialPlan={plan}
              onPaymentSuccess={(newPlan) => {
                setPlan(newPlan);
                setActiveTab('subscription');
              }}
              onGoBack={() => setActiveTab('pricing-plans')}
              showToast={showToast}
            />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionManagementTab
              currentPlan={plan}
              onUpgradePlan={(newPlan) => {
                setPlan(newPlan);
                setActiveTab('checkout');
              }}
              onOpenPricing={() => setActiveTab('pricing-plans')}
              showToast={showToast}
            />
          )}

          {activeTab === 'guide' && (
            <PlatformGuideTab
              onGoToTab={(tab) => setActiveTab(tab)}
              showToast={showToast}
            />
          )}

          {activeTab === 'help' && (
            <HelpAndAboutTab
              showToast={showToast}
            />
          )}

          {activeTab === 'pricing-plans' && (
            <PricingPlansTab
              currentPlan={plan}
              onSelectPlanForCheckout={(selected) => {
                setPlan(selected);
                setActiveTab('checkout');
              }}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Omnipresent AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        metrics={metrics}
        selectedExam={selectedExam}
        pendingMistakesCount={pendingMistakesCount}
        profile={studentProfile}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Pricing & Checkout Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentPlan={plan}
        onUpgradePlan={handleUpgradePlan}
      />

      {/* Student Profile & Guardian Animal Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
        userPlan={plan}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Admin Question Ingestion & Audit Pipeline Modal */}
      <AdminQuestionIngestModal
        isOpen={isAdminIngestOpen}
        onClose={() => setIsAdminIngestOpen(false)}
        onQuestionsIngested={(newQuestions) => {
          showToast(`🚀 ${newQuestions.length} questões auditadas carregadas com sucesso!`);
        }}
      />

      {/* Premium Avatar Onboarding Modal */}
      <AvatarOnboardingModal
        isOpen={isOnboardingTerminalOpen}
        onComplete={(guardianId, warName) => {
          setIsOnboardingTerminalOpen(false);
          const newProfile = {
            ...studentProfile,
            guardianAnimalId: guardianId as any,
            warName,
            updatedAt: new Date().toISOString()
          };
          setStudentProfile(newProfile);
          try {
            localStorage.setItem('aprovalens_student_profile', JSON.stringify(newProfile));
          } catch {}
          showToast(`Bem-vindo, ${warName}! Guardião ativado com sucesso.`);
        }}
      />

      {/* Botão Flutuante de Rolagem Suave para o Topo */}
      <ScrollToTop />

      {/* Dock Flutuante Inferior (Opção 3) */}
      {navMode === 'dock' && (
        <FloatingDockNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          pendingMistakesCount={pendingMistakesCount}
        />
      )}

        </div>
      </div>
    </div>
  );
}
export default AprovaLensApp;
