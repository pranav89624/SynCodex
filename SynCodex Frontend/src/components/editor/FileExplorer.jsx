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
import { debounce } from "lodash";

export const FileExplorer = ({
  openFiles,
  setOpenFiles,
  setActiveFile,
  yDoc,
  sessionName,
  roomOrProjectId,
}) => {
  const [expanded, setExpanded] = useState({});
  const location = useLocation();

  const isCollab =
    (location.pathname.includes("/collab") ||
      location.pathname.includes("/interview")) &&
    Boolean(roomOrProjectId);

  const [folders, setFolders] = useState([]);
  const yFoldersMap = yDoc?.getMap ? yDoc.getMap("folders") : null;

  const fetchFolderStructure = useCallback(async () => {
    if (isCollab) {
      const collabActions = JSON.parse(
        localStorage.getItem("collabActions") || "{}"
      );
      const { action, hostEmail } = collabActions[roomOrProjectId] || {};

      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms/room-folder-structure",
          {
            headers: {
              token: localStorage.getItem("token"),
              email:
                action === "joined" ? hostEmail : localStorage.getItem("email"),
              roomid: roomOrProjectId,
            },
          }
        );
        console.log("Room Folders :", response.data);
        setFolders(response.data); 
      } catch (error) {
        console.error("Error fetching room folder structure:", error);
      }
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
        setFolders(response.data); // ✅ Set folder for project
      } catch (error) {
        console.error("Error fetching project folder structure:", error);
      }
    }
  }, [isCollab, roomOrProjectId, yFoldersMap]);

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

  const handleAddFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    if (isCollab) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/rooms/create-room-folder",
          {
            folderName: folderName,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("email"),
              roomid: roomOrProjectId,
            },
          }
        );
        fetchFolderStructure();
        console.log("Room Folder Structure :: ", res.data);
      } catch (error) {
        console.error("Room Folder Creation Failed :", error);
      }
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

  };

  const handleAddFile = async () => {
    const folderName = prompt("Select folder:");
    if (!folderName) return;

    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    if (isCollab) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/rooms/create-room-file",
          {
            fileName: fileName,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("email"),
              roomid: roomOrProjectId,
              folderName: folderName,
            },
          }
        );
        fetchFolderStructure();
        console.log("Room File created :: ", res.data);

        if (res.status === 201) {
          setOpenFiles((prev) => [...prev, fileName]);
          setActiveFile(fileName);
        }
      } catch (error) {
        console.error("Room File Creation Failed :", error);
      }
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

        if (res.status === 201) {
          setOpenFiles((prev) => [...prev, fileName]);
          setActiveFile(fileName);
        }
      } catch (error) {
        console.error("Project File Creation Failed :", error);
      }
    }
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
          <span
            className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
            title={sessionName}
          >
            {sessionName}
          </span>
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

        <div className="space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-270px)] ">
          {folders.map((folder) => (
            <div key={folder.name} title={folder.name}>
              <div
                className="font-bold cursor-pointer text-white font-open-sans text-[16px] flex items-center gap-3 px-2"
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [folder.name]: !prev[folder.name],
                  }))
                }
              >
                <div>
                  {expanded[folder.name] ? (
                    <FolderOpen color="white" height={"20"} />
                  ) : (
                    <FolderClosed color="white" height={"20"} />
                  )}
                </div>
                <p className="truncate">{folder.name}</p>
              </div>
              {expanded[folder.name] &&
                folder.files.map((file) => (
                  <div
                    key={file.name}
                    className="ml-4 mt-1 px-2 py-1 rounded hover:bg-[#3d415ab2] cursor-pointer flex items-center text-white gap-1 font-open-sans font-semibold truncate"
                    title={file.name}
                    onClick={() => {
                      if (!openFiles.includes(file.name)) {
                        setOpenFiles([...openFiles, file.name]);
                      }
                      setActiveFile(file.name);
                    }}
                  >
                    <div>
                      <File color="white" height={"20"} />
                    </div>
                    <p className="truncate">{file.name}</p>
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
