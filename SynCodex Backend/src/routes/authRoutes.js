import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, refreshToken, logout } from "../controllers/authController.js";
import {verifyToken} from "../middlewares/authMiddleware.js";

const router = express.Router();

//Route for verifing users
router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access Granted", user: req.user });
});

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

//Route for forgot password
router.post("/forgot-password", forgotPassword);

//Route for reset password 
router.post("/reset-password", resetPassword);

//Route for refresh token
router.post("/refresh", refreshToken);

//Route for logout
router.post("/logout", logout);
export default router;
