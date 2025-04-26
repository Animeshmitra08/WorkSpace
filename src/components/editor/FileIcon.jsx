// components/editor/FileIcon.jsx
import React from 'react';
import { File, FileText, Code } from 'lucide-react';

const FileIcon = ({ fileType, size = 18 }) => {
  // Determine icon and color based on file type
  let IconComponent;
  let colorClass;
  
  switch(fileType) {
    case 'javascript':
      IconComponent = Code;
      colorClass = 'text-yellow-500';
      break;
    case 'html':
      IconComponent = Code;
      colorClass = 'text-orange-500';
      break;
    case 'css':
      IconComponent = Code;
      colorClass = 'text-blue-500';
      break;
    case 'python':
      IconComponent = Code;
      colorClass = 'text-green-500';
      break;
    case 'markdown':
      IconComponent = FileText;
      colorClass = 'text-purple-500';
      break;
    default:
      IconComponent = File;
      colorClass = 'text-gray-500';
  }
  
  return <IconComponent size={size} className={colorClass} />;
};

export default FileIcon;