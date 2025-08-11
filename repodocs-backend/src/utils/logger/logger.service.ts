import { Injectable } from "@nestjs/common";
import { createLogger, logLevels } from "./logger.config";

export interface LogContext {
  service?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService {
  private logger: any;
  private context: LogContext = {};

  constructor() {
    this.logger = createLogger();
  }

  /**
   * Format context for logging
   */
  private formatContext(): string {
    const parts: string[] = [];

    if (this.context.service) {
      parts.push(this.context.service);
    }

    if (this.context.method) {
      parts.push(this.context.method);
    }

    return parts.length > 0 ? parts.join("::") : undefined;
  }

  /**
   * Set context for this logger instance
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
    this.logger = createLogger(this.formatContext());
  }

  /**
   * Add additional context
   */
  addContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
    this.logger = createLogger(this.formatContext());
  }

  /**
   * Fatal level logging - Application cannot continue
   */
  fatal(message: string, meta?: any): void {
    this.logger.fatal(message, { ...this.context, ...meta });
  }

  /**
   * Error level logging - Application error that needs attention
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, { ...this.context, ...meta });
  }

  /**
   * Warning level logging - Something unexpected happened but application can continue
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, { ...this.context, ...meta });
  }

  /**
   * Info level logging - General information about application flow
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, { ...this.context, ...meta });
  }

  /**
   * Debug level logging - Detailed information for debugging
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, { ...this.context, ...meta });
  }

  /**
   * Trace level logging - Most detailed information for tracing execution
   */
  trace(message: string, meta?: any): void {
    this.logger.trace(message, { ...this.context, ...meta });
  }

  /**
   * Log with custom level
   */
  log(level: keyof typeof logLevels, message: string, meta?: any): void {
    this.logger.log(level, message, { ...this.context, ...meta });
  }

  /**
   * Log error with stack trace
   */
  errorWithStack(message: string, error: Error, meta?: any): void {
    this.logger.error(message, {
      ...this.context,
      ...meta,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, meta?: any): void {
    this.logger.info(`Performance: ${operation} took ${duration}ms`, {
      ...this.context,
      ...meta,
      operation,
      duration,
      unit: "ms",
    });
  }

  /**
   * Log database operations
   */
  database(
    operation: string,
    table: string,
    duration?: number,
    meta?: any
  ): void {
    this.logger.debug(`Database: ${operation} on ${table}`, {
      ...this.context,
      ...meta,
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  /**
   * Log HTTP requests
   */
  http(
    method: string,
    url: string,
    statusCode: number,
    duration?: number,
    meta?: any
  ): void {
    const level = statusCode >= 400 ? "warn" : "info";
    this.logger.log(level, `HTTP: ${method} ${url} - ${statusCode}`, {
      ...this.context,
      ...meta,
      method,
      url,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  /**
   * Log authentication events
   */
  auth(event: string, userId?: string, meta?: any): void {
    this.logger.info(`Auth: ${event}`, {
      ...this.context,
      ...meta,
      event,
      userId,
    });
  }

  /**
   * Log business logic events
   */
  business(
    event: string,
    entity?: string,
    entityId?: string,
    meta?: any
  ): void {
    this.logger.info(`Business: ${event}`, {
      ...this.context,
      ...meta,
      event,
      entity,
      entityId,
    });
  }
}
