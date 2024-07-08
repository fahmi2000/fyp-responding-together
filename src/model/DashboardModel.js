import { collection, getDocs, where, query } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

// Function to fetch all affected areas count
export const getTotalAffectedAreas = async () => {
    try {
        const querySnapshot = await getDocs(collection(projectFirestore, 'affectedareas'));
        return querySnapshot.size; // Return the total number of documents in affectedAreas collection
    } catch (error) {
        console.error('Error fetching affected areas:', error);
        throw error;
    }
};

// Function to fetch all tasks count (both ongoing and completed)
export const getTotalTasks = async () => {
    try {
        const querySnapshot = await getDocs(collection(projectFirestore, 'tasks'));
        return querySnapshot.size; // Return the total number of documents in tasks collection
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

// Function to fetch all task requests count
export const getTotalTaskRequests = async () => {
    try {
        const querySnapshot = await getDocs(collection(projectFirestore, 'taskRequests'));
        return querySnapshot.size; // Return the total number of documents in taskRequests collection
    } catch (error) {
        console.error('Error fetching task requests:', error);
        throw error;
    }
};

export const getTotalVolunteers = async () => {
    try {
        const q = query(collection(projectFirestore, 'users'), where('userType', '==', 'Volunteer'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        throw error;
    }
};

export const getTotalOfficers = async () => {
    try {
        const q = query(collection(projectFirestore, 'users'), where('userType', '==', 'Officer'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error fetching officers:', error);
        throw error;
    }
};


// Function to fetch all feedback entries count
export const getTotalFeedbacks = async () => {
    try {
        const querySnapshot = await getDocs(collection(projectFirestore, 'locations'));
        return querySnapshot.size; // Return the total number of documents in locations collection
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};
