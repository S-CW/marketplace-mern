// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-marketplace-1a414.firebaseapp.com",
    projectId: "mern-marketplace-1a414",
    storageBucket: "mern-marketplace-1a414.appspot.com",
    messagingSenderId: "1055764826755",
    appId: "1:1055764826755:web:4197a5adac1eeeb9fc29b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);