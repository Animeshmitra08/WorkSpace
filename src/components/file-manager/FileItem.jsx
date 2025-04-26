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
  
  const { iconName } = getFileIconInfo(file.type);
  
  // Modified to use our custom color palette
  let color;
  switch(file.type) {
    case 'javascript':
      color = 'text-[#E29578]';
      break;
    case 'html':
      color = 'text-[#E29578]';
      break;
    case 'css':
      color = 'text-[#83C5BE]';
      break;
    case 'python':
      color = 'text-[#006D77]';
      break;
    case 'markdown':
      color = 'text-[#83C5BE]';
      break;
    default:
      color = 'text-gray-500';
  }
  
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
        className="px-3 py-2 rounded-lg cursor-pointer flex items-center hover:bg-[#83C5BE]/20 transition-colors"
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
      className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md cursor-pointer relative group transition-all"
      onClick={handleFileSelect}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex space-x-1.5 transition-opacity">
        <button 
          className="p-1.5 rounded-full hover:bg-[#83C5BE]/20 text-gray-500 hover:text-[#006D77] transition-colors"
          onClick={handleEditClick}
        >
          <Edit size={16} />
        </button>
        <button 
          className="p-1.5 rounded-full hover:bg-[#FFDDD2] text-gray-500 hover:text-[#E29578] transition-colors"
          onClick={(e) => handleDeleteFile(file.id, e)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-center mb-3">
        <IconComponent size={20} className={color} />
        <span className="ml-2.5 font-medium truncate">{file.name}</span>
      </div>
      <div className="text-xs text-gray-500">
        {formatDate(file.lastModified)}
      </div>
    </div>
  );
};

export default FileItem;