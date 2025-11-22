import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import InspectionView from './pages/InspectionView'
import HistoryPage from './pages/History'
import Navbar from './components/layout/Navbar'
import useAppStore from './store/useAppStore'

function App() {
  const { theme, setTheme } = useAppStore()

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('authentichip-theme') || 'light'
    if (savedTheme !== theme) {
      setTheme(savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, setTheme])

  return (
    <div className="min-h-screen bg-hmi-bg transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<InspectionView />} />

          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

