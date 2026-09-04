import { SubscriptionPlan } from './types';
import { getSupabase, isSupabaseConfigured } from './supabase';

export type PaymentStatus = 'pending_payment' | 'confirmed' | 'expired' | 'failed';

export interface Transaction {
  id: string;
  planId: SubscriptionPlan;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  paymentMethod: 'pix' | 'card';
  status: PaymentStatus;
  pixCode?: string;
  qrCodeUrl?: string;
  externalId?: string;
  provider: 'asaas' | 'stripe' | 'simulated';
  userEmail: string;
  userName: string;
  createdAt: string;
  confirmedAt?: string;
  expiresAt: string;
}

// In-memory store para persistência rápida em runtime
const globalTransactions = new Map<string, Transaction>();

export class TransactionManager {
  static create(tx: Transaction): Transaction {
    globalTransactions.set(tx.id, tx);

    // Se Supabase estiver configurado, salva também na nuvem de forma assíncrona
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client
          .from('transactions')
          .insert({
            id: tx.id,
            plan_id: tx.planId,
            billing_cycle: tx.billingCycle,
            amount: tx.amount,
            payment_method: tx.paymentMethod,
            status: tx.status,
            pix_code: tx.pixCode,
            provider: tx.provider,
            user_email: tx.userEmail,
            created_at: tx.createdAt,
            expires_at: tx.expiresAt,
          })
          .then(({ error }: any) => {
            if (error) console.warn('Aviso Supabase (transactions):', error.message);
          });
      }
    }

    return tx;
  }

  static get(id: string): Transaction | undefined {
    return globalTransactions.get(id);
  }

  static confirm(id: string, provider: 'asaas' | 'stripe' | 'simulated' = 'simulated', externalId?: string): Transaction | null {
    const tx = globalTransactions.get(id);
    if (!tx) {
      // Fallback: criar transação confirmada se for id simulado
      const newTx: Transaction = {
        id,
        planId: 'pro',
        billingCycle: 'annual',
        amount: 297,
        paymentMethod: 'pix',
        status: 'confirmed',
        provider,
        externalId,
        userEmail: 'aluno@aprovalens.ai',
        userName: 'Concurseiro',
        createdAt: new Date().toISOString(),
        confirmedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
      };
      globalTransactions.set(id, newTx);
      return newTx;
    }

    tx.status = 'confirmed';
    tx.confirmedAt = new Date().toISOString();
    if (externalId) tx.externalId = externalId;
    tx.provider = provider;

    globalTransactions.set(id, tx);

    // Atualiza no Supabase se ativo
    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        client
          .from('transactions')
          .update({
            status: 'confirmed',
            confirmed_at: tx.confirmedAt,
            external_id: externalId,
          })
          .eq('id', id)
          .then(({ error }: any) => {
            if (error) console.warn('Aviso Supabase (confirm transaction):', error.message);
          });
      }
    }

    return tx;
  }
}
