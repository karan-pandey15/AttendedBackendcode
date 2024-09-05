import Ride from "../models/rideModel.js";

// Controller to create a new ride
export const createRide = async (req, res) => {
  const { name, email, pickupLocation, dropLocation } = req.body;

  try {
    const newRide = new Ride({
      name,
      email,
      pickupLocation,
      dropLocation,
    });

    await newRide.save();

    res.json({ success: true, message: "Ride details saved successfully!" });
  } catch (error) {
    console.error("Error saving ride details:", error);
    res.status(500).json({ success: false, message: "Failed to save ride details" });
  }
};




// Controller to fetch all rides
export const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rides" });
  }
};

// Controller to delete a ride
export const deleteRide = async (req, res) => {
  try {
    const rideId = req.params.id;
    await Ride.findByIdAndDelete(rideId);
    res.status(200).json({ success: true, message: "Ride deleted successfully" });
  } catch (error) {
    console.error("Error deleting ride:", error);
    res.status(500).json({ success: false, message: "Failed to delete ride" });
  }
};