import { useState } from 'react'
import { cartTotal, resolveCartItem } from '../data'
import ModifierPicker from './ModifierPicker'

export default function WaiterMenu({
  cart,
  tableLabel,
  startedAt,
  categories,
  onAddItem,
  onChangeQty,
  onClear,
  onBack,
  onCheckout,
  onSendToKitchen,
  kitchenStatus,
  canCheckout,
}) {
  const [pickerItem, setPickerItem] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const total = cartTotal(cart)
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const startedLabel = startedAt
    ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const handleRowClick = (item) => {
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
    <div className="waiter-menu">
      <div className="waiter-header">
        <button className="close-btn" onClick={onBack}>✕</button>
        <div>
          <h2>{tableLabel}</h2>
          {startedLabel && <span className="order-meta">started {startedLabel}</span>}
        </div>
      </div>

      <div className="waiter-list">
        {Object.entries(categories).map(([cat, items]) => (
          <div key={cat} className="waiter-category">
            <h3>{cat}</h3>
            {items.map((item) => (
              <button key={item.id} className="waiter-item-row" onClick={() => handleRowClick(item)}>
                <span className="waiter-item-name">{item.name}</span>
                {item.modifiers.length > 0 && (
                  <span className="tile-modifiers">+ {item.modifiers.map((m) => m.name).join(', ')}</span>
                )}
                <span className="waiter-item-price">${item.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <button className="waiter-cart-bar" onClick={() => setCartOpen((v) => !v)} disabled={!cart.length}>
        <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
        <span>${total.toFixed(2)}</span>
        <span>{cartOpen ? '▾' : '▴'}</span>
      </button>

      {cartOpen && (
        <div className="waiter-cart-drawer">
          <div className="waiter-cart-items">
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
            <button className="clear-btn" onClick={onClear} disabled={!cart.length}>Clear</button>
            <button className="kitchen-btn" disabled={!cart.length} onClick={onSendToKitchen}>
              Send to Kitchen
            </button>
            <button className="charge-btn" disabled={!canCheckout} onClick={onCheckout}>
              Checkout ${total.toFixed(2)}
            </button>
            {!canCheckout && cart.length > 0 && (
              <p className="checkout-hint">
                {kitchenStatus === 'pending' ? 'Waiting for kitchen to confirm ready…' : 'Send to kitchen before checkout'}
              </p>
            )}
          </div>
        </div>
      )}

      {pickerItem && (
        <ModifierPicker item={pickerItem} onConfirm={confirmModifiers} onCancel={() => setPickerItem(null)} />
      )}
    </div>
  )
}
