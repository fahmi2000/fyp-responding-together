<template>
    <div class="profile-skills">
        <h2>User Skills</h2>

        <div v-if="userSkills.length === 0">
            <p>No skills added yet. Add skills to display here.</p>
        </div>

        <div v-else>
            <p v-for="(skill, index) in userSkills" :key="index">
                <strong>Skill Name:</strong> {{ skill.skillName }}<br>
                <strong>Category:</strong> {{ skill.skillCategory }}<br>
                <strong>Level:</strong> {{ skill.skillLevel }}<br>
            </p>
        </div>

        <!-- Dialog for adding a new skill -->
        <Dialog v-model:visible="dialogVisible" modal header="Add New Skill" :style="{ width: '30rem' }">
            <form @submit.prevent="addSkill">
                <div class="p-fluid">
                    <div class="p-field">
                        <label for="skillName">Skill Name</label>
                        <InputText id="skillName" v-model="newSkill.skillName" required autocomplete="off" />
                    </div>
                    <div class="p-field">
                        <label for="skillCategory">Category</label>
                        <InputText id="skillCategory" v-model="newSkill.skillCategory" required autocomplete="off" />
                    </div>
                    <div class="p-field">
                        <label for="skillLevel">Level</label>
                        <Dropdown id="skillLevel" v-model="newSkill.skillLevel" :options="skillLevels"
                            optionLabel="label" optionValue="value" required />
                    </div>
                </div>
                <div class="p-dialog-footer">
                    <Button type="button" label="Cancel" class="p-button-secondary" @click="closeDialog" />
                    <Button type="submit" label="Add Skill" class="p-button-primary" />
                </div>
            </form>
        </Dialog>

        <!-- Button to open the dialog -->
        <Button label="Add Skill" icon="pi pi-plus" @click="dialogVisible = true" />

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getUserSkillFromFirestore, addUserSkillToFirestore } from '@/model/UserModel';
import { projectAuth } from '@/firebase/config';

const currentUser = projectAuth.currentUser;
const userSkills = ref([]);
const dialogVisible = ref(false);
const newSkill = ref({
    skillName: '',
    skillCategory: '',
    skillLevel: null // Default value, dropdown will set this
});

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

// Function to add a new skill
const addSkill = async () => {
    try {
        if (currentUser) {
            const userId = currentUser.uid;
            await addUserSkillToFirestore(userId, newSkill.value);
            // Clear the form after successful addition
            newSkill.value = {
                skillName: '',
                skillCategory: '',
                skillLevel: null
            };
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

// Function to close the dialog
const closeDialog = () => {
    dialogVisible.value = false;
};

// Fetch user skills on component mount
fetchUserSkills();
</script>

<style scoped>
.profile-skills {
    margin-top: 20px;
}

.profile-skills p {
    margin-bottom: 10px;
}

form {
    margin-top: 20px;
}

.p-dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.p-field {
    margin-bottom: 20px;
}

.p-button-secondary {
    margin-right: 10px;
}
</style>
