const express = require('express');
const mongoose = require('mongoose');
const FuelRecord = require('../models/FuelRecord');
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All fuel record routes require authentication
router.use(authMiddleware);

// ========================
// GET /api/fuel-records
// ========================
router.get('/', async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, sortBy, order } = req.query;

    // Build filter
    const filter = { userId: req.user.id };
    if (vehicleId) filter.vehicleId = vehicleId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Build sort
    const sortField = sortBy || 'date';
    const sortOrder = order === 'asc' ? 1 : -1;

    const records = await FuelRecord.find(filter)
      .populate('vehicleId', 'name model licensePlate')
      .sort({ [sortField]: sortOrder });

    res.json(records);
  } catch (err) {
    console.error('Fetch fuel records error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========================
// GET /api/fuel-records/stats
// ========================
router.get('/stats', async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const matchFilter = { userId: new mongoose.Types.ObjectId(req.user.id) };
    if (vehicleId) matchFilter.vehicleId = new mongoose.Types.ObjectId(vehicleId);

    // Use MongoDB aggregation for statistics
    const stats = await FuelRecord.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$vehicleId',
          totalFuel: { $sum: '$fuelAmount' },
          totalCost: { $sum: '$totalCost' },
          avgPricePerUnit: { $avg: '$pricePerUnit' },
          avgMileage: { $avg: '$mileage' },
          recordCount: { $sum: 1 },
          maxOdometer: { $max: '$odometer' },
          minOdometer: { $min: '$odometer' },
          lastFillDate: { $max: '$date' },
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    console.error('Fuel stats error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========================
// GET /api/fuel-records/:id
// ========================
router.get('/:id', async (req, res) => {
  try {
    const record = await FuelRecord.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('vehicleId', 'name model licensePlate');

    if (!record) {
      return res.status(404).json({ message: 'Fuel record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Get fuel record error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========================
// POST /api/fuel-records
// ========================
router.post('/', async (req, res) => {
  const { vehicleId, fuelAmount, pricePerUnit, totalCost, odometer, date, notes, mileage } = req.body;

  if (!vehicleId) return res.status(400).json({ message: 'Vehicle ID is required' });
  if (!fuelAmount || fuelAmount <= 0) return res.status(400).json({ message: 'Valid fuel amount is required' });
  if (!pricePerUnit || pricePerUnit <= 0) return res.status(400).json({ message: 'Valid price per unit is required' });
  if (!odometer || odometer <= 0) return res.status(400).json({ message: 'Valid odometer reading is required' });

  try {
    // Verify the vehicle belongs to the user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or does not belong to you' });
    }

    const record = await FuelRecord.create({
      vehicleId,
      userId: req.user.id,
      fuelAmount,
      pricePerUnit,
      totalCost: totalCost || fuelAmount * pricePerUnit,
      odometer,
      date: date || new Date(),
      notes,
      mileage,
    });

    res.status(201).json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Add fuel record error:', err);
    res.status(500).json({ message: 'Error adding fuel record', error: err.message });
  }
});

// ========================
// PUT /api/fuel-records/:id
// ========================
router.put('/:id', async (req, res) => {
  try {
    const record = await FuelRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Fuel record not found' });
    }
    res.json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update fuel record error:', err);
    res.status(500).json({ message: 'Error updating fuel record', error: err.message });
  }
});

// ========================
// DELETE /api/fuel-records/:id
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const record = await FuelRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) {
      return res.status(404).json({ message: 'Fuel record not found' });
    }
    res.json({ message: 'Fuel record deleted successfully' });
  } catch (err) {
    console.error('Delete fuel record error:', err);
    res.status(500).json({ message: 'Error deleting fuel record', error: err.message });
  }
});

module.exports = router;
