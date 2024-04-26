// WeatherController.js
import { WeatherModel } from '@/model/WeatherModel';

export const WeatherController = {
    fetchWeatherForecast: async () => {
        const result = await WeatherModel.getWeatherForecast();
        if (result.success) {
            console.log('controller okay')
            return result.data;
        } else {
            console.log('controller not okay')
            throw new Error(result.error);
        }
    },
};
