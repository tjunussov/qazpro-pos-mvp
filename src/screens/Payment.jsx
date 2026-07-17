import { useState } from 'react'

const METHODS = ['Card', 'Kaspi QR', 'Halyk QR']

export default function Payment({ total, onConfirm }) {
  const [processing, setProcessing] = useState(null)

  const choose = (method) => {
    setProcessing(method)
    setTimeout(() => onConfirm(method), 1000)
  }

  return (
    <div className="payment-screen">
      <h1>Pay ${total.toFixed(2)}</h1>
      {processing ? (
        <p className="processing">Processing {processing}…</p>
      ) : (
        <div className="payment-methods">
          {METHODS.map((m) => (
            <button key={m} className="payment-tile" onClick={() => choose(m)}>
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
