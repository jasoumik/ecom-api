import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260521205816 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "attribute" ("id" text not null, "name" text not null, "handle" text not null, "description" text null, "groupId" text not null, "type" text check ("type" in ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTISELECT', 'DATE', 'COLOR', 'URL')) not null, "isRequired" boolean not null default false, "isFilterable" boolean not null default true, "isSearchable" boolean not null default true, "isComparable" boolean not null default false, "unit" text null, "order" integer not null default 0, "isActive" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_deleted_at" ON "attribute" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "attribute_group" ("id" text not null, "name" text not null, "description" text null, "categoryId" text not null, "isInherited" boolean not null default true, "order" integer not null default 0, "isActive" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_group_deleted_at" ON "attribute_group" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "attribute_option" ("id" text not null, "attributeId" text not null, "label" text not null, "value" text not null, "color" text null, "order" integer not null default 0, "isActive" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "attribute_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_attribute_option_deleted_at" ON "attribute_option" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "product_attribute" ("id" text not null, "productId" text not null, "attributeId" text not null, "value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_attribute_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_attribute_deleted_at" ON "product_attribute" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "attribute" cascade;`);

    this.addSql(`drop table if exists "attribute_group" cascade;`);

    this.addSql(`drop table if exists "attribute_option" cascade;`);

    this.addSql(`drop table if exists "product_attribute" cascade;`);
  }

}
