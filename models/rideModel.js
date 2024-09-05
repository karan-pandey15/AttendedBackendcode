import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,

  },
});

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
