import { describe, it, expect } from 'vitest';
import { AsyncJobManager } from '../lib/queue/jobManager';

describe('Processamento Assíncrono & Fila de Jobs de Editais', () => {
  it('deve criar um job com status inicial "queued" e progresso positivo', () => {
    const job = AsyncJobManager.createJob({
      examTitle: 'Concurso Polícia Federal - Agente',
      role: 'Agente de Polícia Federal',
      banca: 'Cebraspe',
      salary: 'R$ 13.600,00',
      vacancies: 300,
      editalText: 'Conteúdo programático Direito Penal e Processual Penal...',
    });

    expect(job.id).toBeDefined();
    expect(job.id.startsWith('job_edital_')).toBe(true);
    expect(job.status).toBe('queued');
    expect(job.progressPercentage).toBeGreaterThanOrEqual(5);
    expect(job.currentStepMessage).toContain('fila');
  });

  it('deve permitir buscar o job pelo ID através de getJob', () => {
    const job = AsyncJobManager.createJob({
      examTitle: 'TJ-SP Escrevente Técnico',
      role: 'Escrevente',
      banca: 'Vunesp',
    });

    const retrieved = AsyncJobManager.getJob(job.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(job.id);
  });

  it('deve atualizar o estado do job e transicionar para concluído', async () => {
    const job = AsyncJobManager.createJob({
      examTitle: 'Receita Federal - Auditor Fiscal',
      role: 'Auditor Fiscal',
      banca: 'FGV',
    });

    // Esperar um ciclo para que as transições assíncronas aconteçam
    await new Promise((r) => setTimeout(r, 2600));

    const finishedJob = AsyncJobManager.getJob(job.id);
    expect(finishedJob?.status).toBe('completed');
    expect(finishedJob?.progressPercentage).toBe(100);
    expect(finishedJob?.result).toBeDefined();
    expect(finishedJob?.result?.subjects.length).toBeGreaterThan(0);
  });
});
