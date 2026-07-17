import { useState } from 'react'
import { PIN_LENGTH } from '../data'

export default function Login({ staff, onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')

  const press = (digit) => {
    const next = pin + digit
    if (next.length < PIN_LENGTH) {
      setPin(next)
      return
    }
    onLogin(selected)
  }

  if (!selected) {
    return (
      <div className="login-screen">
        <h1>Select Cashier</h1>
        <div className="cashier-grid">
          {staff.map((c) => (
            <button key={c.id} className="cashier-tile" onClick={() => setSelected(c)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="login-screen">
      <h1>Hi, {selected.name}</h1>
      <div className="pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>
      <div className="pin-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              className="pin-key"
              onClick={() => (k === '⌫' ? setPin((p) => p.slice(0, -1)) : press(k))}
            >
              {k}
            </button>
          )
        )}
      </div>
      <button className="pin-back" onClick={() => { setSelected(null); setPin('') }}>
        ← Back
      </button>
    </div>
  )
}
