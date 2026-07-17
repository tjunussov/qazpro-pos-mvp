# Any-PIN + Global Role Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Accept any 4-digit PIN at login, add a persistent footer role switcher (Cashier/Waiter/Kitchen/Admin), keep existing cashier flow working unchanged, placeholder screens for the other 3 roles.

**Architecture:** `App.jsx` gains a `role` state and a shell layout (`app-content` + `RoleTabbar`) wrapping everything post-login. Cashier role renders the existing screen state machine; other roles render a placeholder.

**Tech Stack:** No new dependencies.

## Global Constraints
- In-memory state only.
- No test framework — verification is manual browser click-through against `npm run dev`.
- iPad-sized layout (1024×768).
- Free role switching, no re-auth (per approved spec).
- Any 4 digits accepted as PIN — no comparison, no error state.

---

## File Structure

```
src/
  data.js                    # MODIFY — replace PIN with PIN_LENGTH
  App.jsx                    # MODIFY — add role state + shell layout
  App.css                    # MODIFY — shell/tabbar/placeholder styles, screen height fixes, remove dead pin-error CSS
  screens/
    Login.jsx                 # MODIFY — accept any PIN, drop error UI
    RoleTabbar.jsx             # NEW
    RolePlaceholder.jsx        # NEW
```

---

### Task 1: Any-PIN login

**Files:**
- Modify: `src/data.js`
- Modify: `src/screens/Login.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Produces (from `src/data.js`): `PIN_LENGTH` (number, replaces the old `PIN` string export)
- `Login` component's public interface (`<Login onLogin={(cashier) => void} />`) is unchanged.

- [ ] **Step 1: In `src/data.js`, replace the `PIN` export**

Find:
```js
export const PIN = '1111'
```

Replace with:
```js
export const PIN_LENGTH = 4
```

- [ ] **Step 2: Replace `src/screens/Login.jsx` contents**

```jsx
import { useState } from 'react'
import { CASHIERS, PIN_LENGTH } from '../data'

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')

  const press = (digit) => {
    const next = pin + digit
    if (next.length < PIN_LENGTH) {
      setPin(next)
      return
    }
    onLogin(selected)
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
      <div className="pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>
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

This removes the `error` state, the wrong-PIN comparison, and the `pin-error`/`error` conditional rendering — any 4 digits now always calls `onLogin`.

- [ ] **Step 3: Remove now-dead CSS from `src/App.css`**

Delete these two rules (no longer reachable — Login no longer renders an error state):

```css
.pin-dots.error .pin-dot {
  background: #ff5c5c;
}
```

```css
.pin-error {
  color: #ff8080;
  margin: -12px 0 0;
  font-size: 14px;
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the app.
Expected: "Select Cashier" → pick any cashier → pin pad appears → type any 4 digits (e.g. `9`,`3`,`7`,`2`) → immediately advances to Tables screen. No error state is reachable.

- [ ] **Step 5: Commit**

```bash
git add src/data.js src/screens/Login.jsx src/App.css
git commit -m "Accept any 4-digit PIN, remove wrong-PIN error UI"
```

---

### Task 2: Global role switcher (footer tabbar) + shell layout

**Files:**
- Create: `src/screens/RoleTabbar.jsx`
- Create: `src/screens/RolePlaceholder.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: existing `<Menu>`, `<Tables>`, `<Payment>`, `<History>`, `<Login>` components and their props (all unchanged from prior tasks).
- Produces: `<RoleTabbar role onChange />` where `role` is `'cashier'|'waiter'|'kitchen'|'admin'` and `onChange(roleId)` fires on tap. `<RolePlaceholder role />` renders a capitalized role name + "Coming soon".

- [ ] **Step 1: Create `src/screens/RoleTabbar.jsx`**

```jsx
const ROLES = [
  { id: 'cashier', label: 'Cashier' },
  { id: 'waiter', label: 'Waiter' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'admin', label: 'Admin' },
]

export default function RoleTabbar({ role, onChange }) {
  return (
    <div className="role-tabbar">
      {ROLES.map((r) => (
        <button
          key={r.id}
          className={`role-tab ${r.id === role ? 'active' : ''}`}
          onClick={() => onChange(r.id)}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/screens/RolePlaceholder.jsx`**

```jsx
export default function RolePlaceholder({ role }) {
  const label = role.charAt(0).toUpperCase() + role.slice(1)
  return (
    <div className="role-placeholder">
      <h1>{label}</h1>
      <p>Coming soon</p>
    </div>
  )
}
```

- [ ] **Step 3: Replace `src/App.jsx` contents**

```jsx
import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import Payment from './screens/Payment'
import History from './screens/History'
import RoleTabbar from './screens/RoleTabbar'
import RolePlaceholder from './screens/RolePlaceholder'
import { addToCart, changeCartQty, cartTotal } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [] }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [role, setRole] = useState('cashier')
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

  const renderCashier = () => {
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

  return (
    <div className="app-shell">
      <div className="app-content">
        {role === 'cashier' ? renderCashier() : <RolePlaceholder role={role} />}
      </div>
      <RoleTabbar role={role} onChange={setRole} />
    </div>
  )
}
```

- [ ] **Step 4: Update `src/App.css` — shell/tabbar/placeholder styles**

Append:

```css
.app-shell {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.app-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.role-tabbar {
  display: flex;
  flex-shrink: 0;
  height: 64px;
  background: #14151b;
}

.role-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: #9aa0b4;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.role-tab.active {
  color: #4d7cff;
  background: #1c1e26;
}

.role-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1c1e26;
  color: #fff;
}

.role-placeholder p {
  color: #9aa0b4;
}
```

- [ ] **Step 5: Update `src/App.css` — fix existing screen heights/widths for the new shell**

The four cashier screens (`.pos`, `.tables-screen`, `.payment-screen`, `.history-screen`) now render inside `.app-content` (which is already width/height-constrained by `.app-shell`) instead of being the viewport root. Change each:

In the `.pos` rule, change:
```css
.pos {
  display: flex;
  height: 100svh;
  background: #1c1e26;
}
```
to:
```css
.pos {
  display: flex;
  height: 100%;
  background: #1c1e26;
}
```

In the `.tables-screen` rule, change:
```css
.tables-screen {
  height: 100svh;
  width: 1024px;
  max-width: 100%;
  background: #1c1e26;
  padding: 24px;
  box-sizing: border-box;
}
```
to:
```css
.tables-screen {
  height: 100%;
  background: #1c1e26;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;
}
```

In the `.payment-screen` rule, change:
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
```
to:
```css
.payment-screen {
  height: 100%;
  background: #1c1e26;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  box-sizing: border-box;
  color: #fff;
}
```

In the `.history-screen` rule, change:
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
```
to:
```css
.history-screen {
  height: 100%;
  background: #1c1e26;
  padding: 24px;
  box-sizing: border-box;
  color: #fff;
  overflow-y: auto;
}
```

`.login-screen` is unchanged — it still renders standalone (before the shell exists), keeps `height: 100svh; width: 1024px; max-width: 100%;`.

- [ ] **Step 6: Manual verification**

Run: `npm run dev`, open the app.
Expected: log in (any 4 digits) → lands on Tables screen with footer tabbar visible at the bottom (Cashier/Waiter/Kitchen/Admin, Cashier highlighted). Tap Table 1 → Menu screen still shows tabbar at bottom, cart still works, checkout still flows through Payment → History. Tap "Waiter" in the tabbar → placeholder screen "Waiter / Coming soon", tabbar still visible. Tap "Kitchen", "Admin" → same pattern. Tap "Cashier" again → returns to whichever cashier screen was last active (Tables, unless you navigated away mid-order — in that case it should still be Tables since role switching doesn't reset `screen`). No layout overflow or clipped content at 1024×768.

- [ ] **Step 7: Commit**

```bash
git add src/screens/RoleTabbar.jsx src/screens/RolePlaceholder.jsx src/App.jsx src/App.css
git commit -m "Add global role switcher (footer tabbar) with shell layout"
```

---

### Task 3: End-to-end regression pass

**Files:** none created; fixes only if issues are found.

- [ ] **Step 1: Full click-through**

Run: `npm run dev`, open fresh.
1. Login: pick a cashier, type any 4 digits (not `1111`) → lands on Tables with tabbar visible.
2. Cashier flow unchanged: table → menu → add items → checkout → pick a payment method → returns to Tables, table freed, tabbar visible throughout.
3. History: tap History button on Tables, tabbar still visible on the History screen, check appears correctly, back to Tables works.
4. Tap each of Waiter/Kitchen/Admin in the tabbar → placeholder shows correct role name, tabbar stays visible and functional. Tap Cashier → back to cashier flow, table states preserved (untouched by role switching).
5. Confirm 1024×768 layout has no clipped/overflowing content on any screen + role combination.

- [ ] **Step 2: Fix any issues found**

If any step doesn't match, fix the relevant file and re-run Step 1 from the top.

- [ ] **Step 3: Final commit** (only if fixes were made)

```bash
git add -A
git commit -m "Fix issues found in role switcher regression pass"
```
