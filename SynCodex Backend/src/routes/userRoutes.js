import express from "express";
import { changePassword, changeName  } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/change-password", verifyToken, changePassword);
router.patch("/change-name", verifyToken, changeName);

export default router;
