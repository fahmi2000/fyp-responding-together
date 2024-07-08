<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <div>
        <InputText v-model="filters.global.value" placeholder="Search Area..." class="global-filter" />
      </div>
      <div>
        <Button v-if="userType === 'Admin'" label="Add New Area" icon="pi pi-plus" @click="showDialog = true" />
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
      <Column header="" v-if="userType === 'Admin'">
        <template #body="slotProps">
          <div class="flex justify-content-start gap-2 mb-5">
            <Button icon="pi pi-pen-to-square" @click="editArea(slotProps.data)" outlined />
            <Button icon="pi pi-trash" severity="danger" @click="deleteArea(slotProps.data.id)" outlined />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model="showDialog" :visible="showDialog" header="Edit Affected Area" :modal="true" @hide="clearForm()"
      :style="{ minWidth: '25rem' }">
      <form @submit.prevent="saveArea">
        <div class="flex justify-content-start gap-2 mb-5 mt-4">
          <FloatLabel>
            <Dropdown :style="{ minWidth: '25rem' }" id="type" v-model="newArea.type" :options="typeOptions"
              placeholder="Select a Type" optionLabel="label" optionValue="value" />
            <label for="type">Type</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <FloatLabel>
            <Textarea id="description" v-model="newArea.description" placeholder="Description" required rows="5"
              cols="30" :style="{ minWidth: '25rem' }" />
            <label for="description">Description</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <FloatLabel>
            <Dropdown :style="{ minWidth: '25rem' }" id="area" v-model="newArea.area" :options="areaOptions"
              placeholder="Select an Area" optionLabel="label" optionValue="value" />
            <label for="area">Area</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <FloatLabel>
            <MultiSelect :style="{ maxWidth: '25rem' }" id="locations" v-model="selectedLocations" :options="locations"
              optionLabel="locationName" optionValue="id" placeholder="Select Locations" display="chip" filter />
            <label for="locations">Locations</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-start gap-2 mb-5">
          <FloatLabel>
            <Dropdown :style="{ minWidth: '25rem' }" id="status" v-model="newArea.status" :options="statusOptions"
              placeholder="Select a Status" optionLabel="label" optionValue="value" />
            <label for="status">Status</label>
          </FloatLabel>
        </div>

        <div class="flex justify-content-end gap-2 mb-3">
          <Button type="button" label="Cancel" icon="pi pi-times-circle" @click="hideDialog" severity="danger"
            outlined />
          <Button type="submit" label="Save" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllAffectedAreas, addAffectedArea, deleteAffectedArea, updateAffectedArea } from '@/model/AffectedAreaModel'; // Adjust the path as per your project structure
import { getUserFromFirestore } from '@/model/UserModel';
import LocationModel from "@/model/LocationModel"; // Adjust the path as per your project structure
import { FilterMatchMode } from 'primevue/api';

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const affectedAreas = ref([]);
const newArea = ref({
  id: null,
  description: '',
  area: null,
  type: null,
  status: null,
});
const locations = ref([]);
const selectedLocations = ref([]);
const showDialog = ref(false);
const userType = ref('');

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
  { label: 'Select a Status', value: null },
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
  userType.value = user.userType;
});

// Function to handle editing an area
const editArea = (area) => {
  newArea.value.id = area.id;
  newArea.value.type = area.type;
  newArea.value.description = area.description;
  newArea.value.area = area.area;
  selectedLocations.value = area.locationIDs;
  newArea.value.status = area.status;
  showDialog.value = true;
};

// Function to save a new or edited area
const saveArea = async () => {
  try {
    const areaData = {
      type: newArea.value.type,
      description: newArea.value.description,
      reportedBy: null,
      locationIDs: selectedLocations.value,
      area: newArea.value.area,
      status: newArea.value.status
    };

    if (newArea.value.id) {
      await updateAffectedArea(newArea.value.id, areaData);
    } else {
      await addAffectedArea(areaData);
    }

    affectedAreas.value = await getAllAffectedAreas();
    hideDialog();
  } catch (error) {
    console.error('Error saving area: ', error);
  }
};

// Function to delete an affected area
const deleteArea = async (id) => {
  try {
    await deleteAffectedArea(id);
    affectedAreas.value = affectedAreas.value.filter(area => area.id !== id);
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
  newArea.value.id = null;
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
