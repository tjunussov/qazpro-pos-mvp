import { useState } from 'react'

export default function ModifierPicker({ item, onConfirm, onCancel }) {
  const [selected, setSelected] = useState([])

  const toggle = (mod) =>
    setSelected((s) => (s.includes(mod) ? s.filter((m) => m !== mod) : [...s, mod]))

  const extra = selected.reduce((sum, m) => sum + m.price, 0)
  const total = item.price + extra

  return (
    <div className="modifier-overlay" onClick={onCancel}>
      <div className="modifier-panel" onClick={(e) => e.stopPropagation()}>
        <h3>{item.name}</h3>
        <div className="modifier-list">
          {item.modifiers.map((mod) => (
            <label key={mod.name} className="modifier-row">
              <input
                type="checkbox"
                checked={selected.includes(mod)}
                onChange={() => toggle(mod)}
              />
              <span>{mod.name}</span>
              {mod.price > 0 && <span className="modifier-price">+${mod.price.toFixed(2)}</span>}
            </label>
          ))}
        </div>
        <div className="modifier-actions">
          <button className="admin-cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="admin-save-btn" onClick={() => onConfirm(selected)}>
            Add · ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}
