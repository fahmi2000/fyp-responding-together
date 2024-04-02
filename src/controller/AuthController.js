import { ref } from 'vue';
import { signIn, forgotPassword, signOut } from '@/model/UserModel';

const error = ref('');

const requestSignIn = async (email, password) => {
    error.value = '';

    try {
        const res = await signIn(email, password);
        console.log(`Login successful: ${res.user.uid}`);
        return 'redirectDashboard';
    } catch (err) {
        console.error(`Login error: ${err.message}`);
        error.value = 'Incorrect login credentials';
        return 'displayErrorMessage';
    }
};

const requestForgotPassword = async (email) => {
    error.value = '';
    try {
        await forgotPassword(email);
        console.log('Password reset email sent.');
    } catch (err) {
        console.error(`Error sending reset email: ${err.message}`);
        error.value = 'Error sending password reset email';
    }
};

const requestSignOut = async () => {
    error.value = null;
    try {
        await signOut();

    } catch (err) {
        console.error(err.message);
        error.value = err.message;
    }
};

export const useAuthController = () => {
    return { error, requestSignIn, requestForgotPassword, requestSignOut };
};
