const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// 🌟 Added getArtistTracks to the controller imports
const { uploadTrack, getAllTracks, getArtistTracks } = require('../controllers/trackController');
const { protect, authorizeRoles } = require('../Middleware/auth.js');

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Saves files into your server/uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to ensure only audio files are accepted
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes definitions
router.post('/upload', protect, authorizeRoles('artist'), upload.single('audio'), uploadTrack);
router.get('/', protect, getAllTracks);

// 🔍 🌟 Fetch all tracks belonging to the logged-in artist
router.get('/my-catalog', protect, authorizeRoles('artist'), getArtistTracks);

module.exports = router;