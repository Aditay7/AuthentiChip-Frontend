import { useEffect } from 'react'

export default function KeyboardShortcutsModal({ open, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !open) {
        e.preventDefault()
        onClose(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="card max-w-lg w-full space-y-4">
        <header className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="text-sm text-white/60 hover:text-white"
          >
            Esc
          </button>
        </header>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Shortcut k="Space" label="Trigger scan" />
          <Shortcut k="Enter" label="Next scan" />
          <Shortcut k="G" label="Open gallery" />
          <Shortcut k="R" label="Open reports" />
          <Shortcut k="?" label="Show shortcuts" />
        </dl>
      </div>
    </div>
  )
}

function Shortcut({ k, label }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/70">{label}</dt>
      <dd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">{k}</dd>
    </div>
  )
}


