// Batch.js
const mongoose = require('mongoose');


const ManufacturerUpdateSchema = new mongoose.Schema({
  processingDetails: String,
  remarks: String,
  storageLocation: String,
  batchNumber: String
});

const BatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  herbName: String,
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    description: String,
    village: String,
    city: String,
    pincode: String,
    state: String
  },
  quantity: Number,
  unit: String,
  harvestDate: Date,
  certifications: [String],
  additionalInfo: String,
  status: String,
  adminRemarks: String,
  manufacturerUpdate: ManufacturerUpdateSchema,
  blockchainTx: String
});

module.exports = mongoose.model('Batch', BatchSchema);
