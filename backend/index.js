// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // To parse JSON bodies, increased limit

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/harvests', require('./routes/harvests'));
app.use('/api/herbs', require('./routes/herbs'));
app.use('/api/farmer', require('./routes/farmerProfile'));
app.use('/api/batches', require('./routes/batches'));

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});