import { MailgunHttpError } from "../../infrastructure/mailgun/mailgun.errors";
import { MailgunRateLimitError } from "../../infrastructure/mailgun/mailgun.errors";
import { EmailRetryService } from "./email-retry.service";

describe("EmailRetryService", () => {
  const originalEnv = process.env;
  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, "random").mockReturnValue(0);
    process.env = {
      ...originalEnv,
      EMAIL_RETRY_MAX_ATTEMPTS: "3",
      EMAIL_RETRY_BASE_DELAY_MS: "1000",
      EMAIL_RETRY_MAX_DELAY_MS: "5000",
      EMAIL_STOP_ON_RATE_LIMIT: "false",
    };
  });

  afterEach(() => {
    randomSpy.mockRestore();
    jest.useRealTimers();
    process.env = originalEnv;
  });

  it("respeita Retry-After em status 429", async () => {
    const service = new EmailRetryService();
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new MailgunRateLimitError("429", 60))
      .mockResolvedValueOnce("ok");

    const promise = service.execute(operation);
    await jest.advanceTimersByTimeAsync(60000);
    const result = await promise;

    expect(operation).toHaveBeenCalledTimes(2);
    expect(result.ok).toBe(true);
  });

  it("usa backoff quando 429 nao tem Retry-After", async () => {
    const service = new EmailRetryService();
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new MailgunRateLimitError("429"))
      .mockResolvedValueOnce("ok");

    const promise = service.execute(operation);
    await jest.advanceTimersByTimeAsync(1000);
    const result = await promise;

    expect(operation).toHaveBeenCalledTimes(2);
    expect(result.ok).toBe(true);
  });

  it("para apos EMAIL_RETRY_MAX_ATTEMPTS", async () => {
    const service = new EmailRetryService();
    const operation = jest
      .fn()
      .mockRejectedValue(new MailgunHttpError("500", 500));

    const promise = service.execute(operation);
    await jest.advanceTimersByTimeAsync(1000);
    await jest.advanceTimersByTimeAsync(2000);
    const result = await promise;

    expect(operation).toHaveBeenCalledTimes(3);
    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        attempts: 3,
        sanitizedError: "mailgun_http_500",
      }),
    );
  });
});
