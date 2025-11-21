import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import useAppStore from '../store/useAppStore'

const GalleryView = () => {
  const { scanHistory } = useAppStore()

  return (
    <div className="min-h-screen bg-hmi-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold">Scan Gallery</h1>
        </div>

        {/* Gallery Grid */}
        {scanHistory.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-xl">No scans yet</p>
            <Link
              to="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Start scanning
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scanHistory.map((scan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg overflow-hidden border-2 ${
                  scan.isGenuine ? 'border-pass/50' : 'border-fail/50'
                } glass-effect`}
              >
                <div className="aspect-video bg-black flex items-center justify-center">
                  {scan.image ? (
                    <img
                      src={scan.image}
                      alt="IC Scan"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-white/40">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-2 ${
                      scan.isGenuine ? 'text-pass' : 'text-fail'
                    }`}>
                      {scan.isGenuine ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-bold">
                        {scan.isGenuine ? 'GENUINE' : 'FAKE'}
                      </span>
                    </div>
                    <span className="text-white/60 text-sm font-mono">
                      {scan.confidence}%
                    </span>
                  </div>
                  {scan.partNumber && (
                    <p className="text-white/80 font-mono text-sm mb-1">
                      {scan.partNumber}
                    </p>
                  )}
                  <p className="text-white/60 text-xs line-clamp-2">
                    {scan.reason}
                  </p>
                  {scan.timestamp && (
                    <p className="text-white/40 text-xs mt-2 font-mono">
                      {new Date(scan.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryView

