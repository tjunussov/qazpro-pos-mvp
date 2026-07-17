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
