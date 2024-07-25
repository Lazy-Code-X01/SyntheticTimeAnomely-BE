import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  uploadFile,
  getFiles,
  getFileById,
} from '../controllers/fileControllers.js';

const router = express.Router();

router.post('/', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFileById);

export default router;
