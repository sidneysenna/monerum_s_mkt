import { Injectable } from "@nestjs/common";

import {
  MailgunSendMessageInput,
  MailgunSendMessageResult,
} from "./mailgun.types";

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
      throw new Error(`Mailgun retornou status ${response.status}.`);
    }

    return (await response.json()) as MailgunSendMessageResult;
  }
}
