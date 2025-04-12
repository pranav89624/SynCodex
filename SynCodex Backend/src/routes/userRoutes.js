import express from "express";
import { changePassword } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/change-password", verifyToken, changePassword);

export default router;
