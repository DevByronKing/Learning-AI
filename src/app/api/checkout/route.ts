import { NextRequest, NextResponse } from 'next/server';
import { TransactionManager } from '@/lib/transactions';
import { PaymentGateway } from '@/lib/paymentGateways';
import { SubscriptionPlan } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      planId = 'pro', 
      billingCycle = 'annual', 
      paymentMethod = 'pix', 
      userEmail = 'aluno@aprovalens.ai', 
      userName = 'Concurseiro' 
    } = body;

    // Cálculo de preços baseado em ciclo
    const prices: Record<string, { name: string; monthly: number; annual: number }> = {
      aspirante: { name: 'Aspirante (Gratuito)', monthly: 0, annual: 0 },
      pro: { name: 'Concurseiro PRO', monthly: 39.90, annual: 297.00 },
      elite: { name: 'Tribunal & Carreira Elite', monthly: 69.90, annual: 497.00 },
    };

    const planConfig = prices[planId] || prices.pro;
    const amount = billingCycle === 'annual' ? planConfig.annual : planConfig.monthly;

    if (amount === 0) {
      return NextResponse.json({
        success: true,
        planId,
        status: 'confirmed',
        message: 'Plano gratuito ativado com sucesso!',
      });
    }

    // Gerar Cobrança Pix via Asaas ou EmvCo
    const pixData = await PaymentGateway.createPixCharge({
      planId,
      amount,
      userEmail,
      userName,
      description: `AprovaLens AI - Assinatura ${planConfig.name} (${billingCycle === 'annual' ? 'Anual' : 'Mensal'})`,
    });

    // Registrar no TransactionManager
    TransactionManager.create({
      id: pixData.transactionId,
      planId: planId as SubscriptionPlan,
      billingCycle,
      amount,
      paymentMethod,
      status: 'pending_payment',
      pixCode: pixData.pixCopyPaste,
      qrCodeUrl: pixData.qrCodeUrl,
      provider: pixData.provider,
      userEmail,
      userName,
      createdAt: new Date().toISOString(),
      expiresAt: pixData.expiresAt,
    });

    return NextResponse.json({
      success: true,
      transactionId: pixData.transactionId,
      planName: planConfig.name,
      amount,
      billingCycle,
      paymentMethod,
      provider: pixData.provider,
      pix: {
        copyPasteCode: pixData.pixCopyPaste,
        qrCodeUrl: pixData.qrCodeUrl,
        expiresAt: pixData.expiresAt,
      },
      status: 'pending_payment',
    });
  } catch (error: any) {
    console.error('Erro na API de checkout:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Falha ao processar checkout' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const txId = searchParams.get('txId');

    if (!txId) {
      return NextResponse.json({ success: false, error: 'txId é obrigatório' }, { status: 400 });
    }

    const tx = TransactionManager.get(txId);
    if (!tx) {
      return NextResponse.json({
        success: true,
        transactionId: txId,
        status: 'pending_payment', // Mantém polling se em modo mock
      });
    }

    return NextResponse.json({
      success: true,
      transactionId: tx.id,
      status: tx.status,
      planId: tx.planId,
      confirmedAt: tx.confirmedAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
