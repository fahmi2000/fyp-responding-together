import { ref } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const createUserFunction = httpsCallable(functions, 'createUser');

export const useManageOfficerController = () => {
    const message = ref('');

    const createUser = async (userData) => {
        message.value = 'Creating user...';

        try {
            const result = await createUserFunction(userData);
            message.value = `User created successfully: ${result.data.uid}`;
        } catch (error) {
            console.error('Failed to create user:', error);
            message.value = `Error: ${error.message}`;
        }
    };

    return {
        message,
        createUser,
    };
};
