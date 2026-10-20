import { NextResponse } from 'next/server';
import { getClientIp, checkRateLimit } from '@/lib/rateLimiter';

export interface CopyrightTakedownPayload {
  claimantName: string;
  claimantDocument: string; // CPF ou CNPJ
  claimantEmail: string;
  relationship: 'author' | 'rights_holder' | 'legal_representative';
  workTitle: string;
  workRegistrationProof?: string;
  infringingUrlOrItem: string;
  infringementDescription: string;
  goodFaithDeclaration: boolean;
}

// Log auditável em memória de protocolos de Notice & Takedown
const takedownTickets: Array<{
  protocol: string;
  payload: CopyrightTakedownPayload;
  ip: string;
  status: 'received' | 'under_review' | 'temporarily_disabled' | 'resolved';
  createdAt: string;
  slaLimit: string;
}> = [];

/**
 * Canal de Notificação e Retirada de Conteúdo por Direitos Autorais (Notice & Takedown)
 * Fundamentação: Marco Civil da Internet (Lei 12.965/2014, Art. 19), Lei de Direitos Autorais (Lei 9.610/98)
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed } = checkRateLimit(`takedown_${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Muitas notificações submetidas a partir deste IP. Aguarde um minuto.' },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Corpo da requisição em formato inválido.' },
        { status: 400 }
      );
    }

    const {
      claimantName,
      claimantDocument,
      claimantEmail,
      relationship,
      workTitle,
      workRegistrationProof,
      infringingUrlOrItem,
      infringementDescription,
      goodFaithDeclaration,
    }: CopyrightTakedownPayload = body || {};

    // 1. Validações formais do notificante
    if (!claimantName || claimantName.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Nome completo ou Razão Social do titular/notificante é obrigatório.' },
        { status: 400 }
      );
    }

    if (!claimantDocument || claimantDocument.trim().length < 11) {
      return NextResponse.json(
        { success: false, error: 'CPF ou CNPJ válido do notificante é obrigatório para identificação legal.' },
        { status: 400 }
      );
    }

    if (!claimantEmail || !claimantEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'E-mail para comunicações e protocolo formal é obrigatório.' },
        { status: 400 }
      );
    }

    // 2. Validações da obra e do conteúdo alegadamente infringente
    if (!workTitle || workTitle.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Identificação da obra intelectual protegida é obrigatória.' },
        { status: 400 }
      );
    }

    if (!infringingUrlOrItem || infringingUrlOrItem.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Identificação da URL ou item específico dentro da plataforma é obrigatória.' },
        { status: 400 }
      );
    }

    if (!infringementDescription || infringementDescription.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Descreva sucintamente em que consiste a suposta violação de direitos autorais.' },
        { status: 400 }
      );
    }

    if (!goodFaithDeclaration) {
      return NextResponse.json(
        {
          success: false,
          error: 'É obrigatório declarar a titularidade ou representação legal da obra sob as penas do Art. 299 do Código Penal.',
        },
        { status: 400 }
      );
    }

    // Geração do Protocolo Oficial de Notice & Takedown
    const currentYear = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const protocol = `TKD-${currentYear}-${randomHex}`;

    const now = new Date();
    // SLA de 48 horas úteis para resposta e análise cautelar
    const slaDate = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const ticketRecord = {
      protocol,
      payload: {
        claimantName: claimantName.trim(),
        claimantDocument: claimantDocument.trim(),
        claimantEmail: claimantEmail.trim().toLowerCase(),
        relationship,
        workTitle: workTitle.trim(),
        workRegistrationProof: workRegistrationProof?.trim(),
        infringingUrlOrItem: infringingUrlOrItem.trim(),
        infringementDescription: infringementDescription.trim(),
        goodFaithDeclaration,
      },
      ip,
      status: 'received' as const,
      createdAt: now.toISOString(),
      slaLimit: slaDate.toISOString(),
    };

    takedownTickets.push(ticketRecord);

    return NextResponse.json({
      success: true,
      protocol,
      message: 'Notificação de infração a direitos autorais registrada com sucesso.',
      slaHours: 48,
      status: 'recebida_para_analise_cautelar',
      procedure: [
        '1. Triagem imediata pela Diretoria Jurídica e de Compliance em até 24h úteis.',
        '2. Suspensão preventiva/cautelar do conteúdo apontado caso haja indício de verossimilhança.',
        '3. Notificação do colaborador/criador para eventual apresentação de contranotificação fundamentada.',
        '4. Comunicação formal do resultado e do desfecho para o e-mail cadastrado.',
      ],
      legalNotice: 'Procedimento estruturado em conformidade com o Art. 19 do Marco Civil da Internet (Lei 12.965/2014) e Lei 9.610/98.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Erro ao processar notificação de direitos autorais.' },
      { status: 500 }
    );
  }
}

/**
 * Consulta de informações sobre a política de direitos autorais e status do canal
 */
export async function GET() {
  return NextResponse.json({
    channel: 'Canal Oficial de Notice & Takedown — Argus',
    legalEntity: 'ARGUS TECNOLOGIA EDUCACIONAL LTDA.',
    cnpj: '52.040.000/0001-98',
    dpoContact: 'juridico@argus.app.br',
    sla: '48 horas úteis para análise preliminar e eventual suspensão cautelar',
    applicableLegislation: [
      'Lei nº 9.610/1998 (Lei de Direitos Autorais)',
      'Lei nº 12.965/2014, Art. 19 (Marco Civil da Internet)',
      'Código Penal Brasileiro, Art. 299 (Falsidade Ideológica para notificações fraudulentas)',
    ],
  });
}
