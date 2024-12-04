// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// modifikasi src/utils/firebase.ts
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBH5nvOw_cTg8TYPNVYrhZt_VsBdzPhgag",
  authDomain: "responsi-aeb40.firebaseapp.com",
  projectId: "responsi-aeb40",
  storageBucket: "responsi-aeb40.firebasestorage.app",
  messagingSenderId: "651343619807",
  appId: "1:651343619807:web:e9548d9b75527d67392b6a",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };
