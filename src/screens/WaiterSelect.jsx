export default function WaiterSelect({ staff, onSelect }) {
  return (
    <div className="login-screen">
      <h1>Select Waiter</h1>
      <div className="cashier-grid">
        {staff.map((c) => (
          <button key={c.id} className="cashier-tile" onClick={() => onSelect(c.name)}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
