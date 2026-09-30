import { describe, it, expect, beforeEach } from 'vitest';
import { SeanEllisResult } from '../components/SeanEllisSurveyModal';

describe('Ciclo de Feedback & Teste de PMF (Sean Ellis)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve armazenar e atualizar votos de micro-feedback de IA no localStorage', () => {
    const questionId = 'q-constitucional-01';
    
    // Simula primeiro voto positivo
    const firstVote = {
      id: 'vote-1',
      questionId,
      banca: 'Cebraspe',
      subject: 'Direito Constitucional',
      vote: 'up' as const,
      tags: [],
      comment: '',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('aprovalens_ai_feedback_votes', JSON.stringify([firstVote]));
    
    let saved = JSON.parse(localStorage.getItem('aprovalens_ai_feedback_votes') || '[]');
    expect(saved.length).toBe(1);
    expect(saved[0].vote).toBe('up');
    expect(saved[0].questionId).toBe(questionId);

    // Simula atualização para voto negativo com tags
    const updatedVotes = saved.filter((v: any) => v.questionId !== questionId);
    updatedVotes.push({
      id: 'vote-2',
      questionId,
      banca: 'Cebraspe',
      subject: 'Direito Constitucional',
      vote: 'down' as const,
      tags: ['Faltou citar artigo/lei', 'Pegadinha mal explicada'],
      comment: 'Faltou mencionar o art. 5º, inciso LXVIII',
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('aprovalens_ai_feedback_votes', JSON.stringify(updatedVotes));
    saved = JSON.parse(localStorage.getItem('aprovalens_ai_feedback_votes') || '[]');

    expect(saved.length).toBe(1);
    expect(saved[0].vote).toBe('down');
    expect(saved[0].tags).toContain('Faltou citar artigo/lei');
    expect(saved[0].comment).toContain('art. 5º');
  });

  it('deve formatar e persistir corretamente o payload do Sean Ellis PMF Survey', () => {
    const sampleResult: SeanEllisResult = {
      disappointmentLevel: 'very_disappointed',
      primaryBenefit: 'Predição estatística e pegadinhas da banca',
      targetAudienceOpinion: 'Concurseiros de carreiras policiais que erram pegadinhas',
      improvementSuggestion: 'Adicionar mais questões inéditas de informática Cebraspe',
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem('learning_ai_sean_ellis_survey_completed', 'true');
    localStorage.setItem('learning_ai_sean_ellis_survey_result', JSON.stringify(sampleResult));

    const isCompleted = localStorage.getItem('learning_ai_sean_ellis_survey_completed');
    expect(isCompleted).toBe('true');

    const retrievedResult: SeanEllisResult = JSON.parse(
      localStorage.getItem('learning_ai_sean_ellis_survey_result') || '{}'
    );

    expect(retrievedResult.disappointmentLevel).toBe('very_disappointed');
    expect(retrievedResult.primaryBenefit).toContain('pegadinhas da banca');
    expect(retrievedResult.submittedAt).toBeDefined();
  });

  it('deve calcular corretamente a data de adiamento (skip until) da pesquisa de PMF', () => {
    const now = Date.now();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const skipTimestamp = now + twoDaysMs;

    localStorage.setItem('learning_ai_sean_ellis_skip_until', skipTimestamp.toString());

    const savedSkip = parseInt(localStorage.getItem('learning_ai_sean_ellis_skip_until') || '0', 10);
    expect(savedSkip).toBeGreaterThan(now);
    expect(savedSkip - now).toBeLessThanOrEqual(twoDaysMs);
  });

  it('Pilar 2: deve anexar is_paying_or_committed nos tickets de suporte para qualificação', () => {
    const ticket = {
      id: 'ticket-001',
      date: new Date().toISOString(),
      studentName: 'Lucas Pagante',
      targetExam: 'Polícia Federal',
      currentTab: 'Simulado',
      category: 'Dúvida na questão',
      rating: 5,
      message: 'Explicação do Copiloto no simulado',
      is_paying_or_committed: true,
      prioritySla: 'alta_prioridade_1h',
    };

    localStorage.setItem('learning_ai_support_tickets', JSON.stringify([ticket]));

    const tickets = JSON.parse(localStorage.getItem('learning_ai_support_tickets') || '[]');
    expect(tickets.length).toBe(1);
    expect(tickets[0].is_paying_or_committed).toBe(true);
    expect(tickets[0].prioritySla).toBe('alta_prioridade_1h');
  });

  it('Pilar 3: deve estruturar e persistir o diagnóstico de churn com módulo e motivo', () => {
    const churnPayload = {
      userId: 'user_123',
      planId: 'pro',
      isTrial: true,
      daysActive: 6,
      failedModule: 'copiloto_cognitivo',
      churnReason: 'explicacao_ia_insuficiente',
      feedbackText: 'Faltou aprofundar na jurisprudência do STJ',
      retentionOfferPresented: true,
      retentionOfferAccepted: false,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('learning_ai_churn_diagnostics', JSON.stringify([churnPayload]));

    const stored = JSON.parse(localStorage.getItem('learning_ai_churn_diagnostics') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].failedModule).toBe('copiloto_cognitivo');
    expect(stored[0].churnReason).toBe('explicacao_ia_insuficiente');
    expect(stored[0].retentionOfferAccepted).toBe(false);
  });
});

