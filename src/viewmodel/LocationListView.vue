<template>

  <div class="location-list-view">
    <DataTable v-model:filters="filters" :value="locations" paginator :rows="10" dataKey="id" filterDisplay="row"
      :loading="loading" :globalFilterFields="[
        'locationName',
        'locationAddress',
        'coordinate',
        'district',
      ]">
      <template #empty>No locations available</template>
      <!-- Custom header slot -->
      <template #header>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <Column field="locationName" header="Name" style="min-width: 12rem">
        <template #body="{ data }">
          <a :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            data.locationName
          )}`" target="_blank" rel="noopener noreferrer">
            {{ data.locationName }}
          </a>
        </template>
      </Column>
      <Column field="locationCapacity" header="Capacity" />
      <Column field="locationDistrict" header="District" />
      <!-- Edit Column -->
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <Button severity="contrast" @click="handleEditShow(data)" icon="pi pi-pen-to-square" />
        </template>
      </Column>
      <!-- Delete Column -->
      <Column header="" style="width: 3rem">
        <template #body="{ data }">
          <Button severity="danger" @click="deleteLocation(data.id)" icon="pi pi-trash" />
        </template>
      </Column>
    </DataTable>

    <!-- Edit Location form -->
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ minWidth: '25rem' }">
      <form @submit.prevent="updateLocation">
        <div class="flex justify-content-center gap-2 mb-5 mt-4">
          <FloatLabel>
            <InputText id="locationName" v-model="editingLocation.locationName" :style="{ width: '25rem' }" />
            <label for="locationName">Name</label>
          </FloatLabel>
        </div>

        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputNumber id="locationCapacity" v-model="editingLocation.locationCapacity" suffix=" person"
              :style="{ width: '25rem' }" />
            <label for="locationCapacity">Capacity</label>
          </FloatLabel>
        </div>

        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputText id="locationDistrict" v-model="editingLocation.locationDistrict" :style="{ width: '25rem' }" />
            <label for="locationDistrict">District</label>
          </FloatLabel>
        </div>

        <!-- Add fields for Coordinate and District editing here -->

        <div class="flex justify-content-end gap-2 mb-2">
          <Button label="Save" severity="contrast" type="submit" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
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
    locations.value = locations.value.filter(loc => loc.id !== id); // Remove deleted location from the list
  } catch (error) {
    console.error("Error deleting location:", error);
  }
};

const updateLocation = async () => {
  try {
    await LocationModel.updateLocation(
      editingLocation.value.id,
      editingLocation.value
    );
    editingLocation.value = null;
  } catch (error) {
    console.error("Error updating location:", error);
  }
};

const handleEditShow = (data) => {
  editLocation(data);
  visible.value = true;
};

const editLocation = (location) => {
  editingLocation.value = { ...location };
};

const cancelEdit = () => {
  editingLocation.value = null;
};

const visible = ref(false);
</script>
