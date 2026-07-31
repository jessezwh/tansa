import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "registrations_referral_code_idx";
  ALTER TABLE "sponsors" ADD COLUMN "category" varchar;
  ALTER TABLE "registrations" DROP COLUMN "referral_code";
  ALTER TABLE "registrations" DROP COLUMN "referral_points";
  ALTER TABLE "registrations" DROP COLUMN "referred_by";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "registrations" ADD COLUMN "referral_code" varchar;
  ALTER TABLE "registrations" ADD COLUMN "referral_points" numeric DEFAULT 0;
  ALTER TABLE "registrations" ADD COLUMN "referred_by" varchar;
  CREATE UNIQUE INDEX "registrations_referral_code_idx" ON "registrations" USING btree ("referral_code");
  ALTER TABLE "sponsors" DROP COLUMN "category";`)
}
