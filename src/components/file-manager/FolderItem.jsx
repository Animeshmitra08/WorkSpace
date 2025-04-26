import React from 'react';
import { FolderOpen } from 'lucide-react';
import { getFolderName } from '../../utils/fileHelpers';

const FolderItem = ({ folder, isActive, onClick }) => {
  return (
    <li
      className={`px-3 py-2 rounded-lg cursor-pointer flex items-center transition-colors ${
        isActive ? 'bg-[#83C5BE]/30 text-[#006D77]' : 'hover:bg-[#83C5BE]/20'
      }`}
      onClick={onClick}
    >
      <FolderOpen size={16} className={`mr-2 ${isActive ? 'text-[#006D77]' : 'text-[#E29578]'}`} />
      <span className="text-sm">{getFolderName(folder)}</span>
    </li>
  );
};

export default FolderItem;