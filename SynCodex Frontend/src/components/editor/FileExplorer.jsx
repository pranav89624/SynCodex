import { useEffect, useState, useCallback } from "react";
import {
  FilePlus,
  FolderPlus,
  FolderClosed,
  FolderOpen,
  File,
  Download,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";

export const FileExplorer = ({
  openFiles,
  setOpenFiles,
  setActiveFile,
  yDoc,
  roomId,
  sessionName,
  roomOrProjectId,
}) => {
  const [expanded, setExpanded] = useState({});
  // const [projectName, setProjectName] = useState("Loading...");
  const location = useLocation();

  const isCollab =
    (location.pathname.includes("/collab") ||
      location.pathname.includes("/interview")) &&
    Boolean(roomId);

  const [folders, setFolders] = useState([]);
  // const [folders, setFolders] = useState(isCollab ? [] : JSON.parse(localStorage.getItem("synProjectFolders") || "[]"));
  const yFoldersMap = yDoc?.getMap ? yDoc.getMap("folders") : null;

  const fetchFolderStructure = useCallback(async () => {
    if (isCollab) {
      //
    } else {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/projects/project-folder-structure",
          {
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("email"),
              projectid: roomOrProjectId,
            },
          }
        );
        console.log("Project Folders :", response.data);
        setFolders(response.data); // ✅ Store in state
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  }, [isCollab, roomOrProjectId]);

  useEffect(() => {
    fetchFolderStructure();
  }, [fetchFolderStructure]);

  useEffect(() => {
    if (!isCollab || !yFoldersMap) return;

    const updateFolders = () => {
      const entries = Array.from(yFoldersMap.entries()).map(([name, data]) => ({
        name,
        files: data.files || [],
      }));
      setFolders(entries);
    };

    yFoldersMap.observeDeep(updateFolders);
    updateFolders();

    return () => yFoldersMap.unobserveDeep(updateFolders);
  }, [isCollab, yFoldersMap]);

  // useEffect(() => {
  //   if (location.pathname === "/editor") {
  //     const raw = localStorage.getItem("synProject");
  //     try {
  //       const parsed = raw ? JSON.parse(raw) : {};
  //       setProjectName(parsed.name || "Untitled");
  //     } catch {
  //       setProjectName("Untitled");
  //     }
  //   } else {
  //     setProjectName(sessionName);
  //   }
  // }, [location.pathname, sessionName]);

  const handleAddFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    if (isCollab) {
      // collab room create api
      console.log("Collab chalue hai");
    } else {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/projects/create-project-folder",
          {
            folderName: folderName,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("email"),
              projectid: roomOrProjectId,
            },
          }
        );
        fetchFolderStructure();
        console.log("Project Folder Structure :: ", res.data);
      } catch (error) {
        console.error("Project Folder Creation Failed :", error);
      }
    }

    // if (isCollab) {
    //   if (yFoldersMap.has(name)) return;
    //   yFoldersMap.set(name, { files: [] });
    // } else {
    //   if (folders.some(f => f.name === name)) return;
    //   const newFolders = [...folders, { name, files: [] }];
    //   setFolders(newFolders);
    //   localStorage.setItem("synProjectFolders", JSON.stringify(newFolders));
    // }
  };

  const handleAddFile = async() => {
    const folderName = prompt("Select folder:");
    if (!folderName) return;

    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    if (isCollab) {
      // collab room create api
      console.log("Collab chalue hai");
    } else {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/projects/create-project-file",
          {
            fileName: fileName,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("email"),
              projectid: roomOrProjectId,
              folderName: folderName,
            },
          }
        );
        fetchFolderStructure();
        console.log("Project File created :: ", res.data);
        if (res.status === 200) {
          setOpenFiles((prev) => [...prev, fileName]);
          setActiveFile(fileName);
        }
      } catch (error) {
        console.error("Project File Creation Failed :", error);
      }
    }

    // if (isCollab) {
    //   if (!yFoldersMap.has(folderName)) return;
    //   const folder = yFoldersMap.get(folderName);
    //   folder.files.push({
    //     name: fileName,
    //     content: "",
    //     language: fileName.split(".").pop(),
    //   });
    //   yFoldersMap.set(folderName, folder);
    // } else {
    //   const updatedFolders = folders.map((folder) =>
    //     folder.name === folderName
    //       ? {
    //           ...folder,
    //           files: [
    //             ...folder.files,
    //             {
    //               name: fileName,
    //               content: "",
    //               language: fileName.split(".").pop(),
    //             },
    //           ],
    //         }
    //       : folder
    //   );
    //   setFolders(updatedFolders);
    //   localStorage.setItem("synProjectFolders", JSON.stringify(updatedFolders));
    // }

  };

  const handleDownloadSession = async () => {
    const zip = new JSZip();

    for (const folder of folders) {
      for (const file of folder.files) {
        const filePath = `${folder.name}/${file.name}`;
        let content = "";

        if (yDoc) {
          const yText = yDoc.getText(file.name);
          content = yText.toString();
        } else {
          content = localStorage.getItem(`file-${file.name}`) || "";
        }

        zip.file(filePath, content);
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const zipName = sessionName || "synCodex-session";

    saveAs(blob, `${zipName}.zip`);
  };

  return (
    <div className="text-sm border-r border-[#e4e6f3ab] min-w-[255px] max-w-[255px] flex flex-col justify-between h-full bg-[#21232f]">
      <div>
        <div className="sidebar-header px-4 py-2 h-20 text-white text-lg font-semibold flex items-end border-b border-[#e4e6f3ab]">
          {sessionName}
        </div>
        <div className="flex justify-end gap-4 px-10 mb-4 border-b border-[#e4e6f3ab]">
          <button
            className="p-2 rounded-sm cursor-pointer hover:bg-[#3D415A]"
            onClick={handleAddFile}
          >
            <FilePlus color="white" height={24} />
          </button>
          <button
            className="p-2 rounded-sm cursor-pointer hover:bg-[#3D415A]"
            onClick={handleAddFolder}
          >
            <FolderPlus color="white" height={24} />
          </button>
        </div>

        <div className="space-y-2 flex flex-col overflow-auto">
          {folders.map((folder) => (
            <div key={folder.name}>
              <div
                className="font-bold cursor-pointer text-white font-open-sans text-[16px] flex items-center gap-3 px-2"
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [folder.name]: !prev[folder.name],
                  }))
                }
              >
                {expanded[folder.name] ? (
                  <FolderOpen color="white" height={"20"} />
                ) : (
                  <FolderClosed color="white" height={"20"} />
                )}{" "}
                {folder.name}
              </div>
              {expanded[folder.name] &&
                folder.files.map((file) => (
                  <div
                    key={file.name}
                    className="ml-4 mt-1 px-2 py-1 rounded hover:bg-[#3d415ab2] cursor-pointer flex items-center text-white gap-1 font-open-sans font-semibold"
                    onClick={() => {
                      if (!openFiles.includes(file.name)) {
                        setOpenFiles([...openFiles, file.name]);
                      }
                      setActiveFile(file.name);
                    }}
                  >
                    <File color="white" height={"20"} /> {file.name}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-2 border-t border-[#e4e6f3ab] flex flex-col gap-2 justify-center items-center">
        <button
          onClick={handleDownloadSession}
          className="p-2 rounded-sm cursor-pointer text-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#3D415A] text-white w-[10rem]"
        >
          <Download /> Download
        </button>
      </div>
    </div>
  );
};
