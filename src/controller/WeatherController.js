import { WeatherModel } from '@/model/WeatherModel';

export const WeatherController = {
    fetchWeatherForecast: async () => {
        try {
            const result = await WeatherModel.getWeatherForecast(locationId, startDate, endDate);
            if (result.success) {
                console.log('weathercontroller okay');
                return result.data;
            } else {
                console.log('weathercontroller not okay');
                throw new Error(result.error);
            }
        } catch (err) {
            throw new Error(err.message);
        }
    },
};
