// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: "cake-shop-bce38.firebaseapp.com",
  projectId: "cake-shop-bce38",
  storageBucket: "cake-shop-bce38.firebasestorage.app",
  messagingSenderId: "343027912664",
  appId: "1:343027912664:web:beb7ee479860074ca26cad",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
