<template>
  <div v-if="loading">Loading weather data...</div>
  <div v-else>
    <h1>Weather Forecast for {{ weatherData[0].location.location_name }}</h1>
    <div v-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="forecast in weatherData" :key="forecast.date">
        <h2>{{ forecast.date }}</h2>
        <p>Morning: {{ forecast.morning_forecast }}</p>
        <p>Afternoon: {{ forecast.afternoon_forecast }}</p>
        <p>Night: {{ forecast.night_forecast }}</p>
        <p>
          Summary: {{ forecast.summary_forecast }} ({{ forecast.summary_when }})
        </p>
        <p>Temperature: {{ forecast.min_temp }} - {{ forecast.max_temp }}°C</p>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { WeatherController } from "@/controller/WeatherController";

export default {
  data() {
    return {
      loading: true,
      error: null,
      weatherData: null,
    };
  },
  async created() {
    try {
      this.weatherData = await WeatherController.fetchWeatherForecast();
      this.loading = false;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
    }
  },
};
</script>
  