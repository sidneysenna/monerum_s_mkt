export class MailgunRateLimitError extends Error {
  readonly statusCode = 429;

  constructor(
    message: string,
    readonly retryAfterSeconds?: number,
    readonly responseBody?: string,
  ) {
    super(message);
    this.name = "MailgunRateLimitError";
  }
}

export class MailgunHttpError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly responseBody?: string,
  ) {
    super(message);
    this.name = "MailgunHttpError";
  }
}
