import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyDZfkkIkRCg5xHB3Qz2WeQYgsyeF_QjMos",
    authDomain: "fyp2-rt.firebaseapp.com",
    projectId: "fyp2-rt",
    storageBucket: "fyp2-rt.appspot.com",
    messagingSenderId: "733056774104",
    appId: "1:733056774104:web:94433a1c0958d6485dccad"
};

const app = initializeApp(firebaseConfig);
const projectAuth = getAuth(app);
const projectFirestore = getFirestore(app);
const functions = getFunctions(app);

const timestamp = serverTimestamp;

export {
    projectAuth, projectFirestore, timestamp, functions
};
