import { useState } from 'react'
import { cartTotal, resolveCartItem } from '../data'
import ModifierPicker from './ModifierPicker'

export default function Menu({ cart, tableLabel, startedAt, categories, onAddItem, onChangeQty, onClear, onBack, onCheckout, onSendToKitchen, kitchenStatus, canCheckout }) {
  const categoryNames = Object.keys(categories)
  const [activeCat, setActiveCat] = useState(categoryNames[0])
  const [pickerItem, setPickerItem] = useState(null)
  const total = cartTotal(cart)
  const startedLabel = startedAt
    ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const handleTileClick = (item) => {
    if (item.modifiers.length > 0) {
      setPickerItem(item)
    } else {
      onAddItem(item)
    }
  }

  const confirmModifiers = (selected) => {
    onAddItem(resolveCartItem(pickerItem, selected))
    setPickerItem(null)
  }

  return (
    <div className="pos">
      <div className="menu">
        <div className="tabs">
          {categoryNames.map((cat) => (
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
          {(categories[activeCat] || []).map((item) => (
            <button
              key={item.id}
              className="tile"
              style={item.color ? { background: item.color } : undefined}
              onClick={() => handleTileClick(item)}
            >
              <span className="tile-name">{item.name}</span>
              <span className="tile-price">${item.price.toFixed(2)}</span>
              {item.modifiers.length > 0 && (
                <span className="tile-modifiers">+ {item.modifiers.map((m) => m.name).join(', ')}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="basket">
        <div className="basket-header">
          <div>
            <h2>Order</h2>
            <div className="order-meta">
              {tableLabel}{startedLabel ? ` · started ${startedLabel}` : ''}
            </div>
          </div>
          <button className="close-btn" onClick={onBack}>✕</button>
        </div>
        <div className="basket-items">
          {cart.length === 0 && <p className="empty">No items yet</p>}
          {cart.map((i) => (
            <div key={i.id} className="basket-row">
              <div className="basket-row-name">
                {i.name}
                {i.selectedModifiers?.length > 0 && (
                  <div className="basket-row-mods">{i.selectedModifiers.map((m) => m.name).join(', ')}</div>
                )}
              </div>
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
          {canCheckout ? (
            <button className="charge-btn" onClick={onCheckout}>
              Checkout ${total.toFixed(2)}
            </button>
          ) : kitchenStatus === 'pending' ? (
            <button className="kitchen-btn" disabled>
              Waiting for kitchen…
            </button>
          ) : (
            <button className="kitchen-btn" disabled={!cart.length} onClick={onSendToKitchen}>
              Send to Kitchen · ${total.toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {pickerItem && (
        <ModifierPicker item={pickerItem} onConfirm={confirmModifiers} onCancel={() => setPickerItem(null)} />
      )}
    </div>
  )
}
