import { useState } from 'react'

export default function History({ checks, onBack }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="history-screen">
      <div className="history-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h1>Check History</h1>
      </div>
      <div className="history-list">
        {checks.length === 0 && <p className="empty">No checks yet</p>}
        {checks.map((c) => (
          <div key={c.id} className="history-row" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
            <div className="history-summary">
              <span>{new Date(c.time).toLocaleTimeString()}</span>
              <span>Table {c.tableId}</span>
              <span>{c.payment}</span>
              <span>{c.cashierName}</span>
              <span className="history-total">${c.total.toFixed(2)}</span>
            </div>
            {expandedId === c.id && (
              <div className="history-items">
                {c.items.map((i) => (
                  <div key={i.id} className="history-item">
                    <span>{i.qty}× {i.name}</span>
                    <span>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
