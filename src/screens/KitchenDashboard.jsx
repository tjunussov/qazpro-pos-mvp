import { useEffect, useState } from 'react'
import { orderLabel } from '../data'

const RED_AFTER_MS = 10 * 60 * 1000

export default function KitchenDashboard({ orders, onReady }) {
  const [, setTick] = useState(0)
  const pending = orders.filter((o) => o.status === 'pending')

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="kitchen-screen">
      <h1>Kitchen</h1>
      {pending.length === 0 && <p className="empty">No active orders</p>}
      <div className="kitchen-grid">
        {pending.map((o) => {
          const elapsedMs = Date.now() - new Date(o.sentAt).getTime()
          const elapsedMin = Math.floor(elapsedMs / 60000)
          const late = elapsedMs >= RED_AFTER_MS
          return (
            <div key={o.id} className={`kitchen-card ${late ? 'late' : ''}`}>
              <div className="kitchen-card-header">
                <span>{orderLabel(o.tableId)}</span>
                <span>{elapsedMin}m</span>
              </div>
              <div className="kitchen-card-items">
                {o.items.map((i) => (
                  <div key={i.id}>{i.qty}× {i.name}</div>
                ))}
              </div>
              <button className="ready-btn" onClick={() => onReady(o.id)}>
                Ready
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
