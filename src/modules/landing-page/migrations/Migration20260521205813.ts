import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260521205813 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "landing_page" ("id" text not null, "productId" text not null, "slug" text not null, "headline" text not null, "subHeadline" text not null, "benefits" jsonb not null, "beforeAfterImages" jsonb not null, "urgencyText" text null, "countdownEndsAt" timestamptz null, "whatsappNumber" text not null, "messengerLink" text null, "isCODAvailable" boolean not null default true, "deliveryDhaka" text not null default '1-2 days', "deliveryOutsideDhaka" text not null default '3-5 days', "bkashNumber" text null, "nagadNumber" text null, "isActive" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "landing_page_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_landing_page_deleted_at" ON "landing_page" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "landing_page" cascade;`);
  }

}
