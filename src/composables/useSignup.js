import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { projectAuth } from '../firebase/config';
import { ref } from 'vue';

const error = ref(null);

const signup = async (email, password, userName) => {
    error.value = null;

    try {
        const res = await createUserWithEmailAndPassword(projectAuth, email, password);
        if (!res) {
            throw new Error('Could not complete the signup!');
        }
        if (userName) {
            await updateProfile(res.user, { displayName: userName });
        }
        error.value = null;
        console.log(`Signup successful. User ID: ${res.user.uid}, Display Name: ${res.user.displayName}`);
    } catch (err) {
        console.error(err.message);
        error.value = err.message;
    }
};

export default function useSignup() {
    return {
        error, signup
    };
}
