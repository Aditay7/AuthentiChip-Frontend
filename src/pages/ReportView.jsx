import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import useAppStore from '../store/useAppStore'
import { submitReport } from '../utils/api'

const ReportView = () => {
  const { worker, shiftStats } = useAppStore()
  const [anomaliesNote, setAnomaliesNote] = useState('')
  const [jigCondition, setJigCondition] = useState('okay')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const reportData = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      operatorName: worker.name,
      shiftId: worker.shiftId,
      totalScanned: shiftStats.totalScanned,
      passCount: shiftStats.passCount,
      failCount: shiftStats.failCount,
      fakesFound: shiftStats.fakesFound,
      anomaliesNote,
      jigCondition,
    }

    try {
      await submitReport(reportData)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-hmi-bg flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-pass mb-4">Report Submitted</h2>
          <p className="text-white/80 mb-8">Your shift report has been successfully submitted.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-white font-semibold transition-colors"
          >
            Return to Inspection
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hmi-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold">End of Shift Report</h1>
        </div>

        {/* Auto-filled Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Date</p>
            <p className="text-white font-mono font-semibold">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Time</p>
            <p className="text-white font-mono font-semibold">
              {new Date().toTimeString().split(' ')[0]}
            </p>
          </div>
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Operator</p>
            <p className="text-white font-mono font-semibold">{worker.name}</p>
          </div>
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Total Scanned</p>
            <p className="text-white font-mono font-semibold text-2xl">
              {shiftStats.totalScanned}
            </p>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Pass</p>
            <p className="text-pass font-mono font-bold text-2xl">
              {shiftStats.passCount}
            </p>
          </div>
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Fail</p>
            <p className="text-fail font-mono font-bold text-2xl">
              {shiftStats.failCount}
            </p>
          </div>
          <div className="p-4 rounded-lg glass-effect">
            <p className="text-white/60 text-sm mb-1">Fakes Found</p>
            <p className="text-fail font-mono font-bold text-2xl">
              {shiftStats.fakesFound}
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Anomalies Note */}
          <div>
            <label className="block text-white/80 mb-2">
              Anomalies Note
            </label>
            <textarea
              value={anomaliesNote}
              onChange={(e) => setAnomaliesNote(e.target.value)}
              placeholder="e.g., Lot #45 had consistently bad printing"
              className="w-full p-4 rounded-lg glass-effect text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          {/* Jig Condition */}
          <div>
            <label className="block text-white/80 mb-2">
              Jig Condition
            </label>
            <select
              value={jigCondition}
              onChange={(e) => setJigCondition(e.target.value)}
              className="w-full p-4 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="okay">Okay</option>
              <option value="needs-cleaning">Needs Cleaning</option>
              <option value="needs-repair">Needs Repair</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg text-white font-bold text-xl transition-colors flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  )
}

export default ReportView

