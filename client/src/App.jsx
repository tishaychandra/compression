import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Algorithms from './pages/Algorithms'
import AlgorithmDetail from './pages/AlgorithmDetail'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/algorithms/:algorithm" element={<AlgorithmDetail />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default App 