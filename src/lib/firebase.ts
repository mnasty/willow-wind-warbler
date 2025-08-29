import type { FirebaseUser, Newsletter } from './types';

// MOCK DATA
const createMockNewsletters = (): Newsletter[] => {
  const newsletters: Newsletter[] = [];
  const today = new Date();
  for (let year = today.getFullYear(); year >= 2020; year--) {
    const monthCount = year === today.getFullYear() ? today.getMonth() + 1 : 12;
    for (let month = monthCount; month >= 1; month--) {
      // one newsletter per month for demo
      const date = new Date(year, month - 1, 15);
      const name = `${String(month).padStart(2, '0')}-15-${year}.pdf`;
      newsletters.push({
        id: name,
        name: name,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Placeholder PDF
        date: date,
      });
    }
  }
  return newsletters.sort((a, b) => b.date.getTime() - a.date.getTime());
};

let mockNewsletterStore: Newsletter[] = createMockNewsletters();

// MOCK AUTH
let currentUser: FirebaseUser | null = null;
const listeners: ((user: FirebaseUser | null) => void)[] = [];
const MOCK_ADMIN_USER = { email: 'admin@example.com', password: 'password123', uid: 'admin-uid' };

const notifyListeners = () => {
  listeners.forEach(listener => listener(currentUser));
};

// --- EXPORTED MOCK FUNCTIONS ---

export const getNewsletterList = async (): Promise<Newsletter[]> => {
  console.log('Mock Firebase: Fetching newsletter list.');
  return Promise.resolve([...mockNewsletterStore]);
};

export const getLatestNewsletter = async (): Promise<Newsletter | null> => {
  console.log('Mock Firebase: Fetching latest newsletter.');
  if (mockNewsletterStore.length > 0) {
    return Promise.resolve(mockNewsletterStore[0]);
  }
  return Promise.resolve(null);
};

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<{ user: FirebaseUser }> => {
  console.log(`Mock Firebase: Attempting sign-in for ${email}.`);
  if (email === MOCK_ADMIN_USER.email && password === MOCK_ADMIN_USER.password) {
    currentUser = { email: MOCK_ADMIN_USER.email, uid: MOCK_ADMIN_USER.uid };
    notifyListeners();
    return Promise.resolve({ user: currentUser });
  }
  return Promise.reject(new Error('Invalid credentials'));
};

export const signOut = async (): Promise<void> => {
  console.log('Mock Firebase: Signing out.');
  currentUser = null;
  notifyListeners();
  return Promise.resolve();
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  console.log('Mock Firebase: Auth state listener attached.');
  listeners.push(callback);
  callback(currentUser); // Immediately invoke with current state
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    console.log('Mock Firebase: Auth state listener detached.');
  };
};

export const uploadNewsletter = async (file: File, date: Date): Promise<void> => {
  console.log(`Mock Firebase: Uploading file ${file.name} for date ${date}.`);
  const name = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}.pdf`;

  if (mockNewsletterStore.find(n => n.name === name)) {
    return Promise.reject(new Error('A newsletter for this date already exists.'));
  }

  const newNewsletter: Newsletter = {
    id: name,
    name: name,
    url: URL.createObjectURL(file), // create a temporary local URL for display
    date: date,
  };
  mockNewsletterStore.unshift(newNewsletter);
  mockNewsletterStore.sort((a, b) => b.date.getTime() - a.date.getTime());
  return Promise.resolve();
};

export const deleteNewsletter = async (fileName: string): Promise<void> => {
  console.log(`Mock Firebase: Deleting file ${fileName}.`);
  const initialLength = mockNewsletterStore.length;
  mockNewsletterStore = mockNewsletterStore.filter(n => n.name !== fileName);
  if (mockNewsletterStore.length === initialLength) {
    return Promise.reject(new Error('File not found.'));
  }
  return Promise.resolve();
};
