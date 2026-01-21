// Firebase configuration for SkillTrack Pro
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPLZfg__ZOfUgIEFyV1ZGTfLeaW_iB5NU",
  authDomain: "crime-management-system-651ab.firebaseapp.com",
  projectId: "crime-management-system-651ab",
  storageBucket: "crime-management-system-651ab.firebasestorage.app",
  messagingSenderId: "17933098799",
  appId: "1:17933098799:web:d3e5de539a62eef2500bda"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
