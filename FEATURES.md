# ecom-api — Feature Reference

> Medusa.js v2 headless ecommerce backend for **Replant Glow / GlowNest**.
> Serves `ecom-web` (Next.js 14 storefront) and the Medusa Admin dashboard.
> Base URL: `http://localhost:9000`

---

## Custom Modules

| Module | Location | Description |
|--------|----------|-------------|
| Category | `src/modules/category/` | Recursive, unlimited-depth category tree |
| Attribute | `src/modules/attribute/` | Product attribute groups, attributes, and options |
| Combo Offer | `src/modules/combo-offer/` | Bundle/combo product offers with date windowing |
| Landing Page | `src/modules/landing-page/` | BD-market campaign landing pages |
| Media | `src/modules/media/` | Image upload → WebP convert → watermark → R2 storage |
| Search | `src/modules/search/` | MeiliSearch full-text search with scoped API keys |

---

## Store API (Public — `ecom-web` consumers)

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/categories` | Full recursive category tree (unlimited depth) |

**Response shape:**
```json
{
  "categories": [
    {
      "id": "cat_01",
      "name": "Skincare",
      "slug": "skincare",
      "description": "...",
      "image": "https://cdn.glownest.com/...",
      "level": 0,
      "order": 1,
      "isActive": true,
      "parentId": null,
      "children": [...]
    }
  ]
}
```

---

### Attributes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/attributes` | List all attribute groups with options |
| GET | `/store/attributes?categoryId=cat_01` | Attribute schema for a specific category |
| GET | `/store/products/:id/attributes` | Custom beauty attributes for a product |

**Attribute types:** `TEXT`, `NUMBER`, `SELECT`, `MULTI_SELECT`, `BOOLEAN`, `COLOR`, `DATE`, `URL`

---

### Combo Offers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/combos` | All active combo/bundle offers (date-windowed) |
| GET | `/store/combos?slug=summer-bundle` | Single combo by slug |

**Combo types:** `FIXED_BUNDLE`, `BUY_X_GET_Y`, `PERCENTAGE_OFF`, `TIERED_PRICING`, `CUSTOM_BUNDLE`

**Response shape:**
```json
{
  "combos": [
    {
      "id": "combo_01",
      "name": "Summer Glow Bundle",
      "slug": "summer-glow-bundle",
      "type": "FIXED_BUNDLE",
      "discountValue": 15,
      "originalPrice": 2400,
      "comboPrice": 1999,
      "isActive": true,
      "startsAt": "2025-06-01T00:00:00.000Z",
      "endsAt": "2025-08-31T23:59:59.000Z",
      "items": [...]
    }
  ]
}
```

---

### Landing Pages (BD Market)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/landing-pages/:slug` | BD campaign landing page by slug |

**Response shape:**
```json
{
  "landingPage": {
    "id": "lp_01",
    "productId": "prod_01",
    "slug": "vitamin-c-serum-bd",
    "headline": "Brighten Your Skin in 7 Days",
    "subHeadline": "...",
    "benefits": ["Reduces dark spots", "Boosts collagen"],
    "beforeAfterImages": { "before": "...", "after": "..." },
    "urgencyText": "Only 12 left!",
    "countdownEndsAt": "2025-07-31T23:59:59.000Z",
    "whatsappNumber": "+8801XXXXXXXXX",
    "bkashNumber": "01XXXXXXXXX",
    "nagadNumber": "01XXXXXXXXX",
    "codAvailable": true
  }
}
```

---

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/store/search` | Full-text product search with facets |
| GET | `/store/search/key` | MeiliSearch search-only API key for frontend |

**Search request body:**
```json
{
  "q": "vitamin c serum",
  "limit": 20,
  "offset": 0,
  "filter": ["origin = KR", "price_range = 500 TO 2000"]
}
```

---

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/media/:entityType/:entityId` | Media files for a product or category |

**`entityType`:** `product` or `category`

---

## Admin API (Authenticated — Medusa Admin dashboard)

### Attributes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/attributes` | List all attribute groups |
| POST | `/admin/attributes` | Create attribute group, attribute, or option |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/media` | List all uploaded media files |
| POST | `/admin/media` | Upload image (multipart/form-data) → WebP → watermark → R2 |
| GET | `/admin/media/brand-settings` | Get watermark configuration |
| PUT | `/admin/media/brand-settings` | Update watermark position, opacity, size |
| POST | `/admin/media/brand-settings/logo` | Upload brand watermark logo |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/search/reindex` | Bulk re-sync all products to MeiliSearch index |

---

## Built-in Medusa Endpoints

The following standard Medusa v2 endpoints are available automatically:

### Store
- `GET /store/products` — product listing with filters
- `GET /store/products/:handle` — product detail by handle
- `POST /store/carts` — create cart
- `POST /store/carts/:id/line-items` — add item to cart
- `GET /store/customers/me` — authenticated customer profile
- `POST /store/orders` — create order
- `POST /store/auth` — customer authentication

### Admin
- Full Medusa admin API at `/admin/*` — products, orders, customers, regions, discounts, etc.

---

## Payment Integrations

| Method | Market | Env Vars |
|--------|--------|---------|
| Stripe | Global | `STRIPE_API_KEY` |
| bKash | Bangladesh | `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD` |
| Nagad | Bangladesh | `NAGAD_MERCHANT_ID`, `NAGAD_MERCHANT_PRIVATE_KEY` |
| Cash on Delivery | Bangladesh | No integration — order flag only |

---

## Infrastructure & Storage

| Component | Technology | Config |
|-----------|-----------|--------|
| Database | PostgreSQL 15+ | `DATABASE_URL` |
| Cache & Queues | Redis 7 | `REDIS_URL` |
| Search | MeiliSearch 1.x | `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY` |
| File Storage | Cloudflare R2 | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` |
| Image Processing | sharp (WebP conversion + watermarking) | Built-in |

---

## Environment Setup

Copy `.env.template` to `.env` and fill in all values before running:

```bash
cp .env.template .env
```

Required variables — see `.env.template` for the full list.

---

## Scripts

```bash
npm run dev          # start dev server with hot-reload
npm run build        # compile TypeScript
npm run start        # start production server
npm run db:setup     # create database + run migrations
npm run db:migrate   # run pending migrations only
npm run seed         # seed categories and attributes
npm test             # run Jest test suite
```

---

## Frontend Alignment

This API is consumed by [`ecom-web`](../ecom-web) (Next.js 14 App Router storefront).

| Frontend Route | API Dependency |
|----------------|---------------|
| `/` | `GET /store/products`, `GET /store/combos`, `GET /store/categories` |
| `/products/[handle]` | `GET /store/products?handle=`, `GET /store/products/:id/attributes`, `GET /store/media/product/:id` |
| `/categories/[slug]` | `GET /store/categories`, `GET /store/products?category_id=` |
| `/combos` | `GET /store/combos` |
| `/combos/[slug]` | `GET /store/combos?slug=` |
| `/c/[slug]` | `GET /store/landing-pages/:slug` |
| `/search` | `POST /store/search`, `GET /store/search/key` |
| `/cart` | `GET /store/carts/:id` |
| `/checkout` | Medusa checkout flow |
