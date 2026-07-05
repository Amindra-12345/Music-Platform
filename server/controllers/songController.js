const Song = require('../Models/Song');

// @desc    Get all songs in the system
// @route   GET /api/songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find({});
    res.status(200).json({ success: true, count: songs.length, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new song to the database
// @route   POST /api/songs
exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, duration, genre, audioUrl, imageUrl } = req.body;
    
    const newSong = await Song.create({
      title,
      artist,
      album,
      duration,
      genre,
      audioUrl,
      imageUrl
    });

    res.status(201).json({ success: true, data: newSong });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};