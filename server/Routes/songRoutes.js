const express = require('express');
const router = express.Router();

// Corrected to lowercase 'controllers' to match your folder name exactly
const { getAllSongs, createSong } = require('../controllers/songController');

// GET /api/songs - Fetch all songs
router.get('/', getAllSongs);

// POST /api/songs - Add a new song
router.post('/', createSong);

module.exports = router;