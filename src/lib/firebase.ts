import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  sendSignInLinkToEmail as firebaseSendSignInLink,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
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
import * as crypto from 'crypto';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

const newsletterFolder = 'newsletters';

// --- AUTH FUNCTIONS ---

const actionCodeSettings = {
    url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/finish-login` : 'http://localhost:9002/finish-login',
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

// This is a placeholder for sending emails. In a real app, you'd use a transactional email service.
async function sendWelcomeEmail(to: string) {
  const loginUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/login` : 'http://localhost:9002/login';
  const subject = "Welcome to the Willow Wind Warbler Administration Panel";
  const body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
          body { font-family: 'PT Sans', sans-serif; margin: 0; padding: 0; background-color: #f0f4f8; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
          .header { background-color: #bccd9c; padding: 20px; text-align: center; }
          .header h1 { margin: 0; color: #0D248C; font-family: 'Playfair Display', serif; }
          .content { padding: 30px; color: #333333; line-height: 1.6; }
          .content p { margin: 0 0 15px; }
          .button-container { text-align: center; margin-top: 30px; }
          .button { background-color: #6F6521; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
          .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666666; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Willow Wind Warbler</h1>
          </div>
          <div class="content">
              <h2>Welcome, Administrator!</h2>
              <p>An administrator account has been created for you for the Willow Wind Warbler newsletter.</p>
              <p>You can log in by clicking the button below. You will be sent a secure, one-time link to your email address to complete the sign-in process.</p>
              <div class="button-container">
                  <a href="${loginUrl}" class="button">Login to Admin Panel</a>
              </div>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Willow Wind Warbler. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

  console.log('**************************************************');
  console.log(`** SIMULATING EMAIL TO: ${to}`);
  console.log(`** SUBJECT: ${subject}`);
  console.log('**************************************************');
  console.log(body);
  console.log('**************************************************');

  // In a real application, you would integrate with a service like SendGrid, Mailgun, or AWS SES.
  return Promise.resolve();
}

export const createNewAdminUser = async ({ email }: { email: string }): Promise<{ success: boolean; error?: string }> => {
    try {
        // 1. Generate a secure random password for backend creation. User will not use this.
        const password = crypto.randomBytes(12).toString('base64').slice(0, 16);

        // 2. Create the user in Firebase Auth
        await firebaseCreateUser(auth, email, password);

        // 3. Send the welcome email
        await sendWelcomeEmail(email);

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

export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  return onFirebaseAuthStateChanged(auth, callback);
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
        await getDownloadURL(newsletterRef);
        throw new Error('A newsletter for this date already exists.');
    } catch (error: any) {
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
