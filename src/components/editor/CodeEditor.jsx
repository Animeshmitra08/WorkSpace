import React, { useEffect, useRef } from 'react';
import { X, Save, Edit } from 'lucide-react';
import * as monaco from 'monaco-editor';
import useFileStore from '../../store/fileStore';
import useUIStore from '../../store/uiStore';
import FileIcon from './FileIcon';

const CodeEditor = () => {
  const { 
    selectedFile, 
    setSelectedFile, 
    updateFileContent,
    saveFile 
  } = useFileStore();
  
  const { isEditing, setIsEditing } = useUIStore();
  
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
  }, [selectedFile, isEditing, updateFileContent]);
  
  if (!selectedFile) return null;
  
  const handleSave = () => {
    saveFile(selectedFile);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-white rounded-xl shadow-2xl w-10/12 h-5/6 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#EDF6F9]">
          <div className="flex items-center">
            <FileIcon fileType={selectedFile.type} />
            <h3 className="ml-2.5 font-medium text-[#006D77]">{selectedFile.name}</h3>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#83C5BE] text-white rounded-full hover:bg-[#83C5BE]/80 flex items-center transition-colors shadow-sm"
              >
                <Save size={16} className="mr-1.5" />
                Save
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 bg-[#006D77] text-white rounded-full hover:bg-[#006D77]/80 flex items-center transition-colors shadow-sm"
              >
                <Edit size={16} className="mr-1.5" />
                Edit
              </button>
            )}
            <button 
              onClick={() => setSelectedFile(null)}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {isEditing ? (
            <div ref={containerRef} className="w-full h-full" />
          ) : (
            <pre className="w-full h-full p-5 font-mono text-sm overflow-auto bg-[#EDF6F9]/50 border-t border-gray-100">
              {selectedFile.content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;