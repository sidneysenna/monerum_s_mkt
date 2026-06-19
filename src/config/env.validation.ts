export const REQUIRED_DATABASE_SCHEMA = "sindicatos_br";
export const FORBIDDEN_DATABASE_SCHEMA = "public";

export interface PlannedEnv {
  NODE_ENV: string;
  DATABASE_URL: string;
  EMAIL_SENDING_ENABLED: string;
  EMAIL_DRY_RUN: string;
  EMAIL_REQUIRE_CONFIRMATION: string;
}

// Validacao completa de ambiente sera implementada em fase futura.
