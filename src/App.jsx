import { useState } from 'react'
import './App.css'

const CATEGORIES = {
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

export default function App() {
  const [activeCat, setActiveCat] = useState('Beverages')
  const [cart, setCart] = useState([])

  const addItem = (item) =>
    setCart((c) => {
      const found = c.find((i) => i.id === item.id)
      return found
        ? c.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...item, qty: 1 }]
    })

  const changeQty = (id, delta) =>
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

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
            <button key={item.id} className="tile" onClick={() => addItem(item)}>
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
                <button onClick={() => changeQty(i.id, -1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => changeQty(i.id, 1)}>+</button>
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
          <button className="clear-btn" onClick={clearCart} disabled={!cart.length}>
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
