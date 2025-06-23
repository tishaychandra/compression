import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const StatisticsChart = ({ results }) => {
  const algorithmNames = {
    huffman: 'Huffman Coding',
    rle: 'Run-Length Encoding',
    lz77: 'LZ77'
  }

  const data = {
    labels: results.map(result => algorithmNames[result.algorithm] || result.algorithm),
    datasets: [
      {
        label: 'Compression Ratio (%)',
        data: results.map(result => result.compressionRatio),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 1,
      },
      {
        label: 'Processing Time (ms)',
        data: results.map(result => result.processingTime),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Compression Performance Comparison',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Compression Ratio (%)'
        },
        min: 0,
        max: Math.max(...results.map(r => r.compressionRatio)) + 10
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Processing Time (ms)'
        },
        min: 0,
        max: Math.max(...results.map(r => r.processingTime)) + 50,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return (
    <div className="w-full h-80">
      <Bar data={data} options={options} />
    </div>
  )
}

export default StatisticsChart 