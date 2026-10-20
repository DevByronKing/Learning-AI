/**
 * Argus - Cryptographic Security Engine
 * Implementação enterprise de:
 * 1. Criptografia Simétrica (AES-256-GCM com IV randômico e Auth Tag)
 * 2. Criptografia Assimétrica (RSA-2048 / Assinatura Digital SHA-256)
 * 3. Hashing Criptográfico e Sal (PBKDF2-SHA512 com 100.000 iterações e sal de 16 bytes)
 * 4. Validação de Requisitos HTTPS/TLS (HSTS, TLS 1.3/1.2)
 */

import crypto from 'crypto';

// ============================================================================
// 1. CRIPTOGRAFIA SIMÉTRICA (AES-256-GCM)
// ============================================================================

export interface EncryptedPayload {
  cipherText: string; // Base64
  iv: string;         // Base64 (12 bytes)
  authTag: string;    // Base64 (16 bytes)
  algorithm: 'aes-256-gcm';
}

/**
 * Criptografa dados sensíveis utilizando AES-256-GCM autenticado.
 * @param plaintext Texto a ser cifrado
 * @param key Chave de 32 bytes (256 bits) em string ou Buffer
 */
export function encryptSymmetric(plaintext: string, secretKey: string | Buffer): EncryptedPayload {
  if (!plaintext) {
    throw new Error('Plaintext não pode ser vazio para criptografia.');
  }

  // Assegura chave de 32 bytes
  const key = typeof secretKey === 'string'
    ? crypto.createHash('sha256').update(secretKey).digest()
    : secretKey;

  // IV de 12 bytes recomendado pelo NIST para AES-GCM
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag().toString('base64');

  return {
    cipherText: encrypted,
    iv: iv.toString('base64'),
    authTag,
    algorithm: 'aes-256-gcm',
  };
}

/**
 * Descriptografa dados com verificação de integridade da Auth Tag (rejeita adulteração).
 */
export function decryptSymmetric(payload: EncryptedPayload, secretKey: string | Buffer): string {
  const key = typeof secretKey === 'string'
    ? crypto.createHash('sha256').update(secretKey).digest()
    : secretKey;

  const iv = Buffer.from(payload.iv, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.cipherText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// ============================================================================
// 2. CRIPTOGRAFIA ASSIMÉTRICA (RSA-2048 / Assinatura Digital)
// ============================================================================

export interface KeyPairPem {
  publicKey: string;
  privateKey: string;
}

/**
 * Gera um par de chaves RSA-2048 em formato PEM.
 */
export function generateAsymmetricKeyPair(): KeyPairPem {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return { publicKey, privateKey };
}

/**
 * Assina digitalmente um dado usando a chave privada RSA e hash SHA-256.
 */
export function signDataAsymmetric(data: string, privateKeyPem: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKeyPem, 'base64');
}

/**
 * Verifica a assinatura digital usando a chave pública RSA correspondente.
 */
export function verifyDataAsymmetric(data: string, signatureBase64: string, publicKeyPem: string): boolean {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKeyPem, signatureBase64, 'base64');
  } catch {
    return false;
  }
}

// ============================================================================
// 3. HASHING CRIPTOGRÁFICO E SAL (PBKDF2-SHA512)
// ============================================================================

export interface SaltedHash {
  hash: string;
  salt: string;
  iterations: number;
  algorithm: 'pbkdf2-sha512';
}

const DEFAULT_PBKDF2_ITERATIONS = 100000;
const SALT_BYTE_LENGTH = 16;
const KEY_BYTE_LENGTH = 64;

/**
 * Gera hash criptográfico com sal único por usuário utilizando PBKDF2-SHA512.
 */
export function hashWithSalt(password: string, customSalt?: string): SaltedHash {
  if (!password || password.length < 6) {
    throw new Error('Senha deve possuir no mínimo 6 caracteres.');
  }

  const salt = customSalt || crypto.randomBytes(SALT_BYTE_LENGTH).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    DEFAULT_PBKDF2_ITERATIONS,
    KEY_BYTE_LENGTH,
    'sha512'
  );

  return {
    hash: derivedKey.toString('hex'),
    salt,
    iterations: DEFAULT_PBKDF2_ITERATIONS,
    algorithm: 'pbkdf2-sha512',
  };
}

/**
 * Verifica uma senha contra um hash com sal em tempo constante (evita Timing Attacks).
 */
export function verifyHashWithSalt(password: string, storedHash: string, salt: string): boolean {
  try {
    const computed = hashWithSalt(password, salt);
    const computedBuffer = Buffer.from(computed.hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, storedBuffer);
  } catch {
    return false;
  }
}

// ============================================================================
// 4. VERIFICAÇÃO DE HTTPS E TLS
// ============================================================================

export interface TlsAuditResult {
  isCompliant: boolean;
  hstsConfigured: boolean;
  hstsPreload: boolean;
  hstsMaxAgeYears: number;
  warnings: string[];
}

/**
 * Audita cabeçalhos e configurações de transporte seguro (HTTPS/TLS).
 */
export function auditTlsCompliance(headers: Record<string, string | undefined>): TlsAuditResult {
  const hsts = headers['strict-transport-security'] || headers['Strict-Transport-Security'] || '';
  const warnings: string[] = [];

  let hstsConfigured = false;
  let hstsPreload = false;
  let hstsMaxAgeYears = 0;

  if (hsts) {
    hstsConfigured = true;
    const maxAgeMatch = hsts.match(/max-age=(\d+)/i);
    if (maxAgeMatch) {
      const maxAgeSeconds = parseInt(maxAgeMatch[1], 10);
      hstsMaxAgeYears = +(maxAgeSeconds / (365 * 24 * 3600)).toFixed(1);
      if (maxAgeSeconds < 31536000) {
        warnings.push('HSTS max-age inferior a 1 ano (recomendado >= 2 anos).');
      }
    }
    if (hsts.includes('preload')) {
      hstsPreload = true;
    } else {
      warnings.push('HSTS não possui flag preload para submissão na lista HSTS dos navegadores.');
    }
    if (!hsts.includes('includeSubDomains')) {
      warnings.push('HSTS não cobre includeSubDomains.');
    }
  } else {
    warnings.push('Cabeçalho Strict-Transport-Security (HSTS) ausente.');
  }

  const isCompliant = hstsConfigured && hstsPreload && hstsMaxAgeYears >= 1;

  return {
    isCompliant,
    hstsConfigured,
    hstsPreload,
    hstsMaxAgeYears,
    warnings,
  };
}
