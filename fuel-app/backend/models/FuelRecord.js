const mongoose = require('mongoose');

const fuelRecordSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    fuelAmount: {
      type: Number,
      required: [true, 'Fuel amount is required'],
      min: [0.01, 'Fuel amount must be greater than 0'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0.01, 'Price per unit must be greater than 0'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost cannot be negative'],
    },
    odometer: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      min: [0, 'Odometer reading must be positive'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    mileage: {
      type: Number,
      min: [0, 'Mileage must be positive'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user + vehicle queries
fuelRecordSchema.index({ userId: 1, vehicleId: 1, date: -1 });
fuelRecordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('FuelRecord', fuelRecordSchema);
