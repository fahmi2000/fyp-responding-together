<template>
  <div class="location-list-view">
    <DataTable
      v-model:filters="filters"
      :value="locations"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="row"
      :loading="loading"
      :globalFilterFields="[
        'locationName',
        'locationAddress',
        'coordinate',
        'district',
      ]"
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
      <Column field="locationName" header="Name" style="min-width: 12rem" />
      <Column field="locationAddress" header="Address" />
      <Column field="locationCapacity" header="Capacity" />
      <Column field="locationCoordinate" header="Coordinate" />
      <Column field="locationDistrict" header="District" />
      <!-- Edit Column -->
      <Column header="" style="width: 6rem">
        <template #body="{ data }">
          <Button
            label="Edit"
            severity="contrast"
            @click="editLocation(data)"
          />
        </template>
      </Column>
      <!-- Delete Column -->
      <Column header="" style="width: 6rem">
        <template #body="{ data }">
          <Button
            label="Delete"
            severity="danger"
            @click="deleteLocation(data.id)"
          />
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
          v-model="editingLocation.locationName"
          required
        />

        <label for="edit-address">Address:</label>
        <input
          type="text"
          id="edit-address"
          v-model="editingLocation.locationAddress"
          required
        />

        <label for="edit-capacity">Capacity:</label>
        <input
          type="number"
          id="edit-capacity"
          v-model="editingLocation.locationCapacity"
          required
        />
        <label for="edit-coordinate">Coordinate:</label>
        <input
          type="text"
          id="edit-corrdinate"
          v-model="editingLocation.locationCoordinate"
          required
        />
        <label for="edit-district">District:</label>
        <input
          type="text"
          id="edit-district"
          v-model="editingLocation.locationDistrict"
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
  locationName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  locationAddress: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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



