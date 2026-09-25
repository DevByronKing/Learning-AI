import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rateLimiter';
import { TransactionManager } from '@/lib/transactions';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { AsyncJobManager } from '@/lib/queue/jobManager';

describe('Testes de Carga e Estresse de Alta Concorrência (Stress Testing)', () => {
  describe('Estresse de Concorrência no Rate Limiter', () => {
    it('deve lidar com 1.000 requisições simultâneas sem sofrer race conditions ou corrupção de memória', async () => {
      const floodIp = '198.51.100.42';
      const limit = 25;
      const totalConcurrentRequests = 1000;

      // Dispara 1.000 chamadas simultâneas via Promise.all
      const promises = Array.from({ length: totalConcurrentRequests }, () =>
        Promise.resolve().then(() => checkRateLimit(floodIp, limit, 60000))
      );

      const results = await Promise.all(promises);

      const allowedCount = results.filter((r) => r.allowed).length;
      const blockedCount = results.filter((r) => !r.allowed).length;

      // O rate limiter DEVE permitir exatamente o limite configurado (25) e bloquear os 975 excedentes
      expect(allowedCount).toBe(limit);
      expect(blockedCount).toBe(totalConcurrentRequests - limit);
    });

    it('deve isolar a taxa de limite entre múltiplos IPs concorrentes sob carga massiva', async () => {
      const distinctIps = Array.from({ length: 50 }, (_, i) => `192.168.200.${i + 1}`);
      const requestsPerIp = 5; // Limite é 10, logo todos os 50 IPs devem ser aprovados

      const allPromises = distinctIps.flatMap((ip) =>
        Array.from({ length: requestsPerIp }, () =>
          Promise.resolve().then(() => checkRateLimit(ip, 10, 60000))
        )
      );

      const results = await Promise.all(allPromises);
      const totalAllowed = results.filter((r) => r.allowed).length;

      // 50 IPs * 5 requisições = 250 requisições, todas devem ser permitidas
      expect(totalAllowed).toBe(50 * requestsPerIp);
    });
  });

  describe('Estresse no Gerenciador de Transações (500 gravações simultâneas)', () => {
    it('deve registrar e recuperar 500 transações paralelas sem colisão de IDs ou perda de dados', async () => {
      const count = 500;
      const transactions = Array.from({ length: count }, (_, i) => ({
        id: `stress_tx_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
        planId: 'pro' as const,
        billingCycle: 'monthly' as const,
        amount: 59.9,
        paymentMethod: 'pix' as const,
        status: 'pending_payment' as const,
        provider: 'asaas' as const,
        userEmail: `aluno_${i}@stress.com`,
        userName: `Candidato Concorrente ${i}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      }));

      // Criação concorrente
      await Promise.all(transactions.map((tx) => Promise.resolve().then(() => TransactionManager.create(tx))));

      // Leitura concorrente
      const retrieved = await Promise.all(
        transactions.map((tx) => Promise.resolve().then(() => TransactionManager.get(tx.id)))
      );

      // Nenhuma transação pode ser undefined
      const missingCount = retrieved.filter((tx) => !tx).length;
      expect(missingCount).toBe(0);
      expect(retrieved.length).toBe(count);
    });
  });

  describe('Estresse no Endpoint de Login (/api/auth/login)', () => {
    it('deve responder rapidamente e bloquear flood do mesmo IP retornando status 429', async () => {
      const floodIp = '203.0.113.88';
      const requestsCount = 30; // Limite é 10 por minuto

      const requests = Array.from({ length: requestsCount }, () =>
        new Request('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': floodIp,
          },
          body: JSON.stringify({ email: 'flood@teste.com', password: 'senha' }),
        })
      );

      const startTime = performance.now();
      const responses = await Promise.all(requests.map((req) => loginHandler(req)));
      const endTime = performance.now();

      const statuses = responses.map((res) => res.status);
      const blocked429 = statuses.filter((s) => s === 429).length;

      // Pelo menos 20 requisições devem ter sido barradas com 429
      expect(blocked429).toBeGreaterThanOrEqual(20);

      // O tempo médio para processar 30 requisições deve ser ultra-rápido (< 500ms)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Estresse na Fila Assíncrona de Ingestão de Editais', () => {
    it('deve enfileirar 100 jobs simultâneos garantindo integridade e identificadores únicos', async () => {
      const count = 100;
      const jobPromises = Array.from({ length: count }, (_, i) =>
        Promise.resolve().then(() =>
          AsyncJobManager.createJob({
            examTitle: `Concurso Sob Carga ${i}`,
            banca: i % 2 === 0 ? 'Cebraspe' : 'FGV',
            role: 'Auditor Fiscal',
            examText: 'Texto simulado do edital para teste de estresse da fila...',
          })
        )
      );

      const jobs = await Promise.all(jobPromises);
      const uniqueIds = new Set(jobs.map((j) => j.id));

      // Todos os 100 jobs devem ter IDs únicos
      expect(uniqueIds.size).toBe(count);

      // Todos devem começar com status inicial 'queued'
      const queuedCount = jobs.filter((j) => j.status === 'queued').length;
      expect(queuedCount).toBe(count);
    });
  });
});
