// /src/controller/ProfileController.js
import { ref, onMounted } from 'vue';
import { projectAuth } from "@/firebase/config";
import { updateUserProfile, getCurrentUser } from '@/model/UserModel';

const user = ref(null);
const error = ref('');

// Function to listen for auth state changes and update the user ref
const fetchCurrentUser = () => {
    projectAuth.onAuthStateChanged(_user => {
        console.log('User state change, current user is:', _user);
        user.value = _user; // This could be a detailed user object fetched from the database
    });
};

// Function to update the user profile information
const updateProfile = async (displayName) => {
    error.value = '';
    try {
        if (!user.value) throw new Error("No authenticated user.");
        await updateUserProfile(user.value, displayName);
    } catch (err) {
        console.error(`Profile update error: ${err.message}`);
        error.value = err.message;
    }
};

export const useProfileController = () => {
    onMounted(fetchCurrentUser); // Fetch current user information when the component mounts

    return { user, error, updateProfile };
};
