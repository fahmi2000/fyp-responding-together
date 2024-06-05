import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';

const API_BASE_URL = 'https://api.met.gov.my/v2.1/data';
const AUTH_TOKEN = '9695ad4870b6cdb202a212c05dcaeff7a48f49f1'; // Your actual authentication token

const headers = {
    Authorization: `METToken ${AUTH_TOKEN}`
};

const WeatherModel = {
    async fetchWeather(locationId, startDate, endDate, datasetId, dataCategoryId) {
        const url = `${API_BASE_URL}?datasetid=${datasetId}&datacategoryid=${dataCategoryId}&locationid=LOCATION:${locationId}&start_date=${startDate}&end_date=${endDate}`;
        console.log('Request URL:', url); // Log the request URL to console

        try {
            const response = await axios.get(API_BASE_URL, {
                headers,
                params: {
                    datasetid: datasetId,
                    datacategoryid: dataCategoryId,
                    locationid: `LOCATION:${locationId}`,
                    start_date: startDate,
                    end_date: endDate
                }
            });

            console.log('Raw Response:', response); // Log the raw response to console
            return response.data; // Return the fetched weather data
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    },

    async fetchWarnings(startDate, endDate, datasetId, dataCategoryId) {
        const url = `${API_BASE_URL}?datasetid=${datasetId}&datacategoryid=${dataCategoryId}&start_date=${startDate}&end_date=${endDate}`;
        console.log('Request URL (Warnings):', url); // Log the request URL to console for warnings

        try {
            const response = await axios.get(API_BASE_URL, {
                headers,
                params: {
                    datasetid: datasetId,
                    datacategoryid: dataCategoryId,
                    start_date: startDate,
                    end_date: endDate
                }
            });

            console.log('Raw Warnings Response:', response); // Log the raw response to console for warnings
            const data = response.data;

            await insertWarningsToFirestore(data); // Call the function to insert data into Firestore

            return data; // Return the fetched warning data
        } catch (error) {
            console.error('Error fetching warnings:', error);
            throw error;
        }
    }


};

async function insertWarningsToFirestore(data) {
    try {
        if (data.results && data.results.length > 0) {
            for (const result of data.results) {
                const warningTextEnObj = result.value.text.en;

                // Extract the warning text from the object
                const warningTextEn = warningTextEnObj.warning;

                // Log the value of warningTextEn
                console.log('Warning Text (English):', warningTextEn);
                console.log('Type of warningTextEn:', typeof warningTextEn);

                // Check if the warning text contains the word "Johor"
                if (typeof warningTextEn === 'string' && warningTextEn.includes("Johor")) {
                    await addDoc(collection(projectFirestore, 'weatherwarning'), result);
                    console.log('Data inserted into Firestore:', result);
                } else {
                    console.log('Warning does not contain "Johor". Skipping insertion.');
                }
            }
        }
    } catch (error) {
        console.error('Error inserting data into Firestore:', error);
    }
}

export default WeatherModel;
