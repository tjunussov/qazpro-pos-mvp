import { useState } from 'react'
import { CASHIERS, PIN } from '../data'

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const press = (digit) => {
    const next = pin + digit
    setError(false)
    if (next.length < PIN.length) {
      setPin(next)
      return
    }
    if (next === PIN) {
      onLogin(selected)
    } else {
      setError(true)
      setPin('')
    }
  }

  if (!selected) {
    return (
      <div className="login-screen">
        <h1>Select Cashier</h1>
        <div className="cashier-grid">
          {CASHIERS.map((c) => (
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
      <div className={`pin-dots ${error ? 'error' : ''}`}>
        {Array.from({ length: PIN.length }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>
      {error && <p className="pin-error">Wrong PIN, try again</p>}
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
