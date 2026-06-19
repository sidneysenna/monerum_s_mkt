CREATE SCHEMA IF NOT EXISTS "sindicatos_br";

CREATE TABLE "sindicatos_br"."campanhas_email" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "template_id" VARCHAR(120) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ativa',
    "limite_diario" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanhas_email_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sindicatos_br"."campanha_email_destinatarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campanha_id" UUID NOT NULL,
    "sindicato_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "email_normalizado" TEXT NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "ultimo_erro" TEXT,
    "mailgun_message_id" TEXT,
    "enviado_em" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanha_email_destinatarios_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "campanhas_email_codigo_key"
ON "sindicatos_br"."campanhas_email" ("codigo");

CREATE UNIQUE INDEX "campanhas_email_slug_key"
ON "sindicatos_br"."campanhas_email" ("slug");

CREATE INDEX "idx_campanha_email_destinatarios_campanha_status"
ON "sindicatos_br"."campanha_email_destinatarios" ("campanha_id", "status");

CREATE INDEX "idx_campanha_email_destinatarios_sindicato"
ON "sindicatos_br"."campanha_email_destinatarios" ("sindicato_id");

CREATE INDEX "idx_campanha_email_destinatarios_enviado_em"
ON "sindicatos_br"."campanha_email_destinatarios" ("enviado_em");

CREATE UNIQUE INDEX "uq_campanha_sindicato_enviado"
ON "sindicatos_br"."campanha_email_destinatarios" ("campanha_id", "sindicato_id")
WHERE "status" = 'enviado';

ALTER TABLE "sindicatos_br"."campanha_email_destinatarios"
ADD CONSTRAINT "campanha_email_destinatarios_campanha_id_fkey"
FOREIGN KEY ("campanha_id") REFERENCES "sindicatos_br"."campanhas_email"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "sindicatos_br"."campanhas_email" (
    "codigo",
    "slug",
    "nome",
    "template_id",
    "status",
    "limite_diario"
) VALUES (
    'CAMPANHA_001',
    'consciencia-problema-apresentando-monerum-s',
    'CAMPANHA 001 - Consciência do problema e apresentando Monerum-S',
    'proposta-sindicato-digital',
    'ativa',
    100
)
ON CONFLICT ("codigo") DO UPDATE SET
    "slug" = EXCLUDED."slug",
    "nome" = EXCLUDED."nome",
    "template_id" = EXCLUDED."template_id",
    "status" = EXCLUDED."status",
    "limite_diario" = EXCLUDED."limite_diario",
    "updated_at" = CURRENT_TIMESTAMP;
