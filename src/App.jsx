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
