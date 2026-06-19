export const mailgunConfig = {
  apiBaseUrlEnv: "MAILGUN_API_BASE_URL",
  apiKeyEnv: "MAILGUN_API_KEY",
  domainEnv: "MAILGUN_DOMAIN",
  httpClient: "native-fetch",
  realSendDefault: false,
} as const;
