import axios from 'axios';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { projectFirestore } from '../firebase/config';
import { getUserFromFirestore } from '@/model/UserModel';

const API_BASE_URL = 'https://api.met.gov.my/v2.1/data';
const AUTH_TOKEN = '9695ad4870b6cdb202a212c05dcaeff7a48f49f1'; // Your actual authentication token

const headers = {
    Authorization: `METToken ${AUTH_TOKEN}`
};

const WeatherModel = {
    async fetchWeather(startDate, endDate, datasetId, dataCategoryId) {
        try {
            // Fetch user's profile data including userArea
            const userData = await getUserFromFirestore();
            const userArea = userData.userArea; // Assuming userArea is stored in userData

            // Determine locationId based on userArea
            const locationId = determineLocationId(userArea); // Declare locationId as a const

            // Construct API request URL
            const url = `${API_BASE_URL}?datasetid=${datasetId}&datacategoryid=${dataCategoryId}&locationid=LOCATION:${locationId}&start_date=${startDate}&end_date=${endDate}`;

            // Make GET request to external API with headers and params
            const response = await axios.get(url, {
                headers: headers,  // Ensure headers are passed correctly here
                params: {
                    datasetid: datasetId,
                    datacategoryid: dataCategoryId,
                    locationid: `LOCATION:${locationId}`,
                    start_date: startDate,
                    end_date: endDate
                }
            });

            // Log the raw response for debugging
            console.log('Raw Response:', response);

            // Return the fetched weather data
            return response.data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error; // Rethrow the error for handling upstream
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
    },

    async getAllWeatherWarnings() {
        try {
            const querySnapshot = await getDocs(collection(projectFirestore, 'weatherwarning'));
            const weatherWarnings = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.textwarning && data.textwarning.includes("Johor")) {
                    weatherWarnings.push(data);
                }
            });
            console.log('Weather warnings:', weatherWarnings); // Log the filtered weather warnings to verify
            return weatherWarnings; // Return the filtered weather warnings
        } catch (error) {
            console.error('Error getting weather warnings from Firestore:', error);
            throw error;
        }
    }


};

async function insertWarningsToFirestore(data) {
    try {
        if (data.results && data.results.length > 0) {
            for (const result of data.results) {
                const { datatype, value, attributes, date } = result;

                // Initialize variables to hold uniform structure values
                let textwarning = '';
                let validfrom = '';
                let validto = '';
                let title = '';

                // Extract relevant data for uniform structure based on datatype
                if (datatype === 'THUNDERSTORM' || datatype === 'RAIN' || datatype === 'WINDSEA' || datatype === 'CYCLONE') {
                    if (value && value.text && value.text.en && value.text.en.warning) {
                        textwarning = value.text.en.warning;
                    }
                    if (attributes && attributes.valid_from) {
                        validfrom = formatDate(attributes.valid_from);
                    }
                    if (attributes && attributes.valid_to) {
                        validto = formatDate(attributes.valid_to);
                    }
                    if (attributes && attributes.title && attributes.title.en) {
                        title = attributes.title.en;
                    }
                } else if (datatype === 'QUAKETSUNAMI') {
                    if (value && value.text && value.text.en) {
                        const { earthquake, tsunami } = value.text.en;
                        textwarning = `Earthquake: ${earthquake} Tsunami: ${tsunami}`;
                    }
                    if (attributes && attributes.valid_from) {
                        validfrom = formatDate(attributes.valid_from);
                    }
                    if (attributes && attributes.valid_to) {
                        validto = formatDate(attributes.valid_to);
                    }
                    if (attributes && attributes.title && attributes.title.en) {
                        title = attributes.title.en;
                    }

                    // Insert the document into Firestore without condition for QUAKETSUNAMI datatype
                    const formattedDate = formatDate(date);
                    const documentData = {
                        datatype,
                        textwarning,
                        date: formattedDate,
                        validfrom,
                        validto,
                        title
                    };
                    await addDoc(collection(projectFirestore, 'weatherwarning'), documentData);
                    console.log('Data inserted into Firestore:', documentData);
                    continue; // Skip the condition check for QUAKETSUNAMI datatype
                }

                // Format the date
                const formattedDate = formatDate(date);

                // Construct the document object with a uniform structure
                const documentData = {
                    datatype,
                    textwarning,
                    date: formattedDate,
                    validfrom,
                    validto,
                    title
                };

                // Check if textwarning contains "Johor" before inserting the document into Firestore
                if (textwarning.includes("Johor")) {
                    // Insert the document into Firestore
                    await addDoc(collection(projectFirestore, 'weatherwarning'), documentData);
                    console.log('Data inserted into Firestore:', documentData);
                } else {
                    console.log('Skipped inserting data into Firestore because textwarning does not contain "Johor":', documentData);
                }
            }
        }
    } catch (error) {
        console.error('Error inserting data into Firestore:', error);
    }
}



// Function to format date string
function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function determineLocationId(userArea) {
    // Example mapping logic (customize as per your actual mapping)
    switch (userArea) {
        case 'Batu Pahat':
            return 123;
        case 'Johor Bahru':
            return 124;
        case 'Kluang':
            return 129;
        case 'Kota Tinggi':
            return 130;
        case 'Kulai':
            return 439;
        case 'Mersing':
            return 131;
        case 'Muar':
            return 127;
        case 'Pontian':
            return 134;
        case 'Segamat':
            return 135;
        case 'Tangkak':
            return 126;

        default:
            throw new Error(`Location ID not found for userArea: ${userArea}`);
    }
}


export default WeatherModel;

