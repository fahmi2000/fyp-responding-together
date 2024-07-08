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
        <Dialog v-model:visible="dialogVisible" modal header="Add New Skill" :style="{ minWidth: '25rem' }">
            <form @submit.prevent="addSkill">
                <div class="flex justify-content-start gap-2 mb-5 mt-4">
                    <FloatLabel>
                        <InputText id="skillName" v-model="currentSkill.skillName" required autocomplete="off"
                            :style="{ minWidth: '25rem' }" />
                        <label for="skillName">Brief Description</label>
                    </FloatLabel>
                </div>
                <div class="flex justify-content-start gap-2 mb-5">
                    <FloatLabel>
                        <Dropdown id="skillCategory" v-model="currentSkill.skillCategory" :options="skillCategories"
                            optionLabel="label" optionValue="value" required :style="{ minWidth: '25rem' }" />
                        <label for="skillCategory">Category</label>
                    </FloatLabel>
                </div>

                <div class="flex justify-content-start gap-2 mb-5">
                    <FloatLabel>
                        <Dropdown id="skillLevel" v-model="currentSkill.skillLevel" :options="skillLevels"
                            optionLabel="label" optionValue="value" required :style="{ minWidth: '25rem' }" />
                        <label for="skillLevel">Level</label>
                    </FloatLabel>
                </div>
                <div class="flex justify-content-start gap-2 mb-5">
                    <label for="certificationFile">Upload Certification (PDF)</label>
                    <input type="file" id="certificationFile" @change="handleFileUpload" accept="application/pdf"
                        required />

                </div>

                <div class="flex justify-content-end gap-2 mb-1">
                    <Button label="Cancel" @click="closeDialog" icon="pi pi-times-circle" severity="danger" outlined />
                    <Button type="submit" label="Add Skill" icon="pi pi-file-plus" />
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
    skillCategory: null,
    skillLevel: null, // Default value, dropdown will set this
    certification: null
});
const certificationFile = ref(null);

const skillLevels = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
];

const skillCategories = [
    { label: 'Medical Support', value: 'Medical Support' },
    { label: 'Logistics and Supply Management', value: 'Logistics and Supply Management' },
    { label: 'Food and Nutrition', value: 'Food and Nutrition' },
    { label: 'Child and Elderly Care', value: 'Child and Elderly Care' },
    { label: 'Community Outreach and Support', value: 'Community Outreach and Support' }
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