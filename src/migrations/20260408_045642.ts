import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "csv_uploads" (
    "id" serial PRIMARY KEY,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "url" varchar,
    "thumbnail_u_r_l" varchar,
    "filename" varchar,
    "mime_type" varchar,
    "filesize" numeric,
    "width" numeric,
    "height" numeric,
    "focal_x" numeric,
    "focal_y" numeric
  );
  CREATE INDEX IF NOT EXISTS "csv_uploads_updated_at_idx" ON "csv_uploads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "csv_uploads_created_at_idx" ON "csv_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "csv_uploads_filename_idx" ON "csv_uploads" USING btree ("filename");
  ALTER TABLE "exec" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_exec_category";
  CREATE TYPE "public"."enum_exec_category" AS ENUM('Presidents', 'Admin / Advisory', 'Activities', 'Public Relations Officer', 'Marketing', 'Design / Photography', 'AESIR', 'Interns');
  ALTER TABLE "exec" ALTER COLUMN "category" SET DATA TYPE "public"."enum_exec_category" USING "category"::"public"."enum_exec_category";
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "slug" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_idx" ON "events" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "csv_uploads";
  ALTER TABLE "exec" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_exec_category";
  CREATE TYPE "public"."enum_exec_category" AS ENUM('Presidents', 'Admin', 'Marketing', 'Activities', 'AESIR', 'Public Relations Officer', 'Design', 'Photography', 'Interns');
  ALTER TABLE "exec" ALTER COLUMN "category" SET DATA TYPE "public"."enum_exec_category" USING "category"::"public"."enum_exec_category";
  DROP INDEX IF EXISTS "events_slug_idx";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "slug";`)
}
