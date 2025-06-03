import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtPRZ62QPLmBJa3RA0jpRk3ecVlK5Ytpo",
  authDomain: "fir-8f7a8.firebaseapp.com",
  projectId: "fir-8f7a8",
  storageBucket: "fir-8f7a8.firebasestorage.app",
  messagingSenderId: "28686816270",
  appId: "1:28686816270:web:02967601bc6b25b8ac985f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };