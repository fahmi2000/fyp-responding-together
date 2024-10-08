import { projectFirestore, projectAuth } from '../firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { getUserFromFirestore } from '@/model/UserModel';

const affectedAreasCollection = collection(projectFirestore, 'affectedareas');

// Function to get all affected areas
export async function getAllAffectedAreas() {
    try {
        const snapshot = await getDocs(affectedAreasCollection);
        let affectedAreas = [];
        snapshot.forEach(doc => {
            affectedAreas.push({ id: doc.id, ...doc.data() });
        });
        return affectedAreas;
    } catch (error) {
        console.error('Error getting affected areas: ', error);
        throw error;
    }
}

export async function getAffectedAreaByID(areaID) {
    try {
        const areaDocRef = doc(affectedAreasCollection, areaID);
        const areaDocSnapshot = await getDoc(areaDocRef);

        if (areaDocSnapshot.exists()) {
            return { id: areaDocSnapshot.id, ...areaDocSnapshot.data() };
        } else {
            throw new Error(`Affected area with ID ${areaID} does not exist.`);
        }
    } catch (error) {
        console.error('Error getting affected area by ID:', error);
        throw error;
    }
}

// Function to add a new affected area
export async function addAffectedArea(newArea) {
    try {
        // Get current user's data from Firestore
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const userDoc = await getUserFromFirestore(currentUser.uid);

        // Prepare createdAt timestamp
        const createdAt = serverTimestamp();

        // Add the current user's information to the new area object
        const areaToAdd = {
            ...newArea,
            createdAt, // Add createdAt timestamp
            reportedBy: {
                userID: currentUser.uid,
                displayName: userDoc.userFullName, // Assuming userDoc has this field
                email: userDoc.userEmail // Assuming userDoc has this field
                // Add other relevant fields as needed
            }
        };

        // Add the new affected area to Firestore
        const docRef = await addDoc(affectedAreasCollection, areaToAdd);
        return docRef.id;
    } catch (error) {
        console.error('Error adding affected area: ', error);
        throw error;
    }
}

// Function to update an affected area
export async function updateAffectedArea(id, newData) {
    try {
        const areaDoc = doc(affectedAreasCollection, id);
        await updateDoc(areaDoc, newData);
    } catch (error) {
        console.error('Error updating affected area: ', error);
        throw error;
    }
}

// Function to delete an affected area
export async function deleteAffectedArea(id) {
    try {
        const areaDoc = doc(affectedAreasCollection, id);
        await deleteDoc(areaDoc);
    } catch (error) {
        console.error('Error deleting affected area: ', error);
        throw error;
    }
}
