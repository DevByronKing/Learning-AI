'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { PricingModal } from '@/components/PricingModal';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { StudentProfileModal } from '@/components/StudentProfileModal';
import { UserOnboardingModal } from '@/components/UserOnboardingModal';
import { SeanEllisSurveyModal } from '@/components/SeanEllisSurveyModal';
import { TabLoadingSkeleton } from '@/components/TabLoadingSkeleton';
import { ScrollToTop } from '@/components/ScrollToTop';
import { FloatingDockNavigation } from '@/components/FloatingDockNavigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles } from 'lucide-react';
import { GlobalExamContextBar } from '@/components/GlobalExamContextBar';

// Code Splitting Dinâmico de Abas Pesadas (Performance Otimizada)
const EditalParser = dynamic(
  () => import('@/components/EditalParser').then((m) => m.EditalParser),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const StudyCycleManager = dynamic(
  () => import('@/components/StudyCycleManager').then((m) => m.StudyCycleManager),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const QuizSimulator = dynamic(
  () => import('@/components/QuizSimulator').then((m) => m.QuizSimulator),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const AnalyticsDashboard = dynamic(
  () => import('@/components/AnalyticsDashboard').then((m) => m.AnalyticsDashboard),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const DiscursiveStudio = dynamic(
  () => import('@/components/DiscursiveStudio').then((m) => m.DiscursiveStudio),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const MistakesNotebook = dynamic(
  () => import('@/components/MistakesNotebook').then((m) => m.MistakesNotebook),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const SmartVadeMecum = dynamic(
  () => import('@/components/SmartVadeMecum').then((m) => m.SmartVadeMecum),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const QuestionBank = dynamic(
  () => import('@/components/QuestionBank').then((m) => m.QuestionBank),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const BancaPsychometrics = dynamic(
  () => import('@/components/BancaPsychometrics').then((m) => m.BancaPsychometrics),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const SRSFlashcardPlayer = dynamic(
  () => import('@/components/SRSFlashcardPlayer').then((m) => m.SRSFlashcardPlayer),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const UserSettingsTab = dynamic(
  () => import('@/components/UserSettingsTab').then((m) => m.UserSettingsTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const CheckoutCartTab = dynamic(
  () => import('@/components/CheckoutCartTab').then((m) => m.CheckoutCartTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const SubscriptionManagementTab = dynamic(
  () => import('@/components/SubscriptionManagementTab').then((m) => m.SubscriptionManagementTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const ConcursosRadarTab = dynamic(
  () => import('@/components/ConcursosRadarTab').then((m) => m.ConcursosRadarTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const PlatformGuideTab = dynamic(
  () => import('@/components/PlatformGuideTab').then((m) => m.PlatformGuideTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const HelpAndAboutTab = dynamic(
  () => import('@/components/HelpAndAboutTab').then((m) => m.HelpAndAboutTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const PricingPlansTab = dynamic(
  () => import('@/components/PricingPlansTab').then((m) => m.PricingPlansTab),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const SmartSubjectSummaries = dynamic(
  () => import('@/components/SmartSubjectSummaries').then((m) => m.SmartSubjectSummaries),
  { loading: () => <TabLoadingSkeleton />, ssr: false }
);
const AdminQuestionIngestModal = dynamic(
  () => import('@/components/AdminQuestionIngestModal').then((m) => m.AdminQuestionIngestModal),
  { ssr: false }
);
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
  const [isSeanEllisSurveyOpen, setIsSeanEllisSurveyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student Profile & Daily AI Quota tracking
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_STUDENT_PROFILE);
  const [defaultExamId, setDefaultExamId] = useState<string>(INITIAL_EXAMS[0].id);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dailyAiCount, setDailyAiCount] = useState<number>(0);
  // Navigation Style Mode: 'sidebar' (Opção 1) | 'megamenu' (Opção 2) | 'dock' (Opção 3)
  const [navMode, setNavMode] = useState<'sidebar' | 'megamenu' | 'dock'>('dock');
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

      // Carregar editais personalizados salvos pelo estudante
      let combinedExams = INITIAL_EXAMS;
      const savedCustomExams = localStorage.getItem('aprovalens_custom_exams');
      if (savedCustomExams) {
        try {
          const parsedCustom = JSON.parse(savedCustomExams);
          if (Array.isArray(parsedCustom) && parsedCustom.length > 0) {
            combinedExams = [...parsedCustom, ...INITIAL_EXAMS];
            setExams(combinedExams);
          }
        } catch {}
      }

      // Carregar edital padrão preferido
      const savedDefaultExamId = localStorage.getItem('aprovalens_default_exam_id');
      if (savedDefaultExamId) {
        const matched = combinedExams.find(e => e.id === savedDefaultExamId);
        if (matched) {
          setSelectedExam(matched);
          setDefaultExamId(matched.id);
        }
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
      // Aplica classes de tema: 'dark' para Tailwind dark: + CSS vars, 'light' para CSS vars html.light
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(savedTheme);
      }

      // Carregar preferência de estilo de navegação (Padrão: Dock Flutuante)
      const savedNavMode = (localStorage.getItem('learning_ai_nav_mode') as 'sidebar' | 'megamenu' | 'dock') || 'dock';
      setNavMode(savedNavMode);

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

      // Se for a primeira visita do concurseiro, acolher com o Onboarding automaticamente após breve delay
      const onboardingCompleted = localStorage.getItem('learning_ai_onboarding_completed');
      if (!onboardingCompleted && !savedProfile) {
        setTimeout(() => {
          setIsOnboardingTerminalOpen(true);
        }, 1200);
      }

      // Listener para abertura manual da pesquisa de PMF (via Configurações/Ajuda)
      const handleOpenSurvey = () => setIsSeanEllisSurveyOpen(true);
      window.addEventListener('open-pmf-survey', handleOpenSurvey);
      return () => {
        window.removeEventListener('open-pmf-survey', handleOpenSurvey);
      };
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

  const applyThemeClasses = (t: 'dark' | 'light') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
    if (document.body) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(t);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('learning_ai_theme', nextTheme);
    } catch {}
    applyThemeClasses(nextTheme);
    showToast(nextTheme === 'light' ? '☀️ Modo Claro ativado!' : '🌙 Modo Escuro ativado!');
  };

  const handleSelectExam = (exam: ExamNotice) => {
    setSelectedExam(exam);
    showToast(`Edital selecionado: ${exam.title}`);
  };

  const handleSetDefaultExam = (exam: ExamNotice) => {
    setSelectedExam(exam);
    setDefaultExamId(exam.id);
    try {
      localStorage.setItem('aprovalens_default_exam_id', exam.id);
    } catch {}

    const careerDetected = 
      (exam.title + ' ' + exam.role).toLowerCase().includes('polic') || (exam.title + ' ' + exam.role).toLowerCase().includes('prf') || (exam.title + ' ' + exam.role).toLowerCase().includes('pf')
        ? 'policial'
        : (exam.title + ' ' + exam.role).toLowerCase().includes('fiscal') || (exam.title + ' ' + exam.role).toLowerCase().includes('receita')
        ? 'fiscal'
        : (exam.title + ' ' + exam.role).toLowerCase().includes('tribunal') || (exam.title + ' ' + exam.role).toLowerCase().includes('tj') || (exam.title + ' ' + exam.role).toLowerCase().includes('trf')
        ? 'tribunais'
        : (exam.title + ' ' + exam.role).toLowerCase().includes('oab') || (exam.title + ' ' + exam.role).toLowerCase().includes('advoga')
        ? 'juridica'
        : studentProfile.targetCareer;

    setStudentProfile((prev) => {
      const updated: StudentProfile = {
        ...prev,
        targetExamTitle: exam.title,
        targetBanca: (exam.banca === 'Cebraspe' || exam.banca === 'FGV' || exam.banca === 'FCC' || exam.banca === 'Vunesp' || exam.banca === 'Outra') 
          ? exam.banca 
          : 'Outra',
        targetCareer: careerDetected,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('aprovalens_student_profile', JSON.stringify(updated));
      } catch {}

      try {
        useAuthStore.getState().updateProfile(updated);
        const authUser = useAuthStore.getState().user;
        if (authUser?.id) {
          SupabaseService.syncStudentProfile(authUser.id, updated);
        }
      } catch {}

      return updated;
    });

    showToast(`⭐ "${exam.title}" definido como seu Edital Padrão! Ciclo de estudos, simulados e banco calibrados.`);
  };

  const handleGenerateCycle = (exam: ExamNotice) => {
    setSelectedExam(exam);
    setActiveTab('cycle');
    showToast(`Ciclo de estudos gerado para ${exam.title}!`);
  };

  const handleAddCustomExam = (newExam: ExamNotice) => {
    setExams((prev) => {
      const updated = [newExam, ...prev.filter(e => e.id !== newExam.id)];
      try {
        const customExams = updated.filter(e => !INITIAL_EXAMS.some(ie => ie.id === e.id));
        localStorage.setItem('aprovalens_custom_exams', JSON.stringify(customExams));
      } catch {}
      return updated;
    });
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

      // Gatilho inteligente do Sean Ellis Test após 10 resoluções de questões
      if (newTotal >= 10) {
        try {
          const completed = localStorage.getItem('learning_ai_sean_ellis_survey_completed');
          const skipUntilStr = localStorage.getItem('learning_ai_sean_ellis_skip_until');
          const skipUntil = skipUntilStr ? parseInt(skipUntilStr, 10) : 0;
          if (!completed && Date.now() > skipUntil) {
            setTimeout(() => {
              setIsSeanEllisSurveyOpen(true);
            }, 1200);
          }
        } catch {}
      }

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
      theme === 'light' ? 'app-bg-light text-slate-900' : 'app-bg-dark text-slate-100'
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

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Global Navbar com alternância de tema */}
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
            />
          </div>

          {/* Global Exam Context Bar - Ecossistema Conectado */}
          <GlobalExamContextBar
            selectedExam={selectedExam}
            studentProfile={studentProfile}
            activeTab={activeTab}
            onNavigateTab={setActiveTab}
            onOpenEditalSelector={() => setActiveTab('edital')}
          />

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
            defaultExamId={defaultExamId}
            onSelectExam={handleSelectExam}
            onSetDefaultExam={handleSetDefaultExam}
            onGenerateCycle={handleGenerateCycle}
            onAddCustomExam={handleAddCustomExam}
          />
        )}

        {activeTab === 'cycle' && (
          <StudyCycleManager
            selectedExam={selectedExam}
            onGoToSimulator={() => setActiveTab('simulator')}
            studentProfile={studentProfile}
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
            studentProfile={studentProfile}
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
            selectedExam={selectedExam}
            onGoToVadeMecum={(query) => {
              setActiveTab('vademecum');
              if (query) showToast(`Buscando no Vade Mecum: ${query}`);
            }}
            onGoToEdital={() => setActiveTab('edital')}
          />
        )}

        {activeTab === 'vademecum' && (
          <SmartVadeMecum
            selectedExam={selectedExam}
            studentProfile={studentProfile}
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToQuestion={(qid) => {
              setActiveTab('simulator');
              showToast(`Carregando questão de prova vinculada: ${qid}`);
            }}
          />
        )}

        {(activeTab === 'summaries' || activeTab === 'resumos') && (
          <SmartSubjectSummaries
            selectedExam={selectedExam}
            studentProfile={studentProfile}
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
            selectedExam={selectedExam}
            studentProfile={studentProfile}
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
            studentProfile={studentProfile}
            onReviewFlashcard={handleReviewFlashcard}
            onAddNewFlashcard={handleAddFlashcard}
            onGoToSimulator={(subj) => {
              setActiveTab('simulator');
              if (subj) showToast(`Atacando vulnerabilidade na Arena: ${subj}`);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            onAddFlashcard={handleAddFlashcard}
            onRecordAttempt={handleRecordAttempt}
            onGoToSimulator={() => setActiveTab('simulator')}
            onGoToMistakes={() => setActiveTab('mistakes')}
            studentProfile={studentProfile}
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
              selectedExam={selectedExam}
              onSetDefaultExam={handleSetDefaultExam}
              exams={exams}
              onSelectExamNotice={(noticeId) => {
                const matched = exams.find((e) => e.id === noticeId);
                if (matched) {
                  handleSetDefaultExam(matched);
                  setActiveTab('edital');
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
              onRestartOnboarding={() => setIsOnboardingTerminalOpen(true)}
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

      {/* Premium Gamified Cognitive Onboarding Modal */}
      <UserOnboardingModal
        isOpen={isOnboardingTerminalOpen}
        onClose={() => setIsOnboardingTerminalOpen(false)}
        currentProfile={studentProfile}
        onOpenPricing={() => setIsPricingOpen(true)}
        onComplete={(partialProfile, destinationTab) => {
          setIsOnboardingTerminalOpen(false);
          const newProfile: StudentProfile = {
            ...studentProfile,
            ...partialProfile,
            updatedAt: new Date().toISOString()
          };
          setStudentProfile(newProfile);
          try {
            localStorage.setItem('aprovalens_student_profile', JSON.stringify(newProfile));
            localStorage.setItem('learning_ai_onboarding_completed', 'true');
          } catch {}

          // Atualizar Zustand store
          try {
            useAuthStore.getState().updateProfile(newProfile);
          } catch {}

          // Sincronizar com Supabase se houver usuário autenticado
          try {
            const authUser = useAuthStore.getState().user;
            if (authUser?.id) {
              SupabaseService.syncStudentProfile(authUser.id, newProfile);
            }
          } catch {}

          // Sincronizar Edital Alvo com os exames disponíveis e torná-lo o edital padrão
          if (partialProfile.targetExamTitle) {
            const matchedExam = exams.find(e => 
              e.title.toLowerCase().includes((partialProfile.targetExamTitle || '').toLowerCase()) ||
              (partialProfile.targetExamTitle || '').toLowerCase().includes(e.title.toLowerCase())
            );
            if (matchedExam) {
              handleSetDefaultExam(matchedExam);
            }
          }

          if (destinationTab) {
            setActiveTab(destinationTab);
          }

          showToast(`🎯 Passaporte Cognitivo ativado! Bem-vindo(a), ${newProfile.warName || newProfile.name}!`);
        }}
      />

      {/* Pesquisa de PMF In-App - Sean Ellis Test */}
      <SeanEllisSurveyModal
        isOpen={isSeanEllisSurveyOpen}
        onClose={() => setIsSeanEllisSurveyOpen(false)}
        onSubmitted={() => {
          showToast('❤️ Muito obrigado por ajudar a calibrar o AprovaLens!');
        }}
      />

      {/* Botão Flutuante de Rolagem Suave para o Topo */}
      <ScrollToTop />

      {/* Botão Flutuante Temporário para Testar e Iniciar o Onboarding a Qualquer Momento */}
      <div className="fixed top-20 right-4 sm:top-22 sm:right-6 z-[60] flex items-center gap-2">
        <button
          onClick={() => setIsOnboardingTerminalOpen(true)}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs tracking-wide shadow-xl shadow-blue-500/30 border border-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Clique para testar e abrir o Onboarding do Usuário a qualquer momento"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Testar Onboarding</span>
          <span className="px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-mono font-bold uppercase tracking-wider">
            DEV
          </span>
        </button>
      </div>

      {/* Dock Flutuante Inferior Exclusivo */}
      <FloatingDockNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        pendingMistakesCount={pendingMistakesCount}
      />

        </div>
      </div>
    </div>
  );
}
export default AprovaLensApp;
