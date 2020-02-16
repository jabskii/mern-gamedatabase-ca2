const mongoose = require('mongoose');

const GameModesSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Game_modes', GameModesSchema);
