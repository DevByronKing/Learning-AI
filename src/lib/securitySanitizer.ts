/**
 * Argus - Security & Input Sanitization Engine
 * Proteção multicamadas contra:
 * - SQL Injection (SQLi)
 * - Cross-Site Scripting (XSS)
 * - Cross-Site Request Forgery (CSRF)
 * - Server-Side Request Forgery (SSRF - OWASP Top 10)
 * - Path Traversal
 * - Engenharia Social & Prompt Injection (Defesa para LLM/Copilot)
 * - Phishing & Ataques Homógrafos (Domínios clonados / Punycode)
 */


// ============================================================================
// 1. SQL INJECTION (SQLi)
// ============================================================================

const SQL_INJECTION_PATTERNS = [
  /(\b(UNION(\s+ALL)?)\b.*?\bSELECT\b)/i,
  /(\bSELECT\b.*?\bFROM\b)/i,
  /(\bINSERT\b\s+INTO\b)/i,
  /(\bDELETE\b\s+FROM\b)/i,
  /(\bDROP\b\s+(TABLE|DATABASE|VIEW|INDEX)\b)/i,
  /(\bALTER\b\s+TABLE\b)/i,
  /(\bUPDATE\b.*?\bSET\b)/i,
  /(\bEXEC(\s+|\()+)/i,
  /(;\s*--)/,
  /(--\s*$)/m,
  /(\/\*.*?\*\/)/,
  /('|\")\s*OR\s*('|\")?\d+('|\")?\s*=\s*('|\")?\d+/i,
  /('|\")\s*OR\s*('|\")?[a-z0-9]+('|\")?\s*=\s*('|\")?[a-z0-9]+/i,
  /('|\")\s*AND\s*('|\")?\d+('|\")?\s*=\s*('|\")?\d+/i,
  /(\bWAITFOR\s+DELAY\b)/i,
  /(\bBENCHMARK\s*\()/i,
  /(\bSLEEP\s*\()/i,
  /(\bPG_SLEEP\s*\()/i,
];

export function detectSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

// ============================================================================
// 2. CROSS-SITE SCRIPTING (XSS) & SANITIZAÇÃO
// ============================================================================

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on(load|error|click|mouseover|focus|blur|change|submit)\s*=/gi,
  /<object\b/gi,
  /<embed\b/gi,
  /<applet\b/gi,
];

export function detectXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }

  return obj;
}

// ============================================================================
// 3. PATH TRAVERSAL
// ============================================================================

const PATH_TRAVERSAL_PATTERN = /(\.\.[\/\\]|\/etc\/passwd|\bwin\.ini\b)/i;

export function detectPathTraversal(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return PATH_TRAVERSAL_PATTERN.test(input);
}

// ============================================================================
// 4. CROSS-SITE REQUEST FORGERY (CSRF)
// ============================================================================

const CSRF_SECRET = process.env.ARGUS_CSRF_SECRET || 'argus_csrf_master_secret_key_2026';

function computeHmacSignature(payload: string, secret: string): string {
  try {
    const nodeCrypto = typeof require !== 'undefined' ? require('crypto') : null;
    if (nodeCrypto?.createHmac) {
      return nodeCrypto.createHmac('sha256', secret).update(payload).digest('hex');
    }
  } catch {}

  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  const str = payload + secret;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

function encodeSafeBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeSafeBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf8');
  }
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Gera token criptográfico CSRF blindado com HMAC e timestamp (validade 1h).
 */
export function generateCsrfToken(sessionId: string): string {
  const timestamp = Date.now().toString();
  const rawPayload = `${sessionId}:${timestamp}`;
  const hmac = computeHmacSignature(rawPayload, CSRF_SECRET);
  return encodeSafeBase64Url(`${rawPayload}:${hmac}`);
}

/**
 * Valida integridade e tempo de expiração do CSRF token.
 */
export function verifyCsrfToken(token: string, sessionId: string, maxAgeMs = 3600000): boolean {
  try {
    if (!token || !sessionId) return false;
    const decoded = decodeSafeBase64Url(token);
    const [tokenSessionId, timestampStr, signature] = decoded.split(':');

    if (!tokenSessionId || !timestampStr || !signature) return false;
    if (tokenSessionId !== sessionId) return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > maxAgeMs) {
      return false; // Token expirado
    }

    const expectedPayload = `${tokenSessionId}:${timestampStr}`;
    const expectedHmac = computeHmacSignature(expectedPayload, CSRF_SECRET);

    return constantTimeCompare(expectedHmac, signature);
  } catch {
    return false;
  }
}

/**
 * Validação rigorosa de CSRF combinando Origin/Referer e Token.
 */
export function validateCsrfProtection(params: {
  method: string;
  origin?: string | null;
  referer?: string | null;
  allowedOrigins: string[];
  csrfToken?: string | null;
  sessionId?: string | null;
}): { isValid: boolean; reason?: string } {
  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(params.method.toUpperCase());
  if (!isStateChanging) {
    return { isValid: true };
  }

  // 1. Validação de Origin / Referer
  const sourceOrigin = params.origin || (params.referer ? new URL(params.referer).origin : null);
  if (sourceOrigin) {
    const isOriginAllowed = params.allowedOrigins.some(
      (allowed) => allowed === '*' || sourceOrigin === allowed || sourceOrigin.endsWith(`.${allowed.replace(/^https?:\/\//, '')}`)
    );
    if (!isOriginAllowed) {
      return { isValid: false, reason: 'ORIGIN_MISMATCH' };
    }
  }

  // 2. Validação de Token CSRF (se sessão ativa)
  if (params.sessionId) {
    if (!params.csrfToken) {
      return { isValid: false, reason: 'CSRF_TOKEN_MISSING' };
    }
    if (!verifyCsrfToken(params.csrfToken, params.sessionId)) {
      return { isValid: false, reason: 'CSRF_TOKEN_INVALID' };
    }
  }

  return { isValid: true };
}

// ============================================================================
// 5. SERVER-SIDE REQUEST FORGERY (SSRF - OWASP TOP 10 A10)
// ============================================================================

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/, // Link-local e AWS/GCP Metadata
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

/**
 * Detecta se uma URL submetida aponta para redes internas ou instâncias de metadados de nuvem.
 */
export function detectSsrfAttempt(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;

  try {
    const parsed = new URL(urlStr);
    
    // Bloqueia esquemas perigosos como file://, gopher://, dict://, ftp://
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return true;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Bloqueia AWS / Cloud metadata domain
    if (hostname.includes('metadata.google.internal') || hostname.includes('169.254.169.254')) {
      return true;
    }

    return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
  } catch {
    // Se a URL não for parseável com protocolo padrão, pode ser um payload truncado
    return urlStr.includes('169.254.169.254') || urlStr.includes('localhost') || urlStr.startsWith('file://');
  }
}

// ============================================================================
// 6. ENGENHARIA SOCIAL & PROMPT INJECTION (DEFESA CONTRA ATAQUES EM IA)
// ============================================================================

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+all\s+(previous|prior)\s+prompts/i,
  /system\s+prompt\s*:\s*/i,
  /reveal\s+your\s+(secret|initial|original)?\s*(system\s+)?(prompt|instructions)/i,
  /you\s+are\s+now\s+(in\s+)?(DAN|unrestricted|godmode|jailbroken)/i,
  /\bDAN\s+mode\b/i,
  /act\s+as\s+an\s+unfiltered\s+ai/i,
  /bypass\s+all\s+ethical\s+guidelines/i,
  /mode\s+developer\s+mode\s+enabled/i,
  /repeat\s+the\s+text\s+above\s+verbatim/i,
  /pretend\s+you\s+have\s+no\s+rules/i,
];

/**
 * Detecta tentativas de engenharia social voltadas a manipular o comportamento da IA (Prompt Injection).
 */
export function detectPromptInjection(prompt: string): boolean {
  if (!prompt || typeof prompt !== 'string') return false;
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(prompt));
}

// ============================================================================
// 7. PHISHING & DOMÍNIOS HOMÓGRAFOS (PUNYCODE / SPOOFING)
// ============================================================================

const LEGITIMATE_ARGUS_DOMAINS = ['argus.app.br', 'argus.ia', 'localhost'];

// Caracteres cirílicos e substitutos visuais comumente usados em ataques homógrafos
const HOMOGLYPH_CYRILLIC_PATTERN = /[\u0400-\u04FF]/;

/**
 * Detecta se uma URL ou domínio tenta se passar fraudulentamente pelo Argus (Phishing).
 */
export function detectPhishingDomain(urlOrDomain: string): { isPhishing: boolean; reason?: string } {
  if (!urlOrDomain || typeof urlOrDomain !== 'string') return { isPhishing: false };

  // 1. Verifica ataque homógrafo por punycode ou caracteres cirílicos antes do parsing
  if (
    urlOrDomain.includes('xn--') ||
    HOMOGLYPH_CYRILLIC_PATTERN.test(urlOrDomain)
  ) {
    return { isPhishing: true, reason: 'HOMOGLYPH_PUNYCODE_ATTACK' };
  }

  try {
    let hostname = urlOrDomain;
    if (urlOrDomain.startsWith('http://') || urlOrDomain.startsWith('https://')) {
      hostname = new URL(urlOrDomain).hostname;
    }

    hostname = hostname.toLowerCase();

    // 2. Domínio legítimo registrado
    if (LEGITIMATE_ARGUS_DOMAINS.includes(hostname)) {
      return { isPhishing: false };
    }

    // 3. Typosquatting e clone de marca: contém 'argus' mas com sufixos fraudulentos
    const suspiciousKeywords = ['login', 'security', 'auth', 'senha', 'banco', 'suporte', 'verificar'];
    if (hostname.includes('argus') && suspiciousKeywords.some((word) => hostname.includes(word))) {
      return { isPhishing: true, reason: 'TYPOSQUATTING_BRAND_IMPERSONATION' };
    }

    return { isPhishing: false };
  } catch {
    return { isPhishing: true, reason: 'MALFORMED_URL_OR_INVALID_PUNYCODE' };
  }
}

// ============================================================================
// 8. INSPEÇÃO GERAL DE PAYLOAD SAFE INPUT
// ============================================================================

export function inspectSafeInput(input: any): { 
  isSafe: boolean; 
  threatType?: 'SQLi' | 'XSS' | 'PathTraversal' | 'PromptInjection' | 'SSRF';
} {
  if (!input) return { isSafe: true };

  const valuesToCheck: string[] = [];

  const extractStrings = (val: any) => {
    if (typeof val === 'string') {
      valuesToCheck.push(val);
    } else if (Array.isArray(val)) {
      val.forEach(extractStrings);
    } else if (typeof val === 'object' && val !== null) {
      Object.values(val).forEach(extractStrings);
    }
  };

  extractStrings(input);

  for (const str of valuesToCheck) {
    if (detectSqlInjection(str)) {
      return { isSafe: false, threatType: 'SQLi' };
    }
    if (detectXss(str)) {
      return { isSafe: false, threatType: 'XSS' };
    }
    if (detectPathTraversal(str)) {
      return { isSafe: false, threatType: 'PathTraversal' };
    }
    if (detectPromptInjection(str)) {
      return { isSafe: false, threatType: 'PromptInjection' };
    }
    if (detectSsrfAttempt(str)) {
      return { isSafe: false, threatType: 'SSRF' };
    }
  }

  return { isSafe: true };
}
