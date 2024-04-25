import { ref, onMounted } from 'vue';
import { projectAuth } from "@/firebase/config";
import { getUser, reauthenticate, updatePassword, updateEmail } from '@/model/UserModel';

const user = ref(null);
const error = ref('');

const fetchCurrentUser = () => {
    projectAuth.onAuthStateChanged(_user => {
        console.log('User state change, current user is:', _user);
        user.value = _user; // This could be a detailed user object fetched from the database
    });
};

const updateProfile = async (displayName) => {
    error.value = '';
    try {
        if (!user.value) throw new Error("No authenticated user.");
        // Assuming updateUserProfile is correctly defined in UserModel
        await updateUserProfile(user.value, displayName);
    } catch (err) {
        console.error(`Profile update error: ${err.message}`);
        error.value = err.message;
    }
};

const reauthenticateUser = async (currentPassword) => {
    if (!user.value) {
        error.value = "No authenticated user.";
        return false;
    }

    const credential = EmailAuthProvider.credential(user.value.email, currentPassword);
    try {
        await reauthenticateWithCredential(user.value, credential);
        return true; // Re-authentication successful
    } catch (err) {
        error.value = `Re-authentication failed: ${err.message}`;
        return false;
    }
};

const changePassword = async (currentPassword, newPassword) => {
    error.value = ''; // Reset error message

    // Ensure the user is authenticated
    if (!user.value) {
        error.value = "You must be logged in to update your password.";
        return;
    }

    // Reauthenticate the user first
    const reauthResult = await reauthenticate(user.value, currentPassword);
    if (!reauthResult.success) {
        error.value = reauthResult.error;
        return;
    }

    // Proceed with password update
    const updateResult = await updatePassword(user.value, newPassword);
    if (!updateResult.success) {
        error.value = updateResult.error;
        return;
    }

    // Successful password change
    console.log("Password has been updated successfully.");
};

// Function within useProfileController to handle email updates
const changeEmail = async (newEmail) => {
    error.value = ''; // Reset error message

    if (!user.value) {
        error.value = "You must be logged in to update your email.";
        return;
    }

    const updateResult = await updateEmail(user.value, newEmail);
    if (!updateResult.success) {
        error.value = updateResult.error;
        return;
    }

    // Email update was successful
    console.log("Email has been updated successfully.");
};

export const useProfileController = () => {
    onMounted(fetchCurrentUser);

    return { user, error, updateProfile, reauthenticateUser, changePassword, changeEmail };
};
