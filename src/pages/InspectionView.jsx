import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import ScanButton from '../components/ScanButton'
import OverallStatusCard from '../components/OverallStatusCard'
import BranchACard from '../components/BranchACard'
import BranchBCard from '../components/BranchBCard'
import TraceabilityCard from '../components/TraceabilityCard'
import ProcessingLoader from '../components/ProcessingLoader'
import useAppStore from '../store/useAppStore'

const InspectionView = () => {
  const {
    isScanning,
    scanResult,
    capturedImage,
    registeredImage,
    setScanning,
    setScanResult,
    setCapturedImage,
    setRegisteredImage,
    addScanResult,
    resetScan,
  } = useAppStore()

  const [showFlash, setShowFlash] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 }) // pan offset in px
  const [isDragging, setIsDragging] = useState(false)
  const pointerStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)

  // Demo mode data - Full structure matching ML response
  const getDemoResult = () => {
    const isGenuine = Math.random() > 0.3
    return {
      overall_status: isGenuine ? 'GENUINE' : 'FAKE',
      overall_confidence_score: isGenuine ? 0.95 : 0.87,
      primary_failure_reason: isGenuine 
        ? null 
        : 'Texture inconsistency (possible blacktopping)',
      branch_a: {
        result: isGenuine ? 'PASS' : 'FAIL',
        autoencoder_anomaly_score: isGenuine ? 0.12 : 0.34,
        anomaly_threshold: 0.25,
        texture_anomaly: {
          number_of_anomalous_regions: isGenuine ? 0 : 3,
          max_entropy_patch: isGenuine ? 0.45 : 0.82,
        },
        physical_flags: {
          possible_resurfacing: !isGenuine,
          non_uniform_texture: !isGenuine,
        },
        preprocessed_image_url: '/demo-registered.jpg',
      },
      branch_b: {
        overall_result: isGenuine ? 'PASS' : 'FAIL',
        ocr_verification: {
          extracted_fields: {
            part_number: 'SN74HC273N',
            manufacturer: 'TI',
            lot_code: 'A23B',
          },
          text_match_result: {
            part_number_match: 'MATCH',
            manufacturer_match: isGenuine ? 'MATCH' : 'MISMATCH',
            lot_date_format: 'VALID',
          },
          ocr_confidence: 0.92,
        },
        datasheet_verification: {
          datasheet_status: 'FOUND',
          oem_source_info: {
            oem_name: 'Texas Instruments',
            datasheet_title: 'SN74HC273 Octal D-Type Flip-Flop',
            version: 'Rev. D',
            source_url: 'https://www.ti.com/lit/ds/symlink/sn74hc273.pdf',
          },
          marking_rule_summary: {
            expected_package_type: 'DIP-20',
            expected_top_marking: 'SN74HC273N',
          },
          rule_parsing_status: 'SUCCESS',
        },
        layout_verification: {
          layout_check_result: isGenuine ? 'PASS' : 'FAIL',
          position_deviation: {
            logo_deviation: isGenuine ? 0.8 : 5.2,
            text_block_deviation: isGenuine ? 1.2 : 6.5,
          },
          layout_flags: {
            text_misaligned: !isGenuine,
            logo_missing: false,
            extra_unknown_marking: false,
          },
        },
      },
      traceability: {
        inspection_id: `INSP-${Date.now()}`,
        timestamp: new Date().toISOString(),
        station_id: 'STATION-001',
        image_references: {
          captured_image_id: `IMG-${Date.now()}`,
          registered_image_id: `REG-${Date.now()}`,
        },
        rule_source_reference: {
          rule_id: 'RULE-SN74HC273N-001',
        },
        operator_override: {
          override_status: 'NONE',
        },
      },
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result)
      setZoom(1)
      setPan({ x: 0, y: 0 })
      resetScan()
      setCapturedImage(null)
    }
    reader.readAsDataURL(file)
  }

  const clearSelectedImage = () => {
    setSelectedImage(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    resetScan()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleScan = () => {
    if (!selectedImage || isScanning) return

    setScanning(true)
    setShowFlash(true)

    setTimeout(() => {
      setShowFlash(false)
      setCapturedImage(selectedImage)

      setTimeout(() => {
        const result = getDemoResult()
        setScanResult(result)
        setRegisteredImage(result.branch_a?.preprocessed_image_url)
        addScanResult({ ...result, timestamp: new Date().toISOString() })
        setScanning(false)
      }, 1200)
    }, 120)
  }

  const handleNextScan = () => {
    resetScan()
  }

  // Keyboard shortcut for scan (Spacebar)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !isScanning && !scanResult) {
        e.preventDefault()
        handleUploadClick()
      } else if (e.code === 'Enter' && scanResult) {
        e.preventDefault()
        handleNextScan()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isScanning, scanResult])

  // Pointer-based dragging handlers
  const onPointerDown = (e) => {
    if (zoom <= 1) return // only allow dragging when zoomed
    // Only left button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return

    const containerRect = containerRef.current?.getBoundingClientRect()
    // store starting pointer coords
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...pan }
    setIsDragging(true)

    // capture pointer so we continue receiving events even if pointer leaves element
    e.target.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - pointerStartRef.current.x
    const dy = e.clientY - pointerStartRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }

  const endDragging = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      e.target.releasePointerCapture?.(e.pointerId)
    } catch (err) {
      // ignore if pointerId not captured
    }
    // Optionally clamp pan here if you want bounds — currently free pan
  }

  // Reset pan when zoom goes back to 1
  useEffect(() => {
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 })
    }
  }, [zoom])

  return (
    <div className="min-h-screen bg-hmi-bg relative overflow-hidden">
      <Sidebar />

      {/* Flash Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-white z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <AnimatePresence mode="wait">
          {!scanResult ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-6xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image container */}
                <div
                  ref={containerRef}
                  className="aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center px-8 relative overflow-hidden"
                >
                  {!selectedImage ? (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-semibold text-slate-900">Upload IC Image</h2>
                      <p className="text-sm text-slate-500">
                        Use the button below to pick an image from your computer. We’ll run the mock
                        analysis once you press Scan.
                      </p>
                      <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                        Supported: JPG, PNG, HEIC
                      </p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={selectedImage}
                        alt="Selected IC"
                        // make image positioned so translate works predictably
                        className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform touch-none"
                        // apply pan + zoom via transform
                        style={{
                          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'auto',
                          // disable pointer events on image when not zoomed? we handle pointer on img so keep enabled
                        }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={endDragging}
                        onPointerCancel={endDragging}
                        onPointerLeave={endDragging}
                        draggable={false}
                      />
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setZoom((z) => {
                              const newZ = Math.max(1, +(z - 0.1).toFixed(2))
                              // if zoom returns to 1 reset pan
                              if (newZ <= 1) setPan({ x: 0, y: 0 })
                              return newZ
                            })
                          }}
                          className="px-3 py-1 rounded-full bg-slate-900/70 text-white text-sm"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                          className="px-3 py-1 rounded-full bg-slate-900/70 text-white text-sm"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={clearSelectedImage}
                          className="px-3 py-1 rounded-full bg-red-500/80 text-white text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Right: Controls */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="px-6 py-3 rounded-full bg-slate-900 font-semibold hover:bg-slate-800 transition-colors"
                    style={{ color: '#ffffff' }}
                  >
                    Upload Image
                  </button>
                  {!isScanning ? (
                    <ScanButton
                      onClick={handleScan}
                      disabled={!selectedImage}
                      isScanning={false}
                    />
                  ) : (
                    <ProcessingLoader />
                  )}
                  <p className="text-slate-600 text-sm text-center">
                    Select an image first, then press Scan to generate the mock response.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl space-y-8"
            >
              {/* Top: Overall Status & Image */}
              <section className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-6 items-stretch">
                {/* Left: Captured Image */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center">
                  {capturedImage && (
                    <img
                      src={capturedImage}
                      alt="Scanned IC"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Right: Overall Status Card */}
                <OverallStatusCard result={scanResult} />
              </section>

              {/* Middle: Branch A & B */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BranchACard branchA={scanResult.branch_a} />
                <BranchBCard branchB={scanResult.branch_b} />
              </section>

              {/* Bottom: Traceability */}
              <section>
                <TraceabilityCard traceability={scanResult.traceability} />
              </section>

              {/* Next Scan Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleNextScan}
                  className="px-12 py-4 bg-primary hover:bg-primary/90 rounded-lg text-white font-bold text-xl transition-colors"
                  autoFocus
                >
                  NEXT SCAN
                </button>
              </motion.div>
              <p className="text-white/60 text-sm text-center">
                Press <kbd className="px-2 py-1 bg-white/10 rounded">ENTER</kbd> for next scan
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default InspectionView
