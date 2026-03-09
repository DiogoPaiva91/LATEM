# Lá Tem Costa Marta - B2B Construction Materials E-Commerce

## Overview
B2B e-commerce platform for construction materials distribution. Features an admin panel (products, customers, categories, team management), a client-facing storefront with catalog/cart/checkout, and a client profile area.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, shadcn/ui, wouter (routing), @tanstack/react-query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod + drizzle-zod

## Visual Identity
- Primary: dark navy `#01034a`
- Accent: yellow `#fdd700`
- Section headers (client area): `#0B132B` bg with `#fdd700` text

## Project Structure
```
client/src/
  pages/          - Route pages (home, catalog, product-detail, checkout, client-area, admin)
  components/     - Shared components + admin/ subfolder (CategoriesTab, TeamTab, TeamMemberForm)
  lib/            - queryClient, cart-context, utils
  hooks/          - use-toast, use-mobile
server/
  index.ts        - Server entry point
  routes.ts       - REST API routes (all /api prefixed)
  storage.ts      - DatabaseStorage class implementing IStorage interface
  db.ts           - Drizzle + PostgreSQL connection
  seed.ts         - Initial data seeding (categories, products, customers, team)
shared/
  schema.ts       - Drizzle schema + Zod insert schemas + types
```

## Database Schema
- **categories**: id (serial), name, slug, icon, color, image, parentId (self-ref for subcategories), productCount, status, sortOrder, blingId (text, nullable)
- **products**: id (serial), name, sku, categoryId, subcategoryId, description, price (integer cents), image, packageType, stock, minStock, status, specs (jsonb), blingId (text, nullable)
- **customers**: id (serial), name, cnpj, email, segment, status, phone, address, lastOrderAmount
- **team_members**: id (serial), name, email, role, whatsapp, status, admissionDate, lastAccess, avatar
- **orders**: id (serial), customerId, items (jsonb), total (integer cents), status, paymentMethod, createdAt
- **users**: id (serial), username, password
- **bling_tokens**: id (serial), accessToken, refreshToken, expiresAt (timestamp), createdAt (timestamp)

## API Endpoints
All prefixed with `/api`:
- Categories: GET/POST `/categories`, GET/PUT/DELETE `/categories/:id`
- Products: GET/POST `/products`, GET/PUT/DELETE `/products/:id`
- Customers: GET/POST `/customers`, GET/PUT/DELETE `/customers/:id`
- Team Members: GET/POST `/team-members`, GET/PUT/DELETE `/team-members/:id`
- Orders: GET/POST `/orders`, GET/PUT `/orders/:id`
- Bling Integration:
  - GET `/bling/auth-url` - returns OAuth authorization URL
  - GET `/bling/callback` - OAuth callback (exchanges code for tokens, redirects to admin)
  - GET `/bling/status` - returns connection status
  - DELETE `/bling/disconnect` - removes Bling tokens
  - POST `/bling/push-category/:id` - creates single category in Bling and saves blingId
  - POST `/bling/push/categories` - pushes ALL unsynced categories to Bling (parents first, then subs)
  - POST `/bling/sync/categories` - imports categories from Bling
  - POST `/bling/sync/products` - imports products from Bling (with pagination + details)
  - POST `/bling/sync/all` - syncs everything

## Bling Integration
- OAuth2 flow: client_id/client_secret in env vars, tokens stored in `bling_tokens` table
- Auto-refreshes expired tokens before API calls
- Sync uses upsert (creates or updates by blingId) to avoid duplicates
- Products synced using list data only (no per-product detail calls) for efficiency
- API base: `https://www.bling.com.br/Api/v3`
- Rate limiting: sequential queue with 600ms between calls, 429 retry with 3000ms wait
- Auto token refresh on 401 invalid_token errors

## Status Bling
- Admin CategoriesTab shows "Status Bling" column: "Sincronizado" (blue) if category has blingId, "Não sincronizado" (orange) if not
- Each category/subcategory has individual status based on its own blingId (no parent inheritance)
- "Enviar ao Bling" button in dropdown menu for categories not synced: creates category in Bling via POST and saves blingId
- "Sincronizar Bling" button in header opens dialog with two directions:
  - Sistema → Bling: pushes all unsynced categories (parents first, then subs), with per-item error handling
  - Bling → Sistema: imports categories from Bling, matching by name to avoid duplicates
- Subcategories require parent to be synced first before pushing to Bling
- Catalog sidebar has toggle: "Status Sistema" (filters by status=Ativa) vs "Status Bling" (filters by blingId present)
- Product list respects the selected mode, only showing products from visible categories

## Key Notes
- Product prices stored as integer cents (e.g., 24990 = R$249.90)
- Categories use self-referencing parentId for subcategory hierarchy
- Cart is client-side only (React context), not persisted
- Seed data runs on startup if categories table is empty
- Catalog filter uses checkbox-style category selection with chevron accordion for subcategories
