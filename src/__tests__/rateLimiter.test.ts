import { describe, it, expect } from 'vitest';
import { checkRateLimit, getClientIp } from '../lib/rateLimiter';

describe('Rate Limiting & Segurança de Requisições', () => {
  it('deve permitir requisições dentro do limite estipulado', () => {
    const testIp = '192.168.1.100';
    const res1 = checkRateLimit(testIp, 3, 10000);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(testIp, 3, 10000);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(testIp, 3, 10000);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('deve bloquear requisições quando o limite for excedido', () => {
    const testIp = '10.0.0.99';
    // 2 requisições permitidas
    checkRateLimit(testIp, 2, 10000);
    checkRateLimit(testIp, 2, 10000);

    // 3ª tentativa deve ser bloqueada
    const blocked = checkRateLimit(testIp, 2, 10000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetTime).toBeGreaterThan(Date.now());
  });

  it('deve extrair IP do cliente a partir de cabeçalhos x-forwarded-for ou x-real-ip', () => {
    const reqForwarded = new Request('http://localhost/api/copilot', {
      headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' }
    });
    expect(getClientIp(reqForwarded)).toBe('203.0.113.195');

    const reqRealIp = new Request('http://localhost/api/copilot', {
      headers: { 'x-real-ip': '198.51.100.4' }
    });
    expect(getClientIp(reqRealIp)).toBe('198.51.100.4');

    const reqFallback = new Request('http://localhost/api/copilot');
    expect(getClientIp(reqFallback)).toBe('127.0.0.1');
  });
});
