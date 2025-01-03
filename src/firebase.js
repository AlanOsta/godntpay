import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "godntpay.firebaseapp.com",
  projectId: "godntpay",
  storageBucket: "godntpay.firebasestorage.app",
  messagingSenderId: "319803165939",
  appId: "1:319803165939:web:b460f5a22763481e463b86"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
