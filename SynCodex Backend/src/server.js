import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import contactRoutes from "./routes/contactRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json());


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);

// Root Endpoint (for testing)
app.get("/", (req, res) => {
  res.send("🔥 SynCodex Backend is Running! 🔥");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
