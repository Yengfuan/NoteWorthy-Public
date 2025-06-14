// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC-j0NeTVLlnt2gyaWEmy7U8PvemvvtUE",
  authDomain: "noteworthy-28a74.firebaseapp.com",
  projectId: "noteworthy-28a74",
  storageBucket: "noteworthy-28a74.firebasestorage.app",
  messagingSenderId: "83941648213",
  appId: "1:83941648213:web:ffbdb50225c9cbf88531dc"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

