// services/firebaseService.js
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { auth, storage, db } from '../config/firebase';

// File metadata collection
const filesCollection = collection(db, 'files');
const foldersCollection = collection(db, 'folders');

// Save file to Firebase Storage and metadata to Firestore
export const saveFile = async (file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    const filePath = `${userId}${file.folder}${file.name}`;
    const storageRef = ref(storage, filePath);
    
    // Convert file content to blob for storage
    const blob = new Blob([file.content], { type: 'text/plain' });
    
    // Upload to Storage
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Save metadata to Firestore
    const fileData = {
      id: file.id || Date.now().toString(),
      name: file.name,
      type: file.type,
      folder: file.folder,
      storagePath: filePath,
      downloadURL: downloadURL,
      userId: userId,
      lastModified: new Date().toISOString()
    };
    
    // Update or add document to Firestore
    if (file.id) {
      const fileRef = doc(db, 'files', file.id);
      await updateDoc(fileRef, fileData);
    } else {
      const docRef = await addDoc(filesCollection, fileData);
      fileData.id = docRef.id;
    }
    
    console.log('File saved to Firebase:', fileData);
    return { ...fileData, content: file.content };
  } catch (error) {
    console.error('Error saving file to Firebase:', error);
    throw error;
  }
};

// Delete file from Firebase Storage and metadata from Firestore
export const deleteFile = async (fileId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    // Get file data from Firestore
    const fileRef = doc(db, 'files', fileId);
    const fileSnapshot = await getDoc(fileRef);
    
    if (fileSnapshot.exists()) {
      const fileData = fileSnapshot.data();
      
      // Delete from Storage
      const storageRef = ref(storage, fileData.storagePath);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(fileRef);
      
      console.log('File deleted from Firebase:', fileId);
      return true;
    } else {
      throw new Error('File not found');
    }
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
    throw error;
  }
};

// Fetch files from Firestore and their content from Storage
export const fetchFiles = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    const q = query(filesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const files = [];
    for (const doc of querySnapshot.docs) {
      const fileData = doc.data();
      
      // Fetch file content from Storage
      const storageRef = ref(storage, fileData.storagePath);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Fetch text content
      const response = await fetch(downloadURL);
      const content = await response.text();
      
      files.push({
        ...fileData,
        id: doc.id,
        content
      });
    }
    
    console.log('Fetched files from Firebase:', files);
    return files;
  } catch (error) {
    console.error('Error fetching files from Firebase:', error);
    throw error;
  }
};

// Fetch folders from Firestore
export const fetchFolders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    const q = query(foldersCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const folders = querySnapshot.docs.map(doc => doc.data().path);
    
    // Always include root folder
    if (!folders.includes('/')) {
      folders.push('/');
    }
    
    console.log('Fetched folders from Firebase:', folders);
    return folders;
  } catch (error) {
    console.error('Error fetching folders from Firebase:', error);
    throw error;
  }
};

// Create folder in Firestore
export const createFolder = async (folderPath) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    
    // Check if folder already exists
    const q = query(
      foldersCollection, 
      where('userId', '==', userId),
      where('path', '==', folderPath)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add folder to Firestore
      await addDoc(foldersCollection, {
        path: folderPath,
        userId: userId,
        createdAt: new Date().toISOString()
      });
    }
    
    console.log('Created folder in Firebase:', folderPath);
    return folderPath;
  } catch (error) {
    console.error('Error creating folder in Firebase:', error);
    throw error;
  }
};

// Initialize default folders for new users
export const initializeUserFolders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const defaultFolders = ['/', '/documents', '/code'];
    
    // Create default folders for the user
    const promises = defaultFolders.map(folder => createFolder(folder));
    await Promise.all(promises);
    
    // Create a welcome file
    const welcomeFile = {
      name: 'welcome.md',
      type: 'markdown',
      content: `# Welcome to DevVault!\n\nThis is your personal code vault in the cloud.\n\n## Features\n\n- Create and edit code files\n- Organize your files in folders\n- Secure authentication\n- Real-time sync with Firebase\n\nGet started by creating your first file or folder using the sidebar.`,
      folder: '/',
      lastModified: new Date().toISOString()
    };
    
    await saveFile(welcomeFile);
    
    return defaultFolders;
  } catch (error) {
    console.error('Error initializing user folders:', error);
    throw error;
  }
};

// NEW FUNCTION: Check if a file exists
export const checkFileExists = async (fileName, folderPath) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    const q = query(
      filesCollection, 
      where('userId', '==', userId),
      where('folder', '==', folderPath),
      where('name', '==', fileName)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    throw error;
  }
};

// NEW FUNCTION: Get file by ID
export const getFileById = async (fileId) => {
  try {
    const fileRef = doc(db, 'files', fileId);
    const fileSnapshot = await getDoc(fileRef);
    
    if (fileSnapshot.exists()) {
      return { id: fileSnapshot.id, ...fileSnapshot.data() };
    } else {
      throw new Error('File not found');
    }
  } catch (error) {
    console.error('Error getting file by ID:', error);
    throw error;
  }
};

// NEW FUNCTION: List files in a specific folder
export const listFilesInFolder = async (folderPath) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const userId = user.uid;
    const q = query(
      filesCollection, 
      where('userId', '==', userId),
      where('folder', '==', folderPath)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error listing files in folder:', error);
    throw error;
  }
};