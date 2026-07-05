// server/controllers/trackController.js
const Track = require('../Models/Track');

// @desc    Upload a new track (Artists only)
// @route   POST /api/tracks/upload
exports.uploadTrack = async (req, res) => {
  try {
    const { title, genre, accessMode } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an audio file' });
    }

    const track = await Track.create({
      title,
      genre,
      accessMode,
      audioUrl: req.file.path, // Saves the path where Multer stored the file
      artist: req.user.id // Taken directly from our protect middleware token
    });

    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all available tracks
// @route   GET /api/tracks
exports.getAllTracks = async (req, res) => {
  try {
    // Populate fetches the artist's name and email instead of just showing a raw ID
    const tracks = await Track.find().populate('artist', 'name email');
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};