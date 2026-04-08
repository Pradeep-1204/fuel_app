const express = require('express');
const Vehicle = require('../models/Vehicle');
const FuelRecord = require('../models/FuelRecord');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All vehicle routes require authentication
router.use(authMiddleware);

// ========================
// GET /api/vehicles
// ========================
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error('Fetch vehicles error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========================
// GET /api/vehicles/:id
// ========================
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    console.error('Get vehicle error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========================
// POST /api/vehicles
// ========================
router.post('/', async (req, res) => {
  const { name, model, year, licensePlate } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Vehicle name is required' });
  }

  try {
    const vehicle = await Vehicle.create({
      userId: req.user.id,
      name: name.trim(),
      model: model || '',
      year,
      licensePlate: licensePlate || '',
    });

    res.status(201).json(vehicle);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Add vehicle error:', err);
    res.status(500).json({ message: 'Error adding vehicle', error: err.message });
  }
});

// ========================
// PUT /api/vehicles/:id
// ========================
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update vehicle error:', err);
    res.status(500).json({ message: 'Error updating vehicle', error: err.message });
  }
});

// ========================
// DELETE /api/vehicles/:id
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Also delete all fuel records for this vehicle
    await FuelRecord.deleteMany({ vehicleId: req.params.id, userId: req.user.id });

    res.json({ message: 'Vehicle and associated fuel records deleted successfully' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
  }
});

module.exports = router;
