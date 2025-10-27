import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7G9FFEZVFRx8Ml_H49tJTcMUbmOZYmQ4",
  authDomain: "iaiwaf.firebaseapp.com",
  projectId: "iaiwaf",
  storageBucket: "iaiwaf.firebasestorage.app",
  messagingSenderId: "548868801867",
  appId: "1:548868801867:web:a51be7e24ea9f1014d94ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const storage = getStorage(app);
