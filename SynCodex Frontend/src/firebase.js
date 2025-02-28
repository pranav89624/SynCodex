import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAttributes } from "./firebaseAttributes";

const firebaseConfig = {
  apiKey: firebaseAttributes.apiKey,
  authDomain: firebaseAttributes.authDomain,
  projectId: firebaseAttributes.projectId,
  storageBucket: firebaseAttributes.storageBucket,
  messagingSenderId: firebaseAttributes.messagingSenderId,
  appId: firebaseAttributes.appId,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Google Sign-Up/Login
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user) {
      const token = await user.getIdToken();  // ✅ Get token
      console.log("Google Token:", token);    // Debugging
      localStorage.setItem("token", token);   // ✅ Store token in localStorage

      return user;
    }
  } catch (error) {
    console.error("Google Login Error:", error);
  }
};

export { auth, loginWithGoogle }; 