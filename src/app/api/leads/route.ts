import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getEditalBySlug } from '@/lib/editaisCatalog';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

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
    // 0. Rate limiting contra flood de submissões
    const ip = getClientIp(req);
    const { allowed, resetTime } = checkRateLimit(`lead_${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Limite de cadastros excedido temporariamente. Tente novamente em 1 minuto.',
          retryAfterSeconds: Math.ceil((resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Payload JSON inválido ou malformado.' },
        { status: 400 }
      );
    }

    const { name, email, phone, editalSlug, examTitle } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'E-mail inválido. Forneça um e-mail válido.' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome é obrigatório e deve ter no mínimo 2 caracteres.' },
        { status: 400 }
      );
    }

    const lead: LeadRecord = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 120),
      phone: phone && typeof phone === 'string' ? phone.trim().slice(0, 20) : undefined,
      editalSlug: editalSlug || 'geral',
      examTitle: examTitle || 'Concurso Geral',
      createdAt: new Date().toISOString(),
    };

    // 1. Armazenamento em memória
    globalLeads.push(lead);

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
      { success: false, error: 'Falha interna ao processar registro de lead.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Proteção de PII (Personally Identifiable Information)
  // Apenas contagem e resumo anônimo são públicos; PII completa requer chave administrativa
  const authHeader = req.headers.get('authorization') || '';
  const adminSecret = process.env.ADMIN_API_KEY || 'learning-ai-admin-secret';
  const isAdmin = authHeader === `Bearer ${adminSecret}`;

  if (isAdmin) {
    return NextResponse.json({
      success: true,
      totalLeads: globalLeads.length,
      leads: globalLeads.slice(-50),
    });
  }

  // Resposta pública anonimizada (zero vazamento de e-mails e telefones)
  return NextResponse.json({
    success: true,
    totalLeads: globalLeads.length,
    recentOverview: globalLeads.slice(-5).map((l) => ({
      id: l.id,
      editalSlug: l.editalSlug,
      examTitle: l.examTitle,
      createdAt: l.createdAt,
    })),
  });
}
