const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
  igdb_id: String,
  name: String
});

module.exports = mongoose.model('Developer', DeveloperSchema);
