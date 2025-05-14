// import express from "express";
// import { createProject } from "../controllers/createProjectController.js";

// const router = express.Router();

// // For Create project - self coding
// router.post("/create-project", createProject);

// // router.patch("/update-project/:projectId", changeName);

// // router.delete("/delete-project", deleteAccount);

// // // For Create room - collab
// // router.post("/create-room", changePassword);
// // router.patch("/update-room/:roomId", changeName);
// // router.delete("/delete-room", deleteAccount);

// // // For Join room - pura room copy hoga host ka aur joiner ke db me save hoga
// // router.post("/join-room", changePassword);

// export default router;

import express from 'express';
import { createProjectFolderStructure, createProject, getMyProjects, getProjectDetails} from '../controllers/createProjectController.js';

const router = express.Router();

// Get all projects
router.get('/my-projects', getMyProjects);

// ✅ This matches '/api/projects/create-project'
router.post('/create-project', createProject);

// Get Specific Project Details
router.get('/project-details', getProjectDetails);

// create folder Structure 
router.post('/create-project-folder-structure',createProjectFolderStructure);


export default router;
