import { Injectable } from "@nestjs/common";

import { MailgunHttpError } from "../../infrastructure/mailgun/mailgun.errors";
import { MailgunRateLimitError } from "../../infrastructure/mailgun/mailgun.errors";

export interface EmailRetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  stopOnRateLimit: boolean;
}

export interface EmailRetrySuccess<T> {
  ok: true;
  value: T;
  attempts: number;
  rateLimit: false;
}

export interface EmailRetryFailure {
  ok: false;
  error: unknown;
  attempts: number;
  rateLimit: boolean;
  sanitizedError: string;
}

export type EmailRetryResult<T> = EmailRetrySuccess<T> | EmailRetryFailure;

@Injectable()
export class EmailRetryService {
  async execute<T>(operation: () => Promise<T>): Promise<EmailRetryResult<T>> {
    const config = this.getConfig();
    let lastError: unknown;
    let lastWasRateLimit = false;
    let attempts = 0;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt += 1) {
      attempts = attempt;
      try {
        const value = await operation();
        return { ok: true, value, attempts: attempt, rateLimit: false };
      } catch (error) {
        lastError = error;
        lastWasRateLimit = error instanceof MailgunRateLimitError;

        if (!this.shouldRetry(error, config, attempt)) {
          break;
        }

        await this.sleep(this.getDelayMs(error, attempt, config));
      }
    }

    return {
      ok: false,
      error: lastError,
      attempts,
      rateLimit: lastWasRateLimit,
      sanitizedError: this.sanitizeError(lastError),
    };
  }

  getConfig(): EmailRetryConfig {
    return {
      maxAttempts: this.readInt("EMAIL_RETRY_MAX_ATTEMPTS", 5),
      baseDelayMs: this.readInt("EMAIL_RETRY_BASE_DELAY_MS", 30000),
      maxDelayMs: this.readInt("EMAIL_RETRY_MAX_DELAY_MS", 300000),
      stopOnRateLimit: process.env.EMAIL_STOP_ON_RATE_LIMIT === "true",
    };
  }

  private shouldRetry(
    error: unknown,
    config: EmailRetryConfig,
    attempt: number,
  ): boolean {
    if (attempt >= config.maxAttempts) {
      return false;
    }

    if (error instanceof MailgunRateLimitError) {
      return !config.stopOnRateLimit;
    }

    return error instanceof MailgunHttpError && error.statusCode >= 500;
  }

  private getDelayMs(
    error: unknown,
    attempt: number,
    config: EmailRetryConfig,
  ): number {
    if (
      error instanceof MailgunRateLimitError &&
      error.retryAfterSeconds !== undefined
    ) {
      return error.retryAfterSeconds * 1000;
    }

    const backoff = Math.min(
      config.baseDelayMs * 2 ** (attempt - 1),
      config.maxDelayMs,
    );

    return backoff + Math.floor(Math.random() * 1001);
  }

  private sanitizeError(error: unknown): string {
    if (error instanceof MailgunRateLimitError) {
      return "rate_limit_429";
    }

    if (error instanceof MailgunHttpError) {
      return `mailgun_http_${error.statusCode}`;
    }

    return "falha_envio_email";
  }

  private readInt(envName: string, fallback: number): number {
    const value = Number(process.env[envName]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
