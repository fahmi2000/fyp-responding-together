<template>
  <div>
    <h1>Weather Forecast</h1>
    <div class="p-d-flex p-flex-column">
      <div class="p-d-flex p-flex-row">
        <Dropdown
          v-model="locationId"
          :options="locationOptions"
          optionLabel="name"
          placeholder="Select a Location"
          class="w-full md:w-14rem"
        />
        <Calendar v-model="startDate" class="ml-4" />
        <Calendar v-model="endDate" class="ml-4" />
        <Button label="Get Forecast" @click="fetchWeather" class="ml-4" />
      </div>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else>
        <DataTable :value="weatherData">
          <Column field="datatype" header="Data Type"></Column>
          <Column field="value" header="Value"></Column>
          <Column field="attributes.valid_from" header="Valid From"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { WeatherController } from "@/controller/WeatherController";

export default {
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const weatherData = ref([]);
    const locationId = ref(null); // This ref will store the selected option object
    const startDate = ref(null);
    const endDate = ref(null);

    const locationOptions = [
      { name: "Johor Bahru", value: "LOCATION:136" },
      { name: "Location B", value: "LOCATION:2" },
      // Use the LOCATION: prefix here if all location IDs need it
    ];

    const fetchWeather = async () => {
      console.log("Fetching weather data..."); // Debugging log
      if (!locationId.value || !startDate.value || !endDate.value) {
        console.error("Missing required fields");
        error.value = "Please ensure all fields are filled.";
        loading.value = false;
        return;
      }
      try {
        weatherData.value = await WeatherController.fetchWeatherForecast(
          locationId.value.value, // Correctly access the string 'value' from the object
          startDate.value.toISOString().substring(0, 10), // Ensure correct date format
          endDate.value.toISOString().substring(0, 10) // Ensure correct date format
        );
      } catch (err) {
        console.error("Error fetching weather:", err);
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      // Optionally, fetch initial data or leave for user action
    });

    return {
      loading,
      error,
      weatherData,
      locationId,
      startDate,
      endDate,
      locationOptions,
      fetchWeather,
    };
  },
};
</script>

