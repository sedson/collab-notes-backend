const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownedNotes: { type:[String], default: [] },
  collabNotes: { type:[String], default: [] },
})

const User = mongoose.model('User', userSchema);
module.exports = User;
