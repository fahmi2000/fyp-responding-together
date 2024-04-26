<template>
  <div>
    <h1>Weather Forecast</h1>
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
</template>

<script>
import { ref, onMounted } from "vue";
import { WeatherController } from "@/controller/WeatherController";

export default {
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const weatherData = ref(null);

    onMounted(async () => {
      try {
        weatherData.value = await WeatherController.fetchWeatherForecast();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    return { loading, error, weatherData };
  },
};
</script>
