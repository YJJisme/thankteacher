import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, getDocs, setDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, getDocs, setDoc };
