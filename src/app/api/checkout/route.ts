import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, paymentMethod = 'pix', userEmail = 'aluno@aprovalens.ai', userName = 'Concurseiro' } = body;

    const planPrices: Record<string, { name: string; price: number }> = {
      aspirante: { name: 'Aspirante', price: 0 },
      elite: { name: 'Concurseiro Elite', price: 39.90 },
      tribunal_master: { name: 'Tribunal Master', price: 79.90 },
    };

    const selectedPlan = planPrices[planId] || planPrices.elite;

    if (selectedPlan.price === 0) {
      return NextResponse.json({
        success: true,
        planId,
        message: 'Plano gratuito ativado com sucesso!',
        status: 'active',
      });
    }

    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

    // Gerador de código Pix padrão BACEN (EMVCo BR Code simulado)
    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136aprovalens-payments-${transactionId}520400005303986540${selectedPlan.price.toFixed(2)}5802BR5913AprovaLens AI6009Sao Paulo62070503***6304ABCD`;

    return NextResponse.json({
      success: true,
      transactionId,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      paymentMethod,
      pix: {
        copyPasteCode: pixCopyPaste,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCopyPaste)}`,
        expiresAt,
      },
      status: 'pending_payment',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Falha ao processar checkout' },
      { status: 500 }
    );
  }
}
