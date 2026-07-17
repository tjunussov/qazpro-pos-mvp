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

const initialTables = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, cart: [], startedAt: null }))

export default function App() {
  const [screen, setScreen] = useState('login')
  const [role, setRole] = useState('cashier')
  const [cashier, setCashier] = useState(null)
  const [tables, setTables] = useState(initialTables)
  const [activeTableId, setActiveTableId] = useState(null)
  const [checks, setChecks] = useState([])

  const activeTable = tables.find((t) => t.id === activeTableId)

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
          tableId={activeTable.id}
          startedAt={activeTable.startedAt}
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
