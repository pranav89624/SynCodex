import express from "express";
import {
  createRoom,
  getMyRooms,
  getRoomDetails,
  createRoomFolder,
  createRoomFile,
  getRoomFolderStructure,
  updateRoomFileContent,
} from "../controllers/createRoomController.js";

const router = express.Router();

// Get all rooms (collab + interview)
router.get("/my-rooms", getMyRooms);
// ✅ create new room (c+i)
router.post("/create-room", createRoom);

// Get Specific Room Details
router.get("/room-details", getRoomDetails);

// create room folder
router.post("/create-room-folder", createRoomFolder);

// create room file
router.post("/create-room-file", createRoomFile);

// Get room folder structure
router.get("/room-folder-structure", getRoomFolderStructure);

//update room file content
router.put("/update-file-content", updateRoomFileContent);

export default router;
