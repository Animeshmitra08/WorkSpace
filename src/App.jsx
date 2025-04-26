// App.jsx
import React, { useState } from 'react';
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import FolderNavigation from './components/file-manager/FolderNavigation';
import FileGrid from './components/file-manager/FileGrid';
import CodeEditor from './components/editor/CodeEditor';
import Notification from './components/layouts/Notification';

// Make sure to install the following packages:
// npm install zustand monaco-editor lucide-react

export default function App() {
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
            <CodeEditor />
          </div>
        </main>
      </div>
    </div>
  );
}