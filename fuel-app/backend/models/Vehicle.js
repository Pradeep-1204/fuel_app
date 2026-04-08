const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    licensePlate: {
      type: String,
      required: [true, 'License plate is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for user-based queries
vehicleSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
