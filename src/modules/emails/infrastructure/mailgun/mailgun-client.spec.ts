import { MailgunClient } from "./mailgun-client";

describe("MailgunClient", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MAILGUN_API_KEY: "test-key",
      MAILGUN_DOMAIN: "mg.example.com",
      MAILGUN_API_BASE_URL: "https://api.mailgun.net/v3",
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "<message-id>", message: "Queued" }),
    } as Response);
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it("monta requisicao Mailgun usando fetch nativo", async () => {
    const client = new MailgunClient();

    await client.sendMessage({
      from: "Monerum <contato@example.com>",
      to: "destino@example.com",
      subject: "Assunto",
      text: "Texto",
      html: "<p>Texto</p>",
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.mailgun.net/v3/mg.example.com/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: expect.any(URLSearchParams),
      }),
    );
  });
});
