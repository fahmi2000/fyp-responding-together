<template>
  <div class="location-view">
    <form @submit.prevent="addLocation">
      <!-- Add file input field for CSV -->
      <div class="flex justify-content-center gap-2 mb-3">
        <FileUpload
          mode="basic"
          accept=".csv"
          @upload="handleFileUpload"
          chooseLabel="Choose CSV file"
        />
      </div>
      <Divider align="center" type="solid">
        <b>or</b>
      </Divider>
      <!-- Your existing form fields -->
      <div class="flex justify-content-center gap-2 mb-3">
        <FloatLabel>
          <InputText id="locationName" v-model="locationName" />
          <label for="locationName">Name</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-3">
        <FloatLabel>
          <InputText id="locationAddress" v-model="locationAddress" />
          <label for="locationAddress">Address</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-3">
        <FloatLabel>
          <InputNumber
            id="locationCapacity"
            v-model="locationCapacity"
            suffix=" person"
          />
          <label for="locationCapacity">Capacity</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-3">
        <FloatLabel>
          <InputText id="locationDistrict" v-model="locationDistrict" />
          <label for="locationDistrict">District</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-3">
        <FloatLabel>
          <InputText id="locationCoordinate" v-model="locationCoordinate" />
          <label for="locationCoordinate">Coordinate</label>
        </FloatLabel>
      </div>
      <Divider />
      <div class="flex justify-content-center gap-2 mb-3">
        <Button label="Add" severity="contrast" type="submit" />
      </div>
    </form>
  </div>
</template>

<script>
import LocationModel from "../model/LocationModel";

export default {
  data() {
    return {
      locationName: "",
      locationAddress: "",
      locationCapacity: null,
      locationDistrict: "",
      locationCoordinate: "",
      csvData: [], // Array to store CSV data
    };
  },
  methods: {
    async addLocation() {
      // Add logic to handle CSV data if present
      if (this.csvData.length > 0) {
        try {
          // Iterate through CSV data and add each location
          for (const location of this.csvData) {
            await LocationModel.addLocation(location);
          }
          alert("Locations added successfully from CSV");
          this.csvData = []; // Clear CSV data array
        } catch (error) {
          console.error("Error adding locations from CSV: ", error);
        }
      }

      // Add your existing addLocation logic for manual input here
      const newLocation = {
        locationName: this.locationName,
        locationAddress: this.locationAddress,
        locationCapacity: this.locationCapacity,
        locationDistrict: this.locationDistrict,
        locationCoordinate: this.locationCoordinate,
      };

      try {
        await LocationModel.addLocation(newLocation);
        alert("Location added successfully");
        this.locationName = "";
        this.locationAddress = "";
        this.locationCapacity = null;
        this.locationDistrict = "";
        this.locationCoordinate = "";
      } catch (error) {
        console.error("Error adding location: ", error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const csv = e.target.result;
        this.csvData = this.parseCSV(csv);
      };

      reader.readAsText(file);
    },
    parseCSV(csv) {
      // Parse CSV and convert to array of objects
      const lines = csv.split("\n");
      const headers = lines[0].split(",");
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length === headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = values[j].trim();
          }
          data.push(obj);
        }
      }

      return data;
    },
  },
};
</script>

<style scoped>
.location-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
