
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseCreateUser,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  getMetadata,
} from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';
import type { FirebaseUser, Newsletter } from './types';
import * as crypto from 'crypto';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const newsletterFolder = 'newsletters';

// --- AUTH FUNCTIONS ---

// NOTE: sendSignInLinkToEmail has been moved to a secure server action in src/app/actions.ts

export const isSignInWithEmailLink = (url: string): boolean => {
    return firebaseIsSignInWithEmailLink(auth, url);
}

export const signInWithEmailLink = async (email: string, url: string): Promise<{ user: FirebaseUser }> => {
    const userCredential = await firebaseSignInWithEmailLink(auth, email, url);
    window.localStorage.removeItem('emailForSignIn');
    return { user: userCredential.user };
}

export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  return onFirebaseAuthStateChanged(auth, callback);
};

export const createNewAdminUser = async ({ email }: { email: string }): Promise<{ success: boolean; error?: string }> => {
    try {
        // This is a placeholder function. In a real app, you would securely create a user
        // on the backend and trigger a welcome/verification email. For this project, we'll
        // simulate creating a user and then rely on the secure server action to send logins.
        
        // 1. Generate a secure random password. User will not use this.
        const password = crypto.randomBytes(12).toString('base64').slice(0, 16);

        // 2. Create the user in Firebase Auth. This is insecure from the client and should
        // ideally be a server-side (e.g., Cloud Function) operation.
        await firebaseCreateUser(auth, email, password);

        // 3. For now, we manually alert the admin that the user is created.
        // The new user can now use the main login form.
        return { success: true };

    } catch (e: any) {
        console.error('Error in createNewAdminUser:', e);
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (e.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already registered as an administrator.';
        } else if (e.code === 'auth/invalid-email') {
            errorMessage = 'The email address provided is not valid.';
        }
        return { success: false, error: errorMessage };
    }
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
  try {
    const res = await listAll(listRef);

    const newslettersPromises = res.items.map(async (itemRef) => {
      const bucket = firebaseConfig.storageBucket;
      const publicUrl = `https://storage.googleapis.com/${bucket}/${itemRef.fullPath}`;
      const metadata = await getMetadata(itemRef);
      const date = parseDateFromName(itemRef.name);
      // Append the last updated time as a cache-busting query parameter.
      const cacheBustedUrl = `${publicUrl}?v=${new Date(metadata.updated).getTime()}`;
      
      return {
        id: itemRef.name,
        name: itemRef.name,
        url: cacheBustedUrl,
        // Provide a default date if parsing fails, though it shouldn't
        date: date || new Date(),
      };
    });

    const newsletters = await Promise.all(newslettersPromises);

    // Sort by date, most recent first
    return newsletters.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error("Error fetching newsletter list from Firebase Storage:", error);
    // If there's an error (e.g., folder doesn't exist, permissions issue),
    // return an empty array to prevent the app from crashing.
    return [];
  }
};

export const getLatestNewsletter = async (): Promise<Newsletter | null> => {
    const newsletters = await getNewsletterList();
    return newsletters.length > 0 ? newsletters[0] : null;
};

export const uploadNewsletter = async (file: File, date: Date): Promise<void> => {
    const fileName = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}.pdf`;
    const newsletterRef = ref(storage, `${newsletterFolder}/${fileName}`);

    try {
        await getMetadata(newsletterRef);
        // If getMetadata succeeds, the file exists.
        throw new Error('A newsletter for this date already exists.');
    } catch (error: any) {
        // If the error is 'storage/object-not-found', we can proceed with the upload.
        // If it's another error, we should throw it.
        if (error.code !== 'storage/object-not-found') {
           throw error;
        }
    }
    
    try {
        await uploadBytes(newsletterRef, file);
    } catch (error: any) {
        if (error.code === 'storage/unauthorized') {
            throw new Error('Permission denied. Please check your Firebase Storage security rules.');
        }
        throw error;
    }
};


export const deleteNewsletter = async (fileName: string): Promise<void> => {
  const desertRef = ref(storage, `${newsletterFolder}/${fileName}`);
  await deleteObject(desertRef);
};
