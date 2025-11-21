export default function ModelDriftPanel({ drift }) {
  if (!drift) return null

  return (
    <section className="card space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Analytics</p>
          <h3 className="text-lg font-semibold">Model Drift</h3>
        </div>
        <span
          className={`status-chip ${
            drift.alert ? 'bg-chip-fail/10 text-chip-fail' : 'bg-chip-pass/10 text-chip-pass'
          }`}
        >
          {drift.alert ? 'ALERT' : 'STABLE'}
        </span>
      </header>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">Drift Score</span>
          <span className="font-mono">{drift.score.toFixed(3)}</span>
        </div>
        <p className="text-xs text-white/60">
          {drift.description || 'Comparing current feature distribution to baseline production data.'}
        </p>
      </div>
    </section>
  )
}


