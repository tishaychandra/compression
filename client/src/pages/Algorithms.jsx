import { Link } from 'react-router-dom'
import { BookOpen, TrendingDown, Clock, Zap } from 'lucide-react'

const Algorithms = () => {
  const algorithms = [
    {
      id: 'huffman',
      name: 'Huffman Coding',
      description: 'A lossless data compression algorithm that creates variable-length codes based on character frequency.',
      shortDesc: 'Variable-length encoding based on character frequency',
      complexity: 'O(n log n)',
      bestFor: 'Text files with repeated characters',
      icon: '📊',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'rle',
      name: 'Run-Length Encoding',
      description: 'A simple form of data compression in which runs of data are stored as a single data value and count.',
      shortDesc: 'Replaces repeated characters with count and character',
      complexity: 'O(n)',
      bestFor: 'Files with many repeated sequences',
      icon: '🔄',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 'lz77',
      name: 'LZ77',
      description: 'A dictionary-based compression algorithm that uses a sliding window technique to find repeated patterns.',
      shortDesc: 'Dictionary-based compression using sliding window',
      complexity: 'O(n²)',
      bestFor: 'General-purpose compression',
      icon: '📚',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <BookOpen className="w-10 h-10 mr-3 text-primary-600" />
          Compression Algorithms
        </h1>
        <p className="text-lg text-gray-600">
          Learn about different compression algorithms and how they work
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algorithm) => (
          <Link
            key={algorithm.id}
            to={`/algorithms/${algorithm.id}`}
            className={`card ${algorithm.color} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{algorithm.icon}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${algorithm.textColor} bg-white`}>
                {algorithm.complexity}
              </div>
            </div>

            <h3 className={`text-xl font-semibold mb-2 ${algorithm.textColor}`}>
              {algorithm.name}
            </h3>

            <p className="text-gray-600 mb-4">
              {algorithm.shortDesc}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-500">
                <TrendingDown className="w-4 h-4 mr-2" />
                <span>Best for: {algorithm.bestFor}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Learn more →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 card">
        <h2 className="text-2xl font-semibold mb-6">How Compression Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingDown className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Reduce Redundancy</h3>
            <p className="text-gray-600 text-sm">
              Identify and eliminate repeated patterns in data to reduce file size
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Optimize Encoding</h3>
            <p className="text-gray-600 text-sm">
              Use efficient encoding schemes to represent data with fewer bits
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Balance compression ratio with processing speed for practical use
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Algorithms 