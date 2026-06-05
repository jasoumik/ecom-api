# Medusa Native Order Migration

**Goal:** Replace the custom `store_order` module with Medusa's native cart → order flow, while keeping all Bangladeshi business logic intact (2 delivery zones, COD, BDT currency).

**Projects involved:**
- `ecom-api` — Medusa v2 backend
- `ecom-web` — Next.js 14 storefront

---

## Business Rules (non-negotiable, must survive migration)

| Rule | Detail |
|------|--------|
| Currency | BDT (Bangladeshi Taka), amounts in **paisa** (1 taka = 100 paisa) |
| Delivery zones | `INSIDE_DHAKA` (default ৳70) and `OUTSIDE_DHAKA` (default ৳130) |
| Delivery prices | Admin-configurable via `/admin/orders/delivery-config` |
| Payment | Cash on Delivery (COD) only — bKash/Nagad/Card coming later |
| Phone validation | Bangladeshi numbers only (`01XXXXXXXXX`) |
| Order statuses | PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED / CANCELLED |

---

## Architecture: Before vs After

### Before (custom module)
```
Storefront → POST /store/orders → custom OrderModuleService → store_order table
```

### After (Medusa native)
```
Storefront → POST /store/carts              (create cart)
           → POST /store/carts/:id/line-items (add products)
           → POST /store/carts/:id/shipping-methods (select zone)
           → POST /store/carts/:id/payment-sessions (init COD)
           → POST /store/carts/:id/complete  (place order → Medusa Order)
```

---

## Migration Phases

### Phase 1 — Seed Medusa infrastructure (API)
**Status: TODO**

Create `src/scripts/seed-medusa-core.ts`:
- Region: Bangladesh (`BD`), currency `bdt`, tax rate 0
- Sales Channel: Default Storefront
- Shipping Option 1: "Inside Dhaka" — ৳70 (7000 paisa), provider: `manual`
- Shipping Option 2: "Outside Dhaka" — ৳130 (13000 paisa), provider: `manual`
- Stock Location: Default Warehouse
- Link products to sales channel

Run with: `medusa exec src/scripts/seed-medusa-core.ts`

---

### Phase 2 — COD Payment Provider (API)
**Status: TODO**

Create `src/modules/payment-cod/`:
- Medusa v2 payment provider that:
  - Accepts `initiatePayment` (returns pending session)
  - Accepts `authorizePayment` (marks as authorized — COD confirmed)
  - Accepts `capturePayment` (marks as captured — when order delivered)
  - `retrievePayment`, `cancelPayment`, `refundPayment` stubs
- Register in `medusa-config.ts` as a payment provider

---

### Phase 3 — Delivery Config sync (API)
**Status: TODO**

Keep the `delivery_config` admin control but wire it to update Medusa shipping option prices:
- `PATCH /admin/orders/delivery-config` should also call Medusa's shipping option update
- Or: query shipping options live instead of a static config table

---

### Phase 4 — Frontend Cart Integration (Web)
**Status: TODO**

Update `src/stores/cart.ts`:
- On `addItem`: create cart in Medusa if no `cartId`, then add line item
- On `removeItem`/`updateQuantity`: sync with Medusa cart
- Cart ID stored in Zustand + localStorage (already has `cartId` field)

API calls needed:
```
POST   /store/carts                          → create cart (returns cart.id)
POST   /store/carts/:id/line-items           → add item
DELETE /store/carts/:id/line-items/:item_id  → remove item
POST   /store/carts/:id/line-items/:item_id  → update quantity
```

Headers required on all store requests:
```
x-publishable-api-key: <NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY>
```

---

### Phase 5 — Checkout Rewrite (Web)
**Status: TODO**

Rewrite `src/app/checkout/page.tsx` — keep 4-step UX, change API calls:

| Step | Current | After |
|------|---------|-------|
| Contact | Stored in form state | Stored in form state (same) |
| Delivery | Fetches charges from custom config | Fetches Medusa shipping options for region |
| Payment | Hardcoded COD | Init COD payment session on cart |
| Review → Place | `POST /store/orders` | `POST /store/carts/:id/complete` |

On complete:
- Response contains `order.id` (Medusa order ID)
- Redirect to `/order-confirmation?id=<order.id>`

---

### Phase 6 — Remove custom order module (API)
**Status: TODO — do last, after Phase 1-5 verified working**

- Remove `src/modules/order/`
- Remove `src/api/store/orders/` (POST + delivery-config GET)
- Remove `src/api/admin/orders/` custom routes (use Medusa admin panel instead)
- Remove from `medusa-config.ts`
- Drop `store_order` and `delivery_config` tables via migration

---

## Key File Map

| File | Purpose |
|------|---------|
| `ecom-api/src/scripts/seed-medusa-core.ts` | Seeds region, sales channel, shipping options |
| `ecom-api/src/modules/payment-cod/` | Custom COD payment provider |
| `ecom-api/medusa-config.ts` | Register COD provider here |
| `ecom-web/src/stores/cart.ts` | Add Medusa cart sync |
| `ecom-web/src/app/checkout/page.tsx` | Rewrite checkout flow |
| `ecom-web/src/app/order-confirmation/page.tsx` | Already exists — confirm it reads `?id=` param |

---

## Environment Variables Required

```env
# ecom-api
DATABASE_URL=
REDIS_URL=
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:7001,http://localhost:3000
JWT_SECRET=
COOKIE_SECRET=

# ecom-web
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=   ← create this in Medusa admin after seeding
```

The publishable API key is created in Medusa admin → Settings → API Keys after Phase 1 seeding.

---

## Progress Tracker

- [x] Phase 1 — Seed Medusa core (region, sales channel, shipping options) — `src/scripts/seed-medusa-core.ts`
- [x] Phase 2 — COD payment provider — `src/modules/payment-cod/` + registered in `medusa-config.ts`
- [ ] Phase 3 — Delivery config sync
- [x] Phase 4 — Frontend cart integration — `cart.ts` clears `cartId` on `clearCart`; checkout creates & syncs cart
- [x] Phase 5 — Checkout rewrite — `src/app/checkout/page.tsx` uses Medusa cart flow
- [ ] Phase 6 — Remove custom order module (do after verifying live orders work)

---

## How to activate (run once per environment)

### 1. Run the seed script
```bash
cd ecom-api
npx medusa exec src/scripts/seed-medusa-core.ts
```

### 2. Create a Publishable API Key
- Open Medusa Admin → Settings → API Keys
- Create a new **Publishable** key
- Copy the key value

### 3. Set environment variable in ecom-web
```env
# ecom-web/.env.local
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

### 4. Restart both servers
```bash
# terminal 1
cd ecom-api && npm run dev

# terminal 2
cd ecom-web && npm run dev
```

### 5. Verify
- Add a product to cart
- Go through checkout — delivery zones should load from Medusa
- Place order — should redirect to `/order-confirmation?id=order_...`
- Check Medusa Admin → Orders — order should appear natively

---

## Notes / Decisions

- **Paisa everywhere**: Medusa stores amounts in the smallest currency unit. BDT paisa = `amount * 100`. So ৳70 = 7000 paisa.
- **Shipping options as zones**: Medusa shipping options are the delivery zones. "Inside Dhaka" and "Outside Dhaka" are two separate shipping options tied to the Bangladesh region.
- **COD provider key**: Will be `pp_cod_cod` (Medusa convention: `pp_<module-key>_<provider-id>`).
- **No fulfillment complexity**: Using `manual` fulfillment provider — no third-party courier integration yet.
- **Custom order module stays alive during transition** — both flows run in parallel until Phase 6.
