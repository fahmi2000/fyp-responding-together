import { projectFirestore, timestamp } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const locationsCollection = collection(projectFirestore, 'locations');

const LocationModel = {
    async addLocation(location) {
        try {
            location.createdAt = timestamp();
            await addDoc(locationsCollection, location);
        } catch (error) {
            console.error('Error adding location: ', error);
            throw error;
        }
    },

    async getLocations() {
        try {
            const snapshot = await getDocs(locationsCollection);
            let locations = [];
            snapshot.forEach(doc => {
                locations.push({ id: doc.id, ...doc.data() });
            });
            return locations;
        } catch (error) {
            console.error('Error getting locations: ', error);
            throw error;
        }
    },

    async updateLocation(id, updatedDetails) {
        try {
            const locationDoc = doc(projectFirestore, 'locations', id);
            await updateDoc(locationDoc, updatedDetails);
        } catch (error) {
            console.error('Error updating location: ', error);
            throw error;
        }
    },

    async deleteLocation(id) {
        try {
            const locationDoc = doc(projectFirestore, 'locations', id);
            await deleteDoc(locationDoc);
        } catch (error) {
            console.error('Error deleting location: ', error);
            throw error;
        }
    }
};

export default LocationModel;

export const getLocationByID = async (locationID) => {
    try {
        console.log(`Fetching location with ID: ${locationID}`);

        const docRef = doc(projectFirestore, 'locations', locationID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const locationData = { id: docSnap.id, ...docSnap.data() };
            console.log(`Location data fetched for ID ${locationID}:`, locationData);
            return locationData;
        } else {
            throw new Error('Location document not found');
        }
    } catch (error) {
        console.error(`Error fetching location with ID ${locationID}:`, error);
        throw error;
    }
};

