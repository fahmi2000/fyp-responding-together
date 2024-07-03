<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <div>
        <InputText v-model="filters.global.value" placeholder="Search Area..." class="global-filter" />
      </div>
      <div>
        <Button v-if="userType !== 'Volunteer'" label="Add New Area" icon="pi pi-plus" @click="showDialog = true" />
      </div>
    </div>
    <DataTable :value="affectedAreas" :filters="filters"
      :globalFilterFields="['description', 'reportedBy.displayName', 'area']" responsiveLayout="scroll"
      sortField="createdAt" :sortOrder="-1" ref="dtaa" size="large" paginator :rows="5">
      <template #header>
        <div style="text-align: left" class="flex justify-content-start mb-3" v-if="userType !== 'Volunteer'">
          <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
        </div>
      </template>
      <Column field="type" header="Type"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="area" header="Area"></Column>
      <Column header="Locations">
        <template #body="slotProps">
          <div v-for="locationID in slotProps.data.locationIDs" :key="locationID">
            <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getLocationName(locationID))}`"
              target="_blank" rel="noopener noreferrer">
              {{ getLocationName(locationID) }}
            </a>
          </div>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">{{ new Date(slotProps.data.createdAt.seconds * 1000 +
          slotProps.data.createdAt.nanoseconds / 1000000).toLocaleString() }}</template>
      </Column>
      <Column field="status" header="Status"></Column>
      <Column header="Actions" v-if="userType === 'Admin'">
        <template #body="slotProps">
          <button @click="deleteArea(slotProps.data.id)">Delete</button>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model="showDialog" :visible="showDialog" header="Add New Affected Area" :modal="true" @hide="clearForm()"
      :style="{ minWidth: '25rem' }">
      <form @submit.prevent="addNewArea" class="p-fluid">
        <div class="flex justify-content-start gap-2 mb-5">
          <Dropdown :style="{ minWidth: '25rem' }" id="type" v-model="newArea.type" :options="typeOptions"
            placeholder="Select a Type" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <InputText id="description" v-model="newArea.description" placeholder="Description" required />
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <Dropdown :style="{ minWidth: '25rem' }" id="area" v-model="newArea.area" :options="areaOptions"
            placeholder="Select an Area" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <MultiSelect :style="{ minWidth: '25rem' }" id="locations" v-model="selectedLocations" :options="locations"
            optionLabel="locationName" optionValue="id" placeholder="Select Locations" display="chip" filter />
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <Dropdown :style="{ minWidth: '25rem' }" id="status" v-model="newArea.status" :options="statusOptions"
            placeholder="Select a Status" optionLabel="label" optionValue="value" />
        </div>

        <div class="flex justify-content-start gap-2 mb-3">
          <Button type="submit" label="Add" />
          <Button type="button" label="Cancel" class="p-button-secondary" @click="hideDialog" />
        </div>
      </form>
    </Dialog>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getAllAffectedAreas, addAffectedArea, deleteAffectedArea } from '@/model/AffectedAreaModel'; // Adjust the path as per your project structure
import { getUserFromFirestore } from '@/model/UserModel';
import LocationModel from "@/model/LocationModel"; // Adjust the path as per your project structure
import { FilterMatchMode } from 'primevue/api';

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const affectedAreas = ref([]);
const newArea = ref({
  description: '',
  area: null, // Initialize area as null
  type: null,
  status: null,
});
const locations = ref([]);
const selectedLocations = ref([]);
const showDialog = ref(false); // Reactive variable to control dialog visibility
const userType = ref(''); // Initialize userType as an empty string

// Options for the dropdown
const areaOptions = ref([
  { label: 'Select an Area', value: null },
  { label: 'Batu Pahat', value: 'Batu Pahat' },
  { label: 'Johor Bahru', value: 'Johor Bahru' },
  { label: 'Kluang', value: 'Kluang' },
  { label: 'Kota Tinggi', value: 'Kota Tinggi' },
  { label: 'Kulai', value: 'Kulai' },
  { label: 'Tangkak', value: 'Tangkak' },
  { label: 'Mersing', value: 'Mersing' },
  { label: 'Muar', value: 'Muar' },
  { label: 'Pontian', value: 'Pontian' },
  { label: 'Segamat', value: 'Segamat' }
]);

const typeOptions = ref([
  { label: 'Select a Type', value: null },
  { label: 'Earthquake/Tsunami', value: 'Earthquake/Tsunami' },
  { label: 'Strong Wind & Rough Sea', value: 'Strong Wind & Rough Sea' },
  { label: 'Thunderstorm', value: 'Thunderstorm' },
  { label: 'Continuous Heavy Rain', value: 'Continuous Heavy Rain' },
  { label: 'Tropical Cyclone', value: 'Tropical Cyclone' }
]);

const statusOptions = ref([
  { label: 'Select a Type', value: null },
  { label: 'Active', value: 'Active' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Under Assessment', value: 'Under Assessment' },
  { label: 'Closed', value: 'Closed' },
]);

// Fetch affected areas and locations on component mount
onMounted(async () => {
  affectedAreas.value = await getAllAffectedAreas();
  locations.value = await LocationModel.getLocations();

  const user = await getUserFromFirestore();
  userType.value = user.userType; // Assign userType
});

// Function to add a new affected area
const addNewArea = async () => {
  try {
    // Prepare new area object with selected locations
    const newAreaData = {
      type: newArea.value.type,
      description: newArea.value.description,
      reportedBy: null, // This will be automatically populated in addAffectedArea function
      locationIDs: selectedLocations.value, // Assuming locationIDs is an array of selected location IDs
      area: newArea.value.area, // Add the selected area
      status: newArea.value.status
    };

    const newAreaId = await addAffectedArea(newAreaData);
    newArea.value.description = ''; // Clear form field after adding
    newArea.value.area = null; // Clear selected area
    selectedLocations.value = []; // Clear selected locations
    newArea.value.type = null;
    newArea.value.status = null;
    affectedAreas.value = await getAllAffectedAreas(); // Refresh affected areas list
    hideDialog(); // Hide dialog after adding
  } catch (error) {
    console.error('Error adding new area: ', error);
  }
};

// Function to delete an affected area
const deleteArea = async (id) => {
  try {
    await deleteAffectedArea(id);
    affectedAreas.value = affectedAreas.value.filter(area => area.id !== id); // Remove deleted area from list
  } catch (error) {
    console.error('Error deleting area: ', error);
  }
};

// Helper function to get location name by ID
const getLocationName = (locationID) => {
  const location = locations.value.find(loc => loc.id === locationID);
  return location ? location.locationName : 'Unknown Location';
};

// Function to hide the dialog and clear the form
const hideDialog = () => {
  showDialog.value = false;
  clearForm();
};

// Function to clear the form fields
const clearForm = () => {
  newArea.value.description = '';
  newArea.value.area = null;
  selectedLocations.value = [];
  newArea.value.type = null;
  newArea.value.status = null;
};

const dtaa = ref();
const exportCSV = () => {
  dtaa.value.exportCSV();
};
</script>
