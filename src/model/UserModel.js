import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword as firebaseUpdatePassword,
    updateEmail as firebaseUpdateEmail
} from 'firebase/auth';
import { projectAuth, projectFirestore } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { ref } from 'vue';

const user = ref()

projectAuth.onAuthStateChanged(_user => {
    console.log('From onAuthStateChanged, current user is:', _user)
    user.value = _user
})

export const getUser = () => {
    return { user }
}

export const createAccount = async (email, password) => {
    return createUserWithEmailAndPassword(projectAuth, email, password);
};

export const addUserToFirestore = async (user, email, userFullName, userType) => {
    try {
        const userRef = doc(projectFirestore, 'users', user.uid);
        await setDoc(userRef, {
            userEmail: email,
            userFullName: userFullName || "",  // Use userFullName directly
            userType: userType,
            userContactNumber: "",
            userArea: "",
            userSkill: [],
            userBio: "",
            createdAt: new Date().toISOString()
        });
        console.log('User added to Firestore');
    } catch (error) {
        console.error('Error adding user to Firestore:', error);
        throw error;
    }
};

export const addDisplayName = async (user, displayName) => {
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

// server-side logic
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const addUserWithRoleFunction = httpsCallable(functions, 'addUserWithRole');
const listUsersFunction = httpsCallable(functions, 'listUsers');
const listOfficersFunction = httpsCallable(functions, 'listOfficers');
const deleteUserFunction = httpsCallable(functions, 'deleteUser');

export const UserModel = {
    addUserWithRole: async (userData) => {
        const result = await addUserWithRoleFunction(userData);
        return result;
    },

    listUsers: async () => {
        const result = await listUsersFunction();
        return result.data.users;  // Return just the users array
    },

    listOfficers: async () => {
        const result = await listOfficersFunction();
        return result.data.users; // Return just the users array
    },

    deleteUser: async (uid) => {
        const result = await deleteUserFunction({ uid });
        return result.data;
    },
};
