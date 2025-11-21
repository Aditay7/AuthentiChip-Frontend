import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const OverallStatusCard = ({ result }) => {
  if (!result) return null

  const status = result.overall_status || (result.isGenuine ? 'GENUINE' : 'FAKE')
  const confidence = result.overall_confidence_score || result.confidence || 0
  const reason = result.primary_failure_reason || result.reason || 'No reason provided'

  const getStatusColor = () => {
    if (status === 'GENUINE') return 'pass'
    if (status === 'FAKE') return 'fail'
    return 'primary' // REVIEW_NEEDED
  }

  const getStatusIcon = () => {
    if (status === 'GENUINE') return CheckCircle2
    if (status === 'FAKE') return XCircle
    return AlertTriangle
  }

  const StatusIcon = getStatusIcon()
  const statusColor = getStatusColor()

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`w-full rounded-2xl p-8 flex flex-col items-center justify-center ${
        status === 'GENUINE'
          ? 'bg-pass/20 border-2 border-pass'
          : status === 'FAKE'
          ? 'bg-fail/20 border-2 border-fail'
          : 'bg-primary/20 border-2 border-primary'
      }`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`mb-6 ${
          statusColor === 'pass' ? 'text-pass' : 
          statusColor === 'fail' ? 'text-fail' : 
          'text-primary'
        }`}
      >
        <StatusIcon className="w-24 h-24" strokeWidth={2} />
      </motion.div>

      {/* Status Text */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-5xl font-bold mb-4 text-shadow ${
          statusColor === 'pass' ? 'text-pass' : 
          statusColor === 'fail' ? 'text-fail' : 
          'text-primary'
        }`}
      >
        {status}
      </motion.h2>

      {/* Confidence Score */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">Overall Confidence</span>
          <span className={`font-mono font-bold text-lg ${
            statusColor === 'pass' ? 'text-pass' : 
            statusColor === 'fail' ? 'text-fail' : 
            'text-primary'
          }`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence * 100}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${
              statusColor === 'pass' ? 'bg-pass' : 
              statusColor === 'fail' ? 'bg-fail' : 
              'bg-primary'
            }`}
          />
        </div>
      </motion.div>

      {/* Primary Failure Reason */}
      {(status === 'FAKE' || status === 'REVIEW_NEEDED') && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white/80 text-lg mb-2">Primary Failure Reason:</p>
          <p className="text-white font-semibold text-xl">{reason}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default OverallStatusCard

