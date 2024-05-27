<template>
  <div class="location-list-view">
    <h1>Locations</h1>
    <DataTable
      v-model:filters="filters"
      :value="locations"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="row"
      :loading="loading"
      :globalFilterFields="['name', 'address', 'coordinate', 'district']"
    >
      <template #empty>No locations available</template>
      <!-- Custom header slot -->
      <template #header>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      </template>
      <Column field="name" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          <strong>{{ data.name }}</strong
          ><br />
          {{ data.address }}<br />
          Capacity: {{ data.capacity }}
        </template>
      </Column>
      <Column field="address" header="Address" />
      <Column field="capacity" header="Capacity" />
      <Column field="coordinate" header="Coordinate" />
      <Column field="district" header="District" />
      <!-- Edit Column -->
      <Column header="Edit" style="width: 6rem">
        <template #body="{ data }">
          <button @click="editLocation(data)">Edit</button>
        </template>
      </Column>
      <!-- Delete Column -->
      <Column header="Delete" style="width: 6rem">
        <template #body="{ data }">
          <button @click="deleteLocation(data.id)">Delete</button>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Location form -->
    <div v-if="editingLocation">
      <h2>Edit Location</h2>
      <form @submit.prevent="updateLocation">
        <label for="edit-name">Name:</label>
        <input
          type="text"
          id="edit-name"
          v-model="editingLocation.name"
          required
        />

        <label for="edit-address">Address:</label>
        <input
          type="text"
          id="edit-address"
          v-model="editingLocation.address"
          required
        />

        <label for="edit-capacity">Capacity:</label>
        <input
          type="number"
          id="edit-capacity"
          v-model="editingLocation.capacity"
          required
        />

        <!-- Add fields for Coordinate and District editing here -->

        <button type="submit">Update Location</button>
        <button @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import LocationModel from "../model/LocationModel";

const locations = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const loading = ref(true);
const editingLocation = ref(null);

onMounted(async () => {
  try {
    locations.value = await LocationModel.getLocations();
  } catch (error) {
    console.error("Error fetching locations:", error);
  } finally {
    loading.value = false;
  }
});

const deleteLocation = async (id) => {
  try {
    await LocationModel.deleteLocation(id);
    await fetchLocations();
  } catch (error) {
    console.error("Error deleting location:", error);
  }
};

const editLocation = (location) => {
  editingLocation.value = { ...location };
};

const updateLocation = async () => {
  try {
    await LocationModel.updateLocation(
      editingLocation.value.id,
      editingLocation.value
    );
    editingLocation.value = null;
    await fetchLocations();
  } catch (error) {
    console.error("Error updating location:", error);
  }
};

const cancelEdit = () => {
  editingLocation.value = null;
};
</script>



