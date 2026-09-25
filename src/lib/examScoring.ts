import { MockExamScoringRule, MockExamSubjectBreakdown } from './types';

export interface ExamAnswerItem {
  questionId: string;
  subjectName: string;
  selectedOption: string | null; // null = deixada em branco
  officialAnswer: string;        // 'CERTO', 'ERRADO', 'A', 'B', etc.
  isAnnulled?: boolean;          // Questão anulada pela banca
  weight?: number;               // Peso da questão (padrão: 1)
}

export interface ExamScoreInput {
  examId?: string;
  examTitle?: string;
  banca?: string;
  totalQuestions: number;
  scoringRule: MockExamScoringRule;
  answers: ExamAnswerItem[];
  cutoffScore?: number;
  minimumCutoffPerSubject?: Record<string, number>; // Nota mínima exigida por disciplina
}

export interface ExamScoreOutput {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  annulledCount: number;
  grossScore: number;
  penaltyDeductions: number;
  netScore: number;
  percentage: number;
  isAboveCutoff: boolean;
  cutoffScore: number;
  isEliminatedByMinimum: boolean;
  eliminationReasons: string[];
  subjectBreakdown: MockExamSubjectBreakdown[];
}

/**
 * Calculadora Oficial de Pontuação de Concursos Públicos
 * Suporta o modelo Cebraspe (uma errada anula uma certa) e Múltipla Escolha Ponderada.
 */
export function calculateExamScore(input: ExamScoreInput): ExamScoreOutput {
  const {
    totalQuestions,
    scoringRule,
    answers,
    cutoffScore = 60,
    minimumCutoffPerSubject = {},
  } = input;

  let correctCount = 0;
  let wrongCount = 0;
  let blankCount = 0;
  let annulledCount = 0;
  let grossScore = 0;
  let penaltyDeductions = 0;

  // Agrupamento por disciplina
  const subjectsMap: Record<
    string,
    { total: number; correct: number; wrong: number; blank: number; annulled: number; gross: number; penalty: number }
  > = {};

  for (const item of answers) {
    const subj = item.subjectName || 'Conhecimentos Gerais';
    if (!subjectsMap[subj]) {
      subjectsMap[subj] = { total: 0, correct: 0, wrong: 0, blank: 0, annulled: 0, gross: 0, penalty: 0 };
    }
    subjectsMap[subj].total += 1;

    const weight = item.weight && item.weight > 0 ? item.weight : 1;

    // Regra 1: Questão Anulada Oficialmente
    // Em concursos públicos, questão anulada atribui ponto a todos os candidatos
    if (item.isAnnulled || item.officialAnswer === 'ANULADA' || item.officialAnswer === 'X') {
      annulledCount += 1;
      correctCount += 1;
      grossScore += weight;
      subjectsMap[subj].annulled += 1;
      subjectsMap[subj].correct += 1;
      subjectsMap[subj].gross += weight;
      continue;
    }

    // Regra 2: Deixada em Branco / Não Respondida
    if (item.selectedOption === null || item.selectedOption === undefined || item.selectedOption.trim() === '') {
      blankCount += 1;
      subjectsMap[subj].blank += 1;
      continue; // Não pontua e nem sofre penalidade
    }

    // Regra 3: Comparação de Gabarito
    const normalizedSelected = item.selectedOption.trim().toUpperCase();
    const normalizedOfficial = item.officialAnswer.trim().toUpperCase();

    const isMatch =
      normalizedSelected === normalizedOfficial ||
      (normalizedSelected === 'C' && normalizedOfficial === 'CERTO') ||
      (normalizedSelected === 'CERTO' && normalizedOfficial === 'C') ||
      (normalizedSelected === 'E' && normalizedOfficial === 'ERRADO') ||
      (normalizedSelected === 'ERRADO' && normalizedOfficial === 'E');

    if (isMatch) {
      correctCount += 1;
      grossScore += weight;
      subjectsMap[subj].correct += 1;
      subjectsMap[subj].gross += weight;
    } else {
      wrongCount += 1;
      subjectsMap[subj].wrong += 1;
      if (scoringRule === 'cebraspe_uma_anula_uma') {
        penaltyDeductions += weight;
        subjectsMap[subj].penalty += weight;
      }
    }
  }

  // Cálculo da Nota Líquida
  let netScore = 0;
  if (scoringRule === 'cebraspe_uma_anula_uma') {
    // No método Cebraspe: Nota Líquida = Acertos - Erros (piso em zero no simulado)
    netScore = Math.max(0, grossScore - penaltyDeductions);
  } else {
    // Múltipla Escolha Ponderada: Sem dedução por erro
    netScore = grossScore;
  }

  const answeredCount = correctCount + wrongCount;
  const effectiveTotal = Math.max(1, totalQuestions);
  const percentage = Math.round((netScore / effectiveTotal) * 100);

  // Verificação de Critérios de Eliminação por Disciplina (Cláusula de Barreira)
  const eliminationReasons: string[] = [];
  const subjectBreakdown: MockExamSubjectBreakdown[] = Object.entries(subjectsMap).map(
    ([name, data]) => {
      const subjNet =
        scoringRule === 'cebraspe_uma_anula_uma'
          ? Math.max(0, data.gross - data.penalty)
          : data.gross;

      const requiredMin = minimumCutoffPerSubject[name];
      if (requiredMin !== undefined && subjNet < requiredMin) {
        eliminationReasons.push(
          `Reprovado no critério de corte de ${name}: obteve ${subjNet} pts (mínimo exigido: ${requiredMin} pts).`
        );
      }

      return {
        subjectName: name,
        total: data.total,
        correct: data.correct,
        wrong: data.wrong,
        blank: data.blank,
        grossScore: data.gross,
        penaltyDeductions: data.penalty,
        netScore: subjNet,
      };
    }
  );

  const isEliminatedByMinimum = eliminationReasons.length > 0;
  const isAboveCutoff = !isEliminatedByMinimum && percentage >= cutoffScore;

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    wrongCount,
    blankCount,
    annulledCount,
    grossScore,
    penaltyDeductions,
    netScore,
    percentage,
    isAboveCutoff,
    cutoffScore,
    isEliminatedByMinimum,
    eliminationReasons,
    subjectBreakdown,
  };
}
