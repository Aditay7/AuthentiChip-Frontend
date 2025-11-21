import { Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function CryptoPassport({ entries }) {
  const [copied, setCopied] = useState(false)

  if (!entries || entries.length === 0) return null

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="card space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Traceability</p>
          <h3 className="text-lg font-semibold">Cryptographic Passport</h3>
        </div>
      </header>
      <div className="space-y-2 text-xs font-mono">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-3 rounded-md bg-black/40 px-3 py-2"
          >
            <div className="space-y-1">
              <p className="text-white truncate">{entry.hash}</p>
              <p className="text-white/50">
                {new Date(entry.timestamp).toLocaleString()} · {entry.location || 'N/A'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(entry.hash)}
              className="mt-1 rounded-full border border-white/20 p-1.5 hover:bg-white/10"
              aria-label="Copy hash"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-chip-pass" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}


