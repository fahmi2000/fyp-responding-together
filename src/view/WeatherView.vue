<template>
  <div class="grid-container">
    <div class="box box1">
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
    </div>
    <div class="box box2">
      <div v-if="loading">
        <Skeleton width="20rem" height="20rem"></Skeleton>
      </div>

      <div v-else>
        <div class="flex justify-center" style="overflow-x: auto">
          <div v-for="date in sortedDates" :key="date" class="m-2">
            <Card style="width: 20rem">
              <template #title>
                {{ formatDateTitle(date) }}
              </template>
              <template #content>
                <div
                  v-for="(forecast, index) in groupedForecasts[date]"
                  :key="index"
                >
                  <p v-if="forecast.datatype === 'FGM'" class="forecast-text">
                    MORNING - {{ forecast.value }}
                  </p>
                  <p v-if="forecast.datatype === 'FGA'" class="forecast-text">
                    AFTERNOON - {{ forecast.value }}
                  </p>
                  <p v-if="forecast.datatype === 'FGA'" class="forecast-text">
                    NIGHT - {{ forecast.value }}
                  </p>
                  <p v-if="forecast.datatype === 'FMAXT'" class="forecast-text">
                    <span class="material-symbols-outlined icon-sm">
                      thermometer_gain
                    </span>
                    {{ forecast.value }}°C
                  </p>
                  <p v-if="forecast.datatype === 'FMINT'" class="forecast-text">
                    <span class="material-symbols-outlined icon-sm">
                      thermometer_minus
                    </span>
                    {{ forecast.value }}°C
                  </p>
                  <p v-if="forecast.datatype === 'FSIGW'" class="forecast-text">
                    <span class="pi pi-info-circle icon-sm"></span>
                    {{ forecast.value }}
                    <span>during {{ forecast.attributes.when }}</span>
                  </p>

                  <!-- <p>
                    {{ getForecastLabel(forecast.datatype) }} -
                    {{ forecast.value }}
                  </p> -->
                </div>
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
  { name: "Putrajaya", locationId: 237 },
  { name: "Kulai", locationId: 439 },
  { name: "Johor Bahru", locationId: 124 },
  { name: "Ayer Hitam", locationId: 122 },
  { name: "Batu Pahat", locationId: 123 },
  { name: "Iskandar Puteri", locationId: 659 },
  { name: "Kluang", locationId: 129 },
  { name: "Kota Tinggi", locationId: 130 },
]);
const selectedCity = ref(); // Reactive reference to store selected city
const selectedDates = ref([]); // Reactive reference to store selected dates (range)

const dateFormat = "yy-mm-dd";
const fetchData = async () => {
  loading.value = true;
  try {
    if (selectedCity.value && selectedDates.value.length === 2) {
      const { locationId } = selectedCity.value;
      const formattedStartDate = formatDate(selectedDates.value[0]); // First selected date as start date
      const formattedEndDate = formatDate(selectedDates.value[1]); // Second selected date as end date
      const datasetId = "FORECAST";
      const dataCategoryId = "GENERAL";

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

watchEffect(() => {
  fetchData();
});

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
function formatDateTitle(date) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const parsedDate = new Date(date);
  const dayOfWeek = daysOfWeek[parsedDate.getDay()];
  const formattedDate = parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${dayOfWeek}, ${formattedDate}`;
}

// Function to sort forecasts by date and data type
function sortForecasts(forecasts) {
  // Sorting logic can be applied here if needed
  return forecasts;
}

function getForecastLabel(datatype) {
  switch (datatype) {
    case "FGM":
      return "Morning";
    case "FGA":
      return "Afternoon";
    case "FGN":
      return "Night";
    case "FMAXT":
      return "Highest Temp.";
    case "FMINT":
      return "Lowest Temp.";
    case "FSIGW":
      return "Alert";
    default:
      return datatype; // Return datatype if not matched
  }
}
</script>

<style scoped>
/* Add any necessary custom styles here */

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Creates two columns */
  gap: 1rem; /* Adds a gap between the grid items */
  grid-template-areas:
    "box1 box1"
    "box2 box2";
}

.box1 {
  grid-area: box1;
}

.box2 {
  grid-area: box2;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Creates two columns */
  gap: 1rem; /* Adds a gap between the grid items */
}
.p-card {
  overflow-wrap: break-word; /* This will break the word at the end of the line */
  word-wrap: break-word; /* For older browsers */
}

.forecast-text {
  font-size: 0.9rem; /* Reduce text font size */
  margin-bottom: 0.5rem; /* Add spacing between forecast items */
}

.icon-sm {
  font-size: 1.2rem; /* Adjust icon size */
}
</style>
