import { useEffect, useState } from "react";
import {
  FilePlus,
  FolderPlus,
  FolderClosed,
  FolderOpen,
  File,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import * as Y from "yjs";

export const FileExplorer = ({ openFiles, setOpenFiles, setActiveFile, yDoc, roomId }) => { 
  const [expanded, setExpanded] = useState({});
  const [projectName, setProjectName] = useState("Loading...");
  const location = useLocation();
  
  const isCollab = (location.pathname.includes("/collab") || location.pathname.includes("/interview")) && Boolean(roomId);

  const [folders, setFolders] = useState(isCollab ? [] : JSON.parse(localStorage.getItem("synProjectFolders") || "[]"));
  const yFoldersMap = yDoc?.getMap ? yDoc.getMap("folders") : null;

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


  useEffect(() => {
    const raw =
      location.pathname === "/editor"
        ? localStorage.getItem("synProject")
        : localStorage.getItem("synSession");

    try {
      const parsed = raw ? JSON.parse(raw) : {};
      setProjectName(parsed.name || "Untitled");
    } catch {
      setProjectName("Untitled");
    }
  }, [location.pathname]);

  const handleAddFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    if (isCollab) {
      if (yFoldersMap.has(name)) return;
      yFoldersMap.set(name, { files: [] });
    } else {
      if (folders.some(f => f.name === name)) return;
      const newFolders = [...folders, { name, files: [] }];
      setFolders(newFolders);
      localStorage.setItem("synProjectFolders", JSON.stringify(newFolders));
    }
  };

  const handleAddFile = () => {
    const folderName = prompt("Select folder:");
    if (!folderName) return;

    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    if (isCollab) {
      if (!yFoldersMap.has(folderName)) return;
      const folder = yFoldersMap.get(folderName);
      folder.files.push({
        name: fileName,
        content: "",
        language: fileName.split(".").pop(),
      });
      yFoldersMap.set(folderName, folder);
    } else {
      const updatedFolders = folders.map(folder =>
        folder.name === folderName
          ? {
              ...folder,
              files: [
                ...folder.files,
                {
                  name: fileName,
                  content: "",
                  language: fileName.split(".").pop(),
                },
              ],
            }
          : folder
      );
      setFolders(updatedFolders);
      localStorage.setItem("synProjectFolders", JSON.stringify(updatedFolders));
    }

    setOpenFiles((prev) => [...prev, fileName]);
    setActiveFile(fileName);
  };

  return (
    <div className="text-sm border-r border-[#e4e6f3ab] min-w-[255px] max-w-[255px] h-full bg-[#21232f]">
      <div className="sidebar-header px-4 py-2 h-20 text-white text-lg font-semibold flex items-end border-b border-[#e4e6f3ab]">
        {projectName}
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

      <div className="space-y-2">
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
  );
};
