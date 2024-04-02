import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged // Import onAuthStateChanged
} from 'firebase/auth';
import { projectAuth } from '@/firebase/config';
import { ref } from 'vue'; // Import ref from Vue for reactivity

// Reactive reference for the current user
const currentUser = ref(null);

// Listen for auth state changes and update currentUser accordingly
onAuthStateChanged(projectAuth, (_user) => {
    console.log('User state change, current user is:', _user);
    currentUser.value = _user; // Update the currentUser reactive reference
});

export const createAccount = async (email, password) => {
    return createUserWithEmailAndPassword(projectAuth, email, password);
};

export const updateUserProfile = async (user, displayName) => {
    return updateProfile(user, { displayName });
};

export const signIn = async (email, password) => {
    return signInWithEmailAndPassword(projectAuth, email, password);
};

export const forgotPassword = async (email) => {
    return sendPasswordResetEmail(projectAuth, email);
};

export const signOut = async () => {
    try {
        await projectAuth.signOut();
    } catch (err) {
        throw err;
    }
};

// Export a function to get the current user
export const getCurrentUser = () => {
    return currentUser;
};
