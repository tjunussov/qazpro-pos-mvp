import { cartTotal } from '../data'

export default function Tables({ tables, onSelectTable, onViewHistory }) {
  return (
    <div className="tables-screen">
      <div className="tables-header">
        <h1>Tables</h1>
        <button className="history-btn" onClick={onViewHistory}>
          History
        </button>
      </div>
      <div className="tables-grid">
        {tables.map((t) => {
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
    </div>
  )
}
