const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  owner: {type: String, required: true, default: "none"},
  authorizedEditors: { type: [String], default: [] },
  createdAt: Number,
  editedAt: Number,
})

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
