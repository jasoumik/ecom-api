import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260521205817 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "brand_settings" ("id" text not null, "name" text not null, "logoUrl" text null, "watermarkPosition" text check ("watermarkPosition" in ('TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT', 'CENTER')) not null default 'BOTTOM_RIGHT', "watermarkOpacity" integer not null default 0.7, "watermarkSizePercent" integer not null default 15, "watermarkPadding" integer not null default 20, "isActive" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_settings_deleted_at" ON "brand_settings" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "media_file" ("id" text not null, "originalName" text not null, "fileName" text not null, "mimeType" text not null, "originalMimeType" text not null, "size" integer not null, "width" integer null, "height" integer null, "r2Key" text not null, "r2Url" text not null, "hasWatermark" boolean not null default false, "entityType" text null, "entityId" text null, "uploadedBy" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_file_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_file_deleted_at" ON "media_file" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "brand_settings" cascade;`);

    this.addSql(`drop table if exists "media_file" cascade;`);
  }

}
