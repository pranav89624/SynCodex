import express from "express";
import { changePassword, changeName, changeEmail  } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/change-password", verifyToken, changePassword);
router.patch("/change-name", verifyToken, changeName);
router.patch("/change-email", verifyToken, changeEmail);

export default router;
