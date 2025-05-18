import { db } from "../config/firebase.js";
import { nanoid } from "nanoid";

// Create room (uers -> email -> rooms -> roomId)
export const createRoom = async (req, res) => {
  try {
    const {
      token,
      email,
      roomId,
      name,
      description,
      isInterviewMode,
      invitedPeople,
    } = req.body;

    if (!name || !roomId) {
      return res
        .status(400)
        .json({ error: "Project name and roomId are required" });
    }

    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const createdAt = new Date().toISOString();

    const roomData = {
      roomId,
      name,
      description: description || "",
      isInterviewMode: isInterviewMode || false,
      invitedPeople: invitedPeople || [],
      createdAt,
    };

    // Save room under user's collection
    await userRef.collection("rooms").doc(roomId).set(roomData);

    // ✅ Save to top-level "allRooms" collection
    const allRoomData = {
      email,
      isInterviewMode: isInterviewMode || false,
      createdAt,
    };
    await db.collection("allRooms").doc(roomId).set(allRoomData);

    return res
      .status(201)
      .json({ message: "Room created", roomId, roomData });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const createRoom = async (req, res) => {
//   try {
//     const {
//       token,
//       email,
//       roomId,
//       name,
//       description,
//       isInterviewMode,
//       invitedPeople,
//     } = req.body;


//     if (!name || !roomId) {
//       return res
//       .status(400)
//       .json({ error: "Project name, roomId are required" });
//     }
    
//     const userRef = db.collection("users").doc(email);
//     const userSnap = await userRef.get();

//     if (!userSnap.exists) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const roomData = {
//       roomId,
//       name,
//       description: description || "",
//       isInterviewMode: isInterviewMode,
//       invitedPeople: invitedPeople || [],
//       createdAt: new Date().toISOString(),
//     };
    
//     await userRef.collection("rooms").doc(roomId).set(roomData);

//     return res
//       .status(201)
//       .json({ message: "Room created", roomId,roomData});
//   } catch (error) {
//     console.error("Error creating room:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Get All Rooms
export const getMyRooms = async (req, res) => {
  const email = req.headers.email; // ✅ Read from headers

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const roomsRef = db
      .collection("users")
      .doc(email)
      .collection("rooms");
    const snapshot = await roomsRef.get();

    const rooms = snapshot.docs.map((doc) => ({
      roomId: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// Get specific room detail by roomid
export const getRoomDetails = async (req, res) => {
  const email = req.headers["email"];
  const roomId = req.headers["roomid"];

  if (!email || !roomId) {
    return res.status(400).json({ error: "Email and roomId are required" });
  }

  try {
    const roomRef = db
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId);
    const snapshot = await roomRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: "Room not found" });
    }

    const roomData = snapshot.data();
    console.log("Room details ✅✅: ", roomData);
    return res.status(200).json(roomData);
  } catch (error) {
    console.error("Error fetching room details:", error);
    return res.status(500).json({ error: "Failed to get room details" });
  }
};

// Create folder in db (room -> folderstructure collection)
export const createRoomFolder = async (req, res) => {
  try {
    const email = req.headers["email"];
    const roomId = req.headers["roomid"];
    const { folderName } = req.body;

    if (!email || !roomId || !folderName) {
      return res
        .status(400)
        .json({ error: "Email, roomId, and folderName are required" });
    }

    const folderRef = db
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
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

// Create room file in folder -> files[]
export const createRoomFile = async (req, res) => {
  try {
    const email = req.headers["email"];
    const roomId = req.headers["roomid"];
    const folderName = req.headers["foldername"];
    const { fileName } = req.body;

    if (!email || !roomId || !folderName || !fileName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const folderRef = db
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(roomId)
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

// Get room folder structure by roomid
export const getRoomFolderStructure = async (req, res) => {
  const email = req.headers["email"];
  const roomId = req.headers["roomid"];

  if (!email || !roomId) {
    return res.status(400).json({ error: "Email and roomId are required" });
  }

  try {
    const foldersRef = db
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .collection("folderStructure");

    const folderSnapshot = await foldersRef.get();

    const folders = folderSnapshot.docs.map((doc) => ({
      folderName: doc.name,
      ...doc.data(),
    }));
    console.log("Folder ➡️➡️ ",folders);
    return res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching room folders:", error);
    return res.status(500).json({ error: "Failed to fetch room folders" });
  }
};


// Delete room from user's email and also allRooms collection
export const deleteRoom = async (req, res) => {
  try {
    const email = req.headers["email"];
    const roomId = req.headers["itemid"];

    console.log("✅✅✅ ", email, roomId);
    if (!email || !roomId) {
      return res.status(400).json({ error: "Email and roomId are required" });
    }

    const roomRef = db.collection("users").doc(email).collection("rooms").doc(roomId);
    const allRoomRef = db.collection("allRooms").doc(roomId);

    // Check if room exists under user
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return res.status(404).json({ error: "Room not found for this user" });
    }

    // Delete from user's rooms
    await roomRef.delete();

    // Optionally delete from allRooms collection
    const allRoomSnap = await allRoomRef.get();
    if (allRoomSnap.exists) {
      await allRoomRef.delete();
    }

    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update entire room folder structure (save changes to db (folder file)) ❤️❤️❤️ working me nahi hai
// export const updateRoomFolderStructure = async (req, res) => {
//   try {
//     const email = req.headers["email"];
//     const roomId = req.headers["roomid"];
//     const { folders } = req.body;

//     if (!email || !roomId || !folders) {
//       return res.status(400).json({ error: "Email, roomId, and folders are required" });
//     }

//     const foldersRef = db
//       .collection("users")
//       .doc(email)
//       .collection("rooms")
//       .doc(roomId)
//       .collection("folderStructure");

//     // 🔥 Delete all existing folders first
//     const existingFoldersSnap = await foldersRef.get();
//     const batch = db.batch();

//     existingFoldersSnap.forEach((doc) => {
//       batch.delete(doc.ref);
//     });

//     // 🔥 Add updated folders
//     folders.forEach((folder) => {
//       const folderRef = foldersRef.doc(folder.name);
//       batch.set(folderRef, {
//         name: folder.name,
//         files: folder.files || [],
//       });
//     });

//     await batch.commit();

//     return res.status(200).json({ message: "Room structure updated successfully" });
//   } catch (error) {
//     console.error("Error updating room structure:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };