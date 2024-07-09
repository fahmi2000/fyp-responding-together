<template>
    <div>
        <!-- PrimeVue Dialog for adding task -->
        <Dialog v-model:visible="addTaskDialogVisible" modal header="Add Task" :style="{ minWidth: '25rem' }">
            <div class="flex justify-content-center">
                <form @submit.prevent="handleAddTask">
                    <div class="flex align-items-center gap-3 mb-5 mt-4">
                        <FloatLabel>
                            <InputText id="newTaskTitle" v-model="newTaskTitle" autocomplete="off"
                                :style="{ minWidth: '25rem' }" />
                            <label for="newTaskTitle">Task Title</label>
                        </FloatLabel>
                    </div>
                    <div class="flex align-items-center gap-3 mb-5">
                        <FloatLabel>
                            <Textarea id="newTaskDescription" v-model="newTaskDescription" autocomplete="off"
                                :style="{ minWidth: '25rem' }" rows="5" cols="30" />
                            <label for="newTaskDescription">Task Description</label>
                        </FloatLabel>
                    </div>
                    <div class="flex align-items-center gap-3 mb-5">
                        <FloatLabel>
                            <Dropdown id="selectedOfficer" v-model="selectedOfficer" :options="officersTaskAdd"
                                optionLabel="userFullName" optionValue="id" placeholder="Select an Officer"
                                :style="{ minWidth: '25rem' }" />
                            <label for="selectedOfficer">Select Officer</label>
                        </FloatLabel>
                    </div>
                    <div class="flex align-items-center gap-3 mb-5">
                        <FloatLabel>
                            <MultiSelect id="selectedCategories" v-model="selectedCategories" :options="categoryOptions"
                                optionLabel="label" optionValue="value" placeholder="Select Categories"
                                :style="{ minWidth: '25rem' }" />
                            <label for="selectedCategories">Select Categories</label>
                        </FloatLabel>
                    </div>

                    <div class="flex align-items-center gap-3 mb-5">
                        <FloatLabel>
                            <Dropdown id="selectedArea" v-model="selectedArea" :options="affectedAreasTaskAdd"
                                optionLabel="area" optionValue="id" placeholder="Select an Affected Area"
                                :style="{ minWidth: '25rem' }" />
                            <label for="selectedArea">Select Affected Area</label>
                        </FloatLabel>
                    </div>
                    <div class="flex justify-content-end gap-2">
                        <Button type="button" label="Cancel" icon="pi pi-times-circle"
                            @click="addTaskDialogVisible = false" severity="danger" outlined></Button>
                        <Button type="submit" label="Save" icon="pi pi-save"></Button>
                    </div>
                </form>
            </div>
        </Dialog>

        <!-- Button to show the dialog -->
        <div class="flex align-items-center justify-content-between mb-5">
            <h1>Tasks Browser</h1>
            <div>
                <Button label="Add Task" icon="pi pi-plus" class="add-task-button" @click="addTaskDialogVisible = true"
                    v-if="userType !== 'Volunteer'" />
            </div>
        </div>
        <DataTable :value="tasks" responsiveLayout="scroll" sortField="status" :sortOrder="-1">
            <Column field="title" header="Title">
                <template #body="slotProps">
                    <span>{{ slotProps.data.title }}</span>
                </template>
            </Column>
            <Column field="description" header="Description">
                <template #body="slotProps">
                    <span>{{ slotProps.data.description }}</span>
                </template>
            </Column>
            <Column field="pic" header="Officer">
                <template #body="slotProps">
                    {{ usersDict[slotProps.data.pic]?.userFullName || slotProps.data.pic }}
                </template>
            </Column>
            <Column field="affectedAreaID" header="Affected Area">
                <template #body="slotProps">
                    {{ areasDict[slotProps.data.affectedAreaID]?.area ||
                        areasDict[slotProps.data.affectedAreaID]?.description ||
                        slotProps.data.affectedAreaID }}
                </template>
            </Column>
            <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                    {{ slotProps.data.status }}
                </template>
            </Column>
            <Column header="">
                <template #body="{ data }">
                    <Button icon="pi pi-pen-to-square" severity="contrast" @click="handleEditShow(data)" outlined />
                </template>
            </Column>
        </DataTable>

        <Dialog header="Task Details" v-model:visible="displayDialog" :closable="true" modal
            :style="{ minWidth: '25rem' }">
            <div v-if="selectedTask">
                <div class="grid">
                    <div class="col">
                        <div>
                            <div class="flex justify-content-start gap-2 mb-5 mt-4">
                                <FloatLabel>
                                    <InputText id="Title" v-model="editedTask.title" :style="{ minWidth: '25rem' }"
                                        :disabled="userType === 'Volunteer'" />
                                    <label for="Title">Title</label>
                                </FloatLabel>
                            </div>
                            <div class="flex justify-content-start gap-2 mb-5">
                                <FloatLabel>
                                    <Textarea v-model="editedTask.description" id="description"
                                        :style="{ minWidth: '25rem' }" rows="5" cols="30"
                                        :disabled="userType === 'Volunteer'" />
                                    <label for="description">Description</label>
                                </FloatLabel>
                            </div>
                            <div class="flex justify-content-start gap-2 mb-5">
                                <FloatLabel>
                                    <Dropdown v-model="editedTask.status" :options="statusOptions" optionLabel="label"
                                        optionValue="value" id="status" :style="{ minWidth: '25rem' }"
                                        :disabled="userType === 'Volunteer'" /> <label for="status">Current
                                        Status</label>
                                </FloatLabel>
                            </div>
                            <div class="flex justify-content-start gap-2 mb-2">
                                <FloatLabel>
                                    <MultiSelect id="editedCategories" v-model="editedCategories"
                                        :options="categoryOptions" optionLabel="label" optionValue="value"
                                        placeholder="Select Categories" :style="{ maxWidth: '25rem' }"
                                        :disabled="userType === 'Volunteer'" />
                                    <label for="editedCategories">Categories</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div>
                            <div class="flex align-content-start gap-2 mb-2">
                                <div>
                                    <span class="text-xs">Task Created By</span><br>
                                    <span class="line-height-4">{{ usersDict[selectedTask.createdBy]?.userFullName ||
                                        selectedTask.createdBy }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-content-start gap-2 mb-2">
                                <div>
                                    <span class="text-xs">Officer in Charge</span><br>
                                    <span class="line-height-4">{{ usersDict[selectedTask.pic]?.userFullName ||
                                        selectedTask.pic
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-content-start gap-2 mt-3">
                                <div>
                                    <span class="text-xs">Affected Area</span><br>
                                    <span class="line-height-4 font-medium">{{
                                        areasDict[selectedTask.affectedAreaID]?.area ||
                                        selectedTask.affectedAreaID }}</span><br>
                                    <span class="line-height-1">{{ areasDict[selectedTask.affectedAreaID]?.description
                                        || selectedTask.affectedAreaID }}</span><br>

                                </div>
                            </div>
                            <div class="flex justify-content-start gap-2 mt-3">
                                <div>
                                    <span class="text-xs">Evacuation Centres</span><br>
                                    <ul class="list-decimal">
                                        <li v-for="locationID in areasDict[selectedTask.affectedAreaID].locationIDs"
                                            :key="locationID">
                                            <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationNames[locationID])}`"
                                                target="_blank" rel="noopener noreferrer">{{ locationNames[locationID]
                                                }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col">

                        <div class="flex justify-content-start gap-2 mb-3">
                            <div>
                                <span class="text-xs">Approved Volunteers</span><br>
                                <span class="line-height-1">
                                    <ul class="list-decimal">
                                        <li v-for="volunteerID in editedTask.volunteerIDs" :key="volunteerID">
                                            {{ usersDict[volunteerID]?.userFullName || volunteerID }}
                                        </li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-content-start gap-2 mb-3">
                            <div>
                                <span class="text-xs">Feedbacks</span><br>
                                <ul v-if="feedback.length > 0" class="list-decimal">
                                    <li v-for="fb in feedback" :key="fb.id">
                                        {{ fb.text }}
                                    </li>
                                </ul>
                                <p v-else>No feedback available for this task.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-content-end gap-2 mb-2">
                    <Button label="Save" icon="pi pi-save" @click="handleSaveChanges" v-if="userType !== 'Volunteer'" />
                    <Button label="Request to Join" icon="pi pi-send" @click="handleSubmitRequest"
                        v-if="userType === 'Volunteer'" />
                </div>
                <div class="flex justify-content-end gap-2 mb-2">

                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { addTask, fetchTasks, updateUserTask, addTaskToUserSubcollection, fetchTaskFeedbackByTaskID } from '@/model/TaskModel';
import { getUserFromFirestore, getAllUsersFromFirestore, getUserSkillFromFirestoreArray } from '@/model/UserModel';
import { getAllAffectedAreas } from '@/model/AffectedAreaModel';
import { addTaskRequest } from '@/model/TaskRequestModel';
import { getLocationByID } from '@/model/LocationModel';
import { projectAuth } from '@/firebase/config';

// Reactive references
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const selectedOfficer = ref(null);
const selectedArea = ref(null);
const officersTaskAdd = ref([]);
const affectedAreasTaskAdd = ref([]);
const addTaskDialogVisible = ref(false);

const tasks = ref([]);
const currentUser = ref(null);
const officers = ref([]);
const affectedAreas = ref([]);
const usersDict = ref({});
const areasDict = ref({});
const displayDialog = ref(false);
const selectedTask = ref(null);
const editedTask = ref(null);
const feedback = ref([]);

const userType = ref('');
const currentUserAuth = projectAuth.currentUser;


const editedCategories = ref([]);
const selectedCategories = ref([]);
const categoryOptions = ref([
    { label: 'Medical Support', value: 'Medical Support' },
    { label: 'Logistics and Supply Management', value: 'Logistics and Supply Management' },
    { label: 'Food and Nutrition', value: 'Food and Nutrition' },
    { label: 'Child and Elderly Care', value: 'Child and Elderly Care' },
    { label: 'Community Outreach and Support', value: 'Community Outreach and Support' }
]);

const statusOptions = ref([
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
]);

// Method to handle adding a task
const handleAddTask = async () => {
    if (newTaskTitle.value && newTaskDescription.value && selectedOfficer.value && selectedArea.value && selectedCategories.value.length > 0) {
        const newTask = {
            title: newTaskTitle.value,
            description: newTaskDescription.value,
            pic: selectedOfficer.value,
            affectedAreaID: selectedArea.value,
            categories: selectedCategories.value,
            status: 'Ongoing',
            volunteerIDs: [],
            feedback: ''
        };

        try {
            await addTask(newTask);
            // Reset form fields and dialog visibility
            newTaskTitle.value = '';
            newTaskDescription.value = '';
            selectedOfficer.value = null;
            selectedArea.value = null;
            selectedCategories.value = [];
            addTaskDialogVisible.value = false;
            fetchTasks(); // Refresh tasks after adding
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
};

// Method to handle showing edit dialog
const handleEditShow = async (task) => {
    try {
        selectedTask.value = task;
        editedTask.value = { ...task };
        editedCategories.value = task.categories; // Populate the categories field
        displayDialog.value = true;

        // Fetch feedback for the selected task
        const taskId = task.id; // Assuming taskID is the correct property name
        console.log("taskid:", task.id)
        feedback.value = await fetchTaskFeedbackByTaskID(taskId);
    } catch (error) {
        console.error('Error handling edit show:', error);
    }
};

// Method to handle saving changes to a task
const handleSaveChanges = async () => {
    try {
        editedTask.value.categories = editedCategories.value; // Update the categories in the edited task
        await updateUserTask(editedTask.value);
        const index = tasks.value.findIndex(task => task.id === editedTask.value.id);
        if (index !== -1) {
            tasks.value[index] = { ...editedTask.value };
        }
        displayDialog.value = false;
    } catch (error) {
        console.error('Error saving changes:', error);
    }
};

// Method to handle submitting a request to join a task
const handleSubmitRequest = async () => {
    try {
        if (!selectedTask.value || !selectedTask.value.id) {
            console.error('Invalid selected task:', selectedTask.value);
            return;
        }
        const taskID = selectedTask.value.id;
        const pic = selectedTask.value.pic; // Extract pic from selectedTask
        const userID = currentUserAuth ? currentUserAuth.uid : null;

        await addTaskToUserSubcollection(userID, taskID, {
            feedback: ''
        });

        // Include pic in the task request object
        await addTaskRequest({ taskID, pic });
        console.log('Task request submitted successfully!');
    } catch (error) {
        console.error('Error submitting task request:', error);
    }
};
const locationNames = ref({});
// Computed property to fetch and store location names
const fetchLocationNames = async () => {
    const names = {};
    const locationIDs = areasDict.value[selectedTask.value?.affectedAreaID]?.locationIDs || [];

    try {
        const locationFetchPromises = locationIDs.map(async (locationID) => {
            const location = await getLocationByID(locationID);
            names[locationID] = location.locationName; // Assuming 'locationName' is the field you want to display
        });

        await Promise.all(locationFetchPromises);
    } catch (error) {
        console.error('Error fetching location names:', error);
        // Handle error if needed
    }

    locationNames.value = names; // Update the reactive reference
};

watch([selectedTask, areasDict], fetchLocationNames, { immediate: true });

// Method to fetch location name asynchronously
const getLocationName = async (locationID) => {
    try {
        const location = await getLocationByID(locationID);
        return location.name;
    } catch (error) {
        console.error('Error fetching location:', error);
        return 'Location Not Found';
    }
};

// Fetch initial data on component mount
onMounted(async () => {
    try {
        // Fetch all users
        const users = await getAllUsersFromFirestore();
        usersDict.value = users.reduce((dict, user) => {
            dict[user.id] = user;
            return dict;
        }, {});

        // Filter officers and affected areas
        officersTaskAdd.value = users.filter(user => user.userType === 'Officer');
        const areas = await getAllAffectedAreas();
        affectedAreasTaskAdd.value = areas;
        areasDict.value = areas.reduce((dict, area) => {
            dict[area.id] = area;
            return dict;
        }, {});

        // Fetch tasks
        tasks.value = await fetchTasks();
        console.log("task value", tasks.value);

        // Fetch current user data
        const user = await getUserFromFirestore();
        currentUser.value = user;
        userType.value = user.userType;

        // Fetch additional data related to tasks (volunteers, etc.)
        const volunteerIDs = new Set();
        tasks.value.forEach(task => {
            task.volunteerIDs.forEach(volunteerID => volunteerIDs.add(volunteerID));
        });
        const volunteerUsers = await getUserSkillFromFirestoreArray(Array.from(volunteerIDs));
        volunteerUsers.forEach(volunteer => {
            usersDict.value[volunteer.id] = volunteer;
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});


</script>
