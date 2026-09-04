import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getEditalBySlug } from '@/lib/editaisCatalog';

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  editalSlug: string;
  examTitle: string;
  createdAt: string;
}

// Store em memória para fallback resiliente
const globalLeads: LeadRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, editalSlug, examTitle } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'E-mail inválido. Forneça um e-mail válido.' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome é obrigatório.' },
        { status: 400 }
      );
    }

    const lead: LeadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      editalSlug: editalSlug || 'geral',
      examTitle: examTitle || 'Concurso Geral',
      createdAt: new Date().toISOString(),
    };

    // 1. Armazenamento em memória
    globalLeads.push(lead);
    console.log(`[Lead Capture] Novo lead registrado: ${lead.email} para ${lead.examTitle}`);

    // 2. Persistência no Supabase (se configurado)
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client
          .from('leads')
          .insert({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            target_edital: lead.editalSlug,
            created_at: lead.createdAt,
          })
          .then(({ error }: any) => {
            if (error) console.warn('Aviso Supabase (leads insert):', error.message);
          });
      }
    }

    // 3. Obter dados do edital para retorno imediato do material
    const edital = getEditalBySlug(editalSlug);

    return NextResponse.json({
      success: true,
      message: 'Cadastro realizado com sucesso! Seu material está pronto para download.',
      leadId: lead.id,
      editalTitle: edital?.title || examTitle,
      downloadReady: true,
    });
  } catch (error: any) {
    console.error('Erro ao processar lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Falha ao registrar lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    totalLeads: globalLeads.length,
    recentLeads: globalLeads.slice(-10),
  });
}
