// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZfkkIkRCg5xHB3Qz2WeQYgsyeF_QjMos",
    authDomain: "fyp2-rt.firebaseapp.com",
    projectId: "fyp2-rt",
    storageBucket: "fyp2-rt.appspot.com",
    messagingSenderId: "733056774104",
    appId: "1:733056774104:web:94433a1c0958d6485dccad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const projectAuth = getAuth(app);
const projectFirestore = getFirestore(app);

// New way to get a timestamp
const timestamp = serverTimestamp;

export {
    projectAuth, projectFirestore, timestamp
};
