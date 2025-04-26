// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FolderNavigation from './components/FolderNavigation';
import FileGrid from './components/FileGrid';
import FileEditor from './components/FileEditor';
import Notification from './components/Notification';

// Make sure to install the following packages:
// npm install zustand monaco-editor lucide-react

export default function FileManagementSystem() {
  const [showSidebar, setShowSidebar] = useState(true);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <Notification />
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <FolderNavigation />
          <div className="flex-1 flex flex-col overflow-hidden">
            <FileGrid />
            <FileEditor />
          </div>
        </main>
      </div>
    </div>
  );
}