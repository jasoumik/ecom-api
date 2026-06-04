# 🖥️ ecom-api — Task List

> **Repo:** `ecom-api` (Medusa.js v2 + Node.js)
> **Last Updated:** 2026-05-22

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | To do |
| `[x]` | Done |
| `[-]` | In progress |
| `[~]` | Blocked |
| 🔴 HIGH | Blocking — must be done first |
| 🟡 MEDIUM | Important — needed for MVP |
| 🟢 LOW | Post-MVP / nice to have |

---

## Phase 1: Project Setup

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 1.1 | `[x]` **Initialise Medusa.js v2** | `npx create-medusa-app@latest ecom-api` with PostgreSQL adapter | 🔴 HIGH |
| 1.2 | `[x]` **TypeScript strict mode** | Configure `tsconfig.json` with `strict: true`, path aliases (`@/` → `src/`) | 🔴 HIGH |
| 1.3 | `[ ]` **ESLint + Prettier** | Configure with `@typescript-eslint`, import ordering, no unused vars | 🔴 HIGH |
| 1.4 | `[x]` **Set up `.env.example`** | Document all required environment variables with comments | 🔴 HIGH |
| 1.5 | `[ ]` **Git hooks (Husky + lint-staged)** | Pre-commit: lint + type-check; commit-msg: conventional commits | 🟡 MEDIUM |
| 1.6 | `[ ]` **GitHub Actions CI** | Pipeline: install → lint → type-check → test → build | 🔴 HIGH |
| 1.7 | `[ ]` **Provision PostgreSQL** | Local: `createdb beauty_store`; staging/prod: Neon or Supabase | 🔴 HIGH |
| 1.8 | `[ ]` **Provision Redis** | Local: `brew install redis`; staging/prod: Railway Redis or Upstash | 🟡 MEDIUM |
| 1.9 | `[ ]` **Provision MeiliSearch** | Local: `meilisearch --master-key=...`; prod: MeiliSearch Cloud | 🟡 MEDIUM |
| 1.10 | `[ ]` **Configure S3/R2 bucket** | Create bucket, set CORS policy, generate access keys | 🔴 HIGH |

---

## Phase 2: Core Medusa Configuration

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 2.1 | `[x]` **`medusa.config.ts`** | Configure: CORS, auth, cookie settings, admin frontend URL, custom modules registered | 🔴 HIGH |
| 2.2 | `[ ]` **Redis event bus** | Install + configure `@medusajs/event-bus-redis` | 🟡 MEDIUM |
| 2.3 | `[ ]` **Redis cache** | Install + configure `@medusajs/cache-redis` | 🟡 MEDIUM |
| 2.4 | `[ ]` **S3 file plugin** | Install + configure `@medusajs/file-s3` with R2/S3 credentials | 🔴 HIGH |
| 2.5 | `[ ]` **Stripe payment plugin** | Install + configure `@medusajs/payment-stripe` | 🔴 HIGH |
| 2.6 | `[x]` **MeiliSearch plugin** | Custom `src/modules/search/` — SearchModuleService, product-indexer subscriber, store + admin routes | 🟡 MEDIUM |
| 2.7 | `[ ]` **Run initial migrations** | `pnpm medusa db:migrate` — verify base Medusa schema | 🔴 HIGH |
| 2.8 | `[ ]` **Create admin user** | `pnpm medusa user -e admin@example.com -p ...` | 🔴 HIGH |
| 2.9 | `[ ]` **Publishable API key** | Create publishable API key in admin for frontend use | 🔴 HIGH |
| 2.10 | `[ ]` **Configure multi-currency regions** | Create regions: BD (BDT), US (USD), UK (GBP), EU (EUR) | 🔴 HIGH |

---

## Phase 3: Database Schema & Migrations

### 3.1 Category Model

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.1.1 | `[x]` **Category MikroORM entity** | Self-referencing entity: `parent`, `children`, `slug`, `level`, `sort_order`, `is_active`, `metadata` | 🔴 HIGH |
| 3.1.2 | `[ ]` **Category migration** | Generate + run migration: `Migration_Category` | 🔴 HIGH |
| 3.1.3 | `[ ]` **Category indexes** | Index on `parent_id`, `slug`, `is_active` | 🔴 HIGH |

### 3.2 Product Extensions

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.2.1 | `[ ]` **`product_extension` entity** | Fields: `origin_country`, `brand`, `skin_types[]`, `skin_concerns[]`, `ingredients[]`, `how_to_use`, `is_featured`, `is_bd_available`, `bd_price_override`, `rating_avg`, `rating_count` | 🔴 HIGH |
| 3.2.2 | `[ ]` **Product extension migration** | Generate + run migration | 🔴 HIGH |

### 3.3 Landing Page Models

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.3.1 | `[x]` **`landing_page` entity** | All fields per schema doc; `benefits` and `beforeAfterImages` as JSON columns | 🔴 HIGH |
| 3.3.2 | `[ ]` **`landing_page_product` join entity** | M2M with `sort_order` | 🟡 MEDIUM |
| 3.3.3 | `[ ]` **`landing_page_combo` join entity** | M2M with `sort_order` | 🟡 MEDIUM |
| 3.3.4 | `[ ]` **Landing page migrations** | Generate + run all landing page migrations | 🔴 HIGH |

### 3.4 Combo Offer Models

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.4.1 | `[x]` **`combo_offer` entity** | Full schema including auto-calculated `discountValue`; type enum (FIXED_BUNDLE, BUY_X_GET_Y, PERCENTAGE_OFF, TIERED_PRICING, CUSTOM_BUNDLE) | 🔴 HIGH |
| 3.4.2 | `[x]` **`combo_item` entity** | FK to combo_offer, productId, quantity field | 🔴 HIGH |
| 3.4.3 | `[ ]` **Combo migrations** | Generate + run migrations | 🔴 HIGH |

### 3.5 BD Payment Model

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.5.1 | `[ ]` **`bd_payment` entity** | Provider enum, status enum, transaction_id, OTP fields, callback JSONB | 🔴 HIGH |
| 3.5.2 | `[ ]` **BD payment migration** | Generate + run migration | 🔴 HIGH |

### 3.6 User Extension

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 3.6.1 | `[ ]` **`customer_extension` entity** | phone_bd, preferred_language, skin_type, skin_concerns, loyalty_points, referral_code | 🟡 MEDIUM |
| 3.6.2 | `[ ]` **Customer extension migration** | Generate + run migration | 🟡 MEDIUM |

---

## Phase 4-pre: Media Module (`src/modules/media/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| M.1 | `[x]` **`BrandSettings` model** | Watermark config: position, opacity, size %, padding, logoUrl | 🔴 HIGH |
| M.2 | `[x]` **`MediaFile` model** | Upload metadata: r2Key, r2Url, dimensions, entityType, entityId | 🔴 HIGH |
| M.3 | `[x]` **`MediaModuleService.uploadFile()`** | Images → WebP + watermark → R2; videos/docs → R2 direct | 🔴 HIGH |
| M.4 | `[x]` **`MediaModuleService.uploadBrandLogo()`** | Upload watermark image to R2 (no watermark applied to itself) | 🔴 HIGH |
| M.5 | `[x]` **`MediaModuleService.deleteFile()`** | Delete from R2 + database | 🟡 MEDIUM |
| M.6 | `[x]` **`MediaModuleService.getEntityMedia()`** | Fetch media by entityType + entityId | 🟡 MEDIUM |
| M.7 | `[x]` **multer middleware** | `src/api/middlewares/upload.ts` — 50 MB limit, mime whitelist | 🔴 HIGH |
| M.8 | `[x]` **`POST /admin/media/upload`** | Multipart upload → process → R2 → save metadata | 🔴 HIGH |
| M.9 | `[x]` **`GET /admin/media`** | List media files with entityType/entityId filters + pagination | 🟡 MEDIUM |
| M.10 | `[x]` **`DELETE /admin/media/:id`** | Delete media file from R2 + database | 🟡 MEDIUM |
| M.11 | `[x]` **`GET /admin/media/brand-settings`** | Get active brand/watermark settings | 🔴 HIGH |
| M.12 | `[x]` **`POST /admin/media/brand-settings`** | Create brand settings | 🔴 HIGH |
| M.13 | `[x]` **`PUT /admin/media/brand-settings/:id`** | Update brand settings | 🟡 MEDIUM |
| M.14 | `[x]` **`POST /admin/media/brand-settings/logo`** | Upload watermark logo → R2 → returns URL | 🔴 HIGH |
| M.15 | `[x]` **`GET /store/media/:entityType/:entityId`** | Public media for a product/category/etc | 🔴 HIGH |
| M.16 | `[x]` **Register MEDIA_MODULE in medusa-config.ts** | Module wired with R2 credentials via env vars | 🔴 HIGH |
| M.17 | `[ ]` **Run migration** | Generate + run migration for `brand_settings`, `media_file` tables | 🔴 HIGH |

---

## Phase 4: Custom Modules

### 4.1 CategoryModule (`src/modules/category/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.1.1 | `[x]` **Module scaffold** | `index.ts` with Medusa v2 `Module()` definition, service registered | 🔴 HIGH |
| 4.1.2 | `[x]` **`CategoryService.getTree()`** | Recursive tree builder sorting by `order`, returns nested children | 🔴 HIGH |
| 4.1.3 | `[x]` **`CategoryService.getBySlug()`** | Find by slug filtering active categories | 🔴 HIGH |
| 4.1.4 | `[x]` **`CategoryService.create()`** | Create category with parent assignment and auto level calculation | 🔴 HIGH |
| 4.1.5 | `[x]` **`CategoryService.update()`** | Update category fields, recalculate level on parent change | 🟡 MEDIUM |
| 4.1.6 | `[ ]` **`CategoryService.reorder()`** | Update sort_order for sibling categories | 🟡 MEDIUM |
| 4.1.7 | `[x]` **`CategoryService.delete()`** | Soft delete (set `isActive: false`) with recursive child handling | 🟡 MEDIUM |
| 4.1.8 | `[ ]` **Redis caching** | Cache tree output for 1 hour, invalidate on any category change | 🟡 MEDIUM |
| 4.1.9 | `[x]` **`CategoryService.getBreadcrumb()`** | Recursive breadcrumb trail from category ID up to root | 🟡 MEDIUM |

### 4.2 LandingPageModule (`src/modules/landing-page/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.2.1 | `[x]` **Module scaffold** | `index.ts` with Medusa v2 `Module()` definition | 🔴 HIGH |
| 4.2.2 | `[x]` **`LandingPageService.getBySlug()`** | Fetch active page by slug | 🔴 HIGH |
| 4.2.3 | `[x]` **`LandingPageService.list()`** | List pages with optional `isActive` filter | 🔴 HIGH |
| 4.2.4 | `[x]` **`LandingPageService.create()`** | Create landing page | 🟡 MEDIUM |
| 4.2.5 | `[x]` **`LandingPageService.update()`** | Update landing page fields | 🟡 MEDIUM |
| 4.2.6 | `[x]` **`LandingPageService.publish()`** | Set `isActive: true` | 🟡 MEDIUM |
| 4.2.7 | `[x]` **`LandingPageService.unpublish()`** | Set `isActive: false` | 🟡 MEDIUM |
| 4.2.8 | `[ ]` **`LandingPageService.clone()`** | Duplicate a landing page with new slug | 🟢 LOW |
| 4.2.9 | `[ ]` **Content JSON schema validation** | Zod schema for `content_json` blocks array | 🟡 MEDIUM |

### 4.4-pre AttributeModule (`src/modules/attribute/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.5.1 | `[x]` **Module scaffold** | `index.ts` with Medusa v2 `Module()` definition, all 4 models registered | 🔴 HIGH |
| 4.5.2 | `[x]` **`AttributeGroup` model** | `name`, `categoryId`, `isInherited`, `order`, `isActive` | 🔴 HIGH |
| 4.5.3 | `[x]` **`Attribute` model** | `name`, `handle`, `groupId`, `type` enum (8 types), filter/search/compare flags, `unit` | 🔴 HIGH |
| 4.5.4 | `[x]` **`AttributeOption` model** | Predefined options for SELECT/MULTISELECT attributes | 🔴 HIGH |
| 4.5.5 | `[x]` **`ProductAttribute` model** | JSON value field stores any type per product | 🔴 HIGH |
| 4.5.6 | `[x]` **`AttributeModuleService.createGroup/updateGroup/deleteGroup/listGroups()`** | Full CRUD for attribute groups | 🔴 HIGH |
| 4.5.7 | `[x]` **`AttributeModuleService.createAttribute/updateAttribute/deleteAttribute/listAttributes()`** | Full CRUD for attributes | 🔴 HIGH |
| 4.5.8 | `[x]` **`AttributeModuleService.createOption/updateOption/deleteOption/listOptions()`** | Full CRUD for attribute options | 🔴 HIGH |
| 4.5.9 | `[x]` **`AttributeModuleService.setProductAttributes()`** | Upsert attribute values for a product | 🔴 HIGH |
| 4.5.10 | `[x]` **`AttributeModuleService.getProductAttributes()`** | Fetch attribute values enriched with definitions | 🔴 HIGH |
| 4.5.11 | `[x]` **`AttributeModuleService.deleteProductAttributes()`** | Remove all attribute values for a product | 🟡 MEDIUM |
| 4.5.12 | `[x]` **`AttributeModuleService.getCategoryAttributeSchema()`** | Returns groups+attributes for a category; walks ancestor chain for inheritance | 🔴 HIGH |
| 4.5.13 | `[x]` **`AttributeModuleService.seedBeautyAttributes()`** | Seeds all beauty/baby/hair/body attribute groups and options | 🔴 HIGH |
| 4.5.14 | `[ ]` **Category module migration** | Generate + run migration for `attribute_group`, `attribute`, `attribute_option`, `product_attribute` tables | 🔴 HIGH |
| 4.5.15 | `[x]` **MeiliSearch index sync** | product-indexer subscriber syncs product.created/updated/deleted events to MeiliSearch | 🟡 MEDIUM |

### 4.3 ComboOfferModule (`src/modules/combo-offer/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.3.1 | `[x]` **Module scaffold** | `index.ts` with Medusa v2 `Module()` definition | 🔴 HIGH |
| 4.3.2 | `[x]` **`ComboOfferService.create()`** | Create combo; auto-calculates `discountValue` as percentage | 🔴 HIGH |
| 4.3.3 | `[x]` **`ComboOfferService.getActiveOffers()`** | Filter by `isActive` and date window (startsAt/endsAt) | 🔴 HIGH |
| 4.3.4 | `[ ]` **`ComboOfferService.getById()`** | Fetch combo with full product + variant details | 🔴 HIGH |
| 4.3.5 | `[ ]` **`ComboOfferService.addToCart()`** | Add all combo items to Medusa cart as line items, apply discount | 🔴 HIGH |
| 4.3.6 | `[ ]` **`ComboOfferService.checkStock()`** | Verify all combo items are in stock before add-to-cart | 🔴 HIGH |
| 4.3.7 | `[x]` **`ComboOfferService.update()`** | Update combo, recalculate discountValue | 🟡 MEDIUM |
| 4.3.8 | `[ ]` **`ComboOfferService.decrementStock()`** | If `stock_limit` set, decrement on order completion | 🟡 MEDIUM |
| 4.3.9 | `[x]` **`ComboOfferService.addItems()`** | Add product items to an existing combo offer | 🟡 MEDIUM |
| 4.3.10 | `[x]` **`ComboOfferService.getBySlug()`** | Find active combo by slug | 🟡 MEDIUM |

### 4.4 BDPaymentModule (`src/modules/bd-payment/`)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 4.4.1 | `[ ]` **Module scaffold** | Medusa v2 payment provider module | 🔴 HIGH |
| 4.4.2 | `[ ]` **bKash provider** | `initiatePayment()`, `authorizePayment()`, `capturePayment()`, `cancelPayment()`, `refundPayment()` using bKash PGW v1.2 tokenized checkout | 🔴 HIGH |
| 4.4.3 | `[ ]` **bKash token management** | Auto-refresh bKash ID token (expires every 60 mins), store in Redis | 🔴 HIGH |
| 4.4.4 | `[ ]` **Nagad provider** | Full payment lifecycle using Nagad Direct API | 🔴 HIGH |
| 4.4.5 | `[ ]` **Rocket provider** | DBBL Rocket payment provider | 🟡 MEDIUM |
| 4.4.6 | `[ ]` **COD provider** | Custom COD payment provider: create pending payment, send OTP, verify OTP, mark confirmed | 🔴 HIGH |
| 4.4.7 | `[ ]` **SSLCommerz provider** | Card payments for BD customers via SSLCommerz | 🟡 MEDIUM |
| 4.4.8 | `[ ]` **bKash webhook handler** | Secure IPN handler: verify signature, update payment status | 🔴 HIGH |
| 4.4.9 | `[ ]` **Nagad webhook handler** | Secure callback handler: verify, update status | 🔴 HIGH |
| 4.4.10 | `[ ]` **OTP service** | Send 6-digit OTP via SMS for COD verification; Redis-backed expiry (5 min) | 🔴 HIGH |
| 4.4.11 | `[ ]` **`BDPaymentService.initiateRefund()`** | Initiate refund via provider API | 🟡 MEDIUM |

---

## Phase 5: API Routes

### 5.1 Store Routes (public)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 5.1.1 | `[x]` **`GET /store/categories`** | Returns full recursive category tree | 🔴 HIGH |
| 5.1.2 | `[ ]` **`GET /store/categories/:slug`** | Category + children (2 levels) | 🔴 HIGH |
| 5.1.3 | `[ ]` **`GET /store/products/featured`** | Featured products for homepage | 🔴 HIGH |
| 5.1.4 | `[ ]` **`GET /store/products/:id/related`** | Related products by category + concern | 🟡 MEDIUM |
| 5.1.5 | `[x]` **`POST /store/search`** | MeiliSearch proxy with faceting, filters, pagination, sort | 🟡 MEDIUM |
| 5.1.6 | `[ ]` **`GET /store/landing-pages`** | Active landing pages by market | 🔴 HIGH |
| 5.1.7 | `[x]` **`GET /store/landing-pages/:slug`** | Full landing page by slug | 🔴 HIGH |
| 5.1.8 | `[x]` **`GET /store/combos`** | Active combo offers (date-filtered) | 🔴 HIGH |
| 5.1.9 | `[ ]` **`GET /store/combos/:id`** | Combo with full product details | 🔴 HIGH |
| 5.1.10 | `[ ]` **`POST /store/carts/:id/combos`** | Add combo to cart | 🔴 HIGH |
| 5.1.11 | `[ ]` **`POST /store/bd-payments/initiate`** | Initiate BD payment | 🔴 HIGH |
| 5.1.12 | `[ ]` **`POST /store/bd-payments/execute`** | Execute post-approval | 🔴 HIGH |
| 5.1.13 | `[ ]` **`POST /store/bd-payments/cod/verify-otp`** | COD OTP verification | 🔴 HIGH |

### 5.2 Admin Routes (authenticated)

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 5.2.1 | `[ ]` **CRUD landing pages** | `GET/POST /admin/landing-pages`, `GET/PUT/DELETE /admin/landing-pages/:id` | 🟡 MEDIUM |
| 5.2.2 | `[ ]` **Publish/unpublish landing page** | `POST /admin/landing-pages/:id/publish` + unpublish | 🟡 MEDIUM |
| 5.2.3 | `[ ]` **CRUD combo offers** | Full admin CRUD for combo offers + items | 🟡 MEDIUM |
| 5.2.4 | `[ ]` **BD payments list** | `GET /admin/bd-payments` with filters | 🟡 MEDIUM |
| 5.2.5 | `[ ]` **BD payment refund** | `POST /admin/bd-payments/:id/refund` | 🟡 MEDIUM |

### 5.3 Webhook Routes

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 5.3.1 | `[ ]` **Stripe webhook** | `POST /hooks/stripe` — secure, signature verified | 🔴 HIGH |
| 5.3.2 | `[ ]` **bKash webhook** | `POST /store/bd-payments/webhook/bkash` — IPN handler | 🔴 HIGH |
| 5.3.3 | `[ ]` **Nagad webhook** | `POST /store/bd-payments/webhook/nagad` — callback handler | 🔴 HIGH |

---

## Phase 6: Background Jobs & Events

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 6.1 | `[x]` **Product indexer subscriber** | Medusa subscriber syncs product.created/updated/deleted to MeiliSearch index | 🟡 MEDIUM |
| 6.2 | `[x]` **Bulk index products** | `POST /admin/search/reindex` triggers full reindex of all products | 🟡 MEDIUM |
| 6.3 | `[ ]` **Order placed subscriber** | On order placed: send confirmation email + SMS (BD) | 🔴 HIGH |
| 6.4 | `[ ]` **Order shipped subscriber** | On order shipped: send tracking info via email + WhatsApp | 🟡 MEDIUM |
| 6.5 | `[ ]` **Low stock alert** | Subscriber: when variant stock < 5, alert admin | 🟢 LOW |
| 6.6 | `[ ]` **Image processor job** | On product image upload: generate WebP variants, update CDN | 🟡 MEDIUM |

---

## Phase 7: Seed Data

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 7.1 | `[x]` **Categories seed** | Full category tree: Beauty & Personal Care, Baby Care, Makeup, Fragrance, Hair Care — ~60 categories | 🔴 HIGH |
| 7.1a | `[x]` **Attribute groups + attributes seed** | `src/scripts/seed-attributes.ts` — seeds all beauty/baby/hair/body attribute groups, attributes, and options | 🔴 HIGH |
| 7.2 | `[ ]` **Products seed** | Seed 50+ products across all categories with all custom fields | 🟡 MEDIUM |
| 7.3 | `[ ]` **Regions & currencies seed** | BD region (BDT), US region (USD), UK region (GBP), EU region (EUR) | 🔴 HIGH |
| 7.4 | `[ ]` **Shipping options seed** | BD shipping options (Dhaka, outside Dhaka, express) + global options | 🔴 HIGH |
| 7.5 | `[ ]` **Sample combo offers seed** | 5+ sample combo offers in BD market | 🟡 MEDIUM |
| 7.6 | `[ ]` **Sample landing pages seed** | 2+ sample BD landing pages with full block content | 🟡 MEDIUM |

---

## Phase 8: Testing

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 8.1 | `[ ]` **CategoryService unit tests** | Test tree building, findBySlug, create, recursive levels | 🔴 HIGH |
| 8.2 | `[ ]` **ComboOfferService unit tests** | Test price calculation, stock check, add-to-cart logic | 🔴 HIGH |
| 8.3 | `[ ]` **BDPaymentService unit tests** | Test OTP flow, provider dispatch, refund logic | 🔴 HIGH |
| 8.4 | `[ ]` **bKash provider unit tests** | Test token refresh, payment lifecycle mocked responses | 🔴 HIGH |
| 8.5 | `[ ]` **Landing page service unit tests** | Test slug resolution, market filtering, publish logic | 🟡 MEDIUM |
| 8.6 | `[ ]` **API integration tests** | Test all store API endpoints with supertest | 🟡 MEDIUM |
| 8.7 | `[ ]` **Payment sandbox testing** | Manual + automated tests against bKash/Nagad sandbox environments | 🔴 HIGH |
| 8.8 | `[ ]` **Load test key endpoints** | k6: product listing, search, checkout endpoints | 🟡 MEDIUM |
| 8.9 | `[ ]` **Security audit** | SQL injection, auth bypass, webhook signature bypass testing | 🔴 HIGH |

---

## Phase 9: Production Readiness

| # | Task | Description | Priority |
|---|------|-------------|----------|
| 9.1 | `[x]` **Structured logging** | Winston logger with JSON output, request IDs, error context | 🔴 HIGH |
| 9.2 | `[ ]` **Sentry error tracking** | Sentry SDK integration, unhandled rejection capture | 🔴 HIGH |
| 9.3 | `[ ]` **Health check endpoint** | `GET /health` → DB ping + Redis ping + 200 OK | 🔴 HIGH |
| 9.4 | `[ ]` **Rate limiting** | Rate limiting middleware on all public endpoints | 🔴 HIGH |
| 9.5 | `[x]` **Request validation middleware** | Zod validation on all POST/PUT request bodies | 🔴 HIGH |
| 9.6 | `[ ]` **PgBouncer connection pooling** | Configure PgBouncer for production DB connections | 🟡 MEDIUM |
| 9.7 | `[ ]` **Database backup strategy** | Automated daily backups, point-in-time recovery | 🔴 HIGH |
| 9.8 | `[ ]` **Staging deployment** | Deploy to Railway/Render staging environment | 🔴 HIGH |
| 9.9 | `[ ]` **Production deployment** | Deploy to production with all env vars, SSL, domain | 🔴 HIGH |
| 9.10 | `[ ]` **Uptime monitoring** | Uptime Robot alerts for API downtime | 🟡 MEDIUM |
