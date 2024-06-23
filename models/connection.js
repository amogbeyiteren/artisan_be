const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artisan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;
