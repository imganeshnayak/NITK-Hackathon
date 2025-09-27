// models/Harvest.js
const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    geoCoordinates: { type: String, required: true },
    village: { type: String, required: true },
    state: { type: String, required: true },
  },
  herb: {
    commonName: { type: String, required: true },
    botanicalName: { type: String },
    partUsed: { type: String },
    quantityKg: { type: Number, required: true },
  },
  harvest: {
    date: { type: Date, required: true },
    method: { type: String },
  },
  initialQuality: {
    moisturePercent: { type: Number },
    grading: { type: String },
    photoUrl: { type: String },
  },
  sustainability: {
    organicCertified: { type: Boolean, default: false },
    fairTrade: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['PendingVerification', 'Verified', 'Sold'],
    default: 'PendingVerification',
  },
}, { timestamps: true });

module.exports = mongoose.model('Harvest', HarvestSchema);