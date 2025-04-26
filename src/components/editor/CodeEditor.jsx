// components/FileEditor.jsx
import React, { useEffect, useRef } from 'react';
import { X, Save, Edit } from 'lucide-react';
import * as monaco from 'monaco-editor';
import useFileStore from '../store/fileStore';
import FileIcon from './FileIcon';

const CodeEditor = () => {
  const { 
    selectedFile, 
    isEditing, 
    setIsEditing, 
    setSelectedFile, 
    updateFileContent,
    saveFile 
  } = useFileStore();
  
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!selectedFile || !containerRef.current) return;
    
    // Only create editor when in editing mode
    if (isEditing) {
      // Convert file type to Monaco language
      const language = selectedFile.type === 'markdown' ? 'markdown' : selectedFile.type;
      
      const editor = monaco.editor.create(containerRef.current, {
        value: selectedFile.content,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true }
      });
      
      editorRef.current = editor;
      
      // Update content in store when editor content changes
      editor.onDidChangeModelContent(() => {
        updateFileContent(editor.getValue());
      });
      
      return () => {
        editor.dispose();
      };
    }
  }, [selectedFile, isEditing]);
  
  if (!selectedFile) return null;
  
  const handleSave = () => {
    saveFile(selectedFile);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-xl w-10/12 h-5/6 flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="flex items-center">
            <FileIcon fileType={selectedFile.type} />
            <h3 className="ml-2 font-medium">{selectedFile.name}</h3>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
            )}
            <button 
              onClick={() => setSelectedFile(null)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {isEditing ? (
            <div ref={containerRef} className="w-full h-full" />
          ) : (
            <pre className="w-full h-full p-4 font-mono text-sm overflow-auto">
              {selectedFile.content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;