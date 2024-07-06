import { projectAuth, projectFirestore } from '../firebase/config';
import { getUserFromFirestore } from './UserModel'; // Adjust the import path as per your project structure
import { addDoc, serverTimestamp, getDocs, collection, getDoc, doc, updateDoc } from 'firebase/firestore';

const tasksCollection = collection(projectFirestore, 'tasks');

export async function addTask(newTask) {
    try {
        // Get current user's data from Firestore
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const userDoc = await getUserFromFirestore(currentUser.uid);

        // Prepare createdAt timestamp
        const createdAt = serverTimestamp();

        // Add the current user's information to the new task object
        const taskToAdd = {
            ...newTask,
            createdAt, // Add createdAt timestamp
            createdBy: currentUser.uid, // Use the current user's ID
            picDisplayName: userDoc.userFullName,
            picEmail: userDoc.userEmail
        };

        // Add the new task to Firestore
        const docRef = await addDoc(tasksCollection, taskToAdd);
        return { id: docRef.id, ...taskToAdd };
    } catch (error) {
        console.error('Error adding task: ', error);
        throw error;
    }
}
// Function to fetch all tasks
export const fetchTasks = async () => {
    try {
        const snapshot = await getDocs(tasksCollection);
        return snapshot.docs.map(doc => ({
            id: doc.id, // Include the document ID
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching tasks: ', error);
        throw error;
    }
};

export const fetchTaskById = async (taskId) => {
    try {
        const taskDoc = await getDoc(doc(projectFirestore, 'tasks', taskId));
        if (taskDoc.exists()) {
            return { id: taskDoc.id, ...taskDoc.data() };
        } else {
            throw new Error('Task not found');
        }
    } catch (error) {
        console.error('Error fetching task details: ', error);
        throw error;
    }
};

export async function updateUserTask(updatedTask) {
    try {
        const { id, ...taskToUpdate } = updatedTask;
        await updateDoc(doc(projectFirestore, 'tasks', id), taskToUpdate);
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}