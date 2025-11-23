import { motion } from 'framer-motion'
import { Scan, UploadCloud } from 'lucide-react'

const ScanButton = ({ onClick, disabled, isScanning, onUpload }) => {
  const handleButtonClick = (e) => {
    if (isScanning) return
    if (disabled) {
      // no image selected — trigger upload if provided
      onUpload?.(e)
      return
    }
    onClick?.(e)
  }

  return (
    <motion.button
      onClick={handleButtonClick}
      disabled={isScanning}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative w-64 h-64 rounded-full
        ${disabled || isScanning
          ? 'bg-primary/10 '
          : 'bg-primary hover:bg-primary/90 cursor-pointer'
        }
        flex items-center justify-center
        shadow-2xl transition-all duration-300
        ${!disabled && !isScanning ? 'animate-pulse-slow' : ''}
      `}
    >
      {/* Simple visual upload control inside the scan circle */}
      
      <motion.div
        animate={isScanning ? { rotate: 360 } : {}}
        transition={isScanning ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
        className="absolute inset-0 rounded-full border-4 border-primary/20"
      />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Scan className={`w-16 h-16 ${disabled || isScanning ? 'text-text-muted' : 'text-white'}`} />
        <span className={`text-2xl font-bold ${disabled || isScanning ? 'text-text-muted' : 'text-white'}`}>
          {isScanning ? 'SCANNING...' : 'SCAN IC'}
        </span>
      </div>
    </motion.button>
  )
}

export default ScanButton

