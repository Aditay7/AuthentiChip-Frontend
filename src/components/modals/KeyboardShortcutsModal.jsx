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
            className="text-sm text-text-muted hover:text-text-primary"
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
      <dt className="text-text-secondary">{label}</dt>
      <dd className="px-2 py-1 rounded bg-bg-panel text-xs font-mono text-text-primary">{k}</dd>
    </div>
  )
}


