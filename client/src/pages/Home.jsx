import { useState, useRef } from "react";
import { Upload, FileText, Download, Info, BarChart3 } from "lucide-react";
import { uploadFile, compressAllAlgorithms, downloadFile } from "../utils/api";
import toast from "react-hot-toast";
import CompressionResults from "../components/CompressionResults";
import StatisticsChart from "../components/StatisticsChart";

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [compressionResults, setCompressionResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadFile(file);
      setUploadedFile(result.file);
      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompress = async () => {
    if (!uploadedFile) return;

    setIsCompressing(true);
    try {
      const result = await compressAllAlgorithms(uploadedFile.id);
      setCompressionResults(result.results);
      toast.success("Compression completed!");
    } catch (error) {
      toast.error("Failed to compress file");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileUpload(event);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Data Compression & Decompression
        </h1>
        <p className="text-lg text-gray-600">
          Upload any file and compress it using multiple algorithms to see which
          works best
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-2" />
            Upload File
          </h2>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop a file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports any file type up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </div>

          {uploadedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="font-medium">{uploadedFile.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.originalSize)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? "Compressing..." : "Compress"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Compression Statistics
          </h2>

          {compressionResults ? (
            <StatisticsChart results={compressionResults} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Upload and compress a file to see statistics</p>
            </div>
          )}
        </div>
      </div>

      {compressionResults && (
        <div className="mt-8">
          <CompressionResults
            results={compressionResults}
            originalFile={uploadedFile}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
