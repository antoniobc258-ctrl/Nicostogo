// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9dobaVoq63pJ4jnfh_raoxNfXVnVy_iw",
  authDomain: "nicostogo.firebaseapp.com",
  projectId: "nicostogo",
  storageBucket: "nicostogo.firebasestorage.app",
  messagingSenderId: "398161894027",
  appId: "1:398161894027:web:9ef614a426031653b5928e",
  measurementId: "G-KWHLR19NP1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
