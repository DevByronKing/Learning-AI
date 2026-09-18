import { NextResponse } from 'next/server';
import { AsyncJobManager } from '@/lib/queue/jobManager';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      examTitle = 'Edital Analisado por IA',
      role = 'Analista / Técnico',
      banca = 'Cebraspe',
      salary = 'R$ 8.520,00',
      vacancies = 150,
      editalText = '',
      pdfFileName = 'Edital_Upload.pdf'
    } = body;

    // Cria o job assíncrono na fila e retorna imediatamente o ID para polling
    const job = AsyncJobManager.createJob({
      examTitle,
      role,
      banca,
      salary,
      vacancies,
      editalText,
      pdfFileName,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      progress: job.progressPercentage,
      message: 'Edital enfileirado com sucesso para processamento em segundo plano.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao enfileirar processamento do edital.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const jobs = AsyncJobManager.getAllJobs();
  return NextResponse.json({
    success: true,
    total: jobs.length,
    jobs: jobs.slice(0, 10),
  });
}
