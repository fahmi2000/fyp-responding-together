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
import { projectAuth, projectFirestore, projectStorage } from '../firebase/config';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
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
            userFullName: userFullName || "",
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

export const createUserDocument = async (uid, userData) => {
    try {
        const userRef = doc(projectFirestore, 'users', uid);
        await setDoc(userRef, {
            uid,
            userEmail: userData.email,
            userFullName: userData.userFullName || "",
            userType: userData.userType,
            userContactNumber: userData.userContactNumber || "",
            userBio: userData.userBio || "",
            profilePicture: userData.profilePicture || "",
            createdAt: new Date().toISOString()
        });
        console.log(`User document created with UID: ${uid}`);
    } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
    }
};

export const getUserFromFirestore = async () => {
    try {
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const userRef = doc(projectFirestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error('User document not found in Firestore');
        }
    } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        throw error;
    }
};

export const getAllUsersFromFirestore = async () => {
    try {
        const querySnapshot = await getDocs(collection(projectFirestore, 'users'));
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error('Error fetching users from Firestore:', error);
        throw error;
    }
};

export const uploadProfilePictureToFirebase = async (file, uid) => {
    const storageReference = storageRef(projectStorage, `profilePictures/${uid}`);
    await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(storageReference);
    return downloadURL;
};

export const updateProfilePictureURLInFirestore = async (uid, url) => {
    const userRef = doc(projectFirestore, 'users', uid);
    await updateDoc(userRef, { profilePicture: url });
};

export const updateUserProfileInFirestore = async (uid, updatedData) => {
    try {
        const userRef = doc(projectFirestore, 'users', uid);
        await updateDoc(userRef, updatedData);
        console.log('User profile updated in Firestore');
    } catch (error) {
        console.error('Error updating user profile in Firestore:', error);
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

export const updatePasswordWithReauth = async (user, currentPassword, newPassword) => {
    try {
        // Reauthenticate user with their current credentials (old password)
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Once reauthentication is successful, update the password
        await firebaseUpdatePassword(user, newPassword);
        console.log('Password update successful');
        return { success: true };
    } catch (error) {
        console.error(`Error updating password: ${error.message}`);
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

const addUserFunction = httpsCallable(functions, 'addUser');
const deleteUserFunction = httpsCallable(functions, 'deleteUser');
const listUsersFunction = httpsCallable(functions, 'listUsers');

export const UserModel = {
    addUser: async (userData) => {
        const result = await addUserFunction(userData);
        return result;
    },

    deleteUser: async (uid) => {
        const result = await deleteUserFunction({ uid });
        return result.data;
    },

    listUsers: async () => {
        const result = await listUsersFunction();
        return result.data.users;  // Return just the users array
    },
};
