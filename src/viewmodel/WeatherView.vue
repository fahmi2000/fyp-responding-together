<template>
  <div class="grid-container">
    <div class="box box2">
      <div v-if="loading">
        <Skeleton width="20rem" height="20rem"></Skeleton>
      </div>

      <div v-else>
        <!-- Check if there are sortedDates available -->
        <template v-if="sortedDates.length > 0">
          <div class="flex justify-center" style="overflow-x: auto">
            <div v-for="date in sortedDates" :key="date" class="m-2">
              <Card style="width: 25rem">
                <template #title>
                  {{ formatDateTitle(date) }}
                </template>
                <template #content>
                  <div v-for="(forecast, index) in groupedForecasts[date]" :key="index">
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
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>

        <!-- Display welcome message if no forecast data -->
        <template v-else>
          <h2>Welcome! Head over to your profile to update your information!</h2>
        </template>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import WeatherModel from "../model/WeatherModel";
import { addDays, format } from 'date-fns';

const loading = ref(false);
const forecasts = ref([]);
const selectedDates = ref([]); // Reactive reference to store selected dates (range)

const dateFormat = "yy-mm-dd";
const fetchData = async () => {
  loading.value = true;
  try {
    const today = new Date();  // Get today's date
    const startDate = today;  // Start date is today
    const endDate = addDays(today, 6);  // End date is 6 days later

    const formattedStartDate = format(startDate, 'yyyy-MM-dd');  // Format dates as yyyy-MM-dd
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    const datasetId = 'FORECAST';
    const dataCategoryId = 'GENERAL';

    const weatherData = await WeatherModel.fetchWeather(
      formattedStartDate,
      formattedEndDate,
      datasetId,
      dataCategoryId
    );

    // Sort and group forecasts by date
    const sortedForecasts = sortForecasts(weatherData.results);
    forecasts.value = sortedForecasts;
  } catch (error) {
    console.error('Error fetching weather:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
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



.forecast-text {
  font-size: 0.9rem;
  /* Reduce text font size */
  margin-bottom: 0.5rem;
  /* Add spacing between forecast items */
}

.icon-sm {
  font-size: 1.2rem;
  /* Adjust icon size */
}
</style>
