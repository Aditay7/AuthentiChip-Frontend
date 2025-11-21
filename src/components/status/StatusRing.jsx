import { motion } from 'framer-motion'

export default function StatusRing({ value = 0, status = 'GENUINE', size = 72 }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - value * circumference

  const intent =
    status === 'GENUINE' ? 'pass' : status === 'FAKE' ? 'fail' : 'review'

  const colorClass =
    intent === 'pass' ? 'text-chip-pass' : intent === 'fail' ? 'text-chip-fail' : 'text-chip-review'

  return (
    <div
      className={`relative inline-flex items-center justify-center ${colorClass}`}
      style={{ width: size, height: size }}
      aria-label={`Status ${status} at ${(value * 100).toFixed(1)} percent`}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/10"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-xs font-mono">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}


