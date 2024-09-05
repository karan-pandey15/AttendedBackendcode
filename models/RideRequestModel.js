// models/RideRequestModel.js
import mongoose from 'mongoose';

const rideRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider',
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);

export default RideRequest;
