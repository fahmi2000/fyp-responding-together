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
                <h3>Task Details</h3>
            </template>
            <div v-if="selectedTask">
                <p><strong>Task Title:</strong> {{ selectedTask.title }}</p>
                <p><strong>Task Description:</strong> {{ selectedTask.description }}</p>
                <p><strong>Task Status:</strong> {{ selectedTask.status }}</p>
                <p><strong>Affected Area:</strong> {{ selectedTask.affectedAreaID }}</p>
                <p><strong>Officer In Charge:</strong> {{ selectedTask.pic }} <Button type="button" icon="pi pi-image"
                        label="Image" @click="toggle" /></p>
                <OverlayPanel ref="op">
                    <p><strong>Name:</strong> {{ officerDetails.userFullName }} </p>
                    <p><strong>Email:</strong> {{ officerDetails.userEmail }} </p>
                    <p><strong>Number:</strong> {{ officerDetails.userContactNumber }} </p>
                </OverlayPanel>
            </div>
            <div v-else>
                <p>No task selected.</p>
            </div>
            <div class="p-dialog-footer">
                <Button label="Close" @click="closeDialog" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { projectAuth } from '@/firebase/config';
import { getTaskRequestListUID } from '@/model/TaskRequestModel';
import { fetchTaskById } from '@/model/TaskModel';
import { getUserFromFirestoreByID } from '@/model/UserModel';

const userTaskRequests = ref([]);
const dialogVisible = ref(false);
const selectedTask = ref(null);
const currentUser = projectAuth.currentUser;
const op = ref();
const officerDetails = ref(null);

const toggle = (event) => {
    op.value.toggle(event);
    if (op.value.visible) {
        fetchOfficerDetails(selectedTask.value.pic);
        console.log("VISIBLE", selectedTask.value.pic)
    }
}

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
        console.log(officerDetails)
    } catch (error) {
        console.error('Error fetching officer details:', error);
    }
};

const openDialog = async (taskId) => {
    try {
        // Fetch detailed task information for the selected task
        selectedTask.value = await fetchTaskById(taskId);
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
</script>

<style>
/* Add your custom styles here */
</style>
