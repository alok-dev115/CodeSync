import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyBcuzNeMwS6aotQFMC2FAIOQ89_N1P55Uc",
  authDomain: "lost-found-app-c0f6f.firebaseapp.com",
  projectId: "lost-found-app-c0f6f",
  storageBucket: "lost-found-app-c0f6f.firebasestorage.app",
  messagingSenderId: "1037503224290",
  appId: "1:1037503224290:web:fecc1ae140247a714ac1bb"
};; 


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
