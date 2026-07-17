import { useState } from 'react'
import './App.css'
import Login from './screens/Login'
import Menu from './screens/Menu'
import Tables from './screens/Tables'
import Payment from './screens/Payment'
import History from './screens/History'
import RoleTabbar from './screens/RoleTabbar'
import KitchenDashboard from './screens/KitchenDashboard'
import WaiterSelect from './screens/WaiterSelect'
import AdminPanel from './screens/AdminPanel'
import { addToCart, changeCartQty, cartTotal, seedCatalog, groupByCategory, seedStaff } from './data'

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [], startedAt: null }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [role, setRole] = useState('cashier')
  const [cashier, setCashier] = useState(null)
  const [waiterName, setWaiterName] = useState(null)
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)
  const [checks, setChecks] = useState([])
  const [kitchenOrders, setKitchenOrders] = useState([])
  const [catalog, setCatalog] = useState(seedCatalog)
  const [staff, setStaff] = useState(seedStaff)

  const activeTable = tables.find((t) => t.id === activeTableId)
  const staffName = role === 'waiter' ? waiterName : cashier?.name
  const categories = groupByCategory(catalog)

  const addCatalogItem = (item) =>
    setCatalog((c) => [...c, { ...item, id: `i${Date.now()}` }])

  const updateCatalogItem = (id, patch) =>
    setCatalog((c) => c.map((item) => (item.id === id ? { ...item, ...patch } : item)))

  const deleteCatalogItem = (id) =>
    setCatalog((c) => c.filter((item) => item.id !== id))

  const addStaffMember = (name) =>
    setStaff((s) => [...s, { id: `u${Date.now()}`, name }])

  const updateStaffMember = (id, name) =>
    setStaff((s) => s.map((m) => (m.id === id ? { ...m, name } : m)))

  const deleteStaffMember = (id) =>
    setStaff((s) => s.filter((m) => m.id !== id))

  const updateActiveCart = (updater) =>
    setTables((ts) => ts.map((t) => {
      if (t.id !== activeTableId) return t
      const cart = updater(t.cart)
      const startedAt = cart.length === 0 ? null : (t.startedAt ?? new Date())
      return { ...t, cart, startedAt }
    }))

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

  const sendToKitchen = () => {
    setKitchenOrders((ks) => [
      ...ks.filter((k) => k.tableId !== activeTableId),
      { id: activeTableId, tableId: activeTableId, items: activeTable.cart, sentAt: new Date(), status: 'pending' },
    ])
  }

  const markOrderReady = (orderId) =>
    setKitchenOrders((ks) => ks.map((k) => (k.id === orderId ? { ...k, status: 'ready' } : k)))

  const activeKitchenOrder = kitchenOrders.find((k) => k.tableId === activeTableId)
  const canCheckout = activeKitchenOrder?.status === 'ready'

  const confirmPayment = (method) => {
    const check = {
      id: Date.now(),
      tableId: activeTableId,
      items: activeTable.cart,
      total: cartTotal(activeTable.cart),
      payment: method,
      cashierName: staffName,
      time: new Date(),
    }
    setChecks((cs) => [check, ...cs])
    setKitchenOrders((ks) => ks.filter((k) => k.tableId !== activeTableId))
    updateActiveCart(() => [])
    setActiveTableId(null)
    setScreen('tables')
  }

  if (screen === 'login') {
    return <Login staff={staff} onLogin={login} />
  }

  const renderCashier = () => {
    if (screen === 'menu' && activeTable) {
      return (
        <Menu
          cart={activeTable.cart}
          tableId={activeTable.id}
          startedAt={activeTable.startedAt}
          categories={categories}
          onAddItem={addItem}
          onChangeQty={changeQty}
          onClear={clearCart}
          onBack={backToTables}
          onCheckout={goToPayment}
          onSendToKitchen={sendToKitchen}
          kitchenStatus={activeKitchenOrder?.status ?? null}
          canCheckout={canCheckout}
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
        {role === 'cashier' && renderCashier()}
        {role === 'kitchen' && <KitchenDashboard orders={kitchenOrders} onReady={markOrderReady} />}
        {role === 'waiter' && (waiterName ? renderCashier() : <WaiterSelect staff={staff} onSelect={setWaiterName} />)}
        {role === 'admin' && (
          <AdminPanel
            catalog={catalog}
            onAddItem={addCatalogItem}
            onUpdateItem={updateCatalogItem}
            onDeleteItem={deleteCatalogItem}
            staff={staff}
            onAddStaff={addStaffMember}
            onUpdateStaff={updateStaffMember}
            onDeleteStaff={deleteStaffMember}
            checks={checks}
          />
        )}
      </div>
      <RoleTabbar role={role} onChange={setRole} />
    </div>
  )
}
