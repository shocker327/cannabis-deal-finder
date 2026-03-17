import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1v8J7FjWR5Q2zqPyNQ-soTmKqKFqf0qk",
  authDomain: "shocker-deals.firebaseapp.com",
  projectId: "shocker-deals",
  storageBucket: "shocker-deals.firebasestorage.app",
  messagingSenderId: "657176662397",
  appId: "1:657176662397:web:d1a12ac13cbb611891bc14",
  measurementId: "G-8W861LFC13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
