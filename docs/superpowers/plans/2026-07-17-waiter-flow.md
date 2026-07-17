# Waiter Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Waiter role tab: pick a waiter name once, then reuse the existing Tables→Menu→Payment→History flow (same components as Cashier), attributing checks to the waiter's name instead of the logged-in cashier's.

**Architecture:** One new component (`WaiterSelect.jsx`, a no-PIN name picker). `App.jsx` gains a `waiterName` state and a `staffName` helper that picks `waiterName` or `cashier.name` depending on active role. No other component changes — `Menu`/`Tables`/`Payment`/`History` are reused byte-for-byte via the existing `renderCashier()` function.

**Tech Stack:** No new dependencies.

## Global Constraints
- In-memory state only.
- No test framework — manual browser verification.
- No PIN/auth for waiter name selection (explicitly out of scope per spec).
- `tables`/`checks`/`kitchenOrders` state is shared across roles (one physical restaurant) — do not duplicate it per role.

---

## File Structure

```
src/
  App.jsx                    # MODIFY — add waiterName state, staffName helper, route role==='waiter'
  screens/
    WaiterSelect.jsx           # NEW
```

---

### Task 1: Waiter name picker + wire into role routing

**Files:**
- Create: `src/screens/WaiterSelect.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `<WaiterSelect onSelect={(name) => void} />` — renders the same `CASHIERS` list from `src/data.js` as tappable name tiles (no PIN step).
- `App.jsx`'s `confirmPayment` now computes `cashierName` via a `staffName` value instead of always `cashier.name`.

- [ ] **Step 1: Create `src/screens/WaiterSelect.jsx`**

```jsx
import { CASHIERS } from '../data'

export default function WaiterSelect({ onSelect }) {
  return (
    <div className="login-screen">
      <h1>Select Waiter</h1>
      <div className="cashier-grid">
        {CASHIERS.map((c) => (
          <button key={c.id} className="cashier-tile" onClick={() => onSelect(c.name)}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

This reuses the existing `.login-screen`/`.cashier-grid`/`.cashier-tile` CSS classes (already defined in `src/App.css` from the Login screen) — no new CSS needed.

- [ ] **Step 2: Modify `src/App.jsx`**

Add the import (near the other screen imports):

```jsx
import WaiterSelect from './screens/WaiterSelect'
```

Add state (next to `const [cashier, setCashier] = useState(null)`):

```jsx
  const [waiterName, setWaiterName] = useState(null)
```

Add a `staffName` helper (place it right after `const activeTable = ...` line):

```jsx
  const staffName = role === 'waiter' ? waiterName : cashier.name
```

Change `confirmPayment`'s check-building to use it — find:

```jsx
      cashierName: cashier.name,
```

replace with:

```jsx
      cashierName: staffName,
```

Change the final render block — find:

```jsx
        {role === 'cashier' && renderCashier()}
        {role === 'kitchen' && <KitchenDashboard orders={kitchenOrders} onReady={markOrderReady} />}
        {(role === 'waiter' || role === 'admin') && <RolePlaceholder role={role} />}
```

replace with:

```jsx
        {role === 'cashier' && renderCashier()}
        {role === 'kitchen' && <KitchenDashboard orders={kitchenOrders} onReady={markOrderReady} />}
        {role === 'waiter' && (waiterName ? renderCashier() : <WaiterSelect onSelect={setWaiterName} />)}
        {role === 'admin' && <RolePlaceholder role={role} />}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the app.
Expected: log in as a cashier, land on Tables. Tap "Waiter" in the footer tabbar → "Select Waiter" screen with the same 3 name tiles. Tap a name → lands on Tables (same screen Cashier would see — same physical tables/state). Open a table, add items, tap "Send to Kitchen" — switch to Kitchen role, order appears attributed to that table as before. Switch back to Waiter, checkout, pick a payment method → History (via Tables' History button) shows the check with the **waiter's** name in the cashier-name column, not the logged-in cashier's name. Switch to Cashier role → still shows the logged-in cashier's name for any checks *they* complete. Switching Waiter→Cashier→Waiter again does not re-prompt "Select Waiter" (name persists for the session).

- [ ] **Step 4: Commit**

```bash
git add src/screens/WaiterSelect.jsx src/App.jsx
git commit -m "Add waiter flow: name picker + reuse of tables/menu/payment/history"
```

---

### Task 2: End-to-end regression pass

**Files:** none created; fixes only if issues are found.

- [ ] **Step 1: Full click-through**

Run: `npm run dev`, open fresh.
1. Log in as cashier (any 4-digit PIN) → Tables.
2. Cashier: table → menu → add items → Send to Kitchen → Checkout → pay → History shows cashier's name.
3. Tap Waiter tab → Select Waiter → pick a different name than the cashier → table → menu → add items → Send to Kitchen → Kitchen tab shows the order (table-scoped, name-agnostic, unchanged from before) → Ready clears it (or pay it off — either path) → back on Waiter, History shows the check attributed to the **waiter's** name.
4. Confirm Admin tab still shows its placeholder (untouched by this change).
5. Confirm no console errors, no layout clipping at 1024×768 on the new WaiterSelect screen.

- [ ] **Step 2: Fix any issues found**

If any step doesn't match, fix the relevant file and re-run Step 1 from the top.

- [ ] **Step 3: Final commit** (only if fixes were made)

```bash
git add -A
git commit -m "Fix issues found in waiter flow regression pass"
```
