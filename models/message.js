const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  connection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
