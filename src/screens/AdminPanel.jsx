import { useState } from 'react'

const emptyForm = { name: '', category: '', price: '', color: '#2b2e3a', modifiers: '' }

const toFormFields = (item) => ({
  name: item.name,
  category: item.category,
  price: String(item.price),
  color: item.color || '#2b2e3a',
  modifiers: item.modifiers.join(', '),
})

const fromFormFields = (fields) => ({
  name: fields.name.trim(),
  category: fields.category.trim() || 'Uncategorized',
  price: Number(fields.price) || 0,
  color: fields.color,
  modifiers: fields.modifiers
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean),
})

function CatalogTab({ catalog, onAddItem, onUpdateItem, onDeleteItem }) {
  const [editingId, setEditingId] = useState(null)
  const [fields, setFields] = useState(emptyForm)

  const startAdd = () => {
    setEditingId('new')
    setFields(emptyForm)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setFields(toFormFields(item))
  }

  const cancel = () => {
    setEditingId(null)
    setFields(emptyForm)
  }

  const save = () => {
    const parsed = fromFormFields(fields)
    if (editingId === 'new') {
      onAddItem(parsed)
    } else {
      onUpdateItem(editingId, parsed)
    }
    cancel()
  }

  return (
    <div className="admin-catalog">
      <div className="admin-toolbar">
        <button className="admin-add-btn" onClick={startAdd}>+ Add Item</button>
      </div>

      {editingId && (
        <div className="admin-form">
          <input
            placeholder="Name"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="Category"
            value={fields.category}
            onChange={(e) => setFields((f) => ({ ...f, category: e.target.value }))}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={fields.price}
            onChange={(e) => setFields((f) => ({ ...f, price: e.target.value }))}
          />
          <input
            type="color"
            value={fields.color}
            onChange={(e) => setFields((f) => ({ ...f, color: e.target.value }))}
          />
          <input
            placeholder="Modifiers (comma separated)"
            value={fields.modifiers}
            onChange={(e) => setFields((f) => ({ ...f, modifiers: e.target.value }))}
          />
          <button className="admin-save-btn" onClick={save} disabled={!fields.name.trim()}>Save</button>
          <button className="admin-cancel-btn" onClick={cancel}>Cancel</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Modifiers</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {catalog.map((item) => (
            <tr key={item.id}>
              <td><span className="admin-swatch" style={{ background: item.color || '#2b2e3a' }} /></td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.modifiers.join(', ') || '—'}</td>
              <td className="admin-row-actions">
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => onDeleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StaffTab({ staff, onAddStaff, onUpdateStaff, onDeleteStaff }) {
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')

  const startAdd = () => {
    setEditingId('new')
    setName('')
  }

  const startEdit = (member) => {
    setEditingId(member.id)
    setName(member.name)
  }

  const cancel = () => {
    setEditingId(null)
    setName('')
  }

  const save = () => {
    const trimmed = name.trim()
    if (editingId === 'new') {
      onAddStaff(trimmed)
    } else {
      onUpdateStaff(editingId, trimmed)
    }
    cancel()
  }

  return (
    <div className="admin-catalog">
      <div className="admin-toolbar">
        <button className="admin-add-btn" onClick={startAdd}>+ Add Staff</button>
      </div>

      {editingId && (
        <div className="admin-form">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="admin-save-btn" onClick={save} disabled={!name.trim()}>Save</button>
          <button className="admin-cancel-btn" onClick={cancel}>Cancel</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td className="admin-row-actions">
                <button onClick={() => startEdit(member)}>Edit</button>
                <button onClick={() => onDeleteStaff(member.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReportsTab({ checks }) {
  const totalSales = checks.reduce((sum, c) => sum + c.total, 0)

  const byStaff = checks.reduce((acc, c) => {
    const key = c.cashierName || 'Unknown'
    acc[key] ||= { orders: 0, total: 0 }
    acc[key].orders += 1
    acc[key].total += c.total
    return acc
  }, {})

  return (
    <div className="admin-reports">
      <div className="admin-stat">
        <span className="admin-stat-label">Total sales</span>
        <span className="admin-stat-value">${totalSales.toFixed(2)}</span>
      </div>
      <div className="admin-stat">
        <span className="admin-stat-label">Checks</span>
        <span className="admin-stat-value">{checks.length}</span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Orders</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(byStaff).map(([name, s]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{s.orders}</td>
              <td>${s.total.toFixed(2)}</td>
            </tr>
          ))}
          {checks.length === 0 && (
            <tr>
              <td colSpan={3} className="empty">No sales yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminPanel({
  catalog,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  staff,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  checks,
}) {
  const [tab, setTab] = useState('catalog')

  return (
    <div className="admin-screen">
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'catalog' ? 'active' : ''}`} onClick={() => setTab('catalog')}>
          Catalog
        </button>
        <button className={`admin-tab ${tab === 'staff' ? 'active' : ''}`} onClick={() => setTab('staff')}>
          Staff
        </button>
        <button className={`admin-tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>
          Reports
        </button>
      </div>
      {tab === 'catalog' && (
        <CatalogTab catalog={catalog} onAddItem={onAddItem} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
      )}
      {tab === 'staff' && (
        <StaffTab staff={staff} onAddStaff={onAddStaff} onUpdateStaff={onUpdateStaff} onDeleteStaff={onDeleteStaff} />
      )}
      {tab === 'reports' && <ReportsTab checks={checks} />}
    </div>
  )
}
