// components/layouts/FloatingUploadButton.jsx
import React from 'react';
import { Upload } from 'lucide-react';
import useUIStore from '../../store/uiStore';

const FloatingUploadButton = () => {
  const { showNotification } = useUIStore();
  
  const handleUpload = () => {
    showNotification('Upload would connect to Firebase Storage in a real app', 'info');
  };
  
  return (
    <button 
      className="fixed bottom-6 right-6 bg-[#83C5BE] text-white p-4 rounded-full hover:bg-[#83C5BE]/80 shadow-lg transition-colors z-10 flex items-center justify-center"
      onClick={handleUpload}
      aria-label="Upload file"
    >
      <Upload size={24} />
    </button>
  );
};

export default FloatingUploadButton;