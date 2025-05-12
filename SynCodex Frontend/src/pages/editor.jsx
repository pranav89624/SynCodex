import React, { useState, useEffect } from "react";
import { FileTabs } from "../components/editor/FileTabs";
import { FileExplorer } from "../components/editor/FileExplorer";
import { EditorPane } from "../components/editor/EditorPane";
import EditorNav from "../components/editor/EditorNav";
import { PanelLeft, PanelRight } from "lucide-react";
import { runCode } from "../services/codeExec";
import CodeExecutionResult from "../components/editor/CodeExecutionResult";

export default function EditorPage() {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectName, setProjectName] = useState("Loading...");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

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

  const detectLang = (file) => {
    if (!file) return "plaintext";
    if (file.endsWith(".py")) return "python";
    if (file.endsWith(".js")) return "js";
    if (file.endsWith(".ts")) return "ts";
    if (file.endsWith(".java")) return "java";
    if (file.endsWith(".cpp")) return "cpp";
    if (file.endsWith(".c")) return "c";
    return "plaintext";
  };

  const handleRunClick = async () => {
    if (!code || !activeFile) return;
    const lang = detectLang(activeFile);
    setIsRunning(true);
    setShowOutput(true);
    setOutput("");
    try {
      const res = await runCode(lang, code);
      setOutput(res.output || res.error || "// No output");
    } catch (err) {
      setOutput(err.message || "// Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCloseOutput = () => {
    setShowOutput(false);
    setOutput("");
  };

  return (
    <>
      <EditorNav onRunClick={handleRunClick} />

      <div className="h-[calc(100vh-4rem)] flex overflow-x-clip bg-[#21232f]">
        <div
          className={`h-full bg-[#21232f] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-[255px]" : "w-0 overflow-hidden"
          }`}
        >
          {isSidebarOpen && (
            <FileExplorer
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
              setActiveFile={setActiveFile}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 h-full">
          <div className="bg-[#21232f] flex items-center border-b border-[#e4e6f3ab]">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-16 left-0 flex z-20 bg-[#3D415A] hover:opacity-90 cursor-pointer text-white p-2 rounded-md transition-all duration-300"
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
          <div
            className={`pt-3 pb-${
              showOutput ? "0" : "3"
            } pr-2 h-full w-full flex flex-col justify-center`}
          >
            <div
              className={`h-full editor-wrapper flex-1 ${
                isSidebarOpen ? "max-w-[calc(100%-2%)]" : "w-full"
              }`}
            >
              <EditorPane activeFile={activeFile} onCodeChange={setCode} />
            </div>
            {showOutput && (
              <CodeExecutionResult
                output={output}
                isRunning={isRunning}
                onClose={handleCloseOutput}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
