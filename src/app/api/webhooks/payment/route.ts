import { NextRequest, NextResponse } from 'next/server';
import { TransactionManager } from '@/lib/transactions';
import { analytics } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Simulação para Teste Instantâneo de Desenvolvimento
    if (body.action === 'simulate_confirmation' && body.transactionId) {
      const eventId = `sim_${body.transactionId}`;
      
      if (TransactionManager.isEventProcessed(eventId)) {
        return NextResponse.json({
          success: true,
          duplicate: true,
          message: 'Evento já processado anteriormente (idempotência preservada).',
        });
      }

      TransactionManager.markEventProcessed(eventId);
      const confirmedTx = TransactionManager.confirm(body.transactionId, 'simulated');
      analytics.track('subscription_activated', { provider: 'simulated', plan: confirmedTx?.planId });

      return NextResponse.json({
        success: true,
        message: 'Webhook simulado com sucesso: Pagamento Pix Confirmado!',
        transaction: confirmedTx,
      });
    }

    // 2. Webhook Oficial Asaas (https://docs.asaas.com/docs/webhook-para-cobrancas)
    if (body.event && body.payment) {
      const { event, payment } = body;
      const eventId = body.id || `asaas_${payment.id}_${event}`;
      console.log(`[Asaas Webhook] Evento recebido: ${event} para pagamento ${payment.id} (EventID: ${eventId})`);

      // Idempotência estrita: se o evento já foi processado, retorna 200 OK sem reprocessar
      if (TransactionManager.isEventProcessed(eventId)) {
        return NextResponse.json({
          success: true,
          duplicate: true,
          message: 'Asaas: Evento já processado anteriormente (idempotência preservada).',
        });
      }

      TransactionManager.markEventProcessed(eventId);

      if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
        const confirmedTx = TransactionManager.confirm(payment.id, 'asaas', payment.id);
        analytics.track('subscription_activated', { provider: 'asaas', plan: confirmedTx?.planId });
        
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
      const eventId = body.id || `stripe_${session.id}_${eventType}`;
      console.log(`[Stripe Webhook] Evento recebido: ${eventType} para sessão ${session.id} (EventID: ${eventId})`);

      // Idempotência estrita
      if (TransactionManager.isEventProcessed(eventId)) {
        return NextResponse.json({
          success: true,
          duplicate: true,
          message: 'Stripe: Evento já processado anteriormente (idempotência preservada).',
        });
      }

      TransactionManager.markEventProcessed(eventId);

      if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
        const txId = session.client_reference_id || session.id;
        const confirmedTx = TransactionManager.confirm(txId, 'stripe', session.id);
        analytics.track('subscription_activated', { provider: 'stripe', plan: confirmedTx?.planId });

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
