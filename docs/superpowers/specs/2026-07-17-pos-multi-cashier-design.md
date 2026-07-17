# POS Multi-Cashier / Tables / Payment / History — Design

## Context
Existing POC (`src/App.jsx`): single screen, category tabs + tile grid + basket, mock checkout. Extending to a full flow: cashier login, table management, payment method selection, check history.

## Scope
In-memory only (resets on refresh). No backend, no real payment gateways — all mocked. iPad-sized (1024×768) fixed layout, matches existing screen.

## Screens
State machine via `screen` string in `App.jsx`, no router library.

1. **Login** (`Login.jsx`) — grid of mock cashier cards (Aida, Bek, Nurlan). Tap card → pincode pad screen → enter `1111` → sets `cashier`, goes to Tables.
2. **Tables** (`Tables.jsx`) — grid of 7 tables. Free tables gray/empty; occupied tables show color + running total. Tap free table → create empty cart, set `activeTableId`, go to Menu. Tap occupied table → resume existing cart, go to Menu. Header "History" button → History screen.
3. **Menu** (`Menu.jsx`) — existing tabs/tile-grid/basket UI, reused as-is. Basket footer button relabeled "Checkout" (was "Charge") → go to Payment. Back arrow in header → save cart onto table (flips table to occupied if cart non-empty), return to Tables.
4. **Payment** (`Payment.jsx`) — 3 buttons: Card, Kaspi QR, Halyk QR. Tap → 1s fake spinner → success tick → append record to `checks`, clear that table's cart (status → free), return to Tables.
5. **History** (`History.jsx`) — list of past checks: time, table #, total, payment method, cashier name. Tap row → expand line items inline. Back → Tables.

## State (owned by `App.jsx`)
```js
cashier: {id, name} | null
tables: [{id, status: 'free'|'occupied', cart: [{id,name,price,qty}]}]  // 7 tables
activeTableId: number | null
checks: [{id, tableId, items, total, payment, cashierName, time}]
screen: 'login' | 'pincode' | 'tables' | 'menu' | 'payment' | 'history'
```
Menu categories/items data stays as the existing `CATEGORIES` const, unchanged.

## Components
Each screen component is presentational: receives state slice + callbacks as props, no direct global state access. `App.jsx` holds all state + handlers (login, selectTable, addItem/changeQty passthrough to Menu, startPayment, completePayment, viewHistory, goBack).

## Error handling
Wrong pincode → shake/red flash, stay on pincode screen, no lockout (POC). No network errors possible (nothing is networked).

## Out of scope
Persistence (localStorage/backend), real payment APIs, printing receipts, cashier permissions/roles, table merging/splitting, multi-language.
