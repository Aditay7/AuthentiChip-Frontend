export default function OperatorAnalytics({ stats }) {
  if (!stats) return null

  return (
    <section className="card space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Analytics</p>
        <h3 className="text-lg font-semibold">Operator Performance</h3>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Metric label="Total Scans" value={stats.totalScans} />
        <Metric label="Pass Rate" value={`${stats.passRate.toFixed(1)}%`} />
        <Metric label="Fakes Found" value={stats.fakesFound} intent="fail" />
        <Metric label="Avg Scan Time" value={`${stats.avgScanTime.toFixed(1)}s`} />
      </div>
    </section>
  )
}

function Metric({ label, value, intent }) {
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</p>
      <p
        className={`mt-1 text-lg font-mono ${
          intent === 'fail' ? 'text-chip-fail' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  )
}


