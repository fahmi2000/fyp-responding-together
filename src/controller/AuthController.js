// /src/controller/AuthController.js
import { ref } from 'vue';
import { signIn, forgotPassword, signOut } from '@/model/UserModel'; // Adjusted function names

const error = ref('');

// Updated to match the specified action - requestSignIn
const requestSignIn = async (email, password) => {
    error.value = '';

    try {
        const res = await signIn(email, password); // Adjusted to the new function name
        console.log(`Login successful: ${res.user.uid}`);
        // Potential place to emit an event or call redirectDashboard directly
        return 'redirectDashboard'; // Placeholder response to indicate action
    } catch (err) {
        console.error(`Login error: ${err.message}`);
        error.value = 'Incorrect login credentials';
        return 'displayErrorMessage'; // Placeholder response to indicate action
    }
};

// Function to handle forgot password requests
const requestForgotPassword = async (email) => {
    try {
        await forgotPassword(email);
        console.log('Password reset email sent.');
        // Here you might want to inform the user that an email has been sent
    } catch (err) {
        console.error(`Error sending reset email: ${err.message}`);
        error.value = 'Error sending password reset email';
    }
};

const requestSignOut = async () => {
    error.value = null;
    try {
        await signOut();
        // Additional actions upon successful logout, if necessary
    } catch (err) {
        console.error(err.message);
        error.value = err.message;
    }
};
// Placeholder functions for actions that might be handled differently, 
// such as through Vue Router for redirects or local state for displaying messages

export const useAuthController = () => {
    return { error, requestSignIn, requestForgotPassword, requestSignOut };
};
