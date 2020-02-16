const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  igdb_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  developer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Developer'
    }
  ],
  publisher: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publisher'
    }
  ],
  genre: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre'
    }
  ],
  platform: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform'
    }
  ],
  release_date: {
    type: String
  },
  game_modes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'game_modes'
    }
  ],
  metacritic_rating: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Game', GameSchema);
