export default function RuleDebugger({ rules }) {
  if (!rules) return null

  return (
    <section className="card space-y-3">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Branch B</p>
        <h3 className="text-lg font-semibold">Marking Rule Debugger</h3>
      </header>
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between text-white/70">
          <span>Expected Package</span>
          <span className="font-mono text-white">{rules.expected_package_type || '—'}</span>
        </div>
        <div>
          <p className="text-white/70 mb-1">Expected Top Marking</p>
          <code className="block bg-black/40 rounded-md px-3 py-2 text-xs font-mono">
            {rules.expected_top_marking || '—'}
          </code>
        </div>
        {rules.raw_rule && (
          <div>
            <p className="text-white/70 mb-1">Parsed Rule Source</p>
            <pre className="bg-black/40 rounded-md px-3 py-2 text-[11px] leading-snug overflow-x-auto">
              {rules.raw_rule}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}


