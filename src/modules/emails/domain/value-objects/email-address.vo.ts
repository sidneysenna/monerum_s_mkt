export class EmailAddress {
  private static readonly SIMPLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {}

  static create(value: string): EmailAddress {
    const normalized = value.trim();

    if (!EmailAddress.isValid(normalized)) {
      throw new Error("E-mail invalido.");
    }

    return new EmailAddress(normalized);
  }

  static isValid(value: string | null | undefined): value is string {
    return (
      typeof value === "string" &&
      EmailAddress.SIMPLE_EMAIL_PATTERN.test(value.trim())
    );
  }
}
