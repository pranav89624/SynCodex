import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); 
app.use(bodyParser.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/projects", projectRoutes);

// Root Endpoint (for testing)
app.get("/", (req, res) => {
  res.send("🔥 SynCodex Backend is Running! 🔥");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
