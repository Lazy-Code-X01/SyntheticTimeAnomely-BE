import asyncHandler from 'express-async-handler';
import File from '../models/fileModel.js';

// @desc    Upload a new file
// @route   POST /api/files
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  const file = new File({
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  const createdFile = await file.save();
  res.status(201).json(createdFile);
});

// @desc    Get all files
// @route   GET /api/files
// @access  Private
const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find({});
  res.json(files);
});

// @desc    Get file by ID
// @route   GET /api/files/:id
// @access  Private
const getFileById = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (file) {
    res.json(file);
  } else {
    res.status(404);
    throw new Error('File not found');
  }
});

export {
  uploadFile,
  getFiles,
  getFileById,
};
