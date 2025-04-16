import { useState, useEffect } from "react";

export const FileExplorer = ({ openFiles, setOpenFiles, setActiveFile }) => {
  const [folders, setFolders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [projectName, setProjectName] = useState("Loading...");

  useEffect(() => {
    const raw = localStorage.getItem("synProject");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProjectName(parsed.name || "Untitled Project");
      } catch (error) {
        console.error("Failed to parse project data:", error);
        setProjectName("Untitled Project");
      }
    } else {
      setProjectName("Untitled Project");
    }
  }, []);

  const handleAddFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name || folders.find((f) => f.name === name)) return;
    setFolders([...folders, { name, files: [] }]);
    setExpanded({ ...expanded, [name]: true });
  };

  const handleAddFile = () => {
    if (folders.length === 0) {
      alert("Please create a folder first.");
      return;
    }

    const folderName = prompt(
      `Select folder to place file:\n${folders.map((f) => f.name).join(", ")}`
    );
    const folder = folders.find((f) => f.name === folderName);
    if (!folder) return;

    const fileName = prompt("Enter file name (e.g. index.html):");
    if (!fileName) return;

    const newFile = {
      name: fileName,
      content: "",
      language: fileName.endsWith(".html")
        ? "html"
        : fileName.endsWith(".css")
        ? "css"
        : "javascript",
    };

    const updatedFolders = folders.map((f) =>
      f.name === folderName ? { ...f, files: [...f.files, newFile] } : f
    );

    setFolders(updatedFolders);
    setOpenFiles([...openFiles, fileName]);
    setActiveFile(fileName);
  };

  const handleToggleFolder = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="text-sm border-r border-[#e4e6f3ab] min-w-[255px] max-w-[255px] h-full bg-[#21232f]">
       <div className="sidebar-header px-4 py-2 h-20 text-white text-lg font-semibold flex items-end">
        {projectName}
       </div>
      <div className="flex justify-between mb-4">
        <button
          className="text-xs bg-[#506DFF] w-full py-1 mb-2 rounded hover:bg-[#3D415A]"
          onClick={handleAddFolder}
        >
          + Folder
        </button>
        <button
          className="text-xs bg-[#506DFF] w-full py-1 rounded hover:bg-[#3D415A]"
          onClick={handleAddFile}
        >
          + File
        </button>
      </div>

      {/* Folder/File Tree */}
      <div className="space-y-2">
        {folders.map((folder) => (
          <div key={folder.name}>
            <div
              className="font-semibold cursor-pointer text-cyan-300"
              onClick={() => handleToggleFolder(folder.name)}
            >
              {expanded[folder.name] ? "📂" : "📁"} {folder.name}
            </div>

            {expanded[folder.name] &&
              folder.files.map((file) => (
                <div
                  key={file.name}
                  className="ml-4 mt-1 px-2 py-1 rounded hover:bg-[#3D415A] cursor-pointer"
                  onClick={() => {
                    if (!openFiles.includes(file.name)) {
                      setOpenFiles([...openFiles, file.name]);
                    }
                    setActiveFile(file.name);
                  }}
                >
                  📄 {file.name}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
