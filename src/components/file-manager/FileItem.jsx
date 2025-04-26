// components/file-manager/FileItem.jsx
import React from 'react';
import { Edit, Trash2, Code, File, FileText } from 'lucide-react';
import useFileStore from '../../store/fileStore';
import useUIStore from '../../store/uiStore';
import useFileOperations from '../../hooks/useFileOperations';
import { getFileIconInfo, formatDate } from '../../utils/fileHelpers';

const FileItem = ({ file, compact = false }) => {
  const { setSelectedFile } = useFileStore();
  const { setIsEditing } = useUIStore();
  const { handleDeleteFile } = useFileOperations();
  
  const { iconName, color } = getFileIconInfo(file.type);
  
  const IconComponent = 
    iconName === 'Code' ? Code :
    iconName === 'FileText' ? FileText : File;
  
  const handleFileSelect = () => {
    setSelectedFile(file);
  };
  
  const handleEditClick = (e) => {
    e.stopPropagation();
    setSelectedFile(file);
    setIsEditing(true);
  };
  
  // Compact mode for sidebar
  if (compact) {
    return (
      <li 
        className="px-2 py-1 rounded cursor-pointer flex items-center hover:bg-gray-200"
        onClick={handleFileSelect}
      >
        <IconComponent size={16} className={color} />
        <span className="ml-2 text-sm truncate">{file.name}</span>
      </li>
    );
  }
  
  // Grid mode for main content
  return (
    <div 
      className="p-3 border rounded bg-white shadow-sm hover:shadow cursor-pointer relative group"
      onClick={handleFileSelect}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
        <button 
          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
          onClick={handleEditClick}
        >
          <Edit size={16} />
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
          onClick={(e) => handleDeleteFile(file.id, e)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-center mb-2">
        <IconComponent size={18} className={color} />
        <span className="ml-2 font-medium truncate">{file.name}</span>
      </div>
      <div className="text-xs text-gray-500">
        {formatDate(file.lastModified)}
      </div>
    </div>
  );
};

export default FileItem;