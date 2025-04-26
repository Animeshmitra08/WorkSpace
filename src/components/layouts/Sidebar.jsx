// components/layout/Sidebar.jsx
import React from 'react';
import { Check, FolderPlus } from 'lucide-react';
import useFileStore from '../../store/fileStore';
import useFolderStore from '../../store/folderStore';
import useFileOperations from '../../hooks/useFileOperations';
import FolderItem from '../file-manager/FolderItem';
import FileItem from '../file-manager/FileItem';

const Sidebar = () => {
  const { getRecentFiles } = useFileStore();
  const { folders, currentFolder, setCurrentFolder } = useFolderStore();
  const { 
    newFileName, 
    setNewFileName, 
    newFolderName, 
    setNewFolderName,
    showNewFolderInput,
    handleCreateFile,
    handleCreateFolder,
    toggleNewFolderInput
  } = useFileOperations();
  
  const recentFiles = getRecentFiles(5);
  
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* New File Section */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-gray-700">New File</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="filename.js"
            className="flex-1 px-2 py-1 text-sm border rounded"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
          />
          <button
            onClick={handleCreateFile}
            className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
      
      {/* Folders Section */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-gray-700">Folders</h2>
          <button 
            onClick={toggleNewFolderInput}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
          >
            <FolderPlus size={16} />
          </button>
        </div>
        
        {showNewFolderInput && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Folder name"
              className="flex-1 px-2 py-1 text-sm border rounded"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <button
              onClick={handleCreateFolder}
              className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
            >
              <Check size={16} />
            </button>
          </div>
        )}
        
        <ul className="mt-2 space-y-1">
          {folders.map((folder) => (
            <FolderItem 
              key={folder} 
              folder={folder} 
              isActive={currentFolder === folder}
              onClick={() => setCurrentFolder(folder)}
            />
          ))}
        </ul>
      </div>
      
      {/* Recent Files Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <h2 className="font-medium text-gray-700 mb-2">Recent Files</h2>
        <ul className="space-y-1">
          {recentFiles.map((file) => (
            <FileItem 
              key={file.id} 
              file={file} 
              compact={true}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;