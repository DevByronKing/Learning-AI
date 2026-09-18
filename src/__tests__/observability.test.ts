import { describe, it, expect, vi } from 'vitest';
import { logger } from '../lib/logger';

describe('Observabilidade & Logger Estruturado', () => {
  it('deve registrar mensagens e sanitizar campos sensíveis como token e senha', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('Tentativa de autenticação', {
      email: 'usuario@learningai.com.br',
      password: 'minhasenhasupersecreta',
      token: 'jwt_secret_token_123',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedArgs = consoleSpy.mock.calls[0];
    const loggedContext = loggedArgs[1];

    expect(loggedContext.email).toBe('usuario@learningai.com.br');
    expect(loggedContext.password).toBe('[REDACTED]');
    expect(loggedContext.token).toBe('[REDACTED]');

    consoleSpy.mockRestore();
  });

  it('deve registrar métricas de performance estruturadas', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.metric('tempo_resposta_gemini', 320, 'ms', { rota: '/api/edital' });

    expect(consoleSpy).toHaveBeenCalled();
    const loggedArgs = consoleSpy.mock.calls[0];
    expect(loggedArgs[0]).toContain('tempo_resposta_gemini=320ms');

    consoleSpy.mockRestore();
  });
});
