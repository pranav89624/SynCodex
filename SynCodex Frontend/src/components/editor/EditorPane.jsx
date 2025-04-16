import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

export const EditorPane = ({ activeFile }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (activeFile) {
      const storedContent = localStorage.getItem(`file-${activeFile}`);
      setValue(storedContent || "");
    }
  }, [activeFile]);

  const handleChange = (newValue) => {
    setValue(newValue);
    localStorage.setItem(`file-${activeFile}`, newValue);
  };

  const getLanguage = () => {
    if (activeFile.endsWith(".html")) return "html";
    if (activeFile.endsWith(".css")) return "css";
    return "javascript";
  };

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select a file to begin editing.
      </div>
    );
  }

  const customTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Optional: Add syntax highlighting rules here
    ],
    colors: {
      'editor.background': '#3D415A',
      'editor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#E4E6F3',
      "editorLineNumber.activeForeground": "#FFFFFF",
      "editorGutter.background": "#21232f", 
      'editorCursor.foreground': '#ffffff',
      'editor.selectionBackground': '#556177',
      'editor.lineHighlightBackground': '#4C5068',
    },
  };
  

  return (
    <Editor
      height="100%"
      language={getLanguage()}
      value={value}
      onChange={handleChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        fontFamily: "Fira Code, monospace",
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme('custom-dark', customTheme);
      }}
      theme="custom-dark"   
    />      
  );
};
