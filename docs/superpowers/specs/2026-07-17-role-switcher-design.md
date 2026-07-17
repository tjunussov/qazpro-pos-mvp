# Any-PIN + Global Role Switcher — Design

## Context
First of 5 sub-projects extending the POS POC (see roadmap below). This one is foundational — role switcher must exist before Waiter/Kitchen/Admin screens can be built on top of it.

## Roadmap (this doc covers #1 only)
1. Any-PIN + role switcher (this spec)
2. Order list: close button, table #, start time
3. Kitchen dashboard (red-flag slow orders)
4. Waiter/client flow (catalog select, table, cart, checkout)
5. Admin panel (catalog CRUD, sales reports)

Later (not in any sub-project yet): publish to Cloudflare Pages (`git@github.com:tjunussov/qazpro-pos-mvp.git`), migrate to SQLite on Cloudflare for remote cart sync + stoplist.

## Scope (this sub-project)
1. **Any PIN accepted** — `Login.jsx` no longer compares against a fixed `1111`. Any 4 digits typed succeeds. Wrong-PIN error UI is removed (unreachable).
2. **Global role switcher** — footer tabbar, 4 roles: Cashier, Waiter, Kitchen, Admin. Free switch, no re-auth. Visible on every screen except Login. Defaults to Cashier after login.
3. **Cashier role** = today's flow (Tables→Menu→Payment→History), unchanged, now living inside the new shell layout.
4. **Waiter/Kitchen/Admin** = placeholder screen (role name + "Coming soon") until their own sub-projects ship. Tabbar stays visible so cashier can switch back.

## Layout
New shell in `App.jsx`: `<div class="app-shell"><div class="app-content">{...}</div><RoleTabbar/></div>`. Existing full-screen components (`.pos`, `.tables-screen`, `.payment-screen`, `.history-screen`) change from `height: 100svh` to `height: 100%` since they now live inside `.app-content` (flex:1) instead of being the viewport root. `.login-screen` is unaffected (rendered outside the shell, still `100svh`).

## Out of scope
Waiter/Kitchen/Admin real screens (later sub-projects), per-cashier PINs, re-auth on role switch, persistence.
