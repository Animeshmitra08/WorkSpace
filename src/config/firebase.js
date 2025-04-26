// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// For better security, use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APP_ID || "AIzaSyAUNy951bIMrc_BDlayCGov4BBkdGBdRjg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ani-workspace.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ani-workspace",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ani-workspace.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "479249607802",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:479249607802:web:8a1c3de1fc1007f6111fc3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;