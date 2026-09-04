import { NextRequest, NextResponse } from 'next/server';
import { TransactionManager } from '@/lib/transactions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Simulação para Teste Instantâneo de Desenvolvimento
    if (body.action === 'simulate_confirmation' && body.transactionId) {
      const confirmedTx = TransactionManager.confirm(body.transactionId, 'simulated');
      return NextResponse.json({
        success: true,
        message: 'Webhook simulado com sucesso: Pagamento Pix Confirmado!',
        transaction: confirmedTx,
      });
    }

    // 2. Webhook Oficial Asaas (https://docs.asaas.com/docs/webhook-para-cobrancas)
    if (body.event && body.payment) {
      const { event, payment } = body;
      console.log(`[Asaas Webhook] Evento recebido: ${event} para pagamento ${payment.id}`);

      if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        const confirmedTx = TransactionManager.confirm(payment.id, 'asaas', payment.id);
        return NextResponse.json({
          success: true,
          message: 'Asaas: Pagamento confirmado e acesso liberado!',
          transactionId: payment.id,
        });
      }

      return NextResponse.json({ success: true, message: `Evento ${event} registrado` });
    }

    // 3. Webhook Oficial Stripe (checkout.session.completed)
    if (body.type && body.data?.object) {
      const eventType = body.type;
      const session = body.data.object;
      console.log(`[Stripe Webhook] Evento recebido: ${eventType} para sessão ${session.id}`);

      if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
        const txId = session.client_reference_id || session.id;
        TransactionManager.confirm(txId, 'stripe', session.id);
        return NextResponse.json({
          success: true,
          message: 'Stripe: Pagamento confirmado!',
          transactionId: txId,
        });
      }

      return NextResponse.json({ success: true, message: `Evento ${eventType} registrado` });
    }

    return NextResponse.json({ success: false, error: 'Formato de webhook não reconhecido' }, { status: 400 });
  } catch (error: any) {
    console.error('Erro no processamento do webhook:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
