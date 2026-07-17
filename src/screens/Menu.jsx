import { useState } from 'react'
import { CATEGORIES, cartTotal } from '../data'

export default function Menu({ cart, onAddItem, onChangeQty, onClear, onBack, onCheckout }) {
  const [activeCat, setActiveCat] = useState('Beverages')
  const total = cartTotal(cart)

  return (
    <div className="pos">
      <div className="menu">
        <div className="tabs">
          <button className="back-btn" onClick={onBack}>←</button>
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
          <button className="charge-btn" disabled={!cart.length} onClick={onCheckout}>
            Checkout ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}
