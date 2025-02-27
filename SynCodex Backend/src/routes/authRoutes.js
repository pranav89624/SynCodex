import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

export default router;
