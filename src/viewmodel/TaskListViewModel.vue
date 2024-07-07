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
                <div class="flex justify-content-start gap-2 mb-5 mt-4">
                    <FloatLabel>
                        <InputText id="Title" v-model="editedTask.title" :style="{ minWidth: '25rem' }" />
                        <label for="Title">Title</label>
                    </FloatLabel>
                </div>
                <div class="flex justify-content-start gap-2 mb-5">
                    <FloatLabel>
                        <Textarea v-model="editedTask.description" id="description" :style="{ minWidth: '25rem' }"
                            rows="5" cols="30" />
                        <label for="description">Description</label>
                    </FloatLabel>
                </div>
                <div class="flex justify-content-start gap-2 mb-2">
                    <FloatLabel>
                        <Dropdown v-model="editedTask.status" :options="statusOptions" optionLabel="label"
                            optionValue="value" id="status" :style="{ minWidth: '25rem' }" /> <label
                            for="status">Status</label>
                    </FloatLabel>
                </div>
                <div class="flex justify-content-start gap-2 mb-2">
                    <p><strong>Created By - </strong> {{ usersDict[selectedTask.createdBy]?.userFullName ||
                        selectedTask.createdBy }}
                    </p>
                </div>
                <div class="flex justify-content-start gap-2 mb-2">
                    <p><strong>Officer - </strong> {{ usersDict[selectedTask.pic]?.userFullName || selectedTask.pic }}
                    </p>
                </div>
                <div class="flex justify-content-start gap-2 mb-2">
                    <p><strong>Affected Area - </strong> {{ areasDict[selectedTask.affectedAreaID]?.area ||
                        selectedTask.affectedAreaID }} - {{ areasDict[selectedTask.affectedAreaID]?.description ||
                            selectedTask.affectedAreaID }}</p>
                </div>

                <div class="flex justify-content-end gap-2 mb-2">
                    <Button label="Save" icon="pi pi-save" @click="handleSaveChanges" v-if="userType !== 'Volunteer'" />
                    <Button label="Request to Join" icon="pi pi-send" @click="handleSubmitRequest" />
                </div>
                <div class="flex justify-content-end gap-2 mb-2">

                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { addTask, fetchTasks, updateUserTask } from '@/model/TaskModel';
import { getUserFromFirestore, getAllUsersFromFirestore } from '@/model/UserModel';
import { getAllAffectedAreas } from '@/model/AffectedAreaModel';
import { addTaskRequest } from '@/model/TaskRequestModel';

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
const userType = ref('');


const statusOptions = ref([
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
]);

const handleAddTask = async () => {
    if (newTaskTitle.value && newTaskDescription.value && selectedOfficer.value && selectedArea.value) {
        const newTask = {
            title: newTaskTitle.value,
            description: newTaskDescription.value,
            pic: selectedOfficer.value,
            affectedAreaID: selectedArea.value,
            status: 'Ongoing',
            volunteerIDs: [],
            feedback: ''
        };

        try {
            await addTask(newTask);
            newTaskTitle.value = '';
            newTaskDescription.value = '';
            selectedOfficer.value = null;
            selectedArea.value = null;
            addTaskDialogVisible.value = false;
            fetchTasks(); // Refresh tasks after adding
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
};

const handleEditShow = (task) => {
    selectedTask.value = task;
    editedTask.value = { ...task };
    displayDialog.value = true;
};

const handleSaveChanges = async () => {
    try {
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

const handleSubmitRequest = async () => {
    try {
        if (!selectedTask.value || !selectedTask.value.id) {
            console.error('Invalid selected task:', selectedTask.value);
            return;
        }
        const taskID = selectedTask.value.id;
        const pic = selectedTask.value.pic; // Extract pic from selectedTask

        // Include pic in the task request object
        await addTaskRequest({ taskID, pic });
        console.log('Task request submitted successfully!');
    } catch (error) {
        console.error('Error submitting task request:', error);
    }
};

onMounted(async () => {
    try {
        const users = await getAllUsersFromFirestore();

        officersTaskAdd.value = users.filter(user => user.userType === 'Officer');

        const areas = await getAllAffectedAreas();
        affectedAreasTaskAdd.value = areas;

        const fetchedTasks = await fetchTasks();
        tasks.value = fetchedTasks;

        const user = await getUserFromFirestore();
        userType.value = user.userType;
        currentUser.value = user;

        users.forEach(user => {
            usersDict.value[user.id] = user;
            if (user.userType === 'Officer') {
                officers.value.push(user);
            }
        });

        areas.forEach(area => {
            areasDict.value[area.id] = area;
            affectedAreas.value.push(area);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

</script>
