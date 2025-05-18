import { db } from "../config/firebase.js";
import { nanoid } from "nanoid";

// Create project (uers -> email -> projects -> projectId)
export const createProject = async (req, res) => {
  try {
    const { token, email, name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name are required" });
    }

    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const projectId = nanoid(12);
    const projectData = {
      projectId,
      name,
      description: description || "",
      createdAt: new Date().toISOString(),
    };

    await userRef.collection("projects").doc(projectId).set(projectData);

    return res.status(201).json({ message: "Project created", projectId });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Projects
export const getMyProjects = async (req, res) => {
  const email = req.headers.email; // ✅ Read from headers

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const projectsRef = db
      .collection("users")
      .doc(email)
      .collection("projects");
    const snapshot = await projectsRef.get();

    const projects = snapshot.docs.map((doc) => ({
      projectId: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Get specific project detail by project id
export const getProjectDetails = async (req, res) => {
  const email = req.headers["email"];
  const projectId = req.headers["projectid"];

  if (!email || !projectId) {
    return res.status(400).json({ error: "Email and projectId are required" });
  }

  try {
    const projectRef = db
      .collection("users")
      .doc(email)
      .collection("projects")
      .doc(projectId);
    const snapshot = await projectRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectData = snapshot.data();
    console.log("Project details ✅✅: ", projectData);
    return res.status(200).json(projectData);
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({ error: "Failed to get project details" });
  }
};

// Create folder in db (project -> folderstructure collection)
export const createProjectFolder = async (req, res) => {
  try {
    const email = req.headers["email"];
    const projectId = req.headers["projectid"];
    const { folderName } = req.body;

    if (!email || !projectId || !folderName) {
      return res
        .status(400)
        .json({ error: "Email, projectId, and folderName are required" });
    }

    const folderRef = db
      .collection("users")
      .doc(email)
      .collection("projects")
      .doc(projectId)
      .collection("folderStructure")
      .doc(folderName);

    const folderSnap = await folderRef.get();

    if (folderSnap.exists) {
      return res.status(409).json({ error: "Folder already exists" });
    }

    // ✅ Create empty folder with name and empty files array
    await folderRef.set({
      name: folderName,
      files: [],
    });

    return res.status(201).json({ message: "Folder created" });
  } catch (error) {
    console.error("Error creating folder:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create project file in folder -> files[]
export const createProjectFile = async (req, res) => {
  try {
    const email = req.headers["email"];
    const projectId = req.headers["projectid"];
    const folderName = req.headers["foldername"];
    const { fileName } = req.body;

    if (!email || !projectId || !folderName || !fileName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const folderRef = db
    .collection("users")
    .doc(email)
    .collection("projects")
    .doc(projectId)
    .collection("folderStructure")
    .doc(folderName);
    
    const folderSnap = await folderRef.get();
    console.log("folder snap check :", folderSnap.data());
    
    if (!folderSnap.exists) {
      return res.status(404).json({ error: "Folder does not exist" });
    }
    
    const existingFiles = folderSnap.data().files || [];

    const extension = fileName.includes(".")
      ? fileName.split(".").pop().toLowerCase()
      : "plaintext";

    const language = extension || "plaintext";

    const fileId = nanoid(12);

    const newFile = {
      id: fileId,
      name: fileName,
      language,
      content: "", // initially empty
    };

    const updatedFiles = [...existingFiles, newFile];

    await folderRef.update({ files: updatedFiles });
    console.log("Updated Files ✅✅ ",updatedFiles);

    return res.status(201).json({ message: "File created", file: newFile });
  } catch (error) {
    console.error("Error creating file:", error);
    return res.status(500).json({ error: "Failed to create file" });
  }
};

// Get project folder structure by project id
export const getProjectFolderStructure = async (req, res) => {
  const email = req.headers["email"];
  const projectId = req.headers["projectid"];

  if (!email || !projectId) {
    return res.status(400).json({ error: "Email and projectId are required" });
  }

  try {
    const foldersRef = db
      .collection("users")
      .doc(email)
      .collection("projects")
      .doc(projectId)
      .collection("folderStructure");
    const folderSnapshot = await foldersRef.get();

    const folders = folderSnapshot.docs.map((doc) => ({
      folderName: doc.name,
      ...doc.data(),
    }));
    console.log("Folder ➡️➡️ ",folders);
    return res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching project folders:", error);
    return res.status(500).json({ error: "Failed to fetch project folders" });
  }
};


// Save project file content
export const saveProjectFileContent = async (req, res) => {
  try {
    const email = req.headers["email"];
    const projectId = req.headers["projectid"];
    const folderName = req.headers["foldername"];
    const fileName = req.headers["filename"];
    const { content } = req.body;

    console.log("✅✅✅✅ ",email,projectId,folderName,fileName,content);

    if (!email || !projectId || !folderName || !fileId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const folderRef = db
      .collection("users")
      .doc(email)
      .collection("projects")
      .doc(projectId)
      .collection("folderStructure")
      .doc(folderName);

    const folderSnap = await folderRef.get();

    if (!folderSnap.exists) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const files = folderSnap.data().files || [];

    const updatedFiles = files.map(file => {
      if (file.name === fileName) {
        return {
          ...file,
          content: content, // 📝 Update content here
        };
      }
      return file;
    });

    await folderRef.update({ files: updatedFiles });

    return res.status(200).json({ message: "File content saved successfully" });
  } catch (error) {
    console.error("Error saving file content:", error);
    return res.status(500).json({ error: "Failed to save file content" });
  }
};


// Get project active file content
export const getProjectFileContent = async (req, res) => {
  try {
    const email = req.headers["email"];
    const projectId = req.headers["projectid"];
    const folderName = req.headers["foldername"];
    const fileId = req.query.fileId;

    if (!email || !projectId || !folderName || !fileId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const folderRef = db
      .collection("users")
      .doc(email)
      .collection("projects")
      .doc(projectId)
      .collection("folderStructure")
      .doc(folderName);

    const folderSnap = await folderRef.get();

    if (!folderSnap.exists) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const files = folderSnap.data().files || [];
    const targetFile = files.find((file) => file.id === fileId);

    if (!targetFile) {
      return res.status(404).json({ error: "File not found" });
    }

    return res.status(200).json({ content: targetFile.content || "" });

  } catch (error) {
    console.error("❌ Error fetching file content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getProjectFileContent = async (req, res) => {
//   try {
//     const email = req.headers["email"];
//     const projectId = req.headers["projectid"];
//     const { folderName, fileName } = req.query;

//     console.log("✅✅✅✅ ",email,projectId,folderName,fileName);

//     if (!email || !projectId || !folderName || !fileName) {
//       return res.status(400).json({ error: "Missing parameters" });
//     }

//     const fileRef = db
//       .collection("users")
//       .doc(email)
//       .collection("projects")
//       .doc(projectId)
//       .collection("folderStructure")
//       .doc(folderName);

//     const folderSnap = await fileRef.get();

//     if (!folderSnap.exists) {
//       return res.status(404).json({ error: "Folder not found" });
//     }

//     const folderData = folderSnap.data();
//     const file = (folderData.files || []).find(f => f.name === fileName);

//     if (!file) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     return res.status(200).json({ content: file.content || "" });
//   } catch (error) {
//     console.error("Error fetching file content:", error);
//     return res.status(500).json({ error: "Failed to fetch file content" });
//   }
// };

