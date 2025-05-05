import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export const CollabEditorPane = ({ activeFile }) => {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const yDocRef = useRef(new Y.Doc());
  const providerRef = useRef(null);
  const [value, setValue] = useState("");
  const { roomId } = useParams();

  // Init WebRTC provider once per room
  useEffect(() => {
    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(roomId || "fallback-room", yDocRef.current);
      console.log("Initialized WebRTC provider for room:", roomId);
    }

    return () => {
      providerRef.current?.destroy();
      providerRef.current = null;
      console.log("Destroyed provider on unmount.");
    };
  }, [roomId]);

  useEffect(() => {
    if (!activeFile) return;

    const storedContent = localStorage.getItem(`file-${activeFile}`);
    setValue(storedContent || "");

    const yText = yDocRef.current.getText(activeFile);

    if (editorRef.current) {
      if (bindingRef.current) bindingRef.current.destroy();

      const model = editorRef.current.getModel();
      if (model) {
        bindingRef.current = new MonacoBinding(
          yText,
          model,
          new Set([editorRef.current]),
          providerRef.current.awareness
        );
        console.log(`Bound Monaco to Y.Text for file: ${activeFile}`);
      }
    }
  }, [activeFile]);

  const saveFileToLocalStorage = debounce((newValue) => {
    if (activeFile) {
      localStorage.setItem(`file-${activeFile}`, newValue);
    }
  }, 1000);

  const handleChange = (newValue) => {
    setValue(newValue);
    saveFileToLocalStorage(newValue);
  };

  const getLanguage = () => {
    try {
      if (activeFile.endsWith(".html")) return "html";
      if (activeFile.endsWith(".css")) return "css";
      if (activeFile.endsWith(".js") || activeFile.endsWith(".jsx")) return "javascript";
      if (activeFile.endsWith(".ts") || activeFile.endsWith(".tsx")) return "typescript";
      if (activeFile.endsWith(".c") || activeFile.endsWith(".cpp")) return "cpp";
      if (activeFile.endsWith(".java")) return "java";
      if (activeFile.endsWith(".py")) return "python";
      if (activeFile.endsWith(".sql")) return "sql";
      if (activeFile.endsWith(".cs")) return "csharp";
      if (activeFile.endsWith(".rs")) return "rust";
      if (activeFile.endsWith(".go")) return "go";
      return "plaintext";
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const customTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#3D415A',
      'editor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#E4E6F3',
      'editorLineNumber.activeForeground': '#FFFFFF',
      'editorGutter.background': '#21232f',
      'editorCursor.foreground': '#ffffff',
      'editor.selectionBackground': '#556177',
      'editor.lineHighlightBackground': '#4C5068',
    },
  };

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select a file to begin editing.
      </div>
    );
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ensure theme is set
    monaco.editor.setTheme('custom-dark');

    const yText = yDocRef.current.getText(activeFile);
    const model = editor.getModel();

    if (bindingRef.current) bindingRef.current.destroy();

    bindingRef.current = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      providerRef.current.awareness
    );

    console.log(`Mounted editor and bound to Y.Text for ${activeFile}`);
  };

  return (
    <Editor
      height="100%"
      language={getLanguage()}
      value={value}
      onChange={handleChange}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme('custom-dark', customTheme);
      }}
      theme="custom-dark"
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        fontFamily: "Fira Code, monospace",
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        automaticLayout: true,
      }}
    />
  );
};
