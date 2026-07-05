// Ensure import case matches the actual filesystem path to avoid casing conflicts
const Playlist = require('../Models/playlist');

// @desc    Create a brand new playlist
// @route   POST /api/playlists
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, user, isPublic } = req.body;

    const playlist = await Playlist.create({
      name,
      description,
      user, // The ObjectId of the user creating it
      isPublic,
      songs: [] // Starts empty
    });

    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all playlists belonging to a specific user
// @route   GET /api/playlists/:userId
exports.getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // .populate('songs') fetches full song records instead of just their string IDs
    const playlists = await Playlist.find({ user: userId }).populate('songs');
    
    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a track into an existing playlist
// @route   PUT /api/playlists/:id/add
exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const { songId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Check if the song is already added to prevent duplicates
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: 'Song already exists in this playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();
    
    // Populate the song details before sending back the response
    await playlist.populate('songs');

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};