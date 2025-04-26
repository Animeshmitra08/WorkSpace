// components/auth/Auth.jsx
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useFileStore from '../../store/fileStore';
import useFolderStore from '../../store/folderStore';
import Login from './Login';
import Register from './Register';

const Auth = ({ children }) => {
  const { user, isAuthenticated, isLoading, initAuth } = useAuthStore();
  const { fetchFiles } = useFileStore();
  const { fetchFolders } = useFolderStore();
  const [showRegister, setShowRegister] = useState(false);
  
  // Initialize authentication listener
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);
  
  // Fetch files and folders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
      fetchFolders();
    }
  }, [isAuthenticated, fetchFiles, fetchFolders]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          {showRegister ? (
            <Register onToggle={() => setShowRegister(false)} />
          ) : (
            <Login onToggle={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }
  
  return children;
};

export default Auth;