import { Link, useLocation } from 'react-router-dom'
import { FileText, BookOpen } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600">
            <FileText className="w-8 h-8" />
            <span>Compression App</span>
          </Link>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/algorithms"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/algorithms') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Algorithms</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 