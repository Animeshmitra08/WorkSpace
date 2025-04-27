// components/layout/Header.jsx
import React from 'react';
import { Menu, Search, LogOut, User } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

const Header = ({ toggleSidebar }) => {
  const { searchTerm, setSearchTerm, showNotification } = useUIStore();
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Successfully logged out', 'success');
    } catch (error) {
      showNotification('Logout failed: ' + error.message, 'error');
    }
  };
  
  return (
    <header className="bg-[#006D77] text-white p-3 flex justify-between items-center shadow-lg">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded hover:bg-[#006D77]/80 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold">My WorkSpace</h1>
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            className="py-1.5 px-3 pr-8 rounded-full bg-[#EDF6F9] text-gray-800 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#83C5BE] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <div className="flex items-center ml-2">
          <span className="mr-3 text-sm flex items-center bg-[#006D77]/30 py-1.5 px-3 rounded-full">
            <User size={16} className="mr-1.5" />
            {user?.email?.split('@')[0]}
          </span>
          <button 
            className="bg-[#E29578] py-1.5 px-4 rounded-full hover:bg-[#E29578]/80 flex items-center gap-1.5 text-sm transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;