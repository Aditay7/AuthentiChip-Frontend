import { useState } from 'react'

export default function ComparisonSlider({ beforeUrl, afterUrl }) {
  const [position, setPosition] = useState(50)

  if (!beforeUrl || !afterUrl) return null

  return (
    <section className="card space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Layout</p>
        <h3 className="text-lg font-semibold text-text-primary">Before / After Comparison</h3>
      </header>
      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-border-color bg-black">
        <img src={afterUrl} alt="Reference layout" className="w-full h-full object-contain" />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img src={beforeUrl} alt="Captured layout" className="w-full h-full object-contain" />
        </div>
        <div
          className="absolute inset-y-0"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-text-secondary" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-text-secondary">
            {position}%
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-x-8 bottom-3"
        />
      </div>
    </section>
  )
}


