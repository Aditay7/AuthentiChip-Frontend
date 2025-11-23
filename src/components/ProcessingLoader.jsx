import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

const ProcessingLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="relative"
      >
        <Cpu className="w-20 h-20 text-primary" />
      </motion.div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-text-primary mb-2">Processing...</h3>
        <p className="text-text-secondary">Analyzing IC marking</p>
      </div>

      {/* Scanning Animation */}
      <div className="w-64 h-32 relative overflow-hidden rounded-lg border-2 border-primary/20">
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
          style={{ height: '50%' }}
        />
      </div>
    </div>
  )
}

export default ProcessingLoader

