import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260521205815 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "combo_item" ("id" text not null, "comboOfferId" text not null, "productId" text not null, "quantity" integer not null default 1, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "combo_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_item_deleted_at" ON "combo_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "combo_offer" ("id" text not null, "name" text not null, "slug" text not null, "description" text null, "image" text null, "type" text check ("type" in ('FIXED_BUNDLE', 'BUY_X_GET_Y', 'PERCENTAGE_OFF', 'TIERED_PRICING', 'CUSTOM_BUNDLE')) not null default 'FIXED_BUNDLE', "discountValue" integer not null default 0, "originalPrice" integer not null, "comboPrice" integer not null, "isActive" boolean not null default true, "startsAt" timestamptz null, "endsAt" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "combo_offer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_offer_deleted_at" ON "combo_offer" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "combo_item" cascade;`);

    this.addSql(`drop table if exists "combo_offer" cascade;`);
  }

}
