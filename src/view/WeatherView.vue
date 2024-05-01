<template>
  <div class="grid-container">
    <h1>Weather Forecast</h1>
    <div class="card flex justify-content-center">
      <FloatLabel class="w-full md:w-14rem">
        <Dropdown
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          class="w-full md:w-14rem"
          filter
        />
        <label for="city">Select a City</label>
      </FloatLabel>
    </div>
    <div class="flex justify-content-center mt-4">
      <div>
        <FloatLabel>
          <Calendar
            v-model="selectedDates"
            selectionMode="range"
            :dateFormat="dateFormat"
            showButtonBar
          />
          <label for="selectedDates">Select Dates</label>
        </FloatLabel>
      </div>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- Render a card for each date group -->
      <div class="forecast-scroll-container">
        <div class="forecast-card" v-for="date in sortedDates" :key="date">
          <h2>{{ date }}</h2>
          <div class="p-grid">
            <Card
              v-for="(forecast, index) in groupedForecasts[date]"
              :key="index"
              :title="forecast.locationname"
              class="p-col-12 p-md-6"
            >
              <template #content>
                <p>Value: {{ forecast.value }}</p>
                <p>DataType: {{ forecast.datatype }}</p>
                <p v-if="forecast.datatype === 'FGM'">
                  <span class="pi pi-sun"></span>
                </p>

                <p v-if="forecast.datatype === 'FSIGW'">
                  Code: {{ forecast.attributes.code }}
                </p>
                <p v-if="forecast.datatype === 'FSIGW'">
                  When: {{ forecast.attributes.when }}
                </p>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, computed } from "vue";
import WeatherModel from "../model/WeatherModel";

const loading = ref(false);
const forecasts = ref([]);
const cities = ref([
  { name: "New York", locationId: 237 },
  { name: "Rome", locationId: 238 },
]);
const selectedCity = ref(); // Reactive reference to store selected city
const selectedDates = ref([]); // Reactive reference to store selected dates (range)

const dateFormat = "yy-mm-dd"; // Date format for API request

const fetchData = async () => {
  loading.value = true;
  try {
    if (selectedCity.value && selectedDates.value.length === 2) {
      const { locationId } = selectedCity.value;
      const formattedStartDate = formatDate(selectedDates.value[0]); // First selected date as start date
      const formattedEndDate = formatDate(selectedDates.value[1]); // Second selected date as end date
      const datasetId = "FORECAST"; // Specify the dataset ID
      const dataCategoryId = "GENERAL"; // Specify the data category ID

      const weatherData = await WeatherModel.fetchWeather(
        locationId,
        formattedStartDate,
        formattedEndDate,
        datasetId,
        dataCategoryId
      );

      // Sort and group forecasts by date
      const sortedForecasts = sortForecasts(weatherData.results);
      forecasts.value = sortedForecasts;
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
  } finally {
    loading.value = false;
  }
};

// Watch for changes in selectedCity and selectedDates and fetch data accordingly
watchEffect(() => {
  fetchData();
});

// Computed property to group forecasts by date
const groupedForecasts = computed(() => {
  const grouped = {};
  forecasts.value.forEach((forecast) => {
    const date = forecast.date.split("T")[0]; // Extract date part from datetime
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(forecast);
  });
  return grouped;
});

// Computed property to return sorted dates
const sortedDates = computed(() => {
  return Object.keys(groupedForecasts.value).sort();
});

// Function to format date in the specified format (yy-mm-dd)
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to sort forecasts by date and data type
function sortForecasts(forecasts) {
  // Sorting logic can be applied here if needed
  return forecasts;
}
</script>

<style scoped>
/* Add any necessary custom styles here */

.forecast-scroll-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 1rem;
}

.forecast-card {
  flex-shrink: 0;
  min-width: 300px; /* Set a minimum width for each card */
  margin-right: 1rem;
}

.p-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
</style>