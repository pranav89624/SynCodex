import React, { useState, useEffect, useRef } from "react";
import EditorNav from "./EditorNav";
import { FileExplorer } from "./FileExplorer";
import { FileTabs } from "./FileTabs";
import { PanelLeft, PanelRight } from "lucide-react";
import VideoCallSection from "../video_call/VideoCallSection";
import { CollabEditorPane } from "./CollabEditorPane";
import { useYjsProvider } from "../../hooks/useYjsProvider";

export default function CollabEditorLayout({
  roomId,
  isInterviewMode,
}) {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectName, setProjectName] = useState("Loading...");
  const { yDoc } = useYjsProvider(roomId);
  useEffect(() => {
    const raw = localStorage.getItem("synSession");
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

  return (
    <>
      <EditorNav />

      <div className="h-[calc(100vh-4rem)] flex overflow-x-clip bg-[#21232f]">
        <div
          className={`h-full bg-[#21232f] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-[255px]" : "w-0 overflow-hidden"
          }`}
        >
          {isSidebarOpen && (
            <FileExplorer
              yDoc={yDoc}
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
              setActiveFile={setActiveFile}
              roomId={roomId}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 h-full">
          <div className="bg-[#21232f] flex items-center border-b border-[#e4e6f3ab]">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-16 left-2 flex z-20 bg-[#3D415A] hover:opacity-90 cursor-pointer text-white p-2 rounded-md transition-all duration-300"
            >
              {isSidebarOpen ? (
                <PanelLeft height={20} width={20} />
              ) : (
                <PanelRight height={20} width={20} />
              )}
            </button>
            {!isSidebarOpen && (
              <span className="ml-10 text-white text-sm font-semibold border-r px-4 py-2 border-[#e4e6f3ab]">
                {projectName}
              </span>
            )}

            <FileTabs
              openFiles={openFiles}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setOpenFiles={setOpenFiles}
            />
          </div>

          <div className="flex h-full overflow-hidden">
            <div
              className="py-3 flex justify-center"
              style={{
                width: isInterviewMode ? "100%" : "70%",
                transition: isInterviewMode ? "none" : "width 0.3s ease",
              }}
            >
              <div
                className={`h-full editor-wrapper flex-1 ${
                  isSidebarOpen ? "max-w-[calc(100%-2%)]" : "w-full"
                }`}
              >
                <CollabEditorPane activeFile={activeFile} yDoc={yDoc}/>
              </div>
            </div>

            <div
              style={{
                width: isInterviewMode ? "auto" : "30%",
                flexShrink: 0,
                transition: isInterviewMode ? "none" : "width 0.3s ease",
              }}
            >
              <VideoCallSection roomIdVCS={roomId} isInterviewMode={isInterviewMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
