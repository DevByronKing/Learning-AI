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

export type QuestionDifficulty = 'Fácil' | 'Média' | 'Difícil';
export type QuestionFormat = 'multipla_escolha' | 'certo_errado';

export type QuestionBankFilter = {
  searchQuery: string;
  banca: string;
  subject: string;
  topic: string;
  year: string;
  difficulty: string;
  status: 'todas' | 'nao_resolvidas' | 'acertos' | 'erros';
};

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  distractorReason?: string; // Por que essa opção é uma pegadinha
  distractorType?: PsychometricDistractorType;
  distractorExplanation?: string;
};

export type Question = {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  banca: string;
  year: number;
  institution: string;
  role?: string;
  difficulty?: QuestionDifficulty;
  format?: QuestionFormat;
  statement: string; // Enunciado
  codeCitation?: string; // Ex: Art. 37, CF/88
  options: QuestionOption[];
  explanation: string;
  lawArticles: string[];
  cognitiveAnalysis: {
    commonTrap: string;
    keyConcept: string;
    bancaTendency: string;
  };
  isOfficialAudited?: boolean;
  auditSource?: string;
  legalStatus?: 'atualizada' | 'alterada_pela_lei' | 'anulada_oficial';
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

export type SubscriptionPlan = 'aspirante' | 'pro' | 'elite' | 'black' | 'lancamento';

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
  isOfficialPastExam?: boolean;
  examYear?: number;
  careerCategory?: 'policial' | 'fiscal' | 'tribunais' | 'juridica' | 'administrativa' | 'bancaria';
  historicalCutoffScore?: number;
  historicalCutoffDescription?: string;
  isFreeDemo?: boolean;
  requiredPlan?: 'pro' | 'elite';
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

export type SmartSubjectSummary = {
  id: string;
  subjectName: string;
  topicName: string;
  banca: string;
  title: string;
  incidence?: 'Alta (80/20)' | 'Média' | 'Ponto Crítico';
  coreConcept?: string;
  keyPoints: string[];
  bancaTrapAlert: string;
  mnemonic?: string;
  hotArticles?: string[];
  relatedQuestionIds?: string[];
  tags?: string[];
  isCustomAiGenerated?: boolean;
};

export type MicroSummary = SmartSubjectSummary;

// Gamification, Mascot Companion & Achievements
export type MascotId = 'coruja' | 'falcao' | 'lobo' | 'leao';

export type MascotCompanion = {
  id: MascotId;
  name: string;
  species: string;
  title: string;
  avatarEmoji: string;
  tagline: string;
  dailyAdvice: string;
  encouragement: string;
  specialty: string;
  unlockedLevel: number;
};

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementCategory = 'todas' | 'bancas' | 'lei_seca' | 'disciplina' | 'elite';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  tier: AchievementTier;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 a 100
  currentValue: number;
  targetValue: number;
  unit: string;
  xpReward: number;
};

export type DailyMission = {
  id: string;
  title: string;
  category: string;
  current: number;
  target: number;
  completed: boolean;
  xpReward: number;
  actionTab?: string;
};

// Psicometria Educacional & Engenharia Reversa de Distratores das Bancas
export type PsychometricDistractorType = 
  | 'generalizacao_indevida'           // Palavras extremas (sempre, nunca, exclusivamente)
  | 'conceito_correto_contexto_errado' // Tese jurídica verdadeira que não responde ao comando
  | 'meia_verdade'                     // 80% do texto certo, erro sutil no final
  | 'senso_comum'                      // Apelo à intuição moral vs rigor da lei seca
  | 'armadilha_semantica'              // FGV: Dupla negação, vocabulário rebuscado
  | 'distrator_temporal'               // Troca de prazos ou momentos processuais
  | 'inversao_competencia'             // Atribuição de poder para órgão errado
  | 'lei_revogada';                    // Tese anterior/superada para pegar desatualizados

export interface PsychometricDistractorDef {
  id: PsychometricDistractorType;
  name: string;
  shortName: string;
  icon: string;
  bancaSpecialty: string;
  severity: 'Crítica' | 'Alta' | 'Moderada';
  description: string;
  examinerLogic: string;
  antidoteStrategy: string;
  exampleSnippet: string;
}

export interface BancaPsychometricProfile {
  banca: 'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp';
  title: string;
  tagline: string;
  totalQuestionsMapped: number;
  discriminationEfficiency: number; // ex: 94%
  primaryDistractor: PsychometricDistractorType;
  secondaryDistractor: PsychometricDistractorType;
  distractorDistribution: {
    type: PsychometricDistractorType;
    name: string;
    percentage: number;
    color: string;
  }[];
  examinerPsychologicalProfile: string;
  antidoteGoldenRule: string;
  studentVulnerabilityRate: number; // taxa de erro do aluno nessa banca
}

export type GuardianAnimalId = 'coruja' | 'lobo' | 'gaviao' | 'leao' | 'raposa' | 'onca' | 'fenix';

export interface GuardianAnimal {
  id: GuardianAnimalId;
  name: string;
  title: string;
  emoji: string;
  archetype: string;
  superpower: string;
  cognitiveStyle: string;
  motto: string;
  colorGradient: string;
  glowColor: string;
  bestForCareers: string[];
  stats: {
    foco: number;
    velocidade: number;
    resiliencia: number;
    estrategia: number;
  };
}

export interface StudentProfile {
  name: string;
  warName?: string;
  targetCareer: 'policial' | 'fiscal' | 'tribunais' | 'administrativa' | 'juridica' | 'controle' | 'outra';
  targetExamTitle?: string;
  dailyHoursGoal: number;
  experienceLevel: 'iniciante' | 'intermediario' | 'veterano';
  guardianAnimalId: GuardianAnimalId;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// TIPAGENS DO PIPELINE DE INGESTÃO E AUDITORIA DE PROVAS
// ==============================================================================

export interface ExamIngestionMetadata {
  title: string;
  banca: 'Cebraspe' | 'FGV' | 'FCC' | 'Vunesp' | 'Outra';
  institution: string; // Ex: Polícia Federal, Receita Federal
  role: string; // Ex: Agente, Auditor-Fiscal
  year: number;
  bookletColorOrCode?: string; // Ex: Caderno Branco, Caderno 1
  sourceUrl?: string; // Link oficial da banca examinadora
  careerCategory: 'policial' | 'fiscal' | 'tribunais' | 'juridica' | 'administrativa' | 'bancaria';
}

export interface AnswerKeyEntry {
  questionNumber: number;
  officialAnswer: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'CERTO' | 'ERRADO' | 'C' | 'E' | 'X' | 'ANULADA'
  status: 'valida' | 'anulada' | 'alterada';
  note?: string;
}

export interface ParsedExamQuestion extends Question {
  questionNumber: number;
  officialAnswerKey: string;
  isAnnulledByBanca: boolean;
  legalUpdateWarning?: string;
  confidenceScore?: number; // 0 a 100
  auditDetails: {
    bancaOfficialDocument: string;
    verifiedAt: string;
    humanAudited: boolean;
  };
}

export interface IngestionAuditSummary {
  totalQuestionsExtracted: number;
  validQuestionsCount: number;
  annulledQuestionsCount: number;
  alteredLegalNormsCount: number;
  averageConfidence: number;
  bancaDetected: string;
  examTitle: string;
}

export interface ExamIngestionResult {
  metadata: ExamIngestionMetadata;
  summary: IngestionAuditSummary;
  questions: ParsedExamQuestion[];
  sqlInsertScript: string;
  warnings: string[];
}

// ==============================================================================
// TIPAGENS DO RADAR DE CONCURSOS, OAB, ENEM E GESTÃO DE ASSINATURA
// ==============================================================================

export type ConcursoStatus = 'publicado' | 'previsto' | 'rumor';

export type ConcursoCategory = 
  | 'juridica' 
  | 'policial' 
  | 'fiscal' 
  | 'tribunais' 
  | 'administrativa' 
  | 'oab' 
  | 'enem';

export type BrazilRegion = 'Nacional' | 'Sudeste' | 'Sul' | 'Centro-Oeste' | 'Nordeste' | 'Norte';

export interface ConcursoRadarItem {
  id: string;
  title: string;
  institution: string;
  banca: string;
  role: string;
  salary: string;
  vacancies: string | number;
  educationLevel: 'Superior' | 'Médio' | 'Pós/Específico';
  status: ConcursoStatus;
  category: ConcursoCategory;
  registrationPeriod?: string;
  examDate?: string;
  officialNoticeUrl?: string;
  keyHighlights: string[];
  matchedEditalId?: string; // ID correspondente para carregamento em 1 clique
  location: string;
  scope: 'Nacional' | 'Estadual' | 'Municipal';
  region?: BrazilRegion;
  stateCode?: string; // SP, RJ, DF, etc.
}

export interface OABCalendarEntry {
  edition: string;
  year: number;
  editalDate: string;
  registrationPeriod: string;
  phase1Date: string;
  phase2Date: string;
  status: 'aberto' | 'em_andamento' | 'previsto';
  fee: string;
  details: {
    banca: string;
    phase1Structure: string;
    phase2Structure: string;
    repescagemInfo: string;
    criticalSubjects: string[];
  };
}

export interface ENEMCalendarEntry {
  edition: string;
  year: number;
  exemptionPeriod: string;
  registrationPeriod: string;
  day1Date: string;
  day2Date: string;
  resultDate: string;
  sisuDate: string;
  fee: string;
  details: {
    day1Subjects: string;
    day2Subjects: string;
    triMechanism: string;
    redacaoCriteria: string[];
  };
}

export interface InvoiceEntry {
  id: string;
  planId: SubscriptionPlan;
  billingCycle: 'mensal' | 'trimestral' | 'anual' | 'vitalicio';
  amount: number;
  status: 'paga' | 'pendente' | 'cancelada';
  paidAt: string;
  paymentMethod: 'pix' | 'cartao';
  receiptCode: string;
}

export interface SubscriptionDetail {
  planId: SubscriptionPlan;
  status: 'ativa' | 'cancelada' | 'expirada' | 'pendente';
  currentPeriodEnd: string;
  autoRenew: boolean;
  billingCycle: 'mensal' | 'trimestral' | 'anual' | 'vitalicio';
  paymentMethodDesc: string;
  invoices: InvoiceEntry[];
}

export interface CouponDiscount {
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
}

