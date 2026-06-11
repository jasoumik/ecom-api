import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260611110000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "philosophyImage1Url" text null;`);
    this.addSql(`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "philosophyImage2Url" text null;`);
  }
  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "philosophyImage1Url";`);
    this.addSql(`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "philosophyImage2Url";`);
  }
}
