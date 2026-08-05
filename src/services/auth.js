import { 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Log in a user with email and password, setting persistence based on rememberMe.
 * @param {string} email 
 * @param {string} password 
 * @param {boolean} rememberMe 
 */
export async function loginUser(email, password, rememberMe = true) {
  try {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistenceType);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

/**
 * Log out current authenticated user.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}

/**
 * Subscribe to auth state change observer.
 * @param {function} callback 
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}
