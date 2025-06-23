import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  compressions: [{
    algorithm: {
      type: String,
      enum: ['huffman', 'rle', 'lz77'],
      required: true
    },
    compressedSize: {
      type: Number,
      required: true
    },
    compressionRatio: {
      type: Number,
      required: true
    },
    processingTime: {
      type: Number,
      required: true
    },
    compressedFilename: {
      type: String,
      required: true
    },
    compressedDate: {
      type: Date,
      default: Date.now
    }
  }],
  decompressions: [{
    algorithm: {
      type: String,
      enum: ['huffman', 'rle', 'lz77'],
      required: true
    },
    decompressedFilename: {
      type: String,
      required: true
    },
    decompressedDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('File', fileSchema); 