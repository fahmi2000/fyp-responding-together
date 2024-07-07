// TaskRequestModel.js

import { projectAuth, projectFirestore, } from '../firebase/config';
import { collection, doc, getDoc, getDocs, updateDoc, addDoc, query, deleteDoc, serverTimestamp, where } from 'firebase/firestore';

const taskRequestsCollection = collection(projectFirestore, 'taskRequests');


// Fetch all task requests
export const fetchTaskRequests = async () => {
    try {
        const snapshot = await getDocs(taskRequestsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching task requests:', error);
        throw error;
    }
};

export const fetchTaskRequestsByVolunteerID = async (volunteerID) => {
    try {
        const q = query(taskRequestsCollection, where("volunteerID", "==", volunteerID));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching task requests by volunteer ID:', error);
        throw error;
    }
};

export const fetchTaskRequestsByPicID = async (pic) => {
    try {
        const q = query(taskRequestsCollection, where("pic", "==", pic));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching task requests by PIC ID:', error);
        throw error;
    }
};

export const getTaskRequestListUID = async (volunteerID) => {
    try {
        const q = query(taskRequestsCollection, where('volunteerID', '==', volunteerID));
        const snapshot = await getDocs(q);

        // Map the snapshot to an array of task requests with document IDs
        const taskRequests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return taskRequests;
    } catch (error) {
        console.error('Error fetching task requests:', error);
        throw error;
    }
};

export const fetchUserFromUsers = async (volunteerID) => {
    try {
        const userRef = doc(projectFirestore, 'users', volunteerID);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            throw new Error(`User document not found for volunteerID: ${volunteerID}`);
        }
    } catch (error) {
        console.error('Error fetching user from Firestore:', error);
        throw error;
    }
};

export const getUserSkillFromFirestore = async (volunteerID) => {
    try {
        const userSkillCollectionRef = collection(projectFirestore, 'users', volunteerID, 'userSkills');
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


// Add a new task request
export const addTaskRequest = async (taskRequest) => {
    try {
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const { taskID } = taskRequest; // Extract taskID from taskRequest

        const taskRequestToAdd = {
            ...taskRequest,
            volunteerID: currentUser.uid, // Use the current user's ID
            status: "Pending",
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(taskRequestsCollection, taskRequestToAdd);
        return { id: docRef.id, ...taskRequestToAdd };
    } catch (error) {
        console.error('Error adding task request:', error);
        throw error;
    }
};

// Update an existing task request
export const updateTaskRequest = async (taskRequest) => {
    const { id, ...requestData } = taskRequest;
    try {
        const taskRequestDocRef = doc(taskRequestsCollection, id);
        await updateDoc(taskRequestDocRef, requestData);
    } catch (error) {
        console.error('Error updating task request:', error);
        throw error;
    }
};

// Delete a task request
export const deleteTaskRequest = async (taskId) => {
    try {
        const taskRequestDocRef = doc(taskRequestsCollection, taskId);
        await deleteDoc(taskRequestDocRef);
    } catch (error) {
        console.error('Error deleting task request:', error);
        throw error;
    }
};