// models/Batch.js
const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  herbName: { type: String, required: true },
  location: { type: String, required: true },
  farmer: {
    type: mongoose.Schema.Types.ObjectId, // Links to the User who created it
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  // This will later hold the link to QR code, lab reports etc.
  metadataURI: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema); 