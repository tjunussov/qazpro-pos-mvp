import { CASHIERS } from '../data'

export default function WaiterSelect({ onSelect }) {
  return (
    <div className="login-screen">
      <h1>Select Waiter</h1>
      <div className="cashier-grid">
        {CASHIERS.map((c) => (
          <button key={c.id} className="cashier-tile" onClick={() => onSelect(c.name)}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
