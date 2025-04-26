// components/file-manager/FolderItem.jsx
import React from 'react';
import { FolderOpen } from 'lucide-react';
import { getFolderName } from '../../utils/fileHelpers';

const FolderItem = ({ folder, isActive, onClick }) => {
  return (
    <li
      className={`px-2 py-1 rounded cursor-pointer flex items-center ${
        isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <FolderOpen size={16} className="mr-2" />
      <span className="text-sm">{getFolderName(folder)}</span>
    </li>
  );
};

export default FolderItem;