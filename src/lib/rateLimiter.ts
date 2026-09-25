/**
 * Learning AI - Rate Limiter em Memória (Sliding Window)
 * Proteção contra flood de requisições e esgotamento de cotas de APIs de IA.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitRecord>();

// Limpeza automática periódica de IPs inativos para prevenção de vazamento de memória (RAM)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCache.entries()) {
      if (now > record.resetTime) {
        ipCache.delete(ip);
      }
    }
  }, 300000); // Executa a cada 5 minutos
}

/**
 * Valida se um IP ultrapassou a cota de requisições na janela de tempo especificada.
 * @param ip Endereço IP do cliente
 * @param limit Número máximo de requisições permitidas na janela (padrão: 20)
 * @param windowMs Janela de tempo em milissegundos (padrão: 60.000ms = 1 minuto)
 */
export function checkRateLimit(
  ip: string,
  limit = 20,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Extrai de forma segura o endereço IP do cliente a partir dos cabeçalhos da requisição HTTP.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
