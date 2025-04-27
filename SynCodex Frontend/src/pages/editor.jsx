import React, { useState, useEffect } from "react";
import { FileTabs } from "../components/editor/FileTabs";
import { FileExplorer } from "../components/editor/FileExplorer";
import { EditorPane } from "../components/editor/EditorPane";
import EditorNav from "../components/editor/EditorNav";
import { PanelLeft, PanelRight } from 'lucide-react';

export default function EditorPage() {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  

  return (
    <>

      <EditorNav />

      <div className="h-[calc(100vh-4rem)] flex overflow-x-clip bg-[#21232f]">
       
        <div
          className={`h-full bg-[#21232f] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-[255px]' : 'w-0 overflow-hidden'
          }`}
        >
          {isSidebarOpen && <FileExplorer
            openFiles={openFiles}
            setOpenFiles={setOpenFiles}
            setActiveFile={setActiveFile}
          />}
        </div>

        <div className="flex flex-col flex-1 h-full">
          <div className="bg-[#21232f] flex items-center border-b border-[#e4e6f3ab]">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-16 left-0 flex z-20 bg-[#3D415A] hover:opacity-90 cursor-pointer text-white p-2 rounded-md transition-all duration-300"
            >
              {isSidebarOpen ? <PanelLeft height={20}width={20}/> : <PanelRight height={20}width={20} /> }
            </button>
              {
                !isSidebarOpen &&
                  <span className="ml-10 text-white text-sm font-semibold border-r px-4 py-2 border-[#e4e6f3ab]">{projectName}</span>
              }

            <FileTabs
              openFiles={openFiles}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setOpenFiles={setOpenFiles}
            />
          </div>
          <div className="pt-3 pb-3 pr-2 h-full w-full flex justify-center">
            <div className={`h-full editor-wrapper flex-1 ${isSidebarOpen ? 'max-w-[calc(100%-2%)]' : 'w-full'}`}>
              <EditorPane activeFile={activeFile} />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
