export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'metric';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class StructuredLogger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;
    const sensitiveKeys = ['password', 'token', 'accessToken', 'secret', 'authorization', 'cookie'];
    const sanitized: Record<string, any> = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, err?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitize(context) : undefined,
      error: err
        ? {
            name: err.name,
            message: err.message,
            stack: this.isDevelopment ? err.stack : undefined,
          }
        : undefined,
    };

    if (this.isDevelopment) {
      const color =
        level === 'error'
          ? '\x1b[31m'
          : level === 'warn'
          ? '\x1b[33m'
          : level === 'metric'
          ? '\x1b[36m'
          : '\x1b[32m';
      console.log(`${color}[${entry.timestamp}] [${level.toUpperCase()}]:\x1b[0m ${message}`, entry.context || '', err || '');
    } else {
      // Formato JSON estruturado para ingestão por Datadog, Sentry, CloudWatch, etc.
      console.log(JSON.stringify(entry));
    }

    // Gancho para envio a serviços externos (ex: Sentry.captureException)
    if (level === 'error' && typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(err || new Error(message), { extra: entry.context });
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  metric(name: string, value: number, unit = 'ms', tags?: Record<string, string>) {
    this.log('metric', `Métrica: ${name}=${value}${unit}`, { metric: name, value, unit, ...tags });
  }
}

export const logger = new StructuredLogger();
