// routes/compression.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import File from "../models/File.js";
import HuffmanCoding from "../algorithms/huffman.js";
import RunLengthEncoding from "../algorithms/rle.js";
import LZ77 from "../algorithms/lz77.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const router = express.Router();

// Compress all algorithms
router.post("/:fileId/all", async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const srcPath = path.join(UPLOAD_DIR, file.filename);
    if (!fs.existsSync(srcPath))
      return res.status(404).json({ error: "File not on disk" });

    const algorithms = ["huffman", "rle", "lz77"];
    const results = [];

    for (const algo of algorithms) {
      try {
        const start = Date.now();
        const result = await compressFile(srcPath, algo, file);
        results.push({
          algorithm: algo,
          ...result,
          processingTime: Date.now() - start,
        });
      } catch (err) {
        results.push({
          algorithm: algo,
          error: err.message,
          originalSize: fs.statSync(srcPath).size,
          compressedSize: 0,
          compressionRatio: 0,
          processingTime: 0,
        });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: "Compression failed" });
  }
});

// Compress or Decompress one algorithm
router.post("/:fileId/:algorithm", async (req, res) => {
  try {
    const { fileId, algorithm } = req.params;
    const { action } = req.body;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const srcPath = path.join(UPLOAD_DIR, file.filename);
    if (!fs.existsSync(srcPath))
      return res.status(404).json({ error: "File not on disk" });

    const start = Date.now();
    let result;
    if (action === "compress") {
      result = await compressFile(srcPath, algorithm, file);
    } else if (action === "decompress") {
      result = await decompressFile(srcPath, algorithm, file);
    } else {
      return res
        .status(400)
        .json({ error: 'Use action="compress" or "decompress"' });
    }

    res.json({ success: true, result, processingTime: Date.now() - start });
  } catch (err) {
    res.status(500).json({ error: "Compression failed" });
  }
});

async function compressFile(srcPath, algorithm, file) {
  const buf = fs.readFileSync(srcPath);
  const originalSize = buf.length;

  let compressedBuf;
  let compressedFilename;

  switch (algorithm) {
    case "huffman": {
      const h = new HuffmanCoding();
      compressedBuf = h.compress(buf);
      compressedFilename = `${file.filename}_huffman.bin`;
      fs.writeFileSync(
        path.join(UPLOAD_DIR, compressedFilename),
        compressedBuf
      );
      break;
    }
    case "rle": {
      const rle = new RunLengthEncoding();
      compressedBuf = rle.compress(buf);
      compressedFilename = `${file.filename}_rle.bin`;
      fs.writeFileSync(
        path.join(UPLOAD_DIR, compressedFilename),
        compressedBuf
      );
      break;
    }
    case "lz77": {
      const lz = new LZ77();
      compressedBuf = lz.compress(buf);
      compressedFilename = `${file.filename}_lz77.bin`;
      fs.writeFileSync(
        path.join(UPLOAD_DIR, compressedFilename),
        compressedBuf
      );
      break;
    }
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  const compressedSize = compressedBuf.length;
  const compressionRatio = parseFloat(
    (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
  );

  file.compressions.push({
    algorithm,
    compressedSize,
    compressionRatio,
    compressedFilename,
    compressedDate: new Date(),
    processingTime: 0,
  });
  await file.save();

  return {
    algorithm,
    originalSize,
    compressedSize,
    compressionRatio,
    compressedFilename,
  };
}

async function decompressFile(srcPath, algorithm, file) {
  const info = file.compressions.find((c) => c.algorithm === algorithm);
  if (!info) throw new Error(`No compressed file for ${algorithm}`);

  const inPath = path.join(UPLOAD_DIR, info.compressedFilename);
  if (!fs.existsSync(inPath))
    throw new Error(`Missing ${info.compressedFilename}`);

  const originalExt = path.extname(file.filename);
  const base = path.basename(file.filename, originalExt);

  let outBuf, decompressedFilename;

  switch (algorithm) {
    case "huffman": {
      const h = new HuffmanCoding();
      const raw = fs.readFileSync(inPath);
      outBuf = h.decompress(raw);
      decompressedFilename = `${base}_huffman_dec${originalExt}`;
      break;
    }
    case "rle": {
      const rle = new RunLengthEncoding();
      const raw = fs.readFileSync(inPath);
      outBuf = rle.decompress(raw);
      decompressedFilename = `${base}_rle_dec${originalExt}`;
      break;
    }
    case "lz77": {
      const lz = new LZ77();
      const raw = fs.readFileSync(inPath);
      outBuf = lz.decompress(raw);
      decompressedFilename = `${base}_lz77_dec${originalExt}`;
      break;
    }
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  fs.writeFileSync(path.join(UPLOAD_DIR, decompressedFilename), outBuf);

  file.decompressions.push({
    algorithm,
    decompressedFilename,
    decompressedDate: new Date(),
  });
  await file.save();

  return {
    algorithm,
    decompressedFilename,
    originalSize: file.originalSize,
    decompressedSize: outBuf.length,
  };
}

export default router;
