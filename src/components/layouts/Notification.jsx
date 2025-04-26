// components/layout/Notification.jsx
import React from 'react';
import useUIStore from '../../store/uiStore';

const Notification = () => {
  const { notification } = useUIStore();
  
  if (!notification.show) return null;
  
  const getBackgroundColor = () => {
    switch(notification.type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      case 'success':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      default:
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
    }
  };
  
  return (
    <div className={`fixed top-16 right-4 px-4 py-2 rounded shadow-lg flex items-center ${getBackgroundColor()}`}>
      {notification.message}
    </div>
  );
};

export default Notification;