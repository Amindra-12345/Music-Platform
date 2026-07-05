const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    trim: true,
    default: 'Single'
  },
  duration: {
    type: Number, // Duration in seconds (e.g., 210 for 3:30)
    required: [true, 'Song duration is required']
  },
  genre: {
    type: String,
    trim: true
  },
  audioUrl: {
    type: String, // URL to the streaming audio source (Cloudinary/S3 or local path)
    trim: true
  },
  imageUrl: {
    type: String, // URL to the album cover art
    trim: true,
    default: 'https://via.placeholder.com/150' // Default fallback image
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Song', songSchema);