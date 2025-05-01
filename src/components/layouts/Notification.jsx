import React, { useEffect } from 'react';
import useUIStore from '../../store/uiStore';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Notification = () => {
  const { notification, clearNotification } = useUIStore();
  
  useEffect(() => {
    if (notification) {
      // Auto-dismiss notification after 5 seconds
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);
  
  if (!notification) return null;
  
  // Configure colors and icons based on notification type
  let bgColor, borderColor, iconColor, Icon;
  
  switch (notification.type) {
    case 'success':
      bgColor = 'bg-[#83C5BE]';
      borderColor = 'border-[#83C5BE]';
      iconColor = 'text-[#83C5BE]';
      Icon = CheckCircle;
      break;
    case 'error':
      bgColor = 'bg-[#E29578]';
      borderColor = 'border-[#E29578]';
      iconColor = 'text-[#E29578]';
      Icon = XCircle;
      break;
    case 'warning':
      bgColor = 'bg-[#FFDDD2]';
      borderColor = 'border-[#E29578]';
      iconColor = 'text-[#E29578]';
      Icon = AlertCircle;
      break;
    case 'info':
    default:
      bgColor = 'bg-[#EDF6F9]';
      borderColor = 'border-[#006D77]';
      iconColor = 'text-[#006D77]';
      Icon = Info;
  }
  
  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in">
      <div 
        className={`${bgColor} ${borderColor} border-l-4 p-4 rounded-r shadow-md max-w-md flex items-start`}
      >
        <Icon size={20} className={`${iconColor} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className="text-gray-800">{notification.message}</p>
        </div>
        <button 
          onClick={clearNotification}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;