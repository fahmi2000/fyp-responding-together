// WeatherModel.js
import axios from 'axios';

export const WeatherModel = {
    getWeatherForecast: async () => {
        try {
            const response = await axios.get('https://api.data.gov.my/weather/forecast');
            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return { success: false, error: 'Failed to retrieve weather data' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};
