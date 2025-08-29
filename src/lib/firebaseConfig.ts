// It's safe for this config to be public
// See https://firebase.google.com/docs/projects/learn-more#config-files-objects

export const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  appId: process.env.APP_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  measurementId: process.env.MEASUREMENT_ID,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};