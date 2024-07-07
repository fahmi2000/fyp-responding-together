<template>
    <div>
        <h1>Tasks Requests</h1>

        <!-- Display task requests -->
        <DataTable v-if="enrichedTaskRequests.length > 0" :value="enrichedTaskRequests" responsiveLayout="scroll">
            <Column field="volunteerFullName" header="Volunteer Name"></Column>
            <Column field="taskTitle" header="Task Title"></Column>
            <Column field="taskDescription" header="Task Description"></Column>
            <Column field="createdAt" header="Requested At">
                <template #body="slotProps">{{ new Date(slotProps.data.createdAt.seconds * 1000 +
                    slotProps.data.createdAt.nanoseconds / 1000000).toLocaleString() }}</template>
            </Column>
            <Column field="status" header="Status"></Column>
            <Column header="">
                <template #body="{ data }">
                    <Button icon="pi pi-pen-to-square" @click="callEditTaskRequest(data)" outlined
                        v-if="userType !== 'Volunteer'" />
                    <Button icon="pi pi-trash" @click="callDeleteTaskRequest(data.id)" severity="danger" outlined
                        v-if="userType === 'Volunteer'" />
                </template>
            </Column>
        </DataTable>
        <p v-else>No request made.</p>

        <!-- Dialog for editing task request -->
        <Dialog v-model:visible="displayDialog" header="Task Request" modal :style="{ minWidth: '50rem' }">
            <div v-if="selectedTaskRequest">
                <Avatar :image="volunteerInfo.profilePicture || 'default-avatar-url.png'" shape="circle"
                    size="xlarge" />
                <div class="grid">
                    <div class="col">

                        <p><strong>Name:</strong> {{ volunteerInfo.userFullName }}</p>
                        <p><strong>Email:</strong> {{ volunteerInfo.userEmail }}</p>
                        <p><strong>Area:</strong> {{ volunteerInfo.userArea }}</p>
                        <p><strong>Bio:</strong> {{ volunteerInfo.userBio }}</p>
                        <p><strong>Contact Number:</strong> {{ volunteerInfo.userContactNumber }}</p>

                        <div v-if="userSkills.length > 0">
                            <h5>User Skills:</h5>
                            <ul>
                                <li v-for="skill in userSkills" :key="skill.id">{{ skill.skillName }} - {{
                                    skill.skillLevel }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col">
                        <p><strong>Task ID:</strong> {{ selectedTaskRequest.taskID }}</p>
                        <p><strong>Task Title:</strong> {{ selectedTaskRequest.taskTitle }}</p>
                        <p><strong>Task Description:</strong> {{ selectedTaskRequest.taskDescription }}</p>
                        <p><strong>Requested At:</strong> {{ selectedTaskRequest.requestedAt }}</p>
                        <p><strong>Status:</strong> {{ selectedTaskRequest.status }}</p>


                    </div>
                </div>
                <div class="flex justify-content-end gap-2 mb-5">
                    <Dropdown v-model="editedStatus" :options="statusOptions" optionLabel="label" optionValue="value">
                    </Dropdown>
                    <Button label="Save" @click="saveChanges" icon="pi pi-save" />
                </div>

            </div>
        </Dialog>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchTaskRequests, updateTaskRequest, deleteTaskRequest, fetchUserFromUsers, getUserSkillFromFirestore, fetchTaskRequestsByPicID, fetchTaskRequestsByVolunteerID } from '@/model/TaskRequestModel';
import { fetchTaskById } from '@/model/TaskModel';
import { getUserFromFirestore } from '@/model/UserModel';
import { projectAuth, projectFirestore, } from '../firebase/config';

const taskRequests = ref([]);
const selectedTaskRequest = ref(null);
const editedStatus = ref();
const displayDialog = ref(false);
const volunteerInfo = ref(null); // To store volunteer information
const userSkills = ref([]); // To store user skills
const userType = ref('');
const currentUser = ref(null);

const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
];

const fetchTaskRequestsHandler = async () => {
    try {
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        const user = await getUserFromFirestore();
        userType.value = user.userType;
        console.log('User Type:', userType.value);
        console.log('User Type:', currentUser.uid);

        if (userType.value === 'Volunteer') {
            taskRequests.value = await fetchTaskRequestsByVolunteerID(currentUser.uid);
            console.log('Displaying volunteer view')
        } else {
            taskRequests.value = await fetchTaskRequestsByPicID(currentUser.uid);
        }

        await enrichTaskRequests(); // Enrich task requests with additional details
    } catch (error) {
        console.error('Error fetching task requests:', error);
    }
};

onMounted(fetchTaskRequestsHandler);

// Method to edit a task request
const callEditTaskRequest = async (taskRequest) => {
    selectedTaskRequest.value = taskRequest;
    editedStatus.value = taskRequest.status;

    // Fetch volunteer information based on volunteerID
    try {
        volunteerInfo.value = await fetchUserFromUsers(taskRequest.volunteerID);
    } catch (error) {
        console.error(`Error fetching volunteer info for volunteerID ${taskRequest.volunteerID}:`, error);
    }

    // Fetch user skills based on volunteerID
    try {
        userSkills.value = await getUserSkillFromFirestore(taskRequest.volunteerID);
    } catch (error) {
        console.error(`Error fetching user skills for volunteerID ${taskRequest.volunteerID}:`, error);
    }

    displayDialog.value = true;
};

// Method to save changes to a task request
const saveChanges = async () => {
    if (selectedTaskRequest.value && editedStatus.value) {
        selectedTaskRequest.value.status = editedStatus.value;
        try {
            await updateTaskRequest(selectedTaskRequest.value);
            displayDialog.value = false;
            selectedTaskRequest.value = null;
        } catch (error) {
            console.error('Error updating task request:', error);
        }
    }
};

// Method to delete a task request
const callDeleteTaskRequest = async (taskId) => {
    if (confirm('Are you sure you want to delete this task request?')) {
        try {
            await deleteTaskRequest(taskId);
            taskRequests.value = taskRequests.value.filter(request => request.id !== taskId);
        } catch (error) {
            console.error('Error deleting task request:', error);
        }
    }
};

// Function to enrich task requests with volunteer's full name and task details
const enrichTaskRequests = async () => {
    for (let i = 0; i < taskRequests.value.length; i++) {
        const taskRequest = taskRequests.value[i];

        // Fetch volunteer information
        try {
            const volunteerInfo = await fetchUserFromUsers(taskRequest.volunteerID);
            taskRequest.volunteerFullName = volunteerInfo.userFullName;
        } catch (error) {
            console.error(`Error enriching task request with volunteer info for volunteerID ${taskRequest.volunteerID}:`, error);
        }

        // Fetch task information
        try {
            const taskInfo = await fetchTaskById(taskRequest.taskID);
            taskRequest.taskTitle = taskInfo.title;
            taskRequest.taskDescription = taskInfo.description;
        } catch (error) {
            console.error(`Error enriching task request with task info for taskID ${taskRequest.taskID}:`, error);
        }
    }
};

// Computed property to return enriched task requests
const enrichedTaskRequests = computed(() => taskRequests.value);

</script>
