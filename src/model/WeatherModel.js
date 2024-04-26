import axios from 'axios';

export const WeatherModel = {
    getWeatherForecast: async () => {
        try {
            const url = 'https://api.met.gov.my/v2.1/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:136&start_date=2024-04-27&end_date=2024-04-27';
            const config = {
                headers: {
                    'Authorization': 'METToken 9695ad4870b6cdb202a212c05dcaeff7a48f49f1'
                }
            };
            const response = await axios.get(url, config);
            if (response.status === 200) {
                // Assuming the response.data contains an object with a 'results' array
                const processedData = response.data.results.map(result => ({
                    datatype: result.datatype,
                    value: result.value,
                    attributes: result.attributes
                }));
                console.log('Processed Data:', processedData);
                return { success: true, data: processedData };
            } else {
                return { success: false, error: 'Failed to retrieve weather data' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};
