// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";

//TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnDm0L34YOeeOXJWyR0aVYXyeES89ZNsg",
  authDomain: "shoutout-board-47bac.firebaseapp.com",
  projectId: "shoutout-board-47bac",
  storageBucket: "shoutout-board-47bac.firebasestorage.app",
  messagingSenderId: "818695833371",
  appId: "1:818695833371:web:cc7d988e9291b374fbb5be",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, collection, getDocs, onSnapshot, orderBy, query };
