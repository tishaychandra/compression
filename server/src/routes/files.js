import express from 'express';
import fs from 'fs';
import path from 'path';
import File from '../models/File.js';

const router = express.Router();

// Download file
router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const decodedFilename = decodeURIComponent(filename);
    
    const filePath = path.join(process.cwd(), 'uploads', decodedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, decodedFilename, (err) => {
      if (err) {
        res.status(500).json({ error: 'Download failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get file statistics
router.get('/stats/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stats = {
      originalName: file.originalName,
      originalSize: file.originalSize,
      uploadDate: file.uploadDate,
      compressions: file.compressions.map(comp => ({
        algorithm: comp.algorithm,
        compressedSize: comp.compressedSize,
        compressionRatio: comp.compressionRatio,
        processingTime: comp.processingTime,
        compressedFilename: comp.compressedFilename
      })),
      decompressions: file.decompressions.map(decomp => ({
        algorithm: decomp.algorithm,
        decompressedFilename: decomp.decompressedFilename
      }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get file statistics' });
  }
});

// Delete file
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete original file
    const originalFilePath = path.join(process.cwd(), 'uploads', file.filename);
    if (fs.existsSync(originalFilePath)) {
      fs.unlinkSync(originalFilePath);
    }

    // Delete compressed files
    for (const compression of file.compressions) {
      const compressedFilePath = path.join(process.cwd(), 'uploads', compression.compressedFilename);
      if (fs.existsSync(compressedFilePath)) {
        fs.unlinkSync(compressedFilePath);
      }
    }

    // Delete decompressed files
    for (const decompression of file.decompressions) {
      const decompressedFilePath = path.join(process.cwd(), 'uploads', decompression.decompressedFilename);
      if (fs.existsSync(decompressedFilePath)) {
        fs.unlinkSync(decompressedFilePath);
      }
    }

    await File.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get all files with compression statistics
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    
    const filesWithStats = files.map(file => ({
      id: file._id,
      originalName: file.originalName,
      originalSize: file.originalSize,
      uploadDate: file.uploadDate,
      compressionCount: file.compressions.length,
      decompressionCount: file.decompressions.length,
      bestCompression: file.compressions.length > 0 
        ? file.compressions.reduce((best, current) => 
            current.compressionRatio > best.compressionRatio ? current : best
          )
        : null
    }));

    res.json(filesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Get specific file by ID
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = {
      id: file._id,
      originalName: file.originalName,
      originalSize: file.originalSize,
      uploadDate: file.uploadDate,
      mimeType: file.mimeType,
      filename: file.filename,
      compressions: file.compressions.map(comp => ({
        algorithm: comp.algorithm,
        compressedSize: comp.compressedSize,
        compressionRatio: comp.compressionRatio,
        processingTime: comp.processingTime,
        compressedFilename: comp.compressedFilename
      })),
      decompressions: file.decompressions.map(decomp => ({
        algorithm: decomp.algorithm,
        decompressedFilename: decomp.decompressedFilename,
        timestamp: decomp.timestamp
      }))
    };

    res.json(fileData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

export default router; 