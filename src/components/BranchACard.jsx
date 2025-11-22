import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const BranchACard = ({ branchA }) => {
  if (!branchA) return null

  const isPass = branchA.result === 'PASS'
  const anomalyScore = branchA.autoencoder_anomaly_score || 0
  const threshold = branchA.anomaly_threshold || 0.25
  const isSuspicious = anomalyScore > threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card border-2 transition-all ${
        isPass ? 'border-pass/50' : 'border-fail/50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-1">Branch A</p>
          <h3 className="text-xl font-bold text-text-primary">Physical Integrity</h3>
        </div>
        <div className={`flex items-center gap-2 ${isPass ? 'text-pass' : 'text-fail'}`}>
          {isPass ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-bold">{branchA.result}</span>
        </div>
      </div>

      {/* Autoencoder Anomaly Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary">Autoencoder Anomaly Score</span>
          <span className={`font-mono font-bold ${isSuspicious ? 'text-fail' : 'text-pass'}`}>
            {anomalyScore.toFixed(3)}
          </span>
        </div>
        <div className="w-full h-2 bg-bg-panel rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(anomalyScore / threshold) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`h-full ${isSuspicious ? 'bg-fail' : 'bg-pass'}`}
            style={{ maxWidth: '100%' }}
          />
        </div>
        <p className="text-text-muted text-xs mt-1">
          Threshold: {threshold} | Status: {isSuspicious ? 'Suspicious' : 'Normal'}
        </p>
      </div>

      {/* Texture Anomaly Score */}
      {branchA.texture_anomaly && (
        <div className="mb-4 p-3 rounded-lg bg-bg-panel border border-border-color">
          <p className="text-text-secondary text-sm mb-2 font-semibold">Texture Anomaly</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Anomalous Regions:</span>
              <span className="font-mono font-semibold text-text-primary">
                {branchA.texture_anomaly.number_of_anomalous_regions || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Max Entropy Patch:</span>
              <span className="font-mono font-semibold text-text-primary">
                {branchA.texture_anomaly.max_entropy_patch?.toFixed(2) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Physical Flags */}
      {branchA.physical_flags && (
        <div className="mb-4">
          <p className="text-text-secondary text-sm mb-2 font-semibold">Physical Flags</p>
          <div className="space-y-2">
            {branchA.physical_flags.possible_resurfacing && (
              <div className="flex items-center gap-2 text-fail text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Possible resurfacing / sanding detected</span>
              </div>
            )}
            {branchA.physical_flags.non_uniform_texture && (
              <div className="flex items-center gap-2 text-fail text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Non-uniform texture detected</span>
              </div>
            )}
            {!branchA.physical_flags.possible_resurfacing && 
             !branchA.physical_flags.non_uniform_texture && (
              <div className="text-pass text-sm">No anomalies detected</div>
            )}
          </div>
        </div>
      )}

      {/* Preprocessed Image Preview */}
      {branchA.preprocessed_image_url && (
        <div className="mt-4">
          <p className="text-text-secondary text-sm mb-2 font-semibold">Registered Image</p>
          <div className="rounded-lg overflow-hidden border border-border-color bg-bg-panel">
            <img
              src={branchA.preprocessed_image_url}
              alt="Preprocessed IC"
              className="w-full h-32 object-contain"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default BranchACard

