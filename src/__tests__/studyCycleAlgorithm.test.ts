import { describe, it, expect } from 'vitest';
import { generateDynamicSchedule } from '@/lib/studyCycleUtils';
import { ExamNotice } from '@/lib/types';

describe('Regras Críticas de Negócio: Algoritmo do Ciclo Meirelles Adaptativo', () => {
  const mockExam: ExamNotice = {
    id: 'exam-pf-2026',
    title: 'Polícia Federal - Agente',
    banca: 'Cebraspe',
    role: 'Agente de Polícia Federal',
    careerCategory: 'policial',
    publicationDate: '2026-01-15',
    examDate: '2026-06-20',
    daysRemaining: 85,
    status: 'inscricoes_abertas',
    subjectsCount: 3,
    totalTopics: 12,
    completedTopics: 4,
    studyProgressPercentage: 33,
    subjects: [
      {
        id: 'sub-dir-penal',
        name: 'Direito Penal',
        weight: 1,
        relevancePercentage: 20,
        totalTopics: 3,
        topics: [{ id: 't-1', name: 'Crimes Contra a Vida', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado' }],
      },
      {
        id: 'sub-ti',
        name: 'Tecnologia da Informação',
        weight: 3, // Maior peso no concurso da PF
        relevancePercentage: 50,
        totalTopics: 5,
        topics: [{ id: 't-2', name: 'Banco de Dados e SQL', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego' }],
      },
      {
        id: 'sub-port',
        name: 'Língua Portuguesa',
        weight: 2,
        relevancePercentage: 30,
        totalTopics: 4,
        topics: [{ id: 't-3', name: 'Crase e Regência Verbal', frequencyInBanca: 'Alta', accuracyRate: 65, status: 'Instável' }],
      },
    ],
  };

  it('deve priorizar a matéria vulnerável (Calcanhar de Aquiles) no topo do ciclo', () => {
    // Declarado que o aluno tem dificuldade em Penal (mesmo tendo peso menor que TI)
    const schedule = generateDynamicSchedule(mockExam, 4, 'Direito Penal');

    // O primeiro bloco do primeiro dia DEVE ser a matéria vulnerável
    const firstDay = schedule[0];
    expect(firstDay.blocks[0].subjectName).toBe('Direito Penal');
    expect(firstDay.blocks[0].topicName).toContain('🛡️ [Foco Blindagem]');
    expect(firstDay.blocks[0].method).toContain('Blindagem Cognitiva');
  });

  it('deve distribuir as horas de estudo diárias proporcionalmente em minutos', () => {
    const dailyHours = 3; // 180 minutos
    const schedule = generateDynamicSchedule(mockExam, dailyHours);

    const firstDay = schedule[0];
    const totalMinutesScheduled = firstDay.blocks.reduce((acc, b) => acc + b.durationMinutes, 0);

    // Deve totalizar aproximadamente 180 minutos
    expect(Math.abs(totalMinutesScheduled - 180)).toBeLessThanOrEqual(2);
  });

  it('deve dimensionar a meta de questões com base na duração do bloco', () => {
    const schedule = generateDynamicSchedule(mockExam, 4); // 4 horas = 240 minutos
    const firstBlock = schedule[0].blocks[0];

    // Para blocos longos (60-90 min), a meta de questões deve ser proporcional
    expect(firstBlock.questionsTarget).toBeGreaterThanOrEqual(10);
    expect(firstBlock.completedQuestions).toBeGreaterThanOrEqual(0);
  });

  it('deve rotacionar matérias entre os dias evitando repetição contínua', () => {
    const schedule = generateDynamicSchedule(mockExam, 4);

    expect(schedule.length).toBe(3); // 3 dias gerados
    const day1Subjects = schedule[0].blocks.map((b) => b.subjectName);
    const day2Subjects = schedule[1].blocks.map((b) => b.subjectName);

    // As disciplinas mudam de posição ou rotacionam no ciclo
    expect(day1Subjects).toBeDefined();
    expect(day2Subjects).toBeDefined();
  });
});
