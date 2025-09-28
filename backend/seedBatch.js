// seedBatch.js
const mongoose = require('mongoose');
const Batch = require('./models/Batch');
require('dotenv').config();
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const batch = new Batch({
    _id: new mongoose.Types.ObjectId('68d8bdbd73536f1a482d8588'),
    batchId: 'VC-20250928-01',
    herbName: 'Turmeric',
    farmer: {
      name: 'Ganesh Nayak',
      email: 'ganesh@example.com',
      village: 'Kalsanka',
      city: 'Udupi',
      pincode: '576101',
      state: 'Karnataka'
    },
    quantity: 100,
    unit: 'kg',
    harvestDate: Date.now(),
    certifications: ['Organic', 'Lab Tested'],
    additionalInfo: 'Harvested in early morning for best potency.',
    status: 'Collected',
    adminRemarks: 'Verified by admin.',
    manufacturerUpdate: {
      processingDetails: 'Dried and powdered in GMP facility.',
      remarks: 'Batch passed all quality checks.',
      storageLocation: 'Warehouse 3',
      batchNumber: 'BATCH-2025-09-28-01'
    }
  });
  await batch.save();
  console.log('Batch seeded!');
  mongoose.disconnect();
}

seed();
