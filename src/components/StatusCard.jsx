import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const StatusCard = ({ result }) => {
  const isGenuine = result?.isGenuine ?? false
  const confidence = result?.confidence ?? 0
  const reason = result?.reason ?? 'No reason provided'

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center ${
        isGenuine 
          ? 'bg-pass/20 border-2 border-pass' 
          : 'bg-fail/20 border-2 border-fail'
      }`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`mb-6 ${
          isGenuine ? 'text-pass' : 'text-fail'
        }`}
      >
        {isGenuine ? (
          <CheckCircle2 className="w-24 h-24" strokeWidth={2} />
        ) : (
          <XCircle className="w-24 h-24" strokeWidth={2} />
        )}
      </motion.div>

      {/* Status Text */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-5xl font-bold mb-4 text-shadow ${
          isGenuine ? 'text-pass' : 'text-fail'
        }`}
      >
        {isGenuine ? 'PASS / GENUINE' : 'FAIL / COUNTERFEIT'}
      </motion.h2>

      {/* Reason */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-6"
      >
        <p className="text-white/80 text-lg mb-2">Reason:</p>
        <p className="text-white font-semibold text-xl">{reason}</p>
      </motion.div>

      {/* Confidence */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">Confidence</span>
          <span className="text-white font-mono font-bold text-lg">
            {confidence}%
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className={`h-full ${
              isGenuine ? 'bg-pass' : 'bg-fail'
            }`}
          />
        </div>
      </motion.div>

      {/* Part Number if available */}
      {result?.partNumber && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 rounded-lg glass-effect w-full"
        >
          <p className="text-white/60 text-sm mb-1">Part Number</p>
          <p className="text-white font-mono text-lg font-semibold">
            {result.partNumber}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StatusCard

