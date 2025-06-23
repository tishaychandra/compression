import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File.js';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileData = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      originalSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await fileData.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileData._id,
        originalName: fileData.originalName,
        filename: fileData.filename,
        originalSize: fileData.originalSize,
        mimeType: fileData.mimeType,
        uploadDate: fileData.uploadDate
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

export default router; 