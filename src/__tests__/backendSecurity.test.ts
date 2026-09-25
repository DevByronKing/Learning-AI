import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { POST as leadsPostHandler, GET as leadsGetHandler } from '@/app/api/leads/route';
import { NextRequest } from 'next/server';

describe('Auditoria de Segurança de Backend & Resiliência de APIs', () => {
  describe('Rate Limiter em Memória', () => {
    it('deve permitir requisições dentro da cota configurada', () => {
      const testIp = '192.168.1.100';
      const r1 = checkRateLimit(testIp, 5, 60000);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(4);

      const r2 = checkRateLimit(testIp, 5, 60000);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(3);
    });

    it('deve bloquear requisições quando ultrapassar o limite (429 status)', () => {
      const floodIp = '10.0.0.99';
      // Consumir 3 de cota máxima 3
      checkRateLimit(floodIp, 3, 60000);
      checkRateLimit(floodIp, 3, 60000);
      checkRateLimit(floodIp, 3, 60000);

      // Quarta requisição deve ser bloqueada
      const blocked = checkRateLimit(floodIp, 3, 60000);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetTime).toBeGreaterThan(Date.now());
    });

    it('deve extrair o IP correto a partir de cabeçalhos x-forwarded-for', () => {
      const req = new Request('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
        },
      });
      const ip = getClientIp(req);
      expect(ip).toBe('203.0.113.195');
    });
  });

  describe('Rota de Login (/api/auth/login)', () => {
    it('deve rejeitar JSON malformado com status 400 Bad Request', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-non-json-string{',
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('malformado');
    });

    it('deve exigir email e senha válidos', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe('Rota de Registro (/api/auth/register)', () => {
    it('deve validar comprimento mínimo de senha de 6 caracteres', async () => {
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'teste@exemplo.com', password: '123' }),
      });

      const res = await registerHandler(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('mínimo 6 caracteres');
    });
  });

  describe('Proteção de PII e Privacidade na Rota de Leads (/api/leads)', () => {
    it('NÃO deve vazar e-mails ou telefones em requisições GET anônimas', async () => {
      // 1. Cadastrar um lead de teste
      const postReq = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Concurseiro Sigiloso',
          email: 'privado@concursosegredo.com',
          phone: '(11) 98888-7777',
          editalSlug: 'pf-agente',
          examTitle: 'Polícia Federal',
        }),
      });

      const postRes = await leadsPostHandler(postReq);
      expect(postRes.status).toBe(200);

      // 2. Consulta pública anônima
      const publicReq = new NextRequest('http://localhost:3000/api/leads', {
        method: 'GET',
      });

      const publicRes = await leadsGetHandler(publicReq);
      expect(publicRes.status).toBe(200);
      const publicData = await publicRes.json();

      expect(publicData.success).toBe(true);
      expect(publicData.totalLeads).toBeGreaterThan(0);
      // Garantir ausência estrita de PII na resposta pública
      expect(publicData.leads).toBeUndefined();
      if (publicData.recentOverview && publicData.recentOverview.length > 0) {
        const first = publicData.recentOverview[0];
        expect(first.email).toBeUndefined();
        expect(first.phone).toBeUndefined();
        expect(first.name).toBeUndefined();
        expect(first.editalSlug).toBeDefined();
      }
    });

    it('deve validar nome e e-mail com arroba na submissão de lead', async () => {
      const invalidReq = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'A',
          email: 'email-sem-arroba',
        }),
      });

      const res = await leadsPostHandler(invalidReq);
      expect(res.status).toBe(400);
    });
  });
});
