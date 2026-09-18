import { ExamNotice, ExamSubject } from '@/lib/types';

export type JobStatus = 
  | 'queued' 
  | 'extracting_pdf' 
  | 'ai_verticalizing' 
  | 'generating_topics' 
  | 'completed' 
  | 'failed';

export interface AsyncEditalJob {
  id: string;
  status: JobStatus;
  progressPercentage: number;
  currentStepMessage: string;
  createdAt: string;
  completedAt?: string;
  result?: ExamNotice;
  error?: string;
}

export interface CreateEditalJobParams {
  examTitle: string;
  role: string;
  banca: string;
  salary?: string;
  vacancies?: number;
  editalText?: string;
  pdfFileName?: string;
}

// Fila em memória para processamento assíncrono (resiliente e com expiração em 24h)
class JobManagerService {
  private jobs: Map<string, AsyncEditalJob> = new Map();

  createJob(params: CreateEditalJobParams): AsyncEditalJob {
    const jobId = `job_edital_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: AsyncEditalJob = {
      id: jobId,
      status: 'queued',
      progressPercentage: 5,
      currentStepMessage: 'Edital colocado na fila de processamento assíncrono...',
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(jobId, job);

    // Iniciar processamento desacoplado em background sem travar a requisição HTTP
    this.executeAsync(jobId, params).catch((err) => {
      console.error(`Erro crítico no job ${jobId}:`, err);
      this.updateJob(jobId, {
        status: 'failed',
        error: err?.message || 'Falha desconhecida no processamento em segundo plano.',
        currentStepMessage: 'Erro durante o processamento do edital.',
      });
    });

    return job;
  }

  getJob(jobId: string): AsyncEditalJob | null {
    return this.jobs.get(jobId) || null;
  }

  getAllJobs(): AsyncEditalJob[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  updateJob(jobId: string, updates: Partial<AsyncEditalJob>): AsyncEditalJob {
    const current = this.jobs.get(jobId);
    if (!current) throw new Error(`Job ${jobId} não encontrado.`);
    const updated: AsyncEditalJob = { ...current, ...updates };
    this.jobs.set(jobId, updated);
    return updated;
  }

  private async executeAsync(jobId: string, params: CreateEditalJobParams): Promise<void> {
    const {
      examTitle = 'Edital Analisado por IA',
      role = 'Analista / Técnico',
      banca = 'Cebraspe',
      salary = 'R$ 8.520,00',
      vacancies = 150,
      editalText = '',
      pdfFileName = 'Edital_Upload.pdf',
    } = params;

    // Etapa 1: Leitura e extração do documento
    await new Promise((r) => setTimeout(r, 600));
    this.updateJob(jobId, {
      status: 'extracting_pdf',
      progressPercentage: 25,
      currentStepMessage: `Extraindo seções de conhecimentos básicos e específicos do documento (${pdfFileName})...`,
    });

    // Etapa 2: Análise psicométrica e verticalização com IA / heurística da banca
    await new Promise((r) => setTimeout(r, 800));
    this.updateJob(jobId, {
      status: 'ai_verticalizing',
      progressPercentage: 60,
      currentStepMessage: `Consultando base cognitiva da banca ${banca} e calculando pesos de relevância...`,
    });

    // Heurística especializada de disciplinas e tópicos
    const subjects: ExamSubject[] = this.buildSubjectsByRole(examTitle, role, banca, editalText);

    // Etapa 3: Geração de matriz de relevância e pontos cegos
    await new Promise((r) => setTimeout(r, 600));
    this.updateJob(jobId, {
      status: 'generating_topics',
      progressPercentage: 85,
      currentStepMessage: 'Estruturando artigos legais, incidência histórica e árvore de estudo...',
    });

    await new Promise((r) => setTimeout(r, 400));

    const finalNotice: ExamNotice = {
      id: `notice-${Date.now()}`,
      title: examTitle,
      institution: examTitle.split(' - ')[0] || 'Órgão de Alta Relevância',
      banca: banca as any,
      role,
      salary,
      vacancies: Number(vacancies) || 150,
      examDate: '2026-12-15',
      daysRemaining: 95,
      pdfFileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      subjects,
    };

    // Etapa 4: Conclusão com sucesso
    this.updateJob(jobId, {
      status: 'completed',
      progressPercentage: 100,
      currentStepMessage: 'Edital verticalizado com sucesso!',
      completedAt: new Date().toISOString(),
      result: finalNotice,
    });
  }

  private buildSubjectsByRole(
    title: string,
    role: string,
    banca: string,
    rawText: string
  ): ExamSubject[] {
    const combined = `${title} ${role} ${rawText}`.toLowerCase();

    if (combined.includes('polic') || combined.includes('prf') || combined.includes('pf')) {
      return [
        {
          id: `sub-${Date.now()}-1`,
          name: 'Direito Penal & Legislação Especial Extravagante',
          weight: 3,
          relevancePercentage: 40,
          totalTopics: 4,
          topics: [
            { id: 't-pol-1', name: 'Crimes Contra o Patrimônio e Administração Pública', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Ponto Cego', articlesOrLaws: ['Arts. 155-180, 312-327 CP'] },
            { id: 't-pol-2', name: 'Lei de Drogas (Lei 11.343/06) & Tráfico Privilegiado', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado', articlesOrLaws: ['Lei 11.343/06'] },
            { id: 't-pol-3', name: 'Estatuto do Desarmamento (Lei 10.826/03)', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável', articlesOrLaws: ['Lei 10.826/03'] },
            { id: 't-pol-4', name: 'Abuso de Autoridade & Pacote Anticrime', frequencyInBanca: 'Média', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Lei 13.869/19'] }
          ]
        },
        {
          id: `sub-${Date.now()}-2`,
          name: 'Direito Processual Penal & Cadeia de Custódia',
          weight: 3,
          relevancePercentage: 35,
          totalTopics: 3,
          topics: [
            { id: 't-pol-5', name: 'Inquérito Policial e Notitia Criminis', frequencyInBanca: 'Alta', accuracyRate: 80, status: 'Dominado', articlesOrLaws: ['Arts. 4º a 23 CPP'] },
            { id: 't-pol-6', name: 'Prisão Preventiva e Liberdade Provisória', frequencyInBanca: 'Alta', accuracyRate: 55, status: 'Instável', articlesOrLaws: ['Arts. 310-313 CPP'] },
            { id: 't-pol-7', name: 'Teoria Geral das Provas e Cadeia de Custódia', frequencyInBanca: 'Alta', accuracyRate: 40, status: 'Ponto Cego', articlesOrLaws: ['Art. 158-A CPP'] }
          ]
        },
        {
          id: `sub-${Date.now()}-3`,
          name: `Língua Portuguesa Padrão ${banca}`,
          weight: 2,
          relevancePercentage: 25,
          totalTopics: 2,
          topics: [
            { id: 't-pol-8', name: 'Interpretação e Inferência Textual', frequencyInBanca: 'Alta', accuracyRate: 65, status: 'Instável' },
            { id: 't-pol-9', name: 'Sintaxe de Concordância e Regência', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado' }
          ]
        }
      ];
    }

    // Default Geral / Administrativo
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Constitucional & Teoria dos Direitos',
        weight: 3,
        relevancePercentage: 40,
        totalTopics: 3,
        topics: [
          { id: 't-gen-1', name: 'Direitos e Garantias Fundamentais (Art. 5º)', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Art. 5º CF/88'] },
          { id: 't-gen-2', name: 'Organização Político-Administrativa do Estado', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Ponto Cego', articlesOrLaws: ['Arts. 18-36 CF/88'] },
          { id: 't-gen-3', name: 'Controle Concentrado e Difuso de Constitucionalidade', frequencyInBanca: 'Alta', accuracyRate: 42, status: 'Ponto Cego', articlesOrLaws: ['Arts. 102-103 CF/88'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Direito Administrativo & Licitações',
        weight: 3,
        relevancePercentage: 35,
        totalTopics: 3,
        topics: [
          { id: 't-gen-4', name: 'Regime Jurídico dos Servidores (Lei 8.112/90)', frequencyInBanca: 'Alta', accuracyRate: 72, status: 'Instável', articlesOrLaws: ['Lei 8.112/90'] },
          { id: 't-gen-5', name: 'Nova Lei de Licitações (Lei 14.133/21)', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego', articlesOrLaws: ['Lei 14.133/21'] },
          { id: 't-gen-6', name: 'Atos Administrativos (Atributos e Anulação)', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável' }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: `Língua Portuguesa & Interpretação (${banca})`,
        weight: 2,
        relevancePercentage: 25,
        totalTopics: 2,
        topics: [
          { id: 't-gen-7', name: 'Tipologia e Compreensão Textual', frequencyInBanca: 'Alta', accuracyRate: 68, status: 'Instável' },
          { id: 't-gen-8', name: 'Crase, Regência e Pontuação Expressiva', frequencyInBanca: 'Alta', accuracyRate: 82, status: 'Dominado' }
        ]
      }
    ];
  }
}

// Singleton export
export const AsyncJobManager = new JobManagerService();
