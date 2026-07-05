const express = require('express');
const router = express.Router();

// Corrected to lowercase 'controllers' here as well
const { createPlaylist, getUserPlaylists, addSongToPlaylist } = require('../controllers/playlistController');

// POST /api/playlists - Create a new playlist
router.post('/', createPlaylist);

// GET /api/playlists/:userId - Fetch all playlists for a specific user
router.get('/:userId', getUserPlaylists);

// PUT /api/playlists/:id/add - Add a song to a specific playlist
router.put('/:id/add', addSongToPlaylist);

module.exports = router;