export const scriptsConfig = {
  requireConfirmationEnv: "EMAIL_REQUIRE_CONFIRMATION",
  sendingEnabledEnv: "EMAIL_SENDING_ENABLED",
  dryRunEnv: "EMAIL_DRY_RUN",
  dailyLimitEnv: "EMAIL_DAILY_LIMIT",
  maxRequestLimitEnv: "EMAIL_MAX_REQUEST_LIMIT",
  batchSizeEnv: "EMAIL_BATCH_SIZE",
  batchIntervalMsEnv: "EMAIL_BATCH_INTERVAL_MS",
  sendIntervalMsEnv: "EMAIL_SEND_INTERVAL_MS",
  retryMaxAttemptsEnv: "EMAIL_RETRY_MAX_ATTEMPTS",
  retryBaseDelayMsEnv: "EMAIL_RETRY_BASE_DELAY_MS",
  retryMaxDelayMsEnv: "EMAIL_RETRY_MAX_DELAY_MS",
  stopOnRateLimitEnv: "EMAIL_STOP_ON_RATE_LIMIT",
} as const;
