import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingDown, Clock, Zap, Code, BarChart3 } from 'lucide-react'

const AlgorithmDetail = () => {
  const { algorithm } = useParams()

  const algorithmData = {
    huffman: {
      name: 'Huffman Coding',
      description: 'Huffman coding is a lossless data compression algorithm that creates variable-length codes based on character frequency. It assigns shorter codes to more frequent characters and longer codes to less frequent ones, resulting in optimal compression for text data.',
      icon: '📊',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      complexity: 'O(n log n)',
      bestFor: 'Text files with repeated characters',
      advantages: [
        'Optimal compression for text data',
        'Lossless compression',
        'Widely used in many applications',
        'Good compression ratio for text files'
      ],
      disadvantages: [
        'Requires two passes through data',
        'Not efficient for binary data',
        'Overhead for storing frequency table'
      ],
      steps: [
        'Count frequency of each character in the input',
        'Build a binary tree (Huffman tree) based on frequencies',
        'Assign binary codes to each character based on tree paths',
        'Encode the input using the generated codes'
      ],
      example: {
        input: 'hello world',
        output: 'Compressed binary representation',
        explanation: 'Characters like "l" and "o" get shorter codes due to higher frequency'
      }
    },
    rle: {
      name: 'Run-Length Encoding',
      description: 'Run-Length Encoding (RLE) is a simple form of data compression in which runs of data are stored as a single data value and count. It works well for data with many repeated consecutive values.',
      icon: '🔄',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      complexity: 'O(n)',
      bestFor: 'Files with many repeated sequences',
      advantages: [
        'Simple to implement',
        'Very fast compression and decompression',
        'Good for data with many repeated values',
        'No additional data structures needed'
      ],
      disadvantages: [
        'Poor compression for diverse data',
        'Can increase file size for random data',
        'Limited compression ratio'
      ],
      steps: [
        'Scan through the input data sequentially',
        'Count consecutive occurrences of each value',
        'Store the count followed by the value',
        'Continue until all data is processed'
      ],
      example: {
        input: 'AAAAABBBCC',
        output: '5A3B2C',
        explanation: '5 A\'s, 3 B\'s, and 2 C\'s are encoded as 5A3B2C'
      }
    },
    lz77: {
      name: 'LZ77',
      description: 'LZ77 is a dictionary-based compression algorithm that uses a sliding window technique to find repeated patterns. It maintains a dictionary of recently seen data and references to previous occurrences.',
      icon: '📚',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      complexity: 'O(n²)',
      bestFor: 'General-purpose compression',
      advantages: [
        'Good compression for various data types',
        'Adaptive to data patterns',
        'Used in many modern compression formats',
        'Balanced compression ratio and speed'
      ],
      disadvantages: [
        'Higher computational complexity',
        'Memory requirements for sliding window',
        'Not optimal for all data types'
      ],
      steps: [
        'Maintain a sliding window of recent data',
        'Look for longest match in the window',
        'Output offset, length, and next character',
        'Slide window forward and repeat'
      ],
      example: {
        input: 'abracadabra',
        output: 'a,b,r,a,c,a,d,<4,7>',
        explanation: 'The second "abracad" is encoded as a reference to the first occurrence'
      }
    }
  }

  const data = algorithmData[algorithm]

  if (!data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Algorithm Not Found</h1>
        <Link to="/algorithms" className="btn-primary">
          Back to Algorithms
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/algorithms" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Algorithms
        </Link>
      </div>

      <div className={`card ${data.color} mb-8`}>
        <div className="flex items-center mb-6">
          <span className="text-4xl mr-4">{data.icon}</span>
          <div>
            <h1 className={`text-3xl font-bold ${data.textColor}`}>{data.name}</h1>
            <p className="text-gray-600 mt-1">{data.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Best for: {data.bestFor}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Complexity: {data.complexity}</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Type: Lossless</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Advantages
          </h2>
          <ul className="space-y-2">
            {data.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{advantage}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Disadvantages
          </h2>
          <ul className="space-y-2">
            {data.disadvantages.map((disadvantage, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span className="text-gray-700">{disadvantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          How It Works
        </h2>
        <ol className="space-y-3">
          {data.steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Example</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Input:</h3>
              <code className="bg-white px-3 py-2 rounded border text-sm">{data.example.input}</code>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Output:</h3>
              <code className="bg-white px-3 py-2 rounded border text-sm">{data.example.output}</code>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Explanation:</h3>
            <p className="text-gray-600 text-sm">{data.example.explanation}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="btn-primary">
          Try This Algorithm
        </Link>
      </div>
    </div>
  )
}

export default AlgorithmDetail 