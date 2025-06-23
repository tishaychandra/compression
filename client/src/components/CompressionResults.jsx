import { Download, Info, Clock, TrendingDown, RotateCcw } from "lucide-react";
import { downloadFile, decompressFile } from "../utils/api";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const CompressionResults = ({ results, originalFile }) => {
  const [decompressing, setDecompressing] = useState({});
  const [decompressedFiles, setDecompressedFiles] = useState({});

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAlgorithmInfo = (algorithm) => {
    const info = {
      huffman: {
        name: "Huffman Coding",
        description: "Variable-length encoding based on character frequency",
        color: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
      },
      rle: {
        name: "Run-Length Encoding",
        description: "Replaces repeated characters with count and character",
        color: "bg-green-50 border-green-200",
        textColor: "text-green-700",
      },
      lz77: {
        name: "LZ77",
        description: "Dictionary-based compression using sliding window",
        color: "bg-purple-50 border-purple-200",
        textColor: "text-purple-700",
      },
    };
    return info[algorithm] || info.huffman;
  };

  const handleDownload = (filename) => {
    const downloadUrl = downloadFile(filename);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDecompress = async (algorithm) => {
    if (decompressing[algorithm]) return;

    setDecompressing((m) => ({ ...m, [algorithm]: true }));
    try {
      const { result } = await decompressFile(originalFile.id, algorithm);
      setDecompressedFiles((d) => ({ ...d, [algorithm]: result }));
      toast.success(
        `${getAlgorithmInfo(algorithm).name.toUpperCase()} decompressed!`
      );
    } catch {
      toast.error(`Failed to decompress ${algorithm}`);
    } finally {
      setDecompressing((m) => ({ ...m, [algorithm]: false }));
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-6">Compression Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((result) => {
          const algorithmInfo = getAlgorithmInfo(result.algorithm);
          const isDecompressing = decompressing[result.algorithm];
          const decompressedFile = decompressedFiles[result.algorithm];

          return (
            <div
              key={result.algorithm}
              className={`border rounded-lg p-6 ${algorithmInfo.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold ${algorithmInfo.textColor}`}
                >
                  {algorithmInfo.name}
                </h3>
                <Link
                  to={`/algorithms/${result.algorithm}`}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Info className="w-5 h-5" />
                </Link>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Size:</span>
                  <span className="font-medium">
                    {formatFileSize(result.originalSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Compressed Size:</span>
                  <span className="font-medium">
                    {formatFileSize(result.compressedSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Compression Ratio:</span>
                  <span className="font-medium text-green-600">
                    {result.compressionRatio.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">{result.processingTime}ms</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleDownload(result.compressedFilename)}
                    className="btn-primary flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Compressed
                  </button>

                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {result.compressionRatio.toFixed(1)}% smaller
                  </div>
                </div>

                <button
                  onClick={() => handleDecompress(result.algorithm)}
                  disabled={isDecompressing}
                  className="w-full btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw
                    className={`w-4 h-4 mr-2 ${
                      isDecompressing ? "animate-spin" : ""
                    }`}
                  />
                  {isDecompressing ? "Decompressing..." : "Decompress"}
                </button>

                {decompressedFile && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Decompressed:
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatFileSize(decompressedFile.decompressedSize)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleDownload(decompressedFile.decompressedFilename);
                      }}
                      className="w-full btn-outline flex items-center justify-center text-sm"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download Decompressed
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Best Compression:</span>
            <span className="ml-2 font-medium">
              {results
                .reduce((best, current) =>
                  current.compressionRatio > best.compressionRatio
                    ? current
                    : best
                )
                .algorithm.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Average Compression:</span>
            <span className="ml-2 font-medium">
              {(
                results.reduce(
                  (sum, result) => sum + result.compressionRatio,
                  0
                ) / results.length
              ).toFixed(1)}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Processing Time:</span>
            <span className="ml-2 font-medium">
              {results.reduce((sum, result) => sum + result.processingTime, 0)}
              ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionResults;
