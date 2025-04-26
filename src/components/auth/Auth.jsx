// components/auth/Auth.jsx
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useFileStore from '../../store/fileStore';
import useFolderStore from '../../store/folderStore';
import useUIStore from '../../store/uiStore';
import Login from './Login';
import Register from './Register';

const Auth = ({ children }) => {
  const { user, isAuthenticated, isLoading, initAuth, error } = useAuthStore();
  const { fetchFiles } = useFileStore();
  const { fetchFolders } = useFolderStore();
  const { showNotification } = useUIStore();
  const [showRegister, setShowRegister] = useState(false);
  
  // Initialize authentication listener
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);
  
  // Fetch files and folders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadUserData = async () => {
        try {
          await Promise.all([fetchFiles(), fetchFolders()]);
          showNotification(`Welcome, ${user.email.split('@')[0]}!`, 'success');
        } catch (err) {
          showNotification('Error loading your files', 'error');
        }
      };
      
      loadUserData();
    }
  }, [isAuthenticated, fetchFiles, fetchFolders, user, showNotification]);
  
  // Show error notifications
  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
    }
  }, [error, showNotification]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DevVault...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">DevVault</h1>
        <p className="text-gray-600 mb-8">Your secure code vault in the cloud</p>
        
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