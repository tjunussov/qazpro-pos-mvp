import { useState } from 'react'

export default function ModifierPicker({ item, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(() =>
    item.modifierGroups.filter((g) => g.type === 'single').map((g) => g.options[0])
  )

  const toggleMulti = (opt) =>
    setSelected((s) => (s.includes(opt) ? s.filter((m) => m !== opt) : [...s, opt]))

  const chooseSingle = (group, opt) =>
    setSelected((s) => [...s.filter((m) => !group.options.includes(m)), opt])

  const extra = selected.reduce((sum, m) => sum + m.price, 0)
  const total = item.price + extra

  return (
    <div className="modifier-overlay" onClick={onCancel}>
      <div className="modifier-panel" onClick={(e) => e.stopPropagation()}>
        <h3>{item.name}</h3>
        {item.modifierGroups.map((group) => (
          <div key={group.id} className="modifier-group">
            <h4>{group.label}</h4>
            <div className="modifier-list">
              {group.options.map((opt) => (
                <label key={opt.name} className="modifier-row">
                  <input
                    type={group.type === 'single' ? 'radio' : 'checkbox'}
                    name={group.id}
                    checked={selected.includes(opt)}
                    onChange={() => (group.type === 'single' ? chooseSingle(group, opt) : toggleMulti(opt))}
                  />
                  <span>{opt.name}</span>
                  {opt.price > 0 && <span className="modifier-price">+${opt.price.toFixed(2)}</span>}
                </label>
              ))}
            </div>
          </div>
        ))}
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
