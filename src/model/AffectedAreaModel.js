import { projectFirestore, projectAuth } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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

// Function to add a new affected area
export async function addAffectedArea(newArea) {
    try {
        // Get current user's data from Firestore
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const userDoc = await getUserFromFirestore(currentUser.uid);

        // Add the current user's information to the new area object
        const areaToAdd = {
            ...newArea,
            reportedBy: {
                userID: currentUser.uid,
                displayName: userDoc.userFullName, // Use appropriate field from userDoc
                email: userDoc.userEmail // Use appropriate field from userDoc
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
