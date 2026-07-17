# qazpos-mvp — Goal

POS system for a minicafe (Square/HQVend-style), iPad-sized (1024×768), React + Vite proof-of-concept.

## Roles (footer tabbar switcher, free switch, no re-auth)

- **Cashier** — logs in with any 4-digit PIN, picks a table, builds an order (catalog grid + cart), sends to kitchen, checks out (Card / Kaspi QR / Halyk QR mocked), views check history.
- **Waiter** — picks a name (no PIN), reuses the same table/menu/checkout flow as Cashier, checks attributed to the waiter's name.
- **Kitchen** — dashboard of orders sent from Cashier/Waiter, live wait timer, turns red past 10 min, "Ready" clears the order.
- **Admin** — catalog CRUD (items/prices/categories/modifiers), sales reports (total by waiter, etc). *Not yet built.*

## Status

Built so far (all in-memory, no backend, no persistence — resets on refresh):
1. Menu grid + cart (original POC)
2. Any-PIN login + role switcher shell
3. Order list: close button, table #, order start time
4. Kitchen dashboard
5. Waiter flow
6. Admin panel — **in progress**

## Roadmap (not started)

- Admin panel: catalog CRUD, sales reports dashboard
- Publish to Cloudflare Pages: `git@github.com:tjunussov/qazpro-pos-mvp.git`
- Migrate from in-memory state to SQLite on Cloudflare — enables remote cart sync (waiters adding from their own device) and a stoplist (blocked/out-of-stock items)

## Docs

- Specs: `docs/superpowers/specs/`
- Plans: `docs/superpowers/plans/`
- Build ledger: `.superpowers/sdd/progress.md`

## Run

```bash
npm install
npm run dev
```
