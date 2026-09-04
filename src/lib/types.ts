export type ExamNotice = {
  id: string;
  title: string;
  institution: string;
  banca: 'FGV' | 'Cebraspe' | 'FCC' | 'Vunesp' | 'Outra';
  role: string;
  salary: string;
  vacancies: number;
  examDate: string;
  daysRemaining: number;
  pdfFileName?: string;
  uploadedAt: string;
  subjects: ExamSubject[];
};

export type ExamSubject = {
  id: string;
  name: string;
  weight: number; // 1 to 3
  relevancePercentage: number;
  totalTopics: number;
  topics: ExamTopic[];
};

export type ExamTopic = {
  id: string;
  name: string;
  frequencyInBanca: 'Alta' | 'Média' | 'Baixa';
  accuracyRate?: number; // 0 to 100
  status: 'Ponto Cego' | 'Instável' | 'Dominado' | 'Não Estudado';
  articlesOrLaws?: string[];
};

export type StudyMethodology = 'ciclo_meirelles' | 'ebbinghaus_srs' | 'estudo_reverso' | 'pomodoro_pro';

export type DailyScheduleItem = {
  id: string;
  dayOfWeek: string;
  dateStr: string;
  blocks: {
    id: string;
    subjectId: string;
    subjectName: string;
    topicName: string;
    durationMinutes: number;
    method: string;
    status: 'pendente' | 'concluido' | 'atrasado';
    questionsTarget: number;
    completedQuestions: number;
  }[];
};

export type ErrorType = 
  | 'pegadinha_banca'        // Distrator semântico/jurisprudencial
  | 'lacuna_teorica'         // Desconhecimento do conceito base
  | 'leitura_apressada'      // Interpretação / Desatenção ao comando
  | 'curva_esquecimento';    // Memória decaiu / falta de revisão

export type Question = {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  banca: string;
  year: number;
  institution: string;
  statement: string; // Enunciado
  codeCitation?: string; // Ex: Art. 37, CF/88
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    distractorReason?: string; // Por que essa opção é uma pegadinha
  }[];
  explanation: string;
  lawArticles: string[];
  cognitiveAnalysis: {
    commonTrap: string;
    keyConcept: string;
    bancaTendency: string;
  };
};

export type QuestionAttempt = {
  id: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: string;
  timeSpentSeconds: number;
  diagnostic?: {
    errorType?: ErrorType;
    confidenceLevel: 'alta' | 'media' | 'chute';
    feedback: string;
    actionableAdvice: string;
    suggestedReviewTopic: string;
    flashcardFront: string;
    flashcardBack: string;
  };
};

export type Flashcard = {
  id: string;
  subjectName: string;
  topicName: string;
  front: string;
  back: string;
  errorOriginQuestionId?: string;
  nextReviewDate: string;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
};

export type UserMetrics = {
  totalAnswered: number;
  totalCorrect: number;
  globalAccuracy: number;
  streakDays: number;
  estimatedCutoffScore: number;
  probabilityOfPassing: number; // 0 to 100%
  errorDistribution: {
    pegadinha_banca: number;
    lacuna_teorica: number;
    leitura_apressada: number;
    curva_esquecimento: number;
  };
  bancaAlignment: {
    banca: string;
    userProficiency: number;
    bancaRequirement: number;
  }[];
};

export type SubscriptionPlan = 'aspirante' | 'pro' | 'elite';

export type DiscursivePrompt = {
  id: string;
  title: string;
  banca: 'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp' | 'OAB';
  institution: string;
  role: string;
  year: number;
  area: 'Policial' | 'Fiscal' | 'Tribunais' | 'Jurídica' | 'Administrativa';
  motivatingText: string;
  mandatoryTopics: {
    id: string;
    description: string;
    maxPoints: number;
  }[];
  minLines: number;
  maxLines: number;
  officialAnswerModel: string;
  suggestedDraft?: string;
};

export type DiscursiveCriterionGrade = {
  name: string;
  description: string;
  score: number;
  maxScore: number;
  status: 'excelente' | 'adequado' | 'insuficiente';
  feedback: string;
};

export type DiscursiveLineError = {
  lineNumber: number;
  originalText: string;
  suggestedCorrection: string;
  errorType: 'gramatical' | 'regência/crase' | 'clareza' | 'vocabulário_jurídico';
  explanation: string;
};

export type DiscursiveEvaluation = {
  finalScore: number; // 0 to 100
  passed: boolean;
  cutOffScore: number;
  criteriaGrades: DiscursiveCriterionGrade[];
  grammaticalDiscounts: number;
  totalLinesUsed: number;
  lineErrors: DiscursiveLineError[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  improvedVersion: string;
  evaluatedAt: string;
};

export type DiscursiveSubmission = {
  id: string;
  promptId: string;
  text: string;
  submittedAt: string;
  timeSpentSeconds: number;
  evaluation: DiscursiveEvaluation;
};

export type MockExamScoringRule = 'cebraspe_uma_anula_uma' | 'multipla_escolha_ponderada';

export type MockExam = {
  id: string;
  title: string;
  banca: 'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp';
  institution: string;
  role: string;
  durationMinutes: number;
  totalQuestions: number;
  scoringRule: MockExamScoringRule;
  estimatedCutoffScore: number;
  description: string;
  questions: Question[];
};

export type MockExamAnswer = {
  questionId: string;
  selectedOptionId: string | null; // null means left blank
  isFlaggedForReview: boolean;
};

export type MockExamSubjectBreakdown = {
  subjectName: string;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  grossScore: number;
  penaltyDeductions: number;
  netScore: number;
};

export type MockExamResult = {
  mockExamId: string;
  mockExamTitle: string;
  banca: string;
  scoringRule: MockExamScoringRule;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  grossScore: number;
  penaltyDeductions: number;
  netScore: number;
  percentage: number;
  simulatedRank: number;
  totalCandidates: number;
  isAboveCutoff: boolean;
  cutoffScore: number;
  timeSpentSeconds: number;
  completedAt: string;
  subjectBreakdown: MockExamSubjectBreakdown[];
};

export type MistakeEntry = {
  id: string;
  question: Question;
  attemptDate: string;
  userSelectedOptionId: string;
  errorType: ErrorType;
  confidenceLevel: 'alta' | 'media' | 'chute';
  feedback: string;
  actionableAdvice: string;
  userPersonalNote?: string;
  isOvercome: boolean; // superado no modo revanche
  overcomeAt?: string;
  revancheAttemptsCount: number;
};

export type VadeMecumArticle = {
  id: string;
  diploma: 'CF/88' | 'Lei 8.112/90' | 'Lei 14.230/21 (LIA)' | 'Lei 14.133/21 (Licitações)' | 'Lei 8.213/91 (Previdência)' | 'Código Penal';
  numberStr: string;
  title: string;
  text: string;
  incidence: 'Alta' | 'Média' | 'Normal';
  trapKeywords: string[];
  bancaTrapNote: string;
  relatedQuestionId?: string;
  tags: string[];
};

export type CopilotMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    actionTab: string;
  };
};

export type MicroSummary = {
  id: string;
  subjectName: string;
  topicName: string;
  banca: string;
  title: string;
  keyPoints: string[];
  bancaTrapAlert: string;
  mnemonic?: string;
};
