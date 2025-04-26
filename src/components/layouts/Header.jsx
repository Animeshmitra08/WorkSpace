// components/layout/Header.jsx
import React from 'react';
import { Menu, Search, Upload } from 'lucide-react';
import useUIStore from '../../store/uiStore';

const Header = () => {
  const { toggleSidebar, searchTerm, setSearchTerm, showNotification } = useUIStore();
  
  const handleUpload = () => {
    showNotification('Upload would connect to Firebase Storage in a real app', 'info');
  };
  
  return (
    <header className="bg-gray-800 text-white p-3 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold">DevVault</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            className="py-1 px-3 pr-8 rounded text-gray-800 text-sm w-48 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute right-2 top-1.5 text-gray-500" />
        </div>
        <button 
          className="bg-blue-600 py-1 px-3 rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
          onClick={handleUpload}
        >
          <Upload size={16} />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
};

export default Header;