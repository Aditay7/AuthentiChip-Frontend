import { Routes, Route } from 'react-router-dom'
import InspectionView from './pages/InspectionView'
import GalleryView from './pages/GalleryView'
import ReportView from './pages/ReportView'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-hmi-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<InspectionView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/report" element={<ReportView />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

