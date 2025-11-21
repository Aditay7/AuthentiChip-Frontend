import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Trigger scan - Backend will trigger hardware camera to capture
export const triggerScan = async () => {
  const response = await api.post('/api/scan/trigger')
  return response.data
}

// Scan IC endpoint - For when image is already captured
export const scanIC = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  
  const response = await api.post('/api/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}

// Get live video stream URL
export const getVideoStreamUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  // Raspberry Pi MJPEG stream endpoint
  return `${baseUrl}/api/video/stream`
}

// Get scan history
export const getScanHistory = async (limit = 10) => {
  const response = await api.get(`/api/scans?limit=${limit}`)
  return response.data
}

// Submit daily report
export const submitReport = async (reportData) => {
  const response = await api.post('/api/reports', reportData)
  return response.data
}

// Report issue
export const reportIssue = async (issueData) => {
  const response = await api.post('/api/issues', issueData)
  return response.data
}

export default api

