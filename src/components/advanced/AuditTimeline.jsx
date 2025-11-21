import { Clock, Edit3, AlertTriangle } from 'lucide-react'

export default function AuditTimeline({ events }) {
  if (!events || events.length === 0) return null

  return (
    <section className="card space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Traceability</p>
          <h3 className="text-lg font-semibold">Audit Log</h3>
        </div>
      </header>
      <ol className="space-y-3 text-sm">
        {events.map((event, idx) => (
          <li key={idx} className="flex gap-3">
            <div className="mt-0.5">
              {event.type === 'override' ? (
                <Edit3 className="w-4 h-4 text-chip-review" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-chip-fail" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium">{event.title}</p>
                <span className="flex items-center gap-1 text-xs text-white/50">
                  <Clock className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">{event.description}</p>
              <p className="text-xs text-white/40 mt-0.5">
                Operator: <span className="font-mono">{event.operator}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}


