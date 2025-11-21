import { useState } from 'react'
import { Menu, X, User, BarChart3, AlertCircle, FileText, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../store/useAppStore'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { worker, shiftStats, scanHistory } = useAppStore()

  const fakesHistory = scanHistory.filter(scan => !scan.isGenuine)

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-hmi-bg border-r border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mb-6 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Profile Card */}
                <div className="mb-6 p-4 rounded-lg glass-effect">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{worker.name}</h3>
                      <p className="text-sm text-white/60 font-mono">{worker.shiftId}</p>
                    </div>
                  </div>
                </div>

                {/* Shift Stats */}
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
                    Shift Stats
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg glass-effect">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Total Scanned</span>
                        <span className="text-2xl font-bold text-primary font-mono">
                          {shiftStats.totalScanned}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg glass-effect">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Pass Rate</span>
                        <span className="text-2xl font-bold text-pass font-mono">
                          {shiftStats.totalScanned > 0 
                            ? Math.round((shiftStats.passCount / shiftStats.totalScanned) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/gallery')
                        setIsOpen(false)
                      }}
                      className="w-full p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Fakes Found</span>
                        <span className="text-2xl font-bold text-fail font-mono">
                          {shiftStats.fakesFound}
                        </span>
                      </div>
                      {fakesHistory.length > 0 && (
                        <p className="text-xs text-white/60 mt-1">
                          Click to view gallery
                        </p>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tools */}
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
                    Tools
                  </h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/gallery')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>View Gallery</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        // TODO: Open issue report modal
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Report Issue</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/report')
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span>End Shift / Submit Report</span>
                    </button>
                    
                    <button
                      className="w-full flex items-center gap-3 p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

