<template>
    <div class="profile-skills">
        <div class="flex overflow-hidden">
            <div class="flex-none flex align-items-center justify-content-center m-2 px-5 py-3">
                <h3>Skills and Expertise</h3>
            </div>
            <div class="flex-none flex align-items-center justify-content-center m-2 px-5 py-3">
                <Button label="Add Skill" icon="pi pi-plus" @click="dialogVisible = true"
                    class="p-button-outlined p-button-rounded" />
            </div>
        </div>

        <div v-if="userSkills.length === 0">
            <p>No skills added yet. Add skills to display here.</p>
        </div>

        <div v-else>
            <Card v-for="(skill, index) in userSkills" :key="index" class="flex mb-5">
                <template #title>
                    {{ skill.skillName }}
                </template>
                <template #subtitle>
                    <p><strong>Category:</strong> {{ skill.skillCategory }}</p>
                    <p><strong>Level:</strong> {{ skill.skillLevel }}</p>
                    <p v-if="skill.certification">
                        <strong>Certification:</strong> <a :href="skill.certification.url" target="_blank">{{
                            skill.certification.name }}</a>
                    </p>
                    <div class="flex justify-content-end mt-3">
                        <Button icon="pi pi-trash" @click="deleteSkill(skill.id)"
                            class="p-button-rounded p-button-danger" />
                    </div>
                </template>
            </Card>
        </div>

        <!-- Dialog for adding a new skill -->
        <Dialog v-model:visible="dialogVisible" modal header="Add New Skill" :style="{ width: '30rem' }">
            <form @submit.prevent="addSkill">
                <div class="p-fluid">
                    <div class="p-field">
                        <label for="skillName">Skill Name</label>
                        <InputText id="skillName" v-model="currentSkill.skillName" required autocomplete="off" />
                    </div>
                    <div class="p-field">
                        <label for="skillCategory">Category</label>
                        <InputText id="skillCategory" v-model="currentSkill.skillCategory" required
                            autocomplete="off" />
                    </div>
                    <div class="p-field">
                        <label for="skillLevel">Level</label>
                        <Dropdown id="skillLevel" v-model="currentSkill.skillLevel" :options="skillLevels"
                            optionLabel="label" optionValue="value" required />
                    </div>
                    <div class="p-field">
                        <label for="certificationFile">Upload Certification (PDF)</label>
                        <input type="file" id="certificationFile" @change="handleFileUpload" accept="application/pdf"
                            required />
                    </div>
                </div>
                <div class="p-dialog-footer">
                    <Button type="button" label="Cancel" class="p-button-secondary" @click="closeDialog" />
                    <Button type="submit" label="Add Skill" class="p-button-primary" />
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getUserSkillFromFirestore, addUserSkillToFirestore, deleteUserSkillFromFirestore, uploadPDFToStorage } from '@/model/UserModel';
import { projectAuth } from '@/firebase/config';

const currentUser = projectAuth.currentUser;
const userSkills = ref([]);
const dialogVisible = ref(false);
const currentSkill = ref({
    skillName: '',
    skillCategory: '',
    skillLevel: null, // Default value, dropdown will set this
    certification: null
});
const certificationFile = ref(null);

const skillLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
];

// Fetch user skills on component mount
const fetchUserSkills = async () => {
    try {
        if (currentUser) {
            const userId = currentUser.uid;
            userSkills.value = await getUserSkillFromFirestore(userId);
        } else {
            throw new Error('No user logged in');
        }
    } catch (error) {
        console.error('Failed to fetch user skills:', error);
        // Handle error gracefully (e.g., show error message to user)
    }
};

// Function to handle file upload
const handleFileUpload = (event) => {
    certificationFile.value = event.target.files[0];
};

// Function to add a new skill
const addSkill = async () => {
    try {
        if (currentUser) {
            const userId = currentUser.uid;
            if (certificationFile.value) {
                const downloadURL = await uploadPDFToStorage(certificationFile.value, userId, currentSkill.value.skillName);
                currentSkill.value.certification = { name: certificationFile.value.name, url: downloadURL };
            }
            await addUserSkillToFirestore(userId, currentSkill.value);
            // Clear the form after successful addition
            currentSkill.value = {
                skillName: '',
                skillCategory: '',
                skillLevel: null,
                certification: null
            };
            certificationFile.value = null;
            // Close the dialog
            closeDialog();
            // Refresh user skills list
            await fetchUserSkills();
        } else {
            throw new Error('No user logged in');
        }
    } catch (error) {
        console.error('Failed to add skill:', error);
        // Handle error gracefully (e.g., show error message to user)
    }
};

// Function to delete a skill
const deleteSkill = async (skillId) => {
    try {
        if (currentUser) {
            const userId = currentUser.uid;
            await deleteUserSkillFromFirestore(userId, skillId);
            // Refresh user skills list
            await fetchUserSkills();
        } else {
            throw new Error('No user logged in');
        }
    } catch (error) {
        console.error('Failed to delete skill:', error);
        // Handle error gracefully (e.g., show error message to user)
    }
};

// Function to close the dialog
const closeDialog = () => {
    dialogVisible.value = false;
    currentSkill.value = {
        skillName: '',
        skillCategory: '',
        skillLevel: null,
        certification: null
    };
    certificationFile.value = null;
};

// Fetch user skills on component mount
fetchUserSkills();
</script>