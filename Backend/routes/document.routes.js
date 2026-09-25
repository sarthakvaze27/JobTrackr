import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createHash, randomUUID } from 'crypto';
import { Blob } from 'buffer';
import DocumentModel from '../models/document.js';
import { verifyToken } from '../utils/auth.middleware.js';

const router = Router();
router.use(verifyToken);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  },
});

function cloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }
  return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET };
}

function signCloudinaryParams(params, apiSecret) {
  const payload = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

async function uploadToCloudinary(file, userId) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `jobtrackr/${userId}/${randomUUID()}`;
  const signed = { public_id: publicId, timestamp };
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('public_id', publicId);
  form.append('timestamp', String(timestamp));
  form.append('api_key', apiKey);
  form.append('signature', signCloudinaryParams(signed, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, { method: 'POST', body: form });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || 'Cloudinary upload failed');
  return { url: result.secure_url, publicId: result.public_id };
}

async function deleteFromCloudinary(publicId) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { public_id: publicId, timestamp };
  const form = new FormData();
  form.append('public_id', publicId);
  form.append('timestamp', String(timestamp));
  form.append('api_key', apiKey);
  form.append('signature', signCloudinaryParams(signed, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/destroy`, { method: 'POST', body: form });
  const result = await response.json();
  if (!response.ok || (result.result !== 'ok' && result.result !== 'not found')) {
    throw new Error(result.error?.message || 'Cloudinary delete failed');
  }
}

// ── Helper: map file extension → fileType enum ───────────────────────────────
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf')              return 'PDF';
  if (ext === '.doc' || ext === '.docx') return 'DOCX';
  return 'Other';
}

// ── Helper: bytes → human readable ───────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── POST /api/documents ── upload a file to Cloudinary ───────────────────────
router.post('/', (req, res, next) => upload.single('file')(req, res, error => {
  if (error) {
    res.status(error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE' ? 413 : 400)
      .json({ message: error.message });
    return;
  }
  next();
}), async (req, res) => {
  let uploaded;
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { type, linkedJobId } = req.body;

    uploaded = await uploadToCloudinary(req.file, req.userId);
    const doc = new DocumentModel({
      userId:      req.userId,
      name:        req.file.originalname,
      type:        type ?? 'Other',
      fileType:    getFileType(req.file.originalname),
      linkedJobId: linkedJobId || null,
      size:        formatSize(req.file.size),
      url:         uploaded.url,
      publicId:    uploaded.publicId,
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    if (uploaded?.publicId) {
      try { await deleteFromCloudinary(uploaded.publicId); } catch { /* Keep original error for the response. */ }
    }
    const message = err instanceof Error ? err.message : 'Error uploading document';
    const status = message.startsWith('Cloudinary is not configured') ? 503 : 502;
    res.status(status).json({ message });
  }
});

// ── GET /api/documents ── fetch all docs for this user ───────────────────────
router.get('/', async (req, res) => {
  try {
    const docs = await DocumentModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// ── DELETE /api/documents/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!doc) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    if (doc.publicId) await deleteFromCloudinary(doc.publicId);
    else if (doc.url?.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), doc.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await doc.deleteOne();

    res.status(200).json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting document' });
  }
});

export default router;
