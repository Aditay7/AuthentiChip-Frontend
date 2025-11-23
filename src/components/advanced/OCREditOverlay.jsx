import { useState } from 'react'
import { Dialog } from '@radix-ui/react-dialog'

export default function OCREditOverlay({ open, onOpenChange, fields, onSave }) {
  const [localFields, setLocalFields] = useState(fields || {})

  const handleChange = (key, value) => {
    setLocalFields((prev) => ({ ...prev, [key]: { ...prev[key], value } }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave?.(localFields)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="card max-w-xl w-full space-y-4">
        <Dialog.Title className="text-lg font-semibold">Edit OCR Fields</Dialog.Title>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.entries(localFields || {}).map(([key, meta]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span className="uppercase tracking-[0.18em]">{key}</span>
                {meta.confidence != null && (
                  <span className="font-mono">
                    {(meta.confidence * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              <input
                className="w-full rounded-md bg-bg-panel border border-border-color px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary"
                value={meta.value ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-md text-sm bg-bg-panel text-text-primary hover:bg-bg-primary border border-border-color"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  )
}


