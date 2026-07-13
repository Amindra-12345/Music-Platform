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
    required: true // Storing the local path e.g., "uploads/1718293-song.mp3"
  },
  accessMode: { 
    type: String, 
    enum: ['open', 'approval'], 
    default: 'open' 
  }
}, { timestamps: true });

// Exporting as 'Track' matches our route controllers perfectly
module.exports = mongoose.model('Track', trackSchema);