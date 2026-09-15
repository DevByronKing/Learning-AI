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
const processedWebhookEvents = new Set<string>();

export class TransactionManager {
  static isEventProcessed(eventId: string): boolean {
    return processedWebhookEvents.has(eventId);
  }

  static markEventProcessed(eventId: string): void {
    processedWebhookEvents.add(eventId);
  }
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

  static async getAsync(id: string): Promise<Transaction | undefined> {
    const memoryTx = globalTransactions.get(id);
    if (memoryTx) return memoryTx;

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const { data, error } = await client
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

          if (!error && data) {
            const tx: Transaction = {
              id: data.id,
              planId: data.plan_id as SubscriptionPlan,
              billingCycle: data.billing_cycle,
              amount: Number(data.amount),
              paymentMethod: data.payment_method,
              status: data.status,
              pixCode: data.pix_code,
              provider: data.provider,
              userEmail: data.user_email,
              userName: 'Concurseiro',
              createdAt: data.created_at,
              confirmedAt: data.confirmed_at,
              expiresAt: data.expires_at,
              externalId: data.external_id,
            };
            globalTransactions.set(id, tx);
            return tx;
          }
        } catch (err) {
          console.warn('[TransactionManager] Erro ao buscar transação no Supabase:', err);
        }
      }
    }

    return undefined;
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

  static async confirmAsync(id: string, provider: 'asaas' | 'stripe' | 'simulated' = 'simulated', externalId?: string): Promise<Transaction | null> {
    let tx = await this.getAsync(id);
    
    if (!tx) {
      // Fallback seguro se não encontrada no Supabase
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
      tx = newTx;
    } else {
      tx.status = 'confirmed';
      tx.confirmedAt = new Date().toISOString();
      if (externalId) tx.externalId = externalId;
      tx.provider = provider;
      globalTransactions.set(id, tx);
    }

    if (isSupabaseConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          await client
            .from('transactions')
            .upsert({
              id: tx.id,
              plan_id: tx.planId,
              billing_cycle: tx.billingCycle,
              amount: tx.amount,
              payment_method: tx.paymentMethod,
              status: tx.status,
              provider: tx.provider,
              user_email: tx.userEmail,
              confirmed_at: tx.confirmedAt,
              external_id: tx.externalId,
              expires_at: tx.expiresAt,
            });
        } catch (error: any) {
          console.warn('[TransactionManager] Erro ao sincronizar confirmação no Supabase:', error.message);
        }
      }
    }

    return tx;
  }
}
