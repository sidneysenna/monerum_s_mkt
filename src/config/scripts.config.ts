export const scriptsConfig = {
  requireConfirmationEnv: 'EMAIL_REQUIRE_CONFIRMATION',
  sendingEnabledEnv: 'EMAIL_SENDING_ENABLED',
  dryRunEnv: 'EMAIL_DRY_RUN',
  batchSizeEnv: 'EMAIL_BATCH_SIZE',
  batchIntervalMsEnv: 'EMAIL_BATCH_INTERVAL_MS',
} as const;
