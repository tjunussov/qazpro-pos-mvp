# POS Multi-Cashier / Tables / Payment / History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-screen menu POC into a 5-screen POS flow: cashier login → tables → menu (existing) → payment method → check history.

**Architecture:** One `App.jsx` owns all state (screen, cashier, tables, checks) and renders one of five presentational screen components based on a `screen` string. No router library. All state in-memory (resets on refresh, per approved spec).

**Tech Stack:** React 19 + Vite (already scaffolded). No new dependencies — no router, no state library, no test framework (none exists in this POC; verification is manual via dev server + browser, matching how the existing Menu screen was verified).

## Global Constraints
- In-memory state only — no localStorage, no backend (spec: `docs/superpowers/specs/2026-07-17-pos-multi-cashier-design.md`).
- Payment methods are mocked (fake 1s "processing" delay, no real gateway calls).
- Cashier PIN is `1111` for all mock cashiers.
- 7 tables, fixed.
- iPad-sized layout (1024×768), matches existing `.pos` styling conventions in `src/App.css`.
- No test framework in this repo — every task's verification step is a manual browser click-through against `npm run dev`, not an automated test.

---

## File Structure

```
src/
  data.js                 # NEW — CATEGORIES, CASHIERS, PIN, cart helper functions
  App.jsx                 # MODIFY — becomes state container + screen switch
  App.css                 # MODIFY — add styles for new screens
  screens/
    Menu.jsx               # NEW (Task 1) — extracted from current App.jsx
    Tables.jsx              # NEW (Task 2)
    Login.jsx               # NEW (Task 3)
    Payment.jsx             # NEW (Task 4)
    History.jsx             # NEW (Task 5)
```

---

### Task 1: Extract data + componentize Menu (no behavior change)

**Files:**
- Create: `src/data.js`
- Create: `src/screens/Menu.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces (from `src/data.js`): `CATEGORIES` (object), `cartTotal(cart) => number`, `addToCart(cart, item) => cart`, `changeCartQty(cart, id, delta) => cart`
- Produces (from `Menu.jsx`): `<Menu cart onAddItem onChangeQty onClear />` — presentational, no internal cart state, `activeCat` stays local to `Menu`.

- [ ] **Step 1: Create `src/data.js`**

```js
export const CATEGORIES = {
  Beverages: [
    { id: 'b1', name: 'Espresso', price: 2.5 },
    { id: 'b2', name: 'Latte', price: 3.5 },
    { id: 'b3', name: 'Cappuccino', price: 3.5 },
    { id: 'b4', name: 'Americano', price: 3.0 },
    { id: 'b5', name: 'Iced Tea', price: 2.75 },
    { id: 'b6', name: 'Orange Juice', price: 3.0 },
  ],
  Pastries: [
    { id: 'p1', name: 'Croissant', price: 3.25 },
    { id: 'p2', name: 'Muffin', price: 2.75 },
    { id: 'p3', name: 'Bagel', price: 2.5 },
    { id: 'p4', name: 'Danish', price: 3.0 },
  ],
  Sandwiches: [
    { id: 's1', name: 'Club Sandwich', price: 6.5 },
    { id: 's2', name: 'BLT', price: 5.75 },
    { id: 's3', name: 'Grilled Cheese', price: 4.5 },
  ],
  Extras: [
    { id: 'e1', name: 'Extra Shot', price: 0.75 },
    { id: 'e2', name: 'Oat Milk', price: 0.6 },
    { id: 'e3', name: 'Whipped Cream', price: 0.5 },
  ],
}

export const CASHIERS = [
  { id: 'c1', name: 'Aida' },
  { id: 'c2', name: 'Bek' },
  { id: 'c3', name: 'Nurlan' },
]

export const PIN = '1111'

export const cartTotal = (cart) => cart.reduce((sum, i) => sum + i.price * i.qty, 0)

export const addToCart = (cart, item) => {
  const found = cart.find((i) => i.id === item.id)
  return found
    ? cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    : [...cart, { ...item, qty: 1 }]
}

export const changeCartQty = (cart, id, delta) =>
  cart
    .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
    .filter((i) => i.qty > 0)
```

- [ ] **Step 2: Create `src/screens/Menu.jsx`**

```jsx
import { useState } from 'react'
import { CATEGORIES, cartTotal } from '../data'

export default function Menu({ cart, onAddItem, onChangeQty, onClear }) {
  const [activeCat, setActiveCat] = useState('Beverages')
  const total = cartTotal(cart)

  return (
    <div className="pos">
      <div className="menu">
        <div className="tabs">
          {Object.keys(CATEGORIES).map((cat) => (
            <button
              key={cat}
              className={`tab ${cat === activeCat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid">
          {CATEGORIES[activeCat].map((item) => (
            <button key={item.id} className="tile" onClick={() => onAddItem(item)}>
              <span className="tile-name">{item.name}</span>
              <span className="tile-price">${item.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="basket">
        <h2>Order</h2>
        <div className="basket-items">
          {cart.length === 0 && <p className="empty">No items yet</p>}
          {cart.map((i) => (
            <div key={i.id} className="basket-row">
              <div className="basket-row-name">{i.name}</div>
              <div className="basket-row-controls">
                <button onClick={() => onChangeQty(i.id, -1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => onChangeQty(i.id, 1)}>+</button>
              </div>
              <div className="basket-row-price">${(i.price * i.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="basket-footer">
          <div className="total-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="clear-btn" onClick={onClear} disabled={!cart.length}>
            Clear
          </button>
          <button className="charge-btn" disabled={!cart.length}>
            Charge ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Menu from './screens/Menu'
import { addToCart, changeCartQty } from './data'

export default function App() {
  const [cart, setCart] = useState([])

  const addItem = (item) => setCart((c) => addToCart(c, item))
  const changeQty = (id, delta) => setCart((c) => changeCartQty(c, id, delta))
  const clearCart = () => setCart([])

  return <Menu cart={cart} onAddItem={addItem} onChangeQty={changeQty} onClear={clearCart} />
}
```

- [ ] **Step 4: Manual regression check**

Run: `npm run dev`, open the app in a browser at the printed URL.
Expected: identical to before this task — Beverages tab active by default, tapping a tile adds it to the Order panel on the right with qty controls, total updates, Clear empties the cart. No visual or behavioral change.

- [ ] **Step 5: Commit**

```bash
git add src/data.js src/screens/Menu.jsx src/App.jsx
git commit -m "Extract Menu screen and shared data/cart helpers"
```

---

### Task 2: Tables screen + per-table cart

**Files:**
- Create: `src/screens/Tables.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `cartTotal` from `src/data.js` (Task 1); `<Menu cart onAddItem onChangeQty onClear />` (Task 1)
- Produces: `<Tables tables onSelectTable onViewHistory />` where `tables` is `[{id: number, cart: Array}]` (status is derived, not stored — a table is "occupied" when `cart.length > 0`). `onSelectTable(id)` fires when a table tile is tapped. `onViewHistory` is a no-op placeholder for now (History screen ships in Task 5); wire the button but it can log to console until Task 5 replaces it.

- [ ] **Step 1: Create `src/screens/Tables.jsx`**

```jsx
import { cartTotal } from '../data'

export default function Tables({ tables, onSelectTable, onViewHistory }) {
  return (
    <div className="tables-screen">
      <div className="tables-header">
        <h1>Tables</h1>
        <button className="history-btn" onClick={onViewHistory}>
          History
        </button>
      </div>
      <div className="tables-grid">
        {tables.map((t) => {
          const occupied = t.cart.length > 0
          const total = cartTotal(t.cart)
          return (
            <button
              key={t.id}
              className={`table-tile ${occupied ? 'occupied' : 'free'}`}
              onClick={() => onSelectTable(t.id)}
            >
              <span className="table-num">Table {t.id}</span>
              {occupied && <span className="table-total">${total.toFixed(2)}</span>}
              <span className="table-status">{occupied ? 'Occupied' : 'Free'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import { addToCart, changeCartQty } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [] }))

export default function App() {
  const [screen, setScreen] = useState('tables')
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)

  const activeTable = tables.find((t) => t.id === activeTableId)

  const updateActiveCart = (updater) =>
    setTables((ts) => ts.map((t) => (t.id !== activeTableId ? t : { ...t, cart: updater(t.cart) })))

  const selectTable = (id) => {
    setActiveTableId(id)
    setScreen('menu')
  }

  const addItem = (item) => updateActiveCart((cart) => addToCart(cart, item))
  const changeQty = (id, delta) => updateActiveCart((cart) => changeCartQty(cart, id, delta))
  const clearCart = () => updateActiveCart(() => [])
  const backToTables = () => setScreen('tables')

  if (screen === 'menu' && activeTable) {
    return (
      <Menu
        cart={activeTable.cart}
        onAddItem={addItem}
        onChangeQty={changeQty}
        onClear={clearCart}
        onBack={backToTables}
      />
    )
  }

  return <Tables tables={tables} onSelectTable={selectTable} onViewHistory={() => console.log('history TBD')} />
}
```

- [ ] **Step 3: Add `onBack` support to `src/screens/Menu.jsx`**

Modify the function signature and add a back button to the `.tabs` row:

```jsx
export default function Menu({ cart, onAddItem, onChangeQty, onClear, onBack }) {
```

```jsx
        <div className="tabs">
          <button className="back-btn" onClick={onBack}>←</button>
          {Object.keys(CATEGORIES).map((cat) => (
```

- [ ] **Step 4: Add Tables + back-button styles to `src/App.css`**

Append:

```css
.back-btn {
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background: #2b2e3a;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.tables-screen {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  background: #1c1e26;
  padding: 24px;
  box-sizing: border-box;
}

.tables-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tables-header h1 {
  color: #fff;
  margin: 0;
  font-size: 24px;
}

.history-btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background: #2b2e3a;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.table-tile {
  height: 140px;
  border: none;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #fff;
}

.table-tile.free {
  background: #2b2e3a;
}

.table-tile.occupied {
  background: #4d7cff;
}

.table-num {
  font-size: 18px;
  font-weight: 700;
}

.table-total {
  font-size: 15px;
  opacity: 0.9;
}

.table-status {
  font-size: 13px;
  opacity: 0.7;
}
```

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open the app.
Expected: lands on Tables screen, 7 tiles labeled Table 1–7, all "Free". Tap Table 3 → goes to Menu (empty cart). Add 2 items → tap back arrow → returns to Tables → Table 3 now shows "Occupied" + correct total. Tap Table 3 again → Menu reopens with the same 2 items still in the cart. Tap a different free table → Menu opens with an empty cart (tables are independent).

- [ ] **Step 6: Commit**

```bash
git add src/screens/Tables.jsx src/App.jsx src/screens/Menu.jsx src/App.css
git commit -m "Add Tables screen with per-table cart state"
```

---

### Task 3: Cashier login screen

**Files:**
- Create: `src/screens/Login.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `CASHIERS`, `PIN` from `src/data.js` (Task 1)
- Produces: `<Login onLogin={(cashier) => void} />` where `cashier` is `{id, name}` from `CASHIERS`.

- [ ] **Step 1: Create `src/screens/Login.jsx`**

```jsx
import { useState } from 'react'
import { CASHIERS, PIN } from '../data'

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const press = (digit) => {
    const next = pin + digit
    setError(false)
    if (next.length < PIN.length) {
      setPin(next)
      return
    }
    if (next === PIN) {
      onLogin(selected)
    } else {
      setError(true)
      setPin('')
    }
  }

  if (!selected) {
    return (
      <div className="login-screen">
        <h1>Select Cashier</h1>
        <div className="cashier-grid">
          {CASHIERS.map((c) => (
            <button key={c.id} className="cashier-tile" onClick={() => setSelected(c)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="login-screen">
      <h1>Hi, {selected.name}</h1>
      <div className={`pin-dots ${error ? 'error' : ''}`}>
        {Array.from({ length: PIN.length }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-error">Wrong PIN, try again</p>}
      <div className="pin-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              className="pin-key"
              onClick={() => (k === '⌫' ? setPin((p) => p.slice(0, -1)) : press(k))}
            >
              {k}
            </button>
          )
        )}
      </div>
      <button className="pin-back" onClick={() => { setSelected(null); setPin('') }}>
        ← Back
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import { addToCart, changeCartQty } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [] }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [cashier, setCashier] = useState(null)
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)

  const activeTable = tables.find((t) => t.id === activeTableId)

  const updateActiveCart = (updater) =>
    setTables((ts) => ts.map((t) => (t.id !== activeTableId ? t : { ...t, cart: updater(t.cart) })))

  const login = (c) => {
    setCashier(c)
    setScreen('tables')
  }

  const selectTable = (id) => {
    setActiveTableId(id)
    setScreen('menu')
  }

  const addItem = (item) => updateActiveCart((cart) => addToCart(cart, item))
  const changeQty = (id, delta) => updateActiveCart((cart) => changeCartQty(cart, id, delta))
  const clearCart = () => updateActiveCart(() => [])
  const backToTables = () => setScreen('tables')

  if (screen === 'login') {
    return <Login onLogin={login} />
  }

  if (screen === 'menu' && activeTable) {
    return (
      <Menu
        cart={activeTable.cart}
        onAddItem={addItem}
        onChangeQty={changeQty}
        onClear={clearCart}
        onBack={backToTables}
      />
    )
  }

  return <Tables tables={tables} onSelectTable={selectTable} onViewHistory={() => console.log('history TBD')} />
}
```

- [ ] **Step 3: Add login styles to `src/App.css`**

Append:

```css
.login-screen {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  background: #1c1e26;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  box-sizing: border-box;
  color: #fff;
}

.login-screen h1 {
  margin: 0;
  font-size: 26px;
}

.cashier-grid {
  display: flex;
  gap: 20px;
}

.cashier-tile {
  width: 160px;
  height: 120px;
  border: none;
  border-radius: 16px;
  background: #2b2e3a;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.pin-dots {
  display: flex;
  gap: 14px;
}

.pin-dots.error .pin-dot {
  background: #ff5c5c;
}

.pin-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2b2e3a;
  border: 2px solid #4d7cff;
}

.pin-dot.filled {
  background: #4d7cff;
}

.pin-error {
  color: #ff8080;
  margin: -12px 0 0;
  font-size: 14px;
}

.pin-pad {
  display: grid;
  grid-template-columns: repeat(3, 72px);
  gap: 14px;
}

.pin-key {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  background: #2b2e3a;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
}

.pin-back {
  background: none;
  border: none;
  color: #9aa0b4;
  font-size: 15px;
  cursor: pointer;
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the app.
Expected: lands on "Select Cashier" with 3 tiles (Aida, Bek, Nurlan). Tap one → pincode pad appears with 4 dots. Press wrong 4 digits (e.g. 1234) → dots flash red, "Wrong PIN, try again", pin resets. Press `1111` → advances straight to Tables screen. "← Back" on pin pad returns to cashier list.

- [ ] **Step 5: Commit**

```bash
git add src/screens/Login.jsx src/App.jsx src/App.css
git commit -m "Add cashier login screen with pincode pad"
```

---

### Task 4: Payment screen + checkout wiring

**Files:**
- Create: `src/screens/Payment.jsx`
- Modify: `src/App.jsx`
- Modify: `src/screens/Menu.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `cartTotal` from `src/data.js`
- Produces: `<Payment total onConfirm={(method) => void} />` where `method` is one of `'Card' | 'Kaspi QR' | 'Halyk QR'`.
- Modifies `Menu`'s footer button: relabeled "Checkout", now calls `onCheckout` (new required prop) instead of being inert.

- [ ] **Step 1: Create `src/screens/Payment.jsx`**

```jsx
import { useState } from 'react'

const METHODS = ['Card', 'Kaspi QR', 'Halyk QR']

export default function Payment({ total, onConfirm }) {
  const [processing, setProcessing] = useState(null)

  const choose = (method) => {
    setProcessing(method)
    setTimeout(() => onConfirm(method), 1000)
  }

  return (
    <div className="payment-screen">
      <h1>Pay ${total.toFixed(2)}</h1>
      {processing ? (
        <p className="processing">Processing {processing}…</p>
      ) : (
        <div className="payment-methods">
          {METHODS.map((m) => (
            <button key={m} className="payment-tile" onClick={() => choose(m)}>
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add `onCheckout` prop and relabel button in `src/screens/Menu.jsx`**

```jsx
export default function Menu({ cart, onAddItem, onChangeQty, onClear, onBack, onCheckout }) {
```

```jsx
          <button className="charge-btn" disabled={!cart.length} onClick={onCheckout}>
            Checkout ${total.toFixed(2)}
          </button>
```

- [ ] **Step 3: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import Payment from './screens/Payment'
import { addToCart, changeCartQty, cartTotal } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [] }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [cashier, setCashier] = useState(null)
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)
  const [checks, setChecks] = useState([])

  const activeTable = tables.find((t) => t.id === activeTableId)

  const updateActiveCart = (updater) =>
    setTables((ts) => ts.map((t) => (t.id !== activeTableId ? t : { ...t, cart: updater(t.cart) })))

  const login = (c) => {
    setCashier(c)
    setScreen('tables')
  }

  const selectTable = (id) => {
    setActiveTableId(id)
    setScreen('menu')
  }

  const addItem = (item) => updateActiveCart((cart) => addToCart(cart, item))
  const changeQty = (id, delta) => updateActiveCart((cart) => changeCartQty(cart, id, delta))
  const clearCart = () => updateActiveCart(() => [])
  const backToTables = () => setScreen('tables')
  const goToPayment = () => setScreen('payment')

  const confirmPayment = (method) => {
    const check = {
      id: Date.now(),
      tableId: activeTableId,
      items: activeTable.cart,
      total: cartTotal(activeTable.cart),
      payment: method,
      cashierName: cashier.name,
      time: new Date(),
    }
    setChecks((cs) => [check, ...cs])
    updateActiveCart(() => [])
    setActiveTableId(null)
    setScreen('tables')
  }

  if (screen === 'login') {
    return <Login onLogin={login} />
  }

  if (screen === 'menu' && activeTable) {
    return (
      <Menu
        cart={activeTable.cart}
        onAddItem={addItem}
        onChangeQty={changeQty}
        onClear={clearCart}
        onBack={backToTables}
        onCheckout={goToPayment}
      />
    )
  }

  if (screen === 'payment' && activeTable) {
    return <Payment total={cartTotal(activeTable.cart)} onConfirm={confirmPayment} />
  }

  return <Tables tables={tables} onSelectTable={selectTable} onViewHistory={() => console.log('history TBD')} />
}
```

- [ ] **Step 4: Add Payment styles to `src/App.css`**

Append:

```css
.payment-screen {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  background: #1c1e26;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  box-sizing: border-box;
  color: #fff;
}

.payment-screen h1 {
  margin: 0;
  font-size: 32px;
}

.payment-methods {
  display: flex;
  gap: 20px;
}

.payment-tile {
  width: 180px;
  height: 130px;
  border: none;
  border-radius: 16px;
  background: #2b2e3a;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.processing {
  font-size: 18px;
  color: #9aa0b4;
}
```

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open the app, log in (any cashier, PIN `1111`).
Expected: tap a free table → add a couple items → tap "Checkout $X" → Payment screen shows "Pay $X" and 3 method tiles. Tap "Kaspi QR" → tiles replaced by "Processing Kaspi QR…" for ~1s → auto-returns to Tables → the table that was just paid is now "Free" again (cart cleared).

- [ ] **Step 6: Commit**

```bash
git add src/screens/Payment.jsx src/App.jsx src/screens/Menu.jsx src/App.css
git commit -m "Add Payment screen, wire Menu checkout to payment flow"
```

---

### Task 5: Check history screen

**Files:**
- Create: `src/screens/History.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `checks` array from `App.jsx` state (Task 4 shape: `{id, tableId, items, total, payment, cashierName, time}`)
- Produces: `<History checks onBack />`

- [ ] **Step 1: Create `src/screens/History.jsx`**

```jsx
import { useState } from 'react'

export default function History({ checks, onBack }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="history-screen">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Check History</h1>
      </div>
      <div className="history-list">
        {checks.length === 0 && <p className="empty">No checks yet</p>}
        {checks.map((c) => (
          <div key={c.id} className="history-row" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
            <div className="history-summary">
              <span>{new Date(c.time).toLocaleTimeString()}</span>
              <span>Table {c.tableId}</span>
              <span>{c.payment}</span>
              <span>{c.cashierName}</span>
              <span className="history-total">${c.total.toFixed(2)}</span>
            </div>
            {expandedId === c.id && (
              <div className="history-items">
                {c.items.map((i) => (
                  <div key={i.id} className="history-item">
                    <span>{i.qty}× {i.name}</span>
                    <span>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import Payment from './screens/Payment'
import History from './screens/History'
import { addToCart, changeCartQty, cartTotal } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [] }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [cashier, setCashier] = useState(null)
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)
  const [checks, setChecks] = useState([])

  const activeTable = tables.find((t) => t.id === activeTableId)

  const updateActiveCart = (updater) =>
    setTables((ts) => ts.map((t) => (t.id !== activeTableId ? t : { ...t, cart: updater(t.cart) })))

  const login = (c) => {
    setCashier(c)
    setScreen('tables')
  }

  const selectTable = (id) => {
    setActiveTableId(id)
    setScreen('menu')
  }

  const addItem = (item) => updateActiveCart((cart) => addToCart(cart, item))
  const changeQty = (id, delta) => updateActiveCart((cart) => changeCartQty(cart, id, delta))
  const clearCart = () => updateActiveCart(() => [])
  const backToTables = () => setScreen('tables')
  const goToPayment = () => setScreen('payment')
  const goToHistory = () => setScreen('history')

  const confirmPayment = (method) => {
    const check = {
      id: Date.now(),
      tableId: activeTableId,
      items: activeTable.cart,
      total: cartTotal(activeTable.cart),
      payment: method,
      cashierName: cashier.name,
      time: new Date(),
    }
    setChecks((cs) => [check, ...cs])
    updateActiveCart(() => [])
    setActiveTableId(null)
    setScreen('tables')
  }

  if (screen === 'login') {
    return <Login onLogin={login} />
  }

  if (screen === 'menu' && activeTable) {
    return (
      <Menu
        cart={activeTable.cart}
        onAddItem={addItem}
        onChangeQty={changeQty}
        onClear={clearCart}
        onBack={backToTables}
        onCheckout={goToPayment}
      />
    )
  }

  if (screen === 'payment' && activeTable) {
    return <Payment total={cartTotal(activeTable.cart)} onConfirm={confirmPayment} />
  }

  if (screen === 'history') {
    return <History checks={checks} onBack={backToTables} />
  }

  return <Tables tables={tables} onSelectTable={selectTable} onViewHistory={goToHistory} />
}
```

- [ ] **Step 3: Add History styles to `src/App.css`**

Append:

```css
.history-screen {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  background: #1c1e26;
  padding: 24px;
  box-sizing: border-box;
  color: #fff;
  overflow-y: auto;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.history-header h1 {
  margin: 0;
  font-size: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-row {
  background: #2b2e3a;
  border-radius: 12px;
  padding: 14px 18px;
  cursor: pointer;
}

.history-summary {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
}

.history-total {
  font-weight: 700;
}

.history-items {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #3a3d4a;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #cfd2dc;
}

.history-item {
  display: flex;
  justify-content: space-between;
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the app, log in, complete one full order+payment (as in Task 4's check) so at least one check exists. From Tables, tap "History".
Expected: History screen shows the completed check — time, table number, payment method, cashier name, total. Tap the row → expands to show line items with qty × name and price. Tap again → collapses. Back arrow → returns to Tables.

- [ ] **Step 5: Commit**

```bash
git add src/screens/History.jsx src/App.jsx src/App.css
git commit -m "Add check history screen"
```

---

### Task 6: End-to-end regression pass

**Files:** none created; fixes only if issues are found during verification.

- [ ] **Step 1: Full click-through**

Run: `npm run dev`, open the app fresh (reload).
Walk the entire flow in order, confirming each:
1. Login screen shows 3 cashiers → pick one → wrong PIN shows error → correct PIN `1111` → lands on Tables, all 7 free.
2. Tap Table 1 → Menu opens empty → switch categories (Beverages/Pastries/Sandwiches/Extras) → add 2 different items → qty +/− works → back arrow → Table 1 shows Occupied + correct total.
3. Tap Table 2 (different table) → confirm its cart is empty and independent of Table 1.
4. Reopen Table 1 → items still there → tap Checkout → Payment screen shows correct total → pick Card → processing → auto-return to Tables → Table 1 back to Free.
5. Tap History → the paid check appears with correct table/total/payment/cashier → expand → items match what was ordered → back → Tables.

- [ ] **Step 2: Fix any issues found**

If any step above doesn't match, fix the relevant screen component or `App.jsx` handler and re-run Step 1 from the top.

- [ ] **Step 3: Final commit** (only if fixes were made)

```bash
git add -A
git commit -m "Fix issues found in end-to-end regression pass"
```
