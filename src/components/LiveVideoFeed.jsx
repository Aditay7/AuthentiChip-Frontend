import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff } from 'lucide-react'

const LiveVideoFeed = ({ videoUrl, onCapture }) => {
  const videoRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return

    const video = videoRef.current

    // For MJPEG stream from Raspberry Pi
    if (videoUrl.includes('mjpeg') || videoUrl.endsWith('.mjpg')) {
      video.src = videoUrl
      video.onloadstart = () => setIsStreaming(true)
      video.onerror = () => {
        setError('Failed to load video stream')
        setIsStreaming(false)
      }
    } else {
      // For WebRTC or other stream types
      // This would need additional setup based on your streaming protocol
      setError('Unsupported stream type')
    }

    return () => {
      if (video.src) {
        video.src = ''
      }
    }
  }, [videoUrl])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-lg border-2 border-white/20">
        <CameraOff className="w-12 h-12 text-white/40 mb-2" />
        <p className="text-white/60 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/20 bg-black">
      {videoUrl ? (
        <img
          ref={videoRef}
          src={videoUrl}
          alt="Live Camera Feed"
          className="w-full h-full object-contain"
          onLoad={() => setIsStreaming(true)}
          onError={() => {
            setError('Failed to load video stream')
            setIsStreaming(false)
          }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Camera className="w-12 h-12 text-white/40 mb-2" />
          <p className="text-white/60 text-sm">No video feed available</p>
        </div>
      )}
      
      {/* Streaming indicator */}
      {isStreaming && (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-pass rounded-full animate-pulse" />
          <span className="text-xs text-white">LIVE</span>
        </div>
      )}

      {/* IC Placement Guide Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-32 border-2 border-dashed border-white/30 rounded-lg" />
      </div>
    </div>
  )
}

export default LiveVideoFeed

