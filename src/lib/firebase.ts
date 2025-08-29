import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  sendSignInLinkToEmail as firebaseSendSignInLink,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  updatePassword
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject
} from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';
import type { FirebaseUser, Newsletter } from './types';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const newsletterFolder = 'newsletters';

// --- AUTH FUNCTIONS ---

const actionCodeSettings = {
    url: typeof window !== 'undefined' ? `${window.location.origin}/finish-login` : 'http://localhost:9002/finish-login',
    handleCodeInApp: true,
};

export const sendSignInLinkToEmail = async (email: string): Promise<void> => {
  await firebaseSendSignInLink(auth, email, actionCodeSettings);
  // Save the email locally so we can use it to complete sign-in.
  window.localStorage.setItem('emailForSignIn', email);
};

export const isSignInWithEmailLink = (url: string): boolean => {
    return firebaseIsSignInWithEmailLink(auth, url);
}

export const signInWithEmailLink = async (email: string, url: string): Promise<{ user: FirebaseUser }> => {
    const userCredential = await firebaseSignInWithEmailLink(auth, email, url);
    window.localStorage.removeItem('emailForSignIn');
    return { user: userCredential.user };
}

// Kept for creating new users in the backend flow. Password will be temporary and not used by user.
export const createUserWithEmailAndPassword = async (email: string, password: string): Promise<{ user: FirebaseUser }> => {
    const userCredential = await firebaseCreateUser(auth, email, password);
    return { user: userCredential.user };
};

export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  return onFirebaseAuthStateChanged(auth, callback);
};

export const updateUserPassword = async (newPassword: string): Promise<void> => {
    const user = auth.currentUser;
    if (user) {
        return updatePassword(user, newPassword);
    }
    throw new Error('No user is currently signed in.');
};


// --- STORAGE FUNCTIONS ---

const parseDateFromName = (name: string): Date | null => {
    const parts = name.replace('.pdf', '').split('-');
    if (parts.length === 3) {
      // Assuming MM-DD-YYYY format
      const [month, day, year] = parts.map(p => parseInt(p, 10));
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month - 1, day);
      }
    }
    return null;
}

export const getNewsletterList = async (): Promise<Newsletter[]> => {
  const listRef = ref(storage, newsletterFolder);
  const res = await listAll(listRef);

  const newslettersPromises = res.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const date = parseDateFromName(itemRef.name);
    return {
      id: itemRef.name,
      name: itemRef.name,
      url: url,
      // Provide a default date if parsing fails, though it shouldn't
      date: date || new Date(),
    };
  });

  const newsletters = await Promise.all(newslettersPromises);

  // Sort by date, most recent first
  return newsletters.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getLatestNewsletter = async (): Promise<Newsletter | null> => {
    const newsletters = await getNewsletterList();
    return newsletters.length > 0 ? newsletters[0] : null;
};

export const uploadNewsletter = async (file: File, date: Date): Promise<void> => {
    const fileName = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}.pdf`;
    const newsletterRef = ref(storage, `${newsletterFolder}/${fileName}`);

    // Check if a file with the same name already exists
    try {
        await getDownloadURL(newsletterRef);
        // If the above line doesn't throw, the file exists.
        throw new Error('A newsletter for this date already exists.');
    } catch (error: any) {
        // If it's a 'storage/object-not-found' error, we can proceed.
        if (error.code !== 'storage/object-not-found') {
           throw error; // Re-throw other errors
        }
    }
    
    await uploadBytes(newsletterRef, file);
};


export const deleteNewsletter = async (fileName: string): Promise<void> => {
  const desertRef = ref(storage, `${newsletterFolder}/${fileName}`);
  await deleteObject(desertRef);
};
