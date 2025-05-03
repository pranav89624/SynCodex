import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import {MonacoBinding} from "y-monaco";
import { debounce } from "lodash";

import 'monaco-editor/esm/vs/basic-languages/html/html.contribution';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
import 'monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution';
import 'monaco-editor/esm/vs/basic-languages/rust/rust.contribution';
import 'monaco-editor/esm/vs/basic-languages/go/go.contribution';

export const CollabEditorPane = ({ activeFile }) => {
    const editorRef = useRef(null);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (activeFile) {
          try {
            const storedContent = localStorage.getItem(`file-${activeFile}`);
            setValue(storedContent || "");
          } catch (error) {
            console.error("Error retrieving file from localStorage:", error);
            setValue("");
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
        "";
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
        "editorLineNumber.activeForeground": "#FFFFFF",
        "editorGutter.background": "#21232f", 
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

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        // initialize yjs
        const doc = new Y.Doc();

        // start connection with WebRtc
        const provider = new WebrtcProvider("test-room", doc);
        const type = doc.getText("monaco");
        
        // bind editor with yjs
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
        console.log(provider.awareness);
    }

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