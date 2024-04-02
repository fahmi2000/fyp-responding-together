import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';

import { projectAuth } from '@/firebase/config';

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