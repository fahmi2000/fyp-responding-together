// WeatherController.js
import { WeatherModel } from './WeatherModel';

export const WeatherController = {
    fetchWeatherForecast: async () => {
        const result = await WeatherModel.getWeatherForecast();
        if (result.success) {
            // Process or transform data if necessary
            return result.data;
        } else {
            throw new Error(result.error);
        }
    },
};
