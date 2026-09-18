import { NextResponse } from 'next/server';
import { AsyncJobManager } from '@/lib/queue/jobManager';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const job = AsyncJobManager.getJob(id);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job não encontrado ou expirado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progressPercentage,
        message: job.currentStepMessage,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        result: job.result || null,
        error: job.error || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao consultar status do job.' },
      { status: 500 }
    );
  }
}
