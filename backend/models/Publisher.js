const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
  igdb_id: String,
  name: String
});

module.exports = mongoose.model('Publisher', PublisherSchema);
