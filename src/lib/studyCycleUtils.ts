import { ExamNotice, DailyScheduleItem } from '@/lib/types';

/**
 * Gerador dinâmico de cronograma por Ciclo Meirelles baseado nas disciplinas e pesos do edital selecionado
 */
export const generateDynamicSchedule = (
  exam: ExamNotice,
  dailyHours: number = 4,
  weakSubject?: string
): DailyScheduleItem[] => {
  const subjects = exam?.subjects && exam.subjects.length > 0 ? exam.subjects : [
    {
      id: 'sub-def-1',
      name: 'Conhecimentos Específicos',
      weight: 3,
      relevancePercentage: 50,
      totalTopics: 3,
      topics: [{ id: 't-1', name: 'Tópicos Críticos do Edital', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Ponto Cego' }]
    },
    {
      id: 'sub-def-2',
      name: 'Língua Portuguesa',
      weight: 2,
      relevancePercentage: 30,
      totalTopics: 2,
      topics: [{ id: 't-2', name: 'Interpretação e Gramática', frequencyInBanca: 'Alta', accuracyRate: 70, status: 'Instável' }]
    }
  ];

  // Ordenar disciplinas colocando o Calcanhar de Aquiles (matéria fraca) no topo absoluto, depois pelo peso (weight)
  const sortedSubjects = [...subjects].sort((a, b) => {
    const isAWeak = weakSubject && a.name.toLowerCase().includes(weakSubject.toLowerCase());
    const isBWeak = weakSubject && b.name.toLowerCase().includes(weakSubject.toLowerCase());
    if (isAWeak && !isBWeak) return -1;
    if (!isAWeak && isBWeak) return 1;
    return b.weight - a.weight;
  });

  const totalMinutesPerDay = Math.max(90, Math.round(dailyHours * 60));

  const daysConfig = [
    { id: 'day-1', label: 'Hoje (Segunda-feira)', dateStr: '01 Set 2026' },
    { id: 'day-2', label: 'Amanhã (Terça-feira)', dateStr: '02 Set 2026' },
    { id: 'day-3', label: 'Quarta-feira', dateStr: '03 Set 2026' }
  ];

  return daysConfig.map((day, dayIndex) => {
    // Rotacionar disciplinas em ciclo de 2 a 3 blocos por dia (Método Meirelles)
    const daySubjects = [
      sortedSubjects[(dayIndex * 2) % sortedSubjects.length],
      sortedSubjects[(dayIndex * 2 + 1) % sortedSubjects.length]
    ].filter(Boolean);

    if (sortedSubjects.length > 2 && dailyHours >= 4) {
      const third = sortedSubjects[(dayIndex * 2 + 2) % sortedSubjects.length];
      if (third && !daySubjects.some((s) => s.id === third.id)) {
        daySubjects.push(third);
      }
    }

    const minutesPerBlock = Math.round(totalMinutesPerDay / daySubjects.length);

    const blocks = daySubjects.map((sub, sIdx) => {
      const topTopic = sub.topics && sub.topics.length > 0 ? sub.topics[dayIndex % sub.topics.length] : null;
      const topicName = topTopic ? topTopic.name : 'Tópicos Fundamentais da Disciplina';
      const isWeak = weakSubject && sub.name.toLowerCase().includes(weakSubject.toLowerCase());

      const questionsTarget = Math.max(10, Math.round((minutesPerBlock / 60) * 12));

      return {
        id: `b-${day.id}-${sIdx + 1}`,
        subjectId: sub.id,
        subjectName: sub.name,
        topicName: isWeak ? `🛡️ [Foco Blindagem] ${topicName}` : topicName,
        durationMinutes: minutesPerBlock,
        method: isWeak 
          ? `Ciclo Ponderado Peso ${sub.weight} + Blindagem Cognitiva` 
          : `Resolução Ativa de Questões ${exam.banca || 'Banca'}`,
        status: (dayIndex === 0 && sIdx === 0 ? 'concluido' : 'pendente') as 'concluido' | 'pendente',
        questionsTarget,
        completedQuestions: dayIndex === 0 && sIdx === 0 ? questionsTarget : 0
      };
    });

    return {
      id: day.id,
      dayOfWeek: day.label,
      dateStr: day.dateStr,
      blocks
    };
  });
};
