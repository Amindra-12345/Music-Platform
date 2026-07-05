// server/models/Track.js
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  genre: { 
    type: String, 
    required: true 
  },
  audioUrl: { 
    type: String, 
    required: true // This will store the local server file path (e.g., "uploads/song-123.mp3")
  },
  accessMode: { 
    type: String, 
    enum: ['open', 'approval'], 
    default: 'open' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);