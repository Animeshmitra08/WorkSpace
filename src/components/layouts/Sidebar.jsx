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
    <aside className="w-64 bg-[#EDF6F9] border-r border-gray-200 flex flex-col">
      {/* New File Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium text-[#006D77]">New File</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="filename.js"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
          />
          <button
            onClick={handleCreateFile}
            className="bg-[#83C5BE] text-white p-2 rounded-lg hover:bg-[#83C5BE]/80 transition-colors"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
      
      {/* Folders Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-[#006D77]">Folders</h2>
          <button 
            onClick={toggleNewFolderInput}
            className="p-1.5 text-[#006D77] hover:text-[#006D77]/80 hover:bg-[#83C5BE]/20 rounded-full transition-colors"
          >
            <FolderPlus size={16} />
          </button>
        </div>
        
        {showNewFolderInput && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Folder name"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#83C5BE] focus:border-[#83C5BE] transition-colors"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <button
              onClick={handleCreateFolder}
              className="bg-[#83C5BE] text-white p-2 rounded-lg hover:bg-[#83C5BE]/80 transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        )}
        
        <ul className="mt-3 space-y-1">
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
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="font-medium text-[#006D77] mb-3">Recent Files</h2>
        <ul className="space-y-1.5">
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