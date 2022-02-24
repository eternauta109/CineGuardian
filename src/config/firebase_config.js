// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIOvhQpaGP051Lq5Z975vZgUpvnSBH90g",
  authDomain: "maintenanceapp-a28d8.firebaseapp.com",
  projectId: "maintenanceapp-a28d8",
  storageBucket: "maintenanceapp-a28d8.appspot.com",
  messagingSenderId: "1031420039108",
  appId: "1:1031420039108:web:7a8b8cc92ee0dabd161e91",
  measurementId: "G-Y60F0NEV62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);


export const storage = getStorage(app);

export const db = getFirestore(app);

