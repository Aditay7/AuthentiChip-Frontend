import { Copy, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const TraceabilityCard = ({ traceability }) => {
  const [copied, setCopied] = useState(false)

  if (!traceability) return null

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-1">Traceability</p>
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Session Info</h3>
      </div>
      
      <div className="space-y-4">
        {/* Inspection ID */}
        {traceability.inspection_id && (
          <div>
            <div className="flex items-center justify-between mb-1 text-xs uppercase tracking-[0.18em] text-text-muted">
              <span>Inspection ID</span>
              <button
                onClick={() => copyToClipboard(traceability.inspection_id)}
                className="text-primary hover:text-accent-hover transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="font-mono text-sm text-text-primary break-all">
              {traceability.inspection_id}
            </p>
          </div>
        )}

        {/* Timestamp */}
        {traceability.timestamp && (
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Timestamp</span>
            <p className="font-mono text-sm text-text-primary">
              {new Date(traceability.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {/* Line / Station ID */}
        {traceability.station_id && (
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Station ID</span>
            <p className="font-mono text-sm text-text-primary">
              {traceability.station_id}
            </p>
          </div>
        )}

        {/* Image References */}
        {traceability.image_references && (
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted mb-2 block">
              Image References
            </span>
            <div className="space-y-1 text-xs text-text-secondary">
              {traceability.image_references.captured_image_id && (
                <div>
                  <span className="font-semibold">Captured:</span>{' '}
                  <span className="font-mono">
                    {traceability.image_references.captured_image_id}
                  </span>
                </div>
              )}
              {traceability.image_references.registered_image_id && (
                <div>
                  <span className="font-semibold">Registered:</span>{' '}
                  <span className="font-mono">
                    {traceability.image_references.registered_image_id}
                  </span>
                </div>
              )}
              {traceability.image_references.anomaly_heatmap_id && (
                <div>
                  <span className="font-semibold">Anomaly Heatmap:</span>{' '}
                  <span className="font-mono">
                    {traceability.image_references.anomaly_heatmap_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rule Source Reference */}
        {traceability.rule_source_reference && (
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Rule Source</span>
            <p className="font-mono text-sm text-text-primary">
              {traceability.rule_source_reference.rule_id || 'N/A'}
            </p>
          </div>
        )}

        {/* Operator Override */}
        {traceability.operator_override && (
          <div className="p-3 rounded-lg bg-bg-panel border border-border-color">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-text-muted" />
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                Operator Override
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-sm">
                <span className="text-text-muted">Status: </span>
                <span className={`font-semibold ${
                  traceability.operator_override.override_status === 'NONE'
                    ? 'text-text-primary' : 'text-primary'
                }`}>
                  {traceability.operator_override.override_status}
                </span>
              </div>
              {traceability.operator_override.operator_comments && (
                <div className="text-sm">
                  <span className="text-text-muted">Comments: </span>
                  <span className="text-text-secondary">
                    {traceability.operator_override.operator_comments}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TraceabilityCard

