import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260611000000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE "brand_settings" ALTER COLUMN "watermarkOpacity" TYPE numeric(5,4) USING "watermarkOpacity"::numeric;`);
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE "brand_settings" ALTER COLUMN "watermarkOpacity" TYPE integer USING "watermarkOpacity"::integer;`);
  }

}
