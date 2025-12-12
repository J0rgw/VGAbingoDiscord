import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCP40HWw6TJf9rQoRyRd-HUTqS3-l6xXRM",
  authDomain: "vgadiscord.firebaseapp.com",
  databaseURL: "https://vgadiscord-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vgadiscord",
  storageBucket: "vgadiscord.firebasestorage.app",
  messagingSenderId: "893609353376",
  appId: "1:893609353376:web:a1a7b9a9c6786a7528a9c5",
  measurementId: "G-2W4NWCE3RY"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
