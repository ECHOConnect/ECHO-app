// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQhjqTnJI76v5TM70E91QRcjOgK1XvVPc",
  authDomain: "echo-connect-4ec59.firebaseapp.com",
  projectId: "echo-connect-4ec59",
  storageBucket: "echo-connect-4ec59.firebasestorage.app",
  messagingSenderId: "10342144652",
  appId: "1:10342144652:web:53d265853b32a331a4f9a9",
  measurementId: "G-TYBX1X1XV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)

export default { app, analytics, storage }

