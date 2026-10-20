/**
 * Argus - WAF & Rate Limiter em Memória (Sliding Window & IP Jail)
 * Proteção contra flood de requisições, ataques de força bruta, bots e esgotamento de infraestrutura.
 * Suporta Cloudflare Reverse Proxy (cf-connecting-ip), X-Forwarded-For e X-Real-IP.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
  violationsCount?: number;
}

interface BannedIpRecord {
  bannedUntil: number;
  reason: string;
}

const ipCache = new Map<string, RateLimitRecord>();
const ipJail = new Map<string, BannedIpRecord>();

// Limpeza automática periódica de registros e bans expirados
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCache.entries()) {
      if (now > record.resetTime) {
        ipCache.delete(ip);
      }
    }
    for (const [ip, record] of ipJail.entries()) {
      if (now > record.bannedUntil) {
        ipJail.delete(ip);
      }
    }
  }, 120000); // Executa a cada 2 minutos
  if (timer && typeof timer.unref === 'function') {
    timer.unref();
  }
}

export type RateLimitProfile = 'general' | 'auth' | 'ai' | 'admin' | 'public_probes';

export const RATE_LIMIT_PROFILES: Record<RateLimitProfile, { limit: number; windowMs: number }> = {
  general: { limit: 60, windowMs: 60000 },       // 60 req/min
  auth: { limit: 10, windowMs: 60000 },          // 10 tentativas de login/registro por min (anti-brute-force)
  ai: { limit: 20, windowMs: 60000 },            // 20 chamadas de LLM por min
  admin: { limit: 15, windowMs: 60000 },         // 15 req/min para rotas administrativas
  public_probes: { limit: 5, windowMs: 60000 },  // 5 tentativas em rotas suspeitas
};

/**
 * Verifica se um endereço IP está temporariamente bloqueado no WAF IP Jail.
 */
export function isIpBanned(ip: string): { banned: boolean; reason?: string; retryAfterSeconds?: number } {
  const now = Date.now();
  const banRecord = ipJail.get(ip);
  if (!banRecord) return { banned: false };

  if (now > banRecord.bannedUntil) {
    ipJail.delete(ip);
    return { banned: false };
  }

  const retryAfterSeconds = Math.ceil((banRecord.bannedUntil - now) / 1000);
  return { banned: true, reason: banRecord.reason, retryAfterSeconds };
}

/**
 * Coloca um IP no IP Jail (bloqueio temporário).
 */
export function banIp(ip: string, reason = 'Tentativas abusivas repetidas', durationMs = 15 * 60 * 1000): void {
  ipJail.set(ip, {
    bannedUntil: Date.now() + durationMs,
    reason,
  });
}

/**
 * Remove IP do jail (para testes e unban administrativo).
 */
export function unbanIp(ip: string): void {
  ipJail.delete(ip);
}

/**
 * Valida se um IP ultrapassou a cota de requisições na janela de tempo especificada.
 */
export function checkRateLimit(
  ip: string,
  limit = 20,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetTime: number; isJailed?: boolean } {
  // 1. Checa se o IP já está bloqueado
  const banStatus = isIpBanned(ip);
  if (banStatus.banned) {
    return { allowed: false, remaining: 0, resetTime: Date.now() + (banStatus.retryAfterSeconds || 60) * 1000, isJailed: true };
  }

  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime, violationsCount: record?.violationsCount || 0 });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    record.violationsCount = (record.violationsCount || 0) + 1;
    // Se violou o limite 4 vezes seguidas, aplica ban temporário de 15 minutos
    if (record.violationsCount >= 4) {
      banIp(ip, 'Violação contínua de Rate Limit (WAF Jail)', 15 * 60 * 1000);
      return { allowed: false, remaining: 0, resetTime: now + 900000, isJailed: true };
    }
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Valida rate limit utilizando perfis pré-definidos de segurança.
 */
export function checkRateLimitWithProfile(
  ip: string,
  profile: RateLimitProfile
): { allowed: boolean; remaining: number; resetTime: number; isJailed?: boolean } {
  const config = RATE_LIMIT_PROFILES[profile] || RATE_LIMIT_PROFILES.general;
  return checkRateLimit(ip, config.limit, config.windowMs);
}

/**
 * Extrai de forma segura o endereço IP do cliente a partir dos cabeçalhos HTTP.
 * Prioriza Cloudflare (cf-connecting-ip), depois X-Forwarded-For, depois X-Real-IP.
 */
export function getClientIp(req: Request): string {
  // 1. Cloudflare Proxy
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  // 2. Standard Reverse Proxy (Nginx, AWS ALB, Vercel)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // 3. Real IP header
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // 4. True-Client-IP (Akamai, Cloudflare Enterprise)
  const trueClientIp = req.headers.get('true-client-ip');
  if (trueClientIp) {
    return trueClientIp.trim();
  }

  return '127.0.0.1';
}
