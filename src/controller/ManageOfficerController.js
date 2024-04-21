import { ref } from 'vue';
import { validateOfficerForm } from '@/model/UserModel';

const message = ref('');

export const useManageOfficerController = () => {
    async function requestAddOfficerForm() {
        // Display the form in the view; already handled by Vue's reactivity
    }

    async function cancelSubmitOfficerForm() {
        // Optionally, perform cleanup or state management
        message.value = '';
    }

    async function submitOfficerForm(officerData) {
        const validationResult = await validateOfficerForm(officerData);
        if (validationResult.valid) {
            message.value = 'Valid form. Processing...';
            // Here you would typically call a Cloud Function to create the officer
        } else {
            message.value = 'Invalid form. Please correct the errors and try again.';
        }
    }

    return {
        requestAddOfficerForm,
        cancelSubmitOfficerForm,
        submitOfficerForm,
        message,
    };
};
