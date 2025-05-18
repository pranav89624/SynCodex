import { useRef, useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { debounce } from "lodash";
import { toast } from "react-toastify";

export const CollabEditorPane = forwardRef (({ activeFile, yDoc }, ref) => {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const [value, setValue] = useState("");

  const yText = useMemo(() => {
    if (yDoc && activeFile) {
      return yDoc.getText(activeFile);
    }
    return null;
  }, [yDoc, activeFile]);

  useImperativeHandle(ref, () => ({
    getCode: () => yText?.toString() || "",
  }));

  useEffect(() => {
    if (!activeFile) return;

      const storedContent = localStorage.getItem(`file-${activeFile}`);
      setValue(storedContent || "");

      if(editorRef.current) {
        if(bindingRef.current) {
          bindingRef.current.destroy();
          bindingRef.current = null;
        }

        const model = editorRef.current.getModel();
        if(model) {
          bindingRef.current = new MonacoBinding(
            yText,
            model,
            new Set([editorRef.current]),
            yDoc.awareness
          );
          console.log(`Bound Monaco to Y.Text for file: ${activeFile}`);
        }
      }
  }, [activeFile]);

  const saveFile = debounce((newValue) => {
    if (activeFile) {
      localStorage.setItem(`file-${activeFile}`, newValue);
    }
  }, 1000);

  const handleChange = (newValue) => {
    setValue(newValue);
    saveFile(newValue);
  };

  const getLanguage = () => {
    try {
      if (activeFile.endsWith(".html")) return "html";
      if (activeFile.endsWith(".css")) return "css";
      if (activeFile.endsWith(".js") || activeFile.endsWith(".jsx")) return "javascript";
      if (activeFile.endsWith(".ts") || activeFile.endsWith(".tsx")) return "typescript";
      if (activeFile.endsWith(".py")) return "python";
      if (activeFile.endsWith(".java")) return "java";
      if (activeFile.endsWith(".c") || activeFile.endsWith(".cpp")) return "cpp";
      return "plaintext";
    } catch (error) {
      toast.error("Error detecting language");
      return "plaintext";
    }
  };

  const customTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#3D415A",
      "editor.foreground": "#ffffff",
      "editorLineNumber.foreground": "#E4E6F3",
      "editorLineNumber.activeForeground": "#FFFFFF",
      "editorGutter.background": "#21232f",
      "editorCursor.foreground": "#ffffff",
      "editor.selectionBackground": "#556177",
      "editor.lineHighlightBackground": "#4C5068",
    },
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("custom-dark", customTheme);
    monaco.editor.setTheme("custom-dark");

    if (bindingRef.current) bindingRef.current.destroy();

    if (yText) {
      bindingRef.current = new MonacoBinding(
        yText,
        editor.getModel(),
        new Set([editor]),
        yDoc.awareness
      );
      console.log(`Bound Monaco to Y.Text for file: ${activeFile}`);
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select a file to begin editing.
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={getLanguage()}
      value={value}
      onChange={handleChange}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("custom-dark", customTheme);
      }}
      theme="custom-dark"
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        fontFamily: "Fira Code, monospace",
        minimap: { enabled: false },
        quickSuggestions: true,
        automaticLayout: true,
        suggestOnTriggerCharacters: true,
      }}
    />
  );
});
