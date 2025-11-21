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
      className="rounded-lg glass-effect p-6 border-2"
      style={{
        borderColor: isPass ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Branch A - Physical Integrity</h3>
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
          <span className="text-white/80">Autoencoder Anomaly Score</span>
          <span className={`font-mono font-bold ${isSuspicious ? 'text-fail' : 'text-pass'}`}>
            {anomalyScore.toFixed(3)}
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(anomalyScore / threshold) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`h-full ${isSuspicious ? 'bg-fail' : 'bg-pass'}`}
            style={{ maxWidth: '100%' }}
          />
        </div>
        <p className="text-white/60 text-xs mt-1">
          Threshold: {threshold} | Status: {isSuspicious ? 'Suspicious' : 'Normal'}
        </p>
      </div>

      {/* Texture Anomaly Score */}
      {branchA.texture_anomaly && (
        <div className="mb-4 p-3 rounded bg-white/5">
          <p className="text-white/80 text-sm mb-2">Texture Anomaly</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Anomalous Regions:</span>
              <span className="font-mono font-semibold text-white">
                {branchA.texture_anomaly.number_of_anomalous_regions || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Max Entropy Patch:</span>
              <span className="font-mono font-semibold text-white">
                {branchA.texture_anomaly.max_entropy_patch?.toFixed(2) || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Physical Flags */}
      {branchA.physical_flags && (
        <div className="mb-4">
          <p className="text-white/80 text-sm mb-2">Physical Flags</p>
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
          <p className="text-white/80 text-sm mb-2">Registered Image</p>
          <div className="rounded overflow-hidden border border-white/20">
            <img
              src={branchA.preprocessed_image_url}
              alt="Preprocessed IC"
              className="w-full h-32 object-contain bg-black"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default BranchACard

