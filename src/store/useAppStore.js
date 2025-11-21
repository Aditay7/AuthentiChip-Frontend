import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Inspection state
  isScanning: false,
  scanResult: null,
  capturedImage: null,
  registeredImage: null, // Preprocessed image from Branch A
  
  // Worker stats
  worker: {
    name: 'Operator 001',
    shiftId: 'SHIFT-2025-001',
    photo: null,
  },
  
  // Shift stats
  shiftStats: {
    totalScanned: 0,
    passCount: 0,
    failCount: 0,
    fakesFound: 0,
    reviewNeeded: 0,
  },
  
  // Scan history
  scanHistory: [],
  
  // Actions
  setScanning: (isScanning) => set({ isScanning }),
  setScanResult: (result) => set({ scanResult: result }),
  setCapturedImage: (image) => set({ capturedImage: image }),
  setRegisteredImage: (image) => set({ registeredImage: image }),
  
  addScanResult: (result) => set((state) => {
    const newHistory = [result, ...state.scanHistory].slice(0, 50) // Keep last 50
    const status = result.overall_status || (result.isGenuine ? 'GENUINE' : 'FAKE')
    const newStats = {
      totalScanned: state.shiftStats.totalScanned + 1,
      passCount: status === 'GENUINE' 
        ? state.shiftStats.passCount + 1 
        : state.shiftStats.passCount,
      failCount: status === 'FAKE' 
        ? state.shiftStats.failCount + 1 
        : state.shiftStats.failCount,
      fakesFound: status === 'FAKE' 
        ? state.shiftStats.fakesFound + 1 
        : state.shiftStats.fakesFound,
      reviewNeeded: status === 'REVIEW_NEEDED'
        ? state.shiftStats.reviewNeeded + 1
        : state.shiftStats.reviewNeeded,
    }
    return {
      scanHistory: newHistory,
      shiftStats: newStats,
    }
  }),
  
  resetScan: () => set({ 
    isScanning: false, 
    scanResult: null, 
    capturedImage: null,
    registeredImage: null,
  }),
}))

export default useAppStore
