import { Suspense } from 'react'

// Skeleton for a lazy-loaded PDF viewer
export default function DatasheetViewer({ url }) {
  if (!url) return null

  return (
    <section className="card space-y-3">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Branch B</p>
        <h3 className="text-lg font-semibold">Datasheet Viewer</h3>
        <p className="text-xs text-white/60 mt-1 break-all">{url}</p>
      </header>
      <Suspense
        fallback={
          <div className="h-64 rounded-xl border border-white/15 bg-black/40 animate-pulse" />
        }
      >
        <iframe
          title="Datasheet PDF"
          src={url}
          className="w-full h-96 rounded-xl border border-white/15 bg-black"
        />
      </Suspense>
    </section>
  )
}


