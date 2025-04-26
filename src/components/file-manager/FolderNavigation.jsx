// components/file-manager/FolderNavigation.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import useFolderStore from '../../store/folderStore';

const FolderNavigation = () => {
  const { currentFolder, navigateUp } = useFolderStore();
  
  return (
    <div className="bg-white border-b border-gray-200 p-3 flex items-center">
      <button 
        onClick={navigateUp} 
        className="p-1 rounded hover:bg-gray-100 mr-2"
        disabled={currentFolder === '/'}
      >
        <ArrowLeft size={18} className={currentFolder === '/' ? 'text-gray-300' : 'text-gray-600'} />
      </button>
      <span className="font-medium">{currentFolder}</span>
    </div>
  );
};

export default FolderNavigation;