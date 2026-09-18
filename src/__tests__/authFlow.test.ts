import { describe, it, expect } from 'vitest';
import { SupabaseService } from '../lib/supabaseService';

describe('Fluxo de Autenticação e Sessão', () => {
  it('quando o Supabase não está configurado, SupabaseService.signIn deve fornecer fallback mock seguro', async () => {
    const result = await SupabaseService.signIn('teste@learningai.com.br', 'senha123456');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('teste@learningai.com.br');
    expect(result.token).toBeDefined();
    expect(result.token?.startsWith('jwt_mock_')).toBe(true);
  });

  it('SupabaseService.signUp deve criar conta mock com nome do aluno', async () => {
    const result = await SupabaseService.signUp(
      'candidato@concursos.com',
      'segredo123',
      'Maria Silva Delegada'
    );
    expect(result.success).toBe(true);
    expect(result.user.name).toBe('Maria Silva Delegada');
  });

  it('SupabaseService.signOut deve executar com sucesso', async () => {
    const result = await SupabaseService.signOut();
    expect(result.success).toBe(true);
  });
});
