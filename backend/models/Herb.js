// models/Herb.js
const mongoose = require('mongoose');

const HerbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  botanicalName: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  uses: [{ type: String }],
  parts: [{ type: String }], // Which parts of the herb are used
  properties: [{ type: String }], // Medicinal properties
  sustainabilityInfo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Herb', HerbSchema);