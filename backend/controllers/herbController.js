// controllers/herbController.js
const Herb = require('../models/Herb');

// Get all herbs
exports.getAllHerbs = async (req, res) => {
  try {
    const herbs = await Herb.find().sort({ name: 1 });
    res.json(herbs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single herb by ID
exports.getHerbById = async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    res.json(herb);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create a new herb (admin only)
exports.createHerb = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    const newHerb = new Herb(req.body);
    const herb = await newHerb.save();
    res.json(herb);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing herb (admin only)
exports.updateHerb = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    const herb = await Herb.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!herb) {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    
    res.json(herb);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Delete a herb (admin only)
exports.deleteHerb = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }

  try {
    const herb = await Herb.findById(req.params.id);
    
    if (!herb) {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    
    await herb.remove();
    res.json({ msg: 'Herb removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Herb not found' });
    }
    res.status(500).send('Server Error');
  }
};