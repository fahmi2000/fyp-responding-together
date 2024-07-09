import { projectAuth, projectFirestore } from '../firebase/config';
import { getUserFromFirestore } from './UserModel';
import { addDoc, serverTimestamp, getDocs, collection, getDoc, doc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';

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

export const addTaskToUserSubcollection = async (userID, taskID, taskData) => {
    try {
        const userTasksRef = collection(projectFirestore, 'users', userID, 'userTasks');
        await addDoc(userTasksRef, {
            taskID,
            ...taskData,
            feedback: '' // Set initial feedback as needed
            // Add more fields as necessary
        });
        console.log('Task added to user subcollection successfully');
    } catch (error) {
        console.error('Error adding task to user subcollection:', error);
        throw error;
    }
};

export const addVolunteerToTask = async (taskId, volunteerId) => {
    const taskRef = doc(projectFirestore, 'tasks', taskId);
    try {
        await updateDoc(taskRef, {
            volunteerIDs: arrayUnion(volunteerId)
        });
        console.log('Volunteer added to task');
    } catch (error) {
        console.error('Error adding volunteer to task:', error);
        throw error;
    }
};


export const updateTaskFeedback = async (taskID, userID, feedbackText) => {
    try {
        console.log("task model", taskID)
        const feedbackRef = collection(projectFirestore, 'tasks', taskID, 'feedback');
        const feedback = {
            userID: userID,
            text: feedbackText,
            taskID: taskID
        };

        // Add the feedback document to the 'feedback' subcollection

        await addDoc(feedbackRef, feedback);

        console.log('Feedback added successfully!');
        return true; // Or return the newly created feedback document ID if needed
    } catch (error) {
        console.error('Error adding feedback:', error);
        return false;
    }
};

export const fetchTaskFeedbackByTaskID = async (taskId) => {
    try {
        const feedbackRef = collection(projectFirestore, 'tasks', taskId, 'feedback');
        const feedbackSnapshot = await getDocs(feedbackRef);
        const feedbackList = feedbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return feedbackList;
    } catch (error) {
        console.log(taskId)
        console.error('Error fetching feedback:', error);
        return [];
    }
};

export const fetchTaskFeedbackByID = async (taskId, userId) => {
    try {
        const feedbackRef = collection(projectFirestore, 'tasks', taskId, 'feedback');
        const q = query(feedbackRef, where('userID', '==', userId));
        const feedbackSnapshot = await getDocs(q);
        const feedbackList = feedbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return feedbackList;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return [];
    }
};