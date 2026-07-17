const ROLES = [
  { id: 'cashier', label: 'Cashier' },
  { id: 'waiter', label: 'Waiter' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'admin', label: 'Admin' },
]

export default function RoleTabbar({ role, onChange }) {
  return (
    <div className="role-tabbar">
      {ROLES.map((r) => (
        <button
          key={r.id}
          className={`role-tab ${r.id === role ? 'active' : ''}`}
          onClick={() => onChange(r.id)}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
