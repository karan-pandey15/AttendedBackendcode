import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./database/db.js"; 
import http from 'http';
import { Server } from 'socket.io';

import riderRoutes from "./routes/RiderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import rideRoutes from "./routes/rideRoutes.js" 
// app.use('/api', userRoutes);
// const productRoutes = require('./routes/product.js');
import productRoutes from "./routes/product.js";

const app = express();

db;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON with a larger limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration
const corsOptions = {
  origin: "https://marasimpex.com",
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
  credentials: true,
};


// Create an HTTP server and setup socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity; adjust as needed
        methods: ["GET", "POST"]
    }
});


app.use(cors(corsOptions));

// app.use("/api", router);

// Routes
app.use("/api/products", productRoutes);


// Attended Routes 

app.use('/api/users', riderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', riderRoutes);
app.use('/api', riderRoutes);

app.use('/api/auth', userRoutes);

app.use('/api/otp', otpRoutes);  
app.use("/api/rides",rideRoutes );
app.use("/api",rideRoutes );





// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Handle ride request
    socket.on('rideRequest', (userData) => {
        // Emit the new ride request to all riders
        io.emit('newRideRequest', { ...userData, socketId: socket.id });
    });
  
    // Handle accepting a ride
    socket.on('acceptRide', (rideDetails) => {
        if (rideDetails.userDetails) {
            // Emit to the user that their ride has been accepted
            io.to(rideDetails.userSocketId).emit('rideAccepted', {
                ...rideDetails,
                driverName: rideDetails.riderName,  // Send rider's name to the user
                driverEmail: rideDetails.riderEmail // Send rider's email to the user
            });
            
            // Emit to all riders to remove this request
            io.emit('removeRideRequest', rideDetails.userSocketId);
  
            // Emit the accepted ride details to the rider who accepted it
            io.to(socket.id).emit('acceptedRideDetails', rideDetails);
        } else {
            console.error('userDetails is undefined in rideDetails:', rideDetails);
        }
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
  });


const port = process.env.PORT || 5010;

server.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
