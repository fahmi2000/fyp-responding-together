
<template>
  <div class="weather-warning-view">
    <h1>Weather Warnings</h1>
    <div class="filter-section">
      <div class="card flex justify-content-center">
        <FloatLabel class="w-full md:w-14rem">
          <Dropdown
            v-model="selectedCategory"
            :options="categoryOptions"
            optionLabel="name"
            @change="fetchWarnings"
            class="w-full md:w-14rem"
          />
          <label for="category">Select Category</label>
        </FloatLabel>
      </div>

      <div class="flex justify-content-center mt-4">
        <FloatLabel class="w-full md:w-14rem">
          <Calendar
            v-model="selectedDates"
            selectionMode="range"
            :dateFormat="dateFormat"
            @change="fetchWarnings"
            showButtonBar
          />
          <label for="dates">Select Dates</label>
        </FloatLabel>
      </div>
    </div>
    <div v-if="loading" class="loading-indicator">
      <Skeleton width="100%" height="2rem"></Skeleton>
      <Divider />
      <Skeleton width="100%" height="2rem"></Skeleton>
      <Divider />
      <Skeleton width="100%" height="2rem"></Skeleton>
      <Divider />
      <Skeleton width="100%" height="2rem"></Skeleton>
    </div>
    <div v-else>
      <DataTable :value="warnings" paginator :rows="3">
        <Column field="attributes.title.en" header="Title"></Column>

        <Column field="value.text.en.warning" header="Warning Text"></Column>

        <Column field="attributes.valid_from" header="Valid From"></Column>
        <Column field="attributes.valid_to" header="Valid To"></Column>
      </DataTable>
    </div>
  </div>
</template>
  
<script setup>
import { ref, watchEffect } from "vue";
import WeatherModel from "@/model/WeatherModel";

const loading = ref(false);
const warnings = ref([]);
const selectedCategory = ref(null);
const selectedDates = ref([]);
const dateFormat = "yy-mm-dd";
const expandedWarning = ref(null);

// Fetch weather warnings based on selected criteria
const fetchWarnings = async () => {
  if (!selectedCategory.value || !selectedDates.value.length) {
    return; // Skip fetching if category or dates are not selected
  }

  const startDate = formatDate(selectedDates.value[0]);
  const endDate = formatDate(selectedDates.value[1]);
  const datasetId = "WARNING";
  const dataCategoryId = selectedCategory.value.id;

  loading.value = true;
  try {
    const data = await WeatherModel.fetchWarnings(
      startDate,
      endDate,
      datasetId,
      dataCategoryId
    );
    warnings.value = data.results;
  } catch (error) {
    console.error("Error fetching weather warnings:", error);
    warnings.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch for changes in selectedCategory and selectedDates
watchEffect(() => {
  fetchWarnings();
});

// Sample category options for Dropdown
const categoryOptions = [
  { id: "WINDSEA2", name: "Strong Winds & Rough Seas" },
  { id: "QUAKETSUNAMI", name: "Earthquake & Tsunami" },
  { id: "THUNDERSTORM", name: "Thunderstorm" },
  { id: "RAIN", name: "Rain" },
  { id: "CYCLONE", name: "Cyclone" },
  // Add more category options as needed
];

const formatReadableDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Utility function to format date in the specified format
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
</script>
  

  