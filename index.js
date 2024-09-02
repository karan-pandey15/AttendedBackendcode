import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./database/db.js";
import router from "./routes/user.route.js";

// const productRoutes = require('./routes/product.js');
import productRoutes from "./routes/product.js";

const server = express();

db;

server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON with a larger limit
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS configuration
const corsOptions = {
  origin: "https://marasimpex.com",
  methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
  credentials: true,
};

server.use(cors(corsOptions));

server.use("/api", router);

// Routes
server.use("/api/products", productRoutes);

const port = process.env.PORT || 5010;

server.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
