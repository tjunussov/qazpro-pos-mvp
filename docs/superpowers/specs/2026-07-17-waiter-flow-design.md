# Waiter Flow — Design

## Context
Sub-project 4 of 5 (role switcher roadmap). Cashier flow (Tables→Menu→Payment→History) and Kitchen dashboard already exist and are shared restaurant state (tables/checks/kitchenOrders live in `App.jsx`, independent of which role tab is viewing them).

## Requirement
"Waiter/client tab → catalog selection, select which table, and which waiter, cart and checkout, order processing/waiting, and final receipt."

## Design: reuse, don't rebuild
Every piece already exists:
- catalog selection + cart = `Menu.jsx`
- select table = `Tables.jsx`
- checkout = `Payment.jsx`
- order processing/waiting = Kitchen dashboard (`Send to Kitchen` button already in `Menu.jsx`, already wired)
- final receipt = `History.jsx`

The only net-new piece is **select which waiter** — a name picker shown once per session when the Waiter tab is first opened, analogous to the cashier picker on Login but without a PIN (picking your name to attribute an order isn't a security gate).

## State
- `waiterName: string | null` in `App.jsx`, separate from `cashier` (the login identity). Persists once picked for the rest of the session (no PIN, no re-pick UI in this pass).
- `role === 'waiter'` renders: `!waiterName` → `<WaiterSelect onSelect={setWaiterName} />`; else → the exact same `renderCashier()` output already used for the Cashier role (same `screen`/`activeTableId`/`tables` state — one physical restaurant, one screen at a time, matches how Kitchen/Admin already share underlying data).
- `confirmPayment`'s `cashierName` field on a check is attributed to whichever staff name is "driving" at the moment of payment: `role === 'waiter' ? waiterName : cashier.name`.

## Out of scope
Per-waiter PIN/auth, switching waiter mid-session, waiter-specific catalog restrictions, concurrent multi-device carts (that's the later Cloudflare/SQLite phase).
