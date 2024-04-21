import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword as firebaseUpdatePassword,
    updateEmail as firebaseUpdateEmail
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

// Reauthenticate user
export const reauthenticate = async (user, currentPassword) => {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
        await reauthenticateWithCredential(user, credential);
        return { success: true };
    } catch (error) {
        console.error(`Reauthentication error: ${error.message}`);
        return { success: false, error: error.message };
    }
};

// Update user password
export const updatePassword = async (user, newPassword) => {
    try {
        await firebaseUpdatePassword(user, newPassword);
        console.log('Password update successful');
        return { success: true };
    } catch (error) {
        console.error(`Password update error: ${error.message}`);
        return { success: false, error: error.message };
    }
};

// Function to update user's email
export const updateEmail = async (user, newEmail) => {
    try {
        await firebaseUpdateEmail(user, newEmail);
        console.log('Email update successful');
        return { success: true };
    } catch (error) {
        console.error(`Email update error: ${error.message}`);
        return { success: false, error: error.message };
    }
};

export const validateOfficerForm = (officerData) => {
    // Simple validation logic; should be extended as needed
    if (officerData.email && officerData.password) {
        return { valid: true };
    } else {
        return { valid: false };
    }
};
