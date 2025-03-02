// client/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBdZluDZR1Epu3fWUflXvgB9-4Wp0sVswQ",
  authDomain: "personal-finance-website-30226.firebaseapp.com",
  projectId: "personal-finance-website-30226",
  storageBucket: "personal-finance-website-30226.appspot.com",
  messagingSenderId: "364827721007",
  appId: "1:364827721007:web:4713a38a1dd27818f675da",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };