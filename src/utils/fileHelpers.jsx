// utils/fileHelpers.js

export const getFileIconInfo = (fileType) => {
  switch(fileType) {
    case 'javascript':
      return { iconName: 'Code', color: 'text-yellow-500' };
    case 'html':
      return { iconName: 'Code', color: 'text-orange-500' };
    case 'css':
      return { iconName: 'Code', color: 'text-blue-500' };
    case 'python':
      return { iconName: 'Code', color: 'text-green-500' };
    case 'markdown':
      return { iconName: 'FileText', color: 'text-purple-500' };
    default:
      return { iconName: 'File', color: 'text-gray-500' };
  }
};

export const getFileLanguage = (fileType) => {
  switch(fileType) {
    case 'javascript':
      return 'javascript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'python':
      return 'python';
    case 'markdown':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

export const getFolderName = (folderPath) => {
  if (folderPath === '/') return 'Root';
  return folderPath.split('/').filter(Boolean).pop();
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};