'use server';

import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { 
  getAuth as getClientAuth, 
  sendSignInLinkToEmail as firebaseSendSignInLink 
} from 'firebase/auth';
import { initializeApp as initializeClientApp, getApps as getClientApps, getApp as getClientApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebaseConfig';


// Initialize Firebase Admin SDK (server-side)
// This service account has elevated privileges and should only be used on the server.
const adminApp = !getApps().length
  ? initializeApp()
  : getApp();
const adminAuth = getAuth(adminApp);


// Initialize Firebase Client SDK (for sending the link)
// This is necessary because the Admin SDK cannot send passwordless sign-in links.
const clientApp = !getClientApps().length ? initializeClientApp(firebaseConfig) : getClientApp();
const clientAuth = getClientAuth(clientApp);


export async function sendAdminSignInLink(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Securely verify the user exists using the Admin SDK.
    // This happens on the server and cannot be bypassed.
    await adminAuth.getUserByEmail(email);

    // 2. If the user exists, send the sign-in link using the Client SDK.
    const actionCodeSettings = {
      // URL must be absolute
      url: process.env.NEXT_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_URL}/finish-login`
        : 'http://localhost:9002/finish-login',
      handleCodeInApp: true,
    };

    await firebaseSendSignInLink(clientAuth, email, actionCodeSettings);

    // 3. Return a success message.
    return { success: true, message: `A sign-in link has been sent to ${email}.` };

  } catch (error: any) {
    // Log the full technical error on the server for debugging.
    console.error('[SERVER_ACTION_ERROR] sendAdminSignInLink:', error);

    // **DEBUGGING MODIFICATION:** Returning the full error message to the client.
    // **WARNING:** This is insecure for production.
    if (error.code === 'auth/user-not-found') {
      return { success: false, message: 'This email address is not registered as an administrator.' };
    }
    
    // Return the detailed error message for debugging.
    return { success: false, message: `An unexpected server error occurred: ${error.message}` };
  }
}
