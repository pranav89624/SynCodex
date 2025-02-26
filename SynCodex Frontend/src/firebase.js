// filepath: /C:/Users/Asus/OneDrive/Desktop/Minor/SynCodex/SynCodex Frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtTZwOEwNkZi8il-9X1ieGeQiGtyoF3_Q",
  authDomain: "syncodex-86dc6.firebaseapp.com",
  projectId: "syncodex-86dc6",
  storageBucket: "syncodex-86dc6.firebasestorage.app",
  messagingSenderId: "955647694515",
  appId: "1:955647694515:web:7ca668941e7c46396402c6",
  measurementId: "G-ZXX9B95CZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };