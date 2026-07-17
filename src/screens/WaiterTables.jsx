import { cartTotal, orderLabel } from '../data'

export default function WaiterTables({ tables, onSelectTable, onViewHistory, onNewTogo }) {
  const dineIn = tables.filter((t) => t.type !== 'togo')
  const togo = tables.filter((t) => t.type === 'togo')

  return (
    <div className="waiter-tables">
      <div className="waiter-tables-header">
        <h2>Tables</h2>
        <button className="history-btn" onClick={onViewHistory}>History</button>
      </div>
      <div className="waiter-tables-list">
        {dineIn.map((t) => {
          const occupied = t.cart.length > 0
          const total = cartTotal(t.cart)
          return (
            <button
              key={t.id}
              className={`waiter-table-row ${occupied ? 'occupied' : 'free'}`}
              onClick={() => onSelectTable(t.id)}
            >
              <span>Table {t.id}</span>
              <span>{occupied ? `$${total.toFixed(2)}` : 'Free'}</span>
            </button>
          )
        })}
      </div>

      <div className="togo-divider" />

      <div className="togo-header">
        <h2>To Go</h2>
        <button className="admin-add-btn" onClick={onNewTogo}>+ New To Go</button>
      </div>
      <div className="togo-list">
        {togo.length === 0 && <p className="empty">No active to-go orders</p>}
        {togo.map((t) => {
          const total = cartTotal(t.cart)
          return (
            <button key={t.id} className="togo-row" onClick={() => onSelectTable(t.id)}>
              <span>{orderLabel(t.id)}</span>
              <span>{t.cart.length} item{t.cart.length === 1 ? '' : 's'}</span>
              <span>${total.toFixed(2)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
