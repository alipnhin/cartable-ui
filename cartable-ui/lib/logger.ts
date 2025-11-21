/**
 * Structured Logging Utility
 * ابزار لاگ‌گیری ساختاریافته
 *
 * این ماژول یک سیستم لاگ‌گیری یکپارچه برای اپلیکیشن فراهم می‌کند
 * که در production می‌تواند به سرویس‌هایی مثل Sentry متصل شود
 *
 * @module lib/logger
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';
  private isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

  /**
   * Format log entry for output
   * فرمت کردن لاگ برای نمایش
   */
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Send log to external service (e.g., Sentry)
   * ارسال لاگ به سرویس خارجی
   */
  private sendToExternalService(entry: LogEntry): void {
    // TODO: در صورت نیاز، اتصال به Sentry یا سرویس مشابه
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   switch (entry.level) {
    //     case LogLevel.ERROR:
    //       window.Sentry.captureException(entry.error || new Error(entry.message));
    //       break;
    //     case LogLevel.WARN:
    //       window.Sentry.captureMessage(entry.message, 'warning');
    //       break;
    //   }
    // }
  }

  /**
   * Core logging method
   * متد اصلی لاگ‌گیری
   */
  private writeLog(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    // Skip logs in test environment
    if (this.isTest) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // In development, use console methods
    if (this.isDevelopment || this.isDebugEnabled) {
      const formattedLog = this.formatLog(entry);
      switch (level) {
        case LogLevel.DEBUG:
          if (this.isDebugEnabled) {
            console.debug(formattedLog, error);
          }
          break;
        case LogLevel.INFO:
          console.info(formattedLog);
          break;
        case LogLevel.WARN:
          console.warn(formattedLog);
          break;
        case LogLevel.ERROR:
          console.error(formattedLog, error);
          break;
      }
    }

    // In production, send to external service
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }
  }

  /**
   * Log debug message - فقط در development + debug mode
   */
  debug(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message - در development نمایش داده می‌شود
   */
  info(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message - همیشه نمایش داده می‌شود
   */
  warn(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  /**
   * Log error message - همیشه نمایش داده می‌شود
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.writeLog(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log API error
   */
  apiError(endpoint: string, error: unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.error(
      `API Error: ${endpoint}`,
      error instanceof Error ? error : new Error(errorMessage),
      {
        ...context,
        endpoint,
      }
    );
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      action,
    });
  }

  /**
   * Log performance metric
   */
  performance(metric: string, duration: number, context?: LogContext): void {
    this.debug(`Performance: ${metric} took ${duration}ms`, {
      ...context,
      metric,
      duration,
    });
  }

  /**
   * Legacy console.log replacement
   */
  log(...args: unknown[]): void {
    if (this.isDevelopment || this.isDebugEnabled) {
      console.log(...args);
    }
  }
}

// Export singleton instance
const loggerInstance = new Logger();

export default loggerInstance;

// Named exports for backward compatibility
export const log = (...args: unknown[]) => loggerInstance.log(...args);
export const info = (message: string, context?: LogContext) => loggerInstance.info(message, context);
export const warn = (message: string, context?: LogContext) => loggerInstance.warn(message, context);
export const error = (message: string, err?: Error, context?: LogContext) => loggerInstance.error(message, err, context);
export const debug = (message: string, context?: LogContext) => loggerInstance.debug(message, context);

// Export logger instance
export const logger = loggerInstance;

/**
 * Create a logger instance with default context
 *
 * @example
 * ```ts
 * const log = createLogger({ component: 'MyComponent' });
 * log.info('Component mounted');
 * log.error('Error occurred', error);
 * ```
 */
export function createLogger(defaultContext: LogContext) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...defaultContext, ...context }),
    error: (message: string, error?: Error, context?: LogContext) =>
      logger.error(message, error, { ...defaultContext, ...context }),
  };
}
