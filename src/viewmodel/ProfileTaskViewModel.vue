<template>
    <div>
        <h2>Task History</h2>

        <DataTable :value="userTaskRequests" responsiveLayout="scroll">
            <Column field="taskName" header="Task Name"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="createdAt" header="Requested At">
                <template #body="slotProps">
                    {{ formatTimestamp(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column header="Actions">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" @click="() => openDialog(slotProps.data.taskID)" outlined />
                </template>
            </Column>
        </DataTable>

        <!-- Dialog for detailed task view -->
        <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ minWidth: '50vw' }">
            <template #header>
                <h2>Task Details</h2>
            </template>
            <div v-if="selectedTask">
                <div class="flex justify-content-start gap-2 mb-1">
                    <h3>{{ selectedTask.title }}</h3>
                </div>
                <div class="flex justify-content-start gap-2 mb-1">
                    <p>{{ selectedTask.description }}</p>
                </div>
                <div class="flex justify-content-start gap-2 mb-1">
                    <p><strong>Status:</strong> {{ selectedTask.status }}</p>
                </div>
                <div class="flex justify-content-start gap-2 mb-1">
                    <p>
                        <strong>Affected Area:</strong> {{ affectedAreaDetails.area }}<br>{{
                            affectedAreaDetails.description
                        }}
                    </p>
                </div>
                <div class="flex justify-content-start gap-2 mb-1">
                    <div v-if="affectedAreaDetails.locationIDs.length > 0">
                        <p><strong>Evacuation Centres:</strong></p>
                        <ul>
                            <li v-for="locationId in affectedAreaDetails.locationIDs" :key="locationId">
                                <span v-if="locationNames[locationId]">
                                    <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationNames[locationId])}`"
                                        target="_blank" rel="noopener noreferrer">
                                        {{ locationNames[locationId] }}
                                    </a>
                                </span>
                                <span v-else>Loading...</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="feedback-section">
                    <h3>Feedback</h3>
                    <ul v-if="taskFeedback && taskFeedback.length > 0">
                        <li v-for="feedback in taskFeedback" :key="feedback.id">
                            <p><strong>User ID:</strong> {{ feedback.userID }}</p>
                            <p>{{ feedback.text }}</p>
                        </li>
                    </ul>
                    <p v-else>No feedback available.</p>
                </div>

                <OverlayPanel ref="op">
                    <p><strong>Name:</strong> {{ officerDetails.userFullName }} </p>
                    <p><strong>Email:</strong> {{ officerDetails.userEmail }} </p>
                    <p><strong>Number:</strong> {{ officerDetails.userContactNumber }} </p>

                </OverlayPanel>

                <OverlayPanel ref="op2">
                    <div class="flex justify-content-center m-3">
                        <p><strong>User ID:</strong> {{ currentUser.uid }}</p>
                    </div>
                    <div class="flex justify-content-center m-3">
                        <p><strong>Task ID:</strong> {{ selectedTask.id }}</p>
                    </div>
                    <div class="flex justify-content-center m-3">
                        <FloatLabel>
                            <InputText v-model="feedbackForm.feedbackText" />
                            <label for="feedbackText">Feedback</label>
                        </FloatLabel>
                    </div>
                    <div class="flex justify-content-center m-3">
                        <!-- Pass taskID to submitFeedback function -->
                        <Button label="Submit Feedback" @click="submitFeedback(selectedTask.id)" />
                    </div>
                </OverlayPanel>

            </div>
            <div v-else>
                <p>No task selected.</p>
            </div>
            <div class="flex justify-content-between mb-1">
                <span class="hidden">{{ selectedTask.pic }}</span>
                <Button label="Officer in Charge" icon="pi pi-eye" @click="toggle" outlined />
                <!-- Conditionally render "Give Feedback" button -->
                <Button v-if="shouldShowFeedbackButton()" label="Give Feedback" icon="pi pi-comment"
                    @click="toggleFeedbackPanel" outlined />
                <Button label="Close" @click="closeDialog" icon="pi pi-times-circle" severity="danger" outlined />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { projectAuth } from '@/firebase/config';
import { getTaskRequestListUID } from '@/model/TaskRequestModel';
import { fetchTaskById, updateTaskFeedback, fetchTaskFeedbackByID } from '@/model/TaskModel';
import { getUserFromFirestoreByID } from '@/model/UserModel';
import { getAffectedAreaByID } from '@/model/AffectedAreaModel'; // Adjust path as per your project structure
import { getLocationByID } from '@/model/LocationModel'; // Adjust path as per your project structure

const userTaskRequests = ref([]);
const dialogVisible = ref(false);
const selectedTask = ref(null);
const currentUser = projectAuth.currentUser;
const op = ref();
const op2 = ref();
const officerDetails = ref(null);
const affectedAreaDetails = ref(null); // Reference for affected area details
const locationNames = ref({}); // Object to store location names by ID
const taskFeedback = ref([]);

const toggle = (event) => {
    op.value.toggle(event);
    if (op.value.visible) {
        fetchOfficerDetails(selectedTask.value.pic);
    }
}

const toggleFeedbackPanel = (event) => {
    op2.value.toggle(event);
    // Additional logic if needed when opening the feedback panel
}

const shouldShowFeedbackButton = () => {
    if (!selectedTask.value || !selectedTask.value.status) {
        return false;
    }

    // Check if task request status is approved and task status is completed
    const isTaskRequestApproved = userTaskRequests.value.some(req => req.taskID === selectedTask.value.id && req.status === 'Approved');
    const isTaskCompleted = selectedTask.value.status === 'Completed';

    console.log(isTaskRequestApproved, isTaskCompleted)
    return isTaskRequestApproved && isTaskCompleted;
}

const feedbackForm = ref({
    feedbackText: ''
});

const submitFeedback = async (taskID) => {
    try {
        // Assuming currentUser and feedbackForm are available within the setup function
        const userID = currentUser.uid;
        const feedbackText = feedbackForm.value.feedbackText;

        console.log("task id:", taskID, "userID: ", userID, "feedback:", feedbackText)

        // Call updateTaskFeedback function to add feedback
        const result = await updateTaskFeedback(taskID, userID, feedbackText);

        if (result) {
            console.log('Feedback submitted successfully!');
            // Optionally, reset the form or perform any other actions after successful submission
            feedbackForm.feedbackText = '';
        } else {
            console.error('Failed to submit feedback.');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
};

onMounted(async () => {
    try {
        const userID = currentUser.uid; // Replace with actual user ID
        const taskRequests = await getTaskRequestListUID(userID); // Fetch initial user task requests

        // Fetch task details for each task request and merge with task requests
        const detailedRequests = await Promise.all(taskRequests.map(async (request) => {
            const taskDetails = await fetchTaskById(request.taskID);
            return {
                ...request,
                taskName: taskDetails.title, // Assuming task details have a 'title' field
            };
        }));

        userTaskRequests.value = detailedRequests;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

const fetchOfficerDetails = async (pic) => {
    try {
        const officer = await getUserFromFirestoreByID(pic);
        officerDetails.value = officer;
    } catch (error) {
        console.error('Error fetching officer details:', error);
    }
};

const openDialog = async (taskId) => {
    try {
        // Fetch detailed task information for the selected task
        selectedTask.value = await fetchTaskById(taskId);
        console.log("selected value:", selectedTask.value.id)

        // Fetch affected area details for the selected task
        if (selectedTask.value.affectedAreaID) {
            affectedAreaDetails.value = await getAffectedAreaByID(selectedTask.value.affectedAreaID);
            // Fetch location names for each location ID in affected area
            await fetchLocationNames(affectedAreaDetails.value.locationIDs);
        }

        taskFeedback.value = await fetchTaskFeedbackByID(taskId, currentUser.uid);

        dialogVisible.value = true;
    } catch (error) {
        console.error('Error fetching task details:', error);
    }
};

const closeDialog = () => {
    selectedTask.value = null;
    dialogVisible.value = false;
};

const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'N/A';
};

const fetchLocationNames = async (locationIDs) => {
    try {
        const promises = locationIDs.map(async (locationId) => {
            const location = await getLocationByID(locationId);
            return { id: locationId, name: location.locationName };
        });

        const results = await Promise.all(promises);
        const names = {};
        results.forEach((result) => {
            names[result.id] = result.name;
        });
        locationNames.value = names;
    } catch (error) {
        console.error('Error fetching location names:', error);
    }
};
</script>

<style>
.hidden {
    display: none;
    /* or visibility: hidden; or opacity: 0; depending on your needs */
}
</style>
