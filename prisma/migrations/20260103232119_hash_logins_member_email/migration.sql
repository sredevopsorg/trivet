ALTER TABLE "logins" ADD COLUMN "member_email_hash" TEXT;

UPDATE "logins"
SET "member_email_hash" = md5(lower(trim("member_email")));

ALTER TABLE "logins" ALTER COLUMN "member_email_hash" SET NOT NULL;

CREATE INDEX "logins_account_id_member_email_hash_idx" ON "logins"("account_id", "member_email_hash");

DROP INDEX "logins_account_id_member_email_idx";

ALTER TABLE "logins" DROP COLUMN "member_email";
