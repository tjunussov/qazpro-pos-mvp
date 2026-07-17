import { cartTotal, orderLabel } from '../data'

export default function Tables({ tables, onSelectTable, onViewHistory, onNewTogo }) {
  const dineIn = tables.filter((t) => t.type !== 'togo')
  const togo = tables.filter((t) => t.type === 'togo')

  return (
    <div className="tables-screen">
      <div className="tables-header">
        <h1>Tables</h1>
        <button className="history-btn" onClick={onViewHistory}>
          History
        </button>
      </div>
      <div className="tables-grid">
        {dineIn.map((t) => {
          const occupied = t.cart.length > 0
          const total = cartTotal(t.cart)
          return (
            <button
              key={t.id}
              className={`table-tile ${occupied ? 'occupied' : 'free'}`}
              onClick={() => onSelectTable(t.id)}
            >
              <span className="table-num">Table {t.id}</span>
              {occupied && <span className="table-total">${total.toFixed(2)}</span>}
              <span className="table-status">{occupied ? 'Occupied' : 'Free'}</span>
            </button>
          )
        })}
      </div>

      <div className="togo-divider" />

      <div className="togo-section">
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
    </div>
  )
}
