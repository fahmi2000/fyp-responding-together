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
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, addDoc, query, deleteDoc, where } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
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

export const getUserSkillFromFirestoreArray = async (userIds) => {
    try {
        const userPromises = userIds.map(async (userId) => {
            const userRef = doc(projectFirestore, 'users', userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                return { id: userId, ...userDoc.data() };
            } else {
                throw new Error(`User document not found for ID: ${userId}`);
            }
        });

        const users = await Promise.all(userPromises);
        return users;
    } catch (error) {
        console.error('Error fetching users from Firestore:', error);
        throw error;
    }
};

export const getUserFromFirestoreByID = async (pic) => {
    try {
        const picRef = doc(projectFirestore, 'users', pic);
        const picDoc = await getDoc(picRef);

        if (picDoc.exists()) {
            return { id: picDoc.id, ...picDoc.data() };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        throw error;
    }
};

export const deleteUserFromFirestore = async (userId) => {
    try {
        // Specify the document reference to the user document
        const userRef = doc(projectFirestore, 'users', userId);

        // Delete the document from Firestore
        await deleteDoc(userRef);

        console.log(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error; // Rethrow the error for handling upstream
    }
};

export const getAllOfficers = async () => {
    try {
        // Construct a query to fetch all users where userType is 'Officer'
        const q = query(collection(projectFirestore, 'users'), where('userType', '==', 'Officer'));

        // Execute the query and get the query snapshot
        const querySnapshot = await getDocs(q);

        // Initialize an empty array to store officer users
        const officers = [];

        // Iterate through the query snapshot and populate the officers array
        querySnapshot.forEach((doc) => {
            officers.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return officers; // Return the array of officer users
    } catch (error) {
        console.error('Error fetching officers:', error);
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

// user skill
export const addUserSkillToFirestore = async (userId, skillData) => {
    try {
        const userSkillsRef = collection(projectFirestore, 'users', userId, 'userSkills');
        await addDoc(userSkillsRef, skillData);
        console.log('User skill added to Firestore');
    } catch (error) {
        console.error('Error adding user skill to Firestore:', error);
        throw error;
    }
};

export const getUserSkillFromFirestore = async (userId) => {
    try {
        const userSkillCollectionRef = collection(projectFirestore, 'users', userId, 'userSkills');
        const userSkillQuery = query(userSkillCollectionRef);
        const userSkillSnapshot = await getDocs(userSkillQuery);

        let userSkills = [];

        userSkillSnapshot.forEach((doc) => {
            userSkills.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return userSkills;
    } catch (error) {
        console.error('Error fetching user skills from Firestore:', error);
        throw error;
    }
};

export const uploadPDFToStorage = async (file, uid, skillName) => {
    try {
        const storage = getStorage();
        const fileRef = storageRef(storage, `certifications/${uid}/${skillName}.pdf`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading PDF to Storage:', error);
        throw error;
    }
};

export const editUserSkillInFirestore = async (userId, skillId, updatedSkillData) => {
    try {
        const skillRef = doc(projectFirestore, `users/${userId}/userSkill`, skillId);
        await updateDoc(skillRef, updatedSkillData);
        console.log('User skill updated in Firestore');
    } catch (error) {
        console.error('Error updating user skill in Firestore:', error);
        throw error;
    }
};

export const deleteUserSkillFromFirestore = async (userId, skillId) => {
    try {
        const skillRef = doc(projectFirestore, `users/${userId}/userSkills`, skillId);
        await deleteDoc(skillRef);
        console.log('Skill deleted successfully');
    } catch (error) {
        console.error('Error deleting skill:', error);
        throw error;
    }
};

export const getUserTaskRequests = async (userID) => {
    try {
        const userTasksCollection = collection(projectFirestore, 'users', userID, 'userTasks');
        const q = query(userTasksCollection);
        const snapshot = await getDocs(q);

        // Map the snapshot to an array of tasks with document IDs
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return tasks;
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        throw error;
    }
};
//////////////////

//auth logic
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
