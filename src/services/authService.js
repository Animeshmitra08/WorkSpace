// services/authService.js
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged 
  } from 'firebase/auth';
  import { auth } from '../config/firebase';
  import { initializeUserFolders } from './firebaseService';
  
  // Sign in with email and password
  export const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  
  // Sign up with email and password
  export const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Initialize default folders for new user
      await initializeUserFolders();
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };
  
  // Sign out
  export const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  // Get current user
  export const getCurrentUser = () => {
    return auth.currentUser;
  };
  
  // Listen for auth state changes
  export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };