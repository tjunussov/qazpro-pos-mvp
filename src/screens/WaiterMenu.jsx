import { useState } from 'react'
import { cartTotal, resolveCartItem } from '../data'
import ModifierPicker from './ModifierPicker'

const buildRows = (allItems, cart, query) => {
  const seen = new Set()
  const cartRows = []
  for (let i = cart.length - 1; i >= 0; i--) {
    const line = cart[i]
    const baseId = line.id.split('__')[0]
    if (seen.has(baseId)) continue
    const catalogItem = allItems.find((it) => it.id === baseId)
    if (!catalogItem) continue
    seen.add(baseId)
    cartRows.push({ catalogItem, cartLine: line })
  }

  const q = query.trim().toLowerCase()
  const restRows = allItems
    .filter((it) => !seen.has(it.id))
    .filter((it) => !q || it.name.toLowerCase().includes(q))
    .map((it) => ({ catalogItem: it, cartLine: null }))

  return [...cartRows, ...restRows]
}

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
  const [query, setQuery] = useState('')
  const total = cartTotal(cart)
  const startedLabel = startedAt
    ? new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const allItems = Object.values(categories).flat()
  const rows = buildRows(allItems, cart, query)

  const handleRowTap = (item) => {
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

      <input
        className="waiter-search"
        placeholder="Search menu…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="waiter-list">
        {rows.map(({ catalogItem, cartLine }) => {
          const inCart = !!cartLine
          return (
            <div key={catalogItem.id} className={`waiter-row ${inCart ? 'in-cart' : ''}`}>
              <button className="waiter-row-main" onClick={() => handleRowTap(catalogItem)}>
                <span className="waiter-item-name">
                  {catalogItem.name}
                  {inCart && cartLine.selectedModifiers?.length > 0 && (
                    <span className="waiter-row-mods"> · {cartLine.selectedModifiers.map((m) => m.name).join(', ')}</span>
                  )}
                  {!inCart && catalogItem.modifiers.length > 0 && (
                    <span className="tile-modifiers">+ {catalogItem.modifiers.map((m) => m.name).join(', ')}</span>
                  )}
                </span>
                <span className="waiter-item-price">
                  ${(inCart ? cartLine.price * cartLine.qty : catalogItem.price).toFixed(2)}
                </span>
              </button>
              {inCart && (
                <div className="waiter-row-stepper">
                  <button onClick={() => onChangeQty(cartLine.id, -1)}>−</button>
                  <span>{cartLine.qty}</span>
                  <button onClick={() => onChangeQty(cartLine.id, 1)}>+</button>
                </div>
              )}
            </div>
          )
        })}
        {rows.length === 0 && <p className="empty">No items match "{query}"</p>}
        {cart.length > 0 && (
          <button className="clear-btn waiter-clear-btn" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <div className="waiter-footer">
        <div className="total-row">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
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

      {pickerItem && (
        <ModifierPicker item={pickerItem} onConfirm={confirmModifiers} onCancel={() => setPickerItem(null)} />
      )}
    </div>
  )
}
