import { Injectable } from "@nestjs/common";

import {
  MailgunSendMessageInput,
  MailgunSendMessageResult,
} from "./mailgun.types";
import { MailgunHttpError, MailgunRateLimitError } from "./mailgun.errors";

@Injectable()
export class MailgunClient {
  async sendMessage(
    input: MailgunSendMessageInput,
  ): Promise<MailgunSendMessageResult> {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const apiBaseUrl =
      process.env.MAILGUN_API_BASE_URL ?? "https://api.mailgun.net/v3";

    if (!apiKey || !domain) {
      throw new Error("Mailgun nao configurado.");
    }

    const token = Buffer.from(`api:${apiKey}`).toString("base64");
    const body = new URLSearchParams({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    const response = await fetch(`${apiBaseUrl}/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      const responseBody = await this.readSanitizedBody(response);
      const retryAfterSeconds = this.parseRetryAfter(
        response.headers.get("Retry-After"),
      );

      if (response.status === 429) {
        throw new MailgunRateLimitError(
          "Mailgun retornou status 429.",
          retryAfterSeconds,
          responseBody,
        );
      }

      throw new MailgunHttpError(
        `Mailgun retornou status ${response.status}.`,
        response.status,
        responseBody,
      );
    }

    return (await response.json()) as MailgunSendMessageResult;
  }

  private async readSanitizedBody(
    response: Response,
  ): Promise<string | undefined> {
    try {
      const body = await response.text();
      const sanitized = body
        .replace(/Basic\s+[A-Za-z0-9+/=]+/g, "Basic [redacted]")
        .replace(/api:key-[A-Za-z0-9_-]+/g, "api:[redacted]")
        .slice(0, 500);

      return sanitized || undefined;
    } catch {
      return undefined;
    }
  }

  private parseRetryAfter(value: string | null): number | undefined {
    if (!value) {
      return undefined;
    }

    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.ceil(seconds);
    }

    const dateMs = Date.parse(value);
    if (Number.isNaN(dateMs)) {
      return undefined;
    }

    return Math.max(Math.ceil((dateMs - Date.now()) / 1000), 0);
  }
}
