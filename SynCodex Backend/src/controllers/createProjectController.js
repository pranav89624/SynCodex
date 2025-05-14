import { db } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";

// Create project (uers - email - projects - projectId)
export const createProject = async (req, res) => {
  try {
    const { token, email, name, description } = req.body;
    // const email = req.user.email;

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

export const getProjectDetails = async (req, res) => {
  // const email = req.headers.email; // ✅ Read from headers
  // const projectId = req.headers.projectid;

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

export const createProjectFolderStructure = async (req, res) => {
  try {
    // const { email, projectId } = req.headers;
    const email = req.headers["email"];
    const projectId = req.headers["projectid"];
    const { folderName, files = [] } = req.body;

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

    // If folder exists, update files
    // if (folderSnap.exists) {
    //   const existingData = folderSnap.data();
    //   const updatedFiles = [...(existingData.files || []), ...files];

    //   await folderRef.update({ files: updatedFiles });
    //   console.log("Folder create data ✅✅ : ",folderSnap.data());
    // } else {
    //   // Folder doesn't exist, create new
    //   await folderRef.set({
    //     name: folderName,
    //     files: files || [],
    //   });
    //   console.log("Folder create data ✅✅ : ",folderSnap.data());
    // }

    if (folderSnap.exists) {
  const existingData = folderSnap.data();
  const updatedFiles = [...(existingData.files || []), ...files];
  await folderRef.update({ files: updatedFiles });

  // Re-fetch updated snapshot
  const updatedSnap = await folderRef.get();
  return res.status(200).json(updatedSnap.data());
} else {
  await folderRef.set({
    name: folderName,
    files: files || [],
  });

  // Fetch after creation
  const newSnap = await folderRef.get();
  return res.status(200).json(newSnap.data());
}


    // return res.status(200).json(folderSnap.data());
    // return res.status(200).json({ message: "Folder structure created successfully" });
  } catch (error) {
    console.error("Error updating folder structure:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
