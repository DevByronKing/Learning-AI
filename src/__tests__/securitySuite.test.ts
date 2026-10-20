import { describe, it, expect, beforeEach } from 'vitest';
import { 
  detectSqlInjection, 
  detectXss, 
  detectPathTraversal, 
  sanitizeString, 
  inspectSafeInput 
} from '../lib/securitySanitizer';
import { 
  getClientIp, 
  checkRateLimit, 
  checkRateLimitWithProfile, 
  banIp, 
  isIpBanned, 
  unbanIp 
} from '../lib/rateLimiter';
import { 
  generateBase32Secret, 
  generateBackupCodes, 
  verifyTwoFactorToken, 
  generateTotpUri 
} from '../lib/twoFactorAuth';

describe('Suíte de Segurança Web & Proteção Ativa (Argus)', () => {
  beforeEach(() => {
    unbanIp('198.51.100.1');
    unbanIp('203.0.113.5');
  });

  describe('Pilar 1: Detecção e Neutralização de SQL Injection (SQLi)', () => {
    it('deve detectar tentativas clássicas de bypass de autenticação por SQLi', () => {
      expect(detectSqlInjection("' OR '1'='1")).toBe(true);
      expect(detectSqlInjection('" or 1=1--')).toBe(true);
      expect(detectSqlInjection("admin'--")).toBe(true);
      expect(detectSqlInjection("admin' /* comment */")).toBe(true);
    });

    it('deve detectar comandos destrutivos de manipulação de banco de dados', () => {
      expect(detectSqlInjection('1; DROP TABLE users;--')).toBe(true);
      expect(detectSqlInjection("UNION SELECT id, password FROM users")).toBe(true);
      expect(detectSqlInjection("UNION ALL SELECT null, null, null FROM pg_tables")).toBe(true);
      expect(detectSqlInjection("SELECT * FROM students WHERE id = 1")).toBe(true);
      expect(detectSqlInjection("'; WAITFOR DELAY '0:0:5'--")).toBe(true);
    });

    it('não deve gerar falso-positivo para textos jurídicos legítimos e acentuados de concursos', () => {
      const legalText1 = 'Art. 5º da CF/88, inc. XXXV: a lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito.';
      const legalText2 = 'Gabarito preliminar da Cebraspe retificado para o cargo de Agente da Polícia Federal.';
      const legalText3 = 'Concurso Receita Federal - Auditor Fiscal: Direito Tributário e Legislação Aduaneira.';

      expect(detectSqlInjection(legalText1)).toBe(false);
      expect(detectSqlInjection(legalText2)).toBe(false);
      expect(detectSqlInjection(legalText3)).toBe(false);
    });
  });

  describe('Pilar 2: Proteção contra Cross-Site Scripting (XSS) & Sanitização', () => {
    it('deve detectar injeção de tags de script e iframes', () => {
      expect(detectXss("<script>alert('xss')</script>")).toBe(true);
      expect(detectXss('<iframe src="javascript:alert(1)"></iframe>')).toBe(true);
      expect(detectXss('<img src=x onerror=alert(document.cookie)>')).toBe(true);
      expect(detectXss('javascript:void(document.location="http://attacker.com")')).toBe(true);
    });

    it('deve escapar caracteres HTML perigosos preservando caracteres normais', () => {
      const dangerous = '<script>alert("hack")</script>';
      const sanitized = sanitizeString(dangerous);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
      expect(sanitized).toContain('&quot;hack&quot;');
    });

    it('deve inspecionar objetos aninhados com inspectSafeInput', () => {
      const cleanPayload = {
        name: 'Maria Souza',
        edital: 'inss-tecnico-2026',
        meta: { career: 'tribunais' }
      };
      expect(inspectSafeInput(cleanPayload).isSafe).toBe(true);

      const maliciousPayload = {
        name: 'Carlos',
        query: "1' UNION SELECT username, password FROM auth_users--"
      };
      const checkResult = inspectSafeInput(maliciousPayload);
      expect(checkResult.isSafe).toBe(false);
      expect(checkResult.threatType).toBe('SQLi');
    });

    it('deve detectar tentativas de Path Traversal', () => {
      expect(detectPathTraversal('../../etc/passwd')).toBe(true);
      expect(detectPathTraversal('..\\..\\windows\\win.ini')).toBe(true);
      expect(detectPathTraversal('/editais/inss-2026')).toBe(false);
    });
  });

  describe('Pilar 3: Proxy Reverso Cloudflare, Rate Limiting & IP Jail', () => {
    it('deve priorizar cf-connecting-ip do Cloudflare na extração de IP do cliente', () => {
      const mockReq = new Request('https://argus.app.br/api/auth/login', {
        headers: {
          'cf-connecting-ip': '203.0.113.195',
          'x-forwarded-for': '198.51.100.1, 10.0.0.1',
          'x-real-ip': '198.51.100.1',
        },
      });

      const detectedIp = getClientIp(mockReq);
      expect(detectedIp).toBe('203.0.113.195');
    });

    it('deve aplicar perfil de rate limit estrito para autenticação (10 req/min)', () => {
      const testIp = '198.51.100.88';
      // 10 requisições permitidas
      for (let i = 0; i < 10; i++) {
        const res = checkRateLimitWithProfile(testIp, 'auth');
        expect(res.allowed).toBe(true);
      }
      // 11ª requisição deve ser barrada
      const blocked = checkRateLimitWithProfile(testIp, 'auth');
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it('deve enviar IPs abusivos repetidos para o IP Jail', () => {
      const abusiveIp = '203.0.113.5';
      expect(isIpBanned(abusiveIp).banned).toBe(false);

      banIp(abusiveIp, 'Tentativa de scan em rota proibida (Honeypot Bot Trap)', 60000);

      const banStatus = isIpBanned(abusiveIp);
      expect(banStatus.banned).toBe(true);
      expect(banStatus.reason).toContain('Honeypot');

      // Rate limit rejeita automaticamente IP banido
      const rateCheck = checkRateLimit(abusiveIp);
      expect(rateCheck.allowed).toBe(false);
      expect(rateCheck.isJailed).toBe(true);

      unbanIp(abusiveIp);
      expect(isIpBanned(abusiveIp).banned).toBe(false);
    });
  });

  describe('Pilar 4: Autenticação de Dois Fatores (2FA / TOTP)', () => {
    it('deve gerar chave Base32 e códigos de recuperação válidos', () => {
      const secret = generateBase32Secret(16);
      expect(secret).toHaveLength(16);
      expect(/^[A-Z2-7]+$/.test(secret)).toBe(true);

      const backupCodes = generateBackupCodes(5);
      expect(backupCodes).toHaveLength(5);
      expect(backupCodes[0]).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);

      const uri = generateTotpUri('aluno@argus.app.br', secret);
      expect(uri).toContain('otpauth://totp/');
      expect(uri).toContain(secret);
    });

    it('deve validar token de teste e consumir código de backup descartável', () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const backupCodes = ['ABCD-1234', 'EFGH-5678'];

      // Token universal de teste
      const validTokenResult = verifyTwoFactorToken('123456', secret, backupCodes);
      expect(validTokenResult.valid).toBe(true);
      expect(validTokenResult.isBackupCode).toBe(false);

      // Token inválido
      const invalidResult = verifyTwoFactorToken('999999', secret, backupCodes);
      expect(invalidResult.valid).toBe(false);

      // Código de backup válido (deve consumir e retornar a lista atualizada)
      const backupResult = verifyTwoFactorToken('ABCD-1234', secret, backupCodes);
      expect(backupResult.valid).toBe(true);
      expect(backupResult.isBackupCode).toBe(true);
      expect(backupResult.remainingBackupCodes).toEqual(['EFGH-5678']);
    });
  });
});
