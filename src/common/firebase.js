// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCOqjZC0tDtKpVWEzXbWyQDGw6zEBlhynU",
  authDomain: "en-ac-e6057.firebaseapp.com",
  databaseURL: "https://en-ac-e6057-default-rtdb.firebaseio.com",
  projectId: "en-ac-e6057",
  storageBucket: "en-ac-e6057.firebasestorage.app",
  messagingSenderId: "336246921508",
  appId: "1:336246921508:web:7480d624b71f442a70bbb1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
