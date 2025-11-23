import { useState } from 'react'
import { Slider } from '@radix-ui/react-slider'
import { Maximize2 } from 'lucide-react'

export default function HeatmapInspector({ baseImageUrl, heatmapUrl }) {
  const [opacity, setOpacity] = useState(0.6)

  if (!baseImageUrl || !heatmapUrl) return null

  return (
    <section className="card space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Branch A</p>
          <h3 className="text-lg font-semibold text-text-primary">Anomaly Heatmap</h3>
        </div>
        <button
          type="button"
          className="rounded-full border border-border-color p-1.5 hover:bg-bg-panel text-text-primary"
          aria-label="Open full-screen heatmap"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </header>

      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-border-color bg-black">
        <img src={baseImageUrl} alt="IC base" className="w-full h-full object-contain" />
        <img
          src={heatmapUrl}
          alt="Anomaly heatmap"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ opacity }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Heatmap Opacity</span>
          <span className="font-mono">{Math.round(opacity * 100)}%</span>
        </div>
        <Slider
          value={[opacity]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(v) => setOpacity(v[0])}
          className="relative flex items-center w-full h-5"
        >
          <span className="block w-full h-1 rounded-full bg-bg-panel" />
        </Slider>
      </div>
    </section>
  )
}


