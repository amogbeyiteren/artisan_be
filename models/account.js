// Example account model for managing user accounts
// Modify according to your application's requirements
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
