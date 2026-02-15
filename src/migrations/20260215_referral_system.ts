import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "referral_code" varchar;
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "referral_points" numeric DEFAULT 0;
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "referred_by" varchar;
    ALTER TABLE "registrations" ADD COLUMN IF NOT EXISTS "signed_up_by_id" integer;
    
    DO $$ BEGIN
      ALTER TABLE "registrations" ADD CONSTRAINT "registrations_signed_up_by_id_exec_id_fk" 
        FOREIGN KEY ("signed_up_by_id") REFERENCES "public"."exec"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    CREATE UNIQUE INDEX IF NOT EXISTS "registrations_referral_code_idx" ON "registrations" USING btree ("referral_code");
    CREATE INDEX IF NOT EXISTS "registrations_signed_up_by_idx" ON "registrations" USING btree ("signed_up_by_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "registrations" DROP CONSTRAINT IF EXISTS "registrations_signed_up_by_id_exec_id_fk";
    DROP INDEX IF EXISTS "registrations_referral_code_idx";
    DROP INDEX IF EXISTS "registrations_signed_up_by_idx";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "referral_code";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "referral_points";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "referred_by";
    ALTER TABLE "registrations" DROP COLUMN IF EXISTS "signed_up_by_id";
  `)
}
