<template>
  <div>


    <Panel header="Header" toggleable>
      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Panel>
    <p>Affected Areas:</p>
    <ul>
      <li v-for="area in affectedAreas" :key="area.id">
        {{ area.description }} - Reported by: {{ area.reportedBy }}
        <div>
          <p>Location IDs:</p>
          <ul>
            <li v-for="locationID in area.locationIDs" :key="locationID">{{ getLocationName(locationID) }}</li>
          </ul>
        </div>
        <p>Area: {{ area.area }}</p>
        <button @click="deleteArea(area.id)">Delete</button>
      </li>
    </ul>

    <form @submit.prevent="addNewArea">
      <input v-model="newArea.description" placeholder="Description" required>
      <div>
        <p>Select Area:</p>
        <select v-model="newArea.area" required>
          <option value="">Select an Area</option>
          <option value="Batu Pahat">Batu Pahat</option>
          <option value="Johor Bahru">Johor Bahru</option>
          <option value="Kluang">Kluang</option>
          <option value="Kota Tinggi">Kota Tinggi</option>
          <option value="Kulai">Kulai</option>
          <option value="Tangkak">Tangkak</option>
          <option value="Mersing">Mersing</option>
          <option value="Muar">Muar</option>
          <option value="Pontian">Pontian</option>
          <option value="Segamat">Segamat</option>
        </select>
      </div>
      <div>
        <p>Select Locations:</p>
        <label v-for="location in locations" :key="location.id">
          <input type="checkbox" :value="location.id" v-model="selectedLocations">
          {{ location.locationName }}
        </label>
      </div>
      <button type="submit">Add New Area</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllAffectedAreas, addAffectedArea, deleteAffectedArea } from '@/model/AffectedAreaModel'; // Adjust the path as per your project structure
import LocationModel from "@/model/LocationModel";

const affectedAreas = ref([]);
const newArea = ref({
  description: '',
  area: ''
});
const locations = ref([]);
const selectedLocations = ref([]);

// Fetch affected areas and locations on component mount
onMounted(async () => {
  affectedAreas.value = await getAllAffectedAreas();
  locations.value = await LocationModel.getLocations();
});

// Function to add a new affected area
const addNewArea = async () => {
  try {
    // Prepare new area object with selected locations
    const newAreaData = {
      description: newArea.value.description,
      reportedBy: null, // This will be automatically populated in addAffectedArea function
      locationIDs: selectedLocations.value, // Assuming locationIDs is an array of selected location IDs
      area: newArea.value.area // Add the selected area
    };

    const newAreaId = await addAffectedArea(newAreaData);
    newArea.value.description = ''; // Clear form field after adding
    newArea.value.area = ''; // Clear selected area
    selectedLocations.value = []; // Clear selected locations
    affectedAreas.value = await getAllAffectedAreas(); // Refresh affected areas list
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
</script>
