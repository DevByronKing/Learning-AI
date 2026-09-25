import { describe, it, expect } from 'vitest';
import { POST as webhookHandler } from '@/app/api/webhooks/payment/route';
import { TransactionManager } from '@/lib/transactions';
import { NextRequest } from 'next/server';

describe('Regras Críticas de Negócio: Ciclo de Vida de Pagamento & Idempotência de Webhooks', () => {
  it('deve processar webhook Asaas PAYMENT_RECEIVED e liberar acesso', async () => {
    const paymentId = `pay_test_${Date.now()}`;
    const txId = `tx_${Date.now()}`;

    // Pré-criar transação pendente
    TransactionManager.create({
      id: txId,
      planId: 'pro',
      billingCycle: 'annual',
      amount: 478.8,
      paymentMethod: 'pix',
      status: 'pending_payment',
      provider: 'asaas',
      userEmail: 'aluno@concurso.com',
      userName: 'Futuro Auditor',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    const req = new NextRequest('http://localhost:3000/api/webhooks/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `evt_asaas_${Date.now()}`,
        event: 'PAYMENT_RECEIVED',
        payment: {
          id: txId,
          value: 478.8,
          status: 'RECEIVED',
        },
      }),
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('confirmado');

    // Transação deve estar com status confirmado
    const updatedTx = TransactionManager.get(txId);
    expect(updatedTx?.status).toBe('confirmed');
  });

  it('deve garantir idempotência estrita ao receber o mesmo evento Asaas repetido', async () => {
    const eventId = `evt_dup_${Date.now()}`;
    const txId = `tx_dup_${Date.now()}`;

    TransactionManager.create({
      id: txId,
      planId: 'pro',
      billingCycle: 'monthly',
      amount: 59.9,
      paymentMethod: 'pix',
      status: 'pending_payment',
      provider: 'asaas',
      userEmail: 'repetido@teste.com',
      userName: 'Candidato',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    const makeRequest = () =>
      new NextRequest('http://localhost:3000/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventId,
          event: 'PAYMENT_CONFIRMED',
          payment: {
            id: txId,
            value: 59.9,
          },
        }),
      });

    // 1º Envio
    const res1 = await webhookHandler(makeRequest());
    expect(res1.status).toBe(200);
    const data1 = await res1.json();
    expect(data1.duplicate).toBeUndefined();

    // 2º Envio com o MESMO eventId (simulando reenvio de rede da gateway)
    const res2 = await webhookHandler(makeRequest());
    expect(res2.status).toBe(200);
    const data2 = await res2.json();
    expect(data2.duplicate).toBe(true);
    expect(data2.message).toContain('idempotência');
  });

  it('deve rejeitar payload com formato de webhook desconhecido', async () => {
    const req = new NextRequest('http://localhost:3000/api/webhooks/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unknownField: 'valor_invalido',
      }),
    });

    const res = await webhookHandler(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('não reconhecido');
  });
});
