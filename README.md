# ecom-api — Medusa.js v2 + Node.js

**Stack:** Medusa.js v2 · Node.js · TypeScript · PostgreSQL · Redis · MeiliSearch

> **Medusa.js v2 backend for the GlowNest Global Beauty & Baby Care Platform**
> Powers product management, orders, payments (Stripe + bKash + Nagad + COD), BD landing pages, and combo offers.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Installation](#4-installation)
5. [Environment Variables](#5-environment-variables)
6. [Running Locally](#6-running-locally)
7. [API Endpoints Overview](#7-api-endpoints-overview)
8. [Folder Structure](#8-folder-structure)
9. [Custom Modules](#9-custom-modules)
10. [Testing](#10-testing)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

This is the backend for **GlowNest**, a global beauty and baby care ecommerce platform. It is built on **Medusa.js v2** and extends the core with:

- **Recursive category system** — unlimited depth category tree (Beauty → Skincare → Serums → Vitamin C)
- **Product extensions** — origin country, skin type tags, ingredient lists, BD availability
- **Bangladesh landing pages** — dynamic, block-based landing pages for BD market campaigns
- **Combo offer engine** — bundle multiple products at a discounted combo price
- **BD payment integrations** — bKash, Nagad, Rocket, and Cash on Delivery (COD with OTP)
- **Global payments** — Stripe (cards, Apple Pay, Google Pay)
- **MeiliSearch integration** — full-text product search with filtering
- **Redis caching** — category trees, featured products, homepage data

### Key Business Context

| Aspect | Detail |
|--------|--------|
| Primary market | Bangladesh (BD) + Global |
| BD payment methods | bKash, Nagad, Rocket, COD |
| Global payments | Stripe |
| Currency | BDT (৳) for BD, USD/GBP/EUR for global |
| Product origins | Korea, Japan, France, UK, USA, Germany |
| Unique BD features | Landing pages, combo offers, WhatsApp order flow, COD |

---

## 2. Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| **Medusa.js** | v2.x | Ecommerce framework |
| **Node.js** | 20 LTS | Runtime |
| **TypeScript** | 5.x | Language |
| **PostgreSQL** | 15+ | Primary database |
| **MikroORM** | 6.x | ORM (Medusa v2 default) |
| **Redis** | 7.x | Caching + event bus + job queue |
| **MeiliSearch** | 1.x | Full-text search |
| **BullMQ** | 5.x | Background jobs |
| **Stripe** | latest | Global payment processing |
| **bKash PGW** | v1.2.0 | Bangladesh mobile financial service |
| **Nagad PGW** | v1 | Bangladesh government MFS |
| **Jest** | 29.x | Testing |

---

## 3. Prerequisites

Ensure the following are installed and running before starting:

| Dependency | Version | Check |
|-----------|---------|-------|
| Node.js | 20+ | `node --version` |
| pnpm | 8+ | `pnpm --version` |
| PostgreSQL | 15+ | `psql --version` |
| Redis | 7+ | `redis-cli ping` |
| MeiliSearch | 1+ | `curl http://localhost:7700/health` |
| Git | any | `git --version` |

### Install Node Version Manager (recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install correct Node version
nvm install 20
nvm use 20
```

### Install pnpm

```bash
npm install -g pnpm
```

### Start PostgreSQL (macOS with Homebrew)

```bash
brew install postgresql@15
brew services start postgresql@15
```

### Start Redis (macOS with Homebrew)

```bash
brew install redis
brew services start redis
```

### Start MeiliSearch (macOS with Homebrew)

```bash
brew install meilisearch
meilisearch --master-key="your_master_key"
```

---

## 4. Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/your-org/ecom-api.git
cd ecom-api
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your local credentials. See [Section 5](#5-environment-variables) for all required variables.

### Step 4: Create the PostgreSQL database

```bash
createdb beauty_store
```

### Step 5: Run database migrations

```bash
pnpm medusa db:migrate
```

### Step 6: Seed the database (optional but recommended for development)

```bash
pnpm seed
```

This seeds:
- All 5 top-level product categories and their subcategories
- 50+ sample products across all categories
- Sample combo offers
- Sample BD landing pages

### Step 7: Create an admin user

```bash
pnpm medusa user -e admin@example.com -p StrongPassword123!
```

---

## 5. Environment Variables

Copy `.env.example` to `.env` and fill in all values.

```bash
# ─── Server ───────────────────────────────────────────────
NODE_ENV=development
PORT=9000
MEDUSA_ADMIN_FRONTEND_URL=http://localhost:7001

# ─── Database ─────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/beauty_store
DATABASE_LOGGING=false

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── MeiliSearch ──────────────────────────────────────────
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_ADMIN_KEY=your_meilisearch_master_key

# ─── Auth ─────────────────────────────────────────────────
JWT_SECRET=change_this_to_a_long_random_string
COOKIE_SECRET=change_this_to_another_long_random_string

# ─── Stripe (Global Payments) ─────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── AWS S3 / Cloudflare R2 (File Storage) ────────────────
S3_BUCKET_NAME=beauty-store-media
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_ENDPOINT=                          # Leave blank for AWS; set for R2

# ─── Email ────────────────────────────────────────────────
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
FROM_EMAIL=hello@glownest.com

# ─── bKash (BD Payment) ───────────────────────────────────
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta

# ─── Nagad (BD Payment) ───────────────────────────────────
NAGAD_MERCHANT_ID=your_nagad_merchant_id
NAGAD_MERCHANT_KEY=your_nagad_merchant_key
NAGAD_BASE_URL=https://api.mynagad.com/api/dfs

# ─── Rocket / DBBL (BD Payment) ───────────────────────────
ROCKET_MERCHANT_ID=your_rocket_merchant_id
ROCKET_MERCHANT_PASSWORD=your_rocket_password
ROCKET_BASE_URL=https://sandbox.rocket.com.bd

# ─── SMS (COD OTP) ────────────────────────────────────────
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=GlowNest

# ─── CORS ─────────────────────────────────────────────────
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001

# ─── WhatsApp ─────────────────────────────────────────────
WHATSAPP_BUSINESS_NUMBER=+8801XXXXXXXXX
```

> **Security:** Never commit `.env` to version control. The `.gitignore` blocks this by default.

---

## 6. Running Locally

### Start the development server

```bash
pnpm dev
```

The Medusa server runs at: **http://localhost:9000**

### Start the Medusa admin panel (separate process)

```bash
pnpm admin
```

The admin panel runs at: **http://localhost:7001**

### All available scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `pnpm dev` | Start server with hot reload |
| Build | `pnpm build` | Compile TypeScript |
| Start (prod) | `pnpm start` | Start compiled server |
| Admin | `pnpm admin` | Start Medusa admin UI |
| Migrations | `pnpm medusa db:migrate` | Run pending migrations |
| Generate migration | `pnpm medusa db:generate <name>` | Create new migration |
| Seed | `pnpm seed` | Seed database with sample data |
| Test | `pnpm test` | Run all tests |
| Test watch | `pnpm test:watch` | Run tests in watch mode |
| Lint | `pnpm lint` | Run ESLint |
| Format | `pnpm format` | Run Prettier |
| Index products | `pnpm index:products` | Sync all products to MeiliSearch |

---

## 7. API Endpoints Overview

### Store API (public, used by frontend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/store/products` | List products with filters |
| `GET` | `/store/products/:handle` | Get product by handle |
| `GET` | `/store/products/featured` | Get homepage featured products |
| `GET` | `/store/categories` | List all active categories |
| `GET` | `/store/categories/tree` | Full recursive category tree |
| `GET` | `/store/categories/:slug` | Get category with children |
| `GET` | `/store/search` | Search products via MeiliSearch |
| `POST` | `/store/carts` | Create a cart |
| `POST` | `/store/carts/:id/line-items` | Add item to cart |
| `POST` | `/store/carts/:id/combos` | Add combo offer to cart |
| `POST` | `/store/carts/:id/complete` | Complete order |
| `GET` | `/store/combos` | List active combo offers |
| `GET` | `/store/combos/:id` | Get combo with product details |
| `GET` | `/store/landing-pages` | List active BD landing pages |
| `GET` | `/store/landing-pages/:slug` | Get landing page content |
| `POST` | `/store/bd-payments/initiate` | Initiate bKash/Nagad payment |
| `POST` | `/store/bd-payments/execute` | Execute payment post-approval |
| `POST` | `/store/bd-payments/cod/verify-otp` | Verify COD OTP |

### Admin API (authenticated, used by admin panel)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/products` | List all products |
| `POST` | `/admin/products` | Create product |
| `PUT` | `/admin/products/:id` | Update product |
| `GET` | `/admin/landing-pages` | List all landing pages |
| `POST` | `/admin/landing-pages` | Create landing page |
| `PUT` | `/admin/landing-pages/:id` | Update landing page |
| `POST` | `/admin/landing-pages/:id/publish` | Publish landing page |
| `GET` | `/admin/combos` | List all combo offers |
| `POST` | `/admin/combos` | Create combo offer |
| `PUT` | `/admin/combos/:id` | Update combo offer |
| `GET` | `/admin/bd-payments` | List BD payment records |
| `POST` | `/admin/bd-payments/:id/refund` | Process refund |
| `GET` | `/admin/orders` | List orders (Medusa built-in) |

### Webhook Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/store/bd-payments/webhook/bkash` | bKash IPN callback |
| `POST` | `/store/bd-payments/webhook/nagad` | Nagad callback |
| `POST` | `/hooks/stripe` | Stripe webhook |

---

## 8. Folder Structure

```
ecom-api/
├── .env                          # Local environment variables (gitignored)
├── .env.example                  # Template for environment variables
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── medusa.config.js              # Medusa server configuration
├── package.json
├── tsconfig.json
├── jest.config.ts
│
├── src/
│   ├── api/                      # Custom Medusa API routes
│   │   ├── store/
│   │   │   ├── landing-pages/
│   │   │   │   └── route.ts      # GET /store/landing-pages
│   │   │   ├── combos/
│   │   │   │   └── route.ts      # GET /store/combos
│   │   │   └── bd-payments/
│   │   │       ├── route.ts      # POST /store/bd-payments/initiate
│   │   │       └── webhook/
│   │   │           ├── bkash/route.ts
│   │   │           └── nagad/route.ts
│   │   └── admin/
│   │       ├── landing-pages/route.ts
│   │       └── combos/route.ts
│   │
│   ├── modules/                  # Medusa v2 custom modules
│   │   ├── category/
│   │   │   ├── index.ts          # Module definition
│   │   │   ├── models/
│   │   │   │   └── category.ts   # Category entity (recursive)
│   │   │   ├── service.ts        # CategoryService
│   │   │   └── migrations/
│   │   │
│   │   ├── landing-page/
│   │   │   ├── index.ts
│   │   │   ├── models/
│   │   │   │   ├── landing-page.ts
│   │   │   │   ├── landing-page-product.ts
│   │   │   │   └── landing-page-combo.ts
│   │   │   ├── service.ts        # LandingPageService
│   │   │   └── migrations/
│   │   │
│   │   ├── combo-offer/
│   │   │   ├── index.ts
│   │   │   ├── models/
│   │   │   │   ├── combo-offer.ts
│   │   │   │   └── combo-item.ts
│   │   │   ├── service.ts        # ComboOfferService
│   │   │   └── migrations/
│   │   │
│   │   └── bd-payment/
│   │       ├── index.ts
│   │       ├── models/
│   │       │   └── bd-payment.ts
│   │       ├── providers/
│   │       │   ├── bkash.provider.ts
│   │       │   ├── nagad.provider.ts
│   │       │   ├── rocket.provider.ts
│   │       │   └── cod.provider.ts
│   │       └── service.ts        # BDPaymentService
│   │
│   ├── jobs/                     # Background jobs (BullMQ)
│   │   ├── product-indexer.job.ts
│   │   └── image-processor.job.ts
│   │
│   ├── subscribers/              # Medusa event handlers
│   │   ├── order-placed.subscriber.ts
│   │   └── product-updated.subscriber.ts
│   │
│   ├── workflows/                # Medusa v2 workflows
│   │   ├── create-combo-order.workflow.ts
│   │   └── process-bd-payment.workflow.ts
│   │
│   ├── seeds/                    # Dev seed data
│   │   ├── index.ts              # Main seed runner
│   │   ├── categories.seed.ts
│   │   ├── products.seed.ts
│   │   └── combos.seed.ts
│   │
│   └── types/                    # Shared TypeScript types
│       ├── bd-payment.types.ts
│       ├── landing-page.types.ts
│       └── combo.types.ts
│
└── tests/
    ├── unit/
    │   ├── services/
    │   │   ├── category.service.test.ts
    │   │   ├── combo-offer.service.test.ts
    │   │   └── bd-payment.service.test.ts
    │   └── providers/
    │       ├── bkash.provider.test.ts
    │       └── nagad.provider.test.ts
    └── integration/
        ├── landing-pages.api.test.ts
        └── combos.api.test.ts
```

---

## 9. Custom Modules

### CategoryModule

**Location:** `src/modules/category/`

Manages the recursive product category tree.

```typescript
// Usage in routes
import CategoryService from '../modules/category/service'

// Get full tree
const tree = await categoryService.getTree()

// Get single category with children
const category = await categoryService.findBySlug('skincare', { includeChildren: true })
```

Key methods:
- `getTree()` — Full recursive category tree
- `findBySlug(slug, options)` — Find category + optional children
- `create(data)` — Create category
- `update(id, data)` — Update category
- `reorder(parentId, orderedIds)` — Reorder children

---

### LandingPageModule

**Location:** `src/modules/landing-page/`

Manages BD market landing pages with their block-based content.

```typescript
// Get landing page with full content
const page = await landingPageService.findBySlug('eid-mega-sale-2025', {
  includeProducts: true,
  includeCombos: true,
})
```

---

### ComboOfferModule

**Location:** `src/modules/combo-offer/`

Manages combo/bundle offers with pricing logic.

```typescript
// Get active combos for BD market
const combos = await comboOfferService.getActive({ market: 'bd' })

// Add combo to cart (handles individual line items + discount)
await comboOfferService.addToCart(cartId, comboId)
```

---

### BDPaymentModule

**Location:** `src/modules/bd-payment/`

Implements Medusa payment providers for all BD payment methods.

```typescript
// Initiate bKash payment
const payment = await bdPaymentService.initiate({
  orderId: 'order_01...',
  provider: 'bkash',
  amount: 1500,
  currency: 'BDT',
  customerPhone: '+8801XXXXXXXXX',
})
```

---

## 10. Testing

### Run all tests

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Run specific test file

```bash
pnpm test src/tests/unit/services/category.service.test.ts
```

### Test coverage

```bash
pnpm test:coverage
```

Target: **80% coverage** on all new code.

---

## 11. Deployment

### Build for production

```bash
pnpm build
```

### Environment variables for production

All variables from `.env.example` must be set in your hosting environment. Change all `sandbox`/`test` values to production equivalents.

### Deploy on Railway

1. Connect GitHub repo to Railway
2. Set all environment variables in Railway dashboard
3. Railway auto-deploys on push to `main`

### Health check endpoint

```
GET /health
```

Returns `{ "status": "ok" }` when the server is healthy.
