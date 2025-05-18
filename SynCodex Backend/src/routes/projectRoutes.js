import express from 'express';
import { createProjectFolder, createProject,createProjectFile, getMyProjects, getProjectDetails,getProjectFolderStructure, getProjectFileContent, saveProjectFileContent} from '../controllers/createProjectController.js';

const router = express.Router();

// Get all projects
router.get('/my-projects', getMyProjects);
// ✅ This matches '/api/projects/create-project'
router.post('/create-project', createProject);


// Get Specific Project Details
router.get('/project-details', getProjectDetails);
// create project folder
router.post('/create-project-folder',createProjectFolder);
// create project file
router.post('/create-project-file',createProjectFile);
// Get project folder structure
router.get('/project-folder-structure',getProjectFolderStructure);
// Get project file content
router.get('/project-file-content',getProjectFileContent);
// Save project file content
router.post('/save-project-file-content',saveProjectFileContent);


export default router;
