import { useState } from 'react'

export default function FeedbackPanel({ inspectionId, onSubmit }) {
  const [label, setLabel] = useState('false_positive')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({ inspectionId, label, notes })
    setNotes('')
  }

  return (
    <section className="card space-y-3">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Feedback</p>
        <h3 className="text-lg font-semibold">Model Feedback</h3>
      </header>
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-white/70">Label</label>
          <select
            className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option value="false_positive">False Positive</option>
            <option value="false_negative">False Negative</option>
            <option value="uncertain">Uncertain</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-white/70">Notes (optional)</label>
          <textarea
            rows={3}
            className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white text-sm"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </section>
  )
}


