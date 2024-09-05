import express from "express";
import { createRide, deleteRide, getAllRides } from "../controllers/rideController.js";

const router = express.Router();

// Route to handle new ride creation
router.post("/", createRide);

// Route to fetch all rides
router.get("/completeridesdata", getAllRides);

// Route to delete a ride
router.delete("/completeridesdata/:id", deleteRide);

export default router;
