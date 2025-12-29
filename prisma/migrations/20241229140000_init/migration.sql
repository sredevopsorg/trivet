CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "LoginType" AS ENUM ('new', 'returning');

CREATE TABLE "accounts" (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "name" TEXT,
  "blog_host" TEXT,
  "admin_host" TEXT,
  "admin_api_key" TEXT,
  "google_oauth_client_id" TEXT,
  "google_oauth_client_secret" TEXT,
  "google_oauth_configured" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX "accounts_uuid_key" ON "accounts"("uuid");
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

CREATE TABLE "logins" (
  "id" SERIAL PRIMARY KEY,
  "account_id" INTEGER NOT NULL REFERENCES "accounts"("id") ON DELETE CASCADE,
  "member_email" TEXT NOT NULL,
  "type" "LoginType" NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "logins_account_id_created_at_idx" ON "logins"("account_id", "created_at");
CREATE INDEX "logins_account_id_member_email_idx" ON "logins"("account_id", "member_email");
