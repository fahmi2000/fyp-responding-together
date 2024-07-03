<template>
  <div class="location-view">
    <!-- CSV Upload Form -->
    <form @submit.prevent="uploadCSV">
      <div class="flex justify-content-center gap-2 mb-3">
        <Button label="Upload .csv" icon="pi pi-image" @click="triggerFileInput" />
        <input type="file" ref="fileInput" accept=".csv" @change="handleFileUpload" style="display: none;" />
      </div>
      <div class="flex justify-content-center gap-2 mb-3">
        <Button label="Submit CSV" severity="contrast" type="submit" />
      </div>
      <!-- Progress spinner for loading indicator -->
      <div v-if="loading" class="flex justify-content-center gap-2 mb-3">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
          animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      </div>
    </form>

    <Divider align="center" type="solid">
      <b>or</b>
    </Divider>

    <!-- Manual Input Form -->
    <form @submit.prevent="addLocation">
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
          <InputNumber id="locationCapacity" v-model="locationCapacity" suffix=" person" />
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
      <div class="flex justify-content-center gap-2 mb-3">
        <Button label="Add" severity="contrast" type="submit" />
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
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
      loading: false, // Loading state
    };
  },
  methods: {
    async uploadCSV() {
      if (this.csvData.length > 0) {
        this.loading = true; // Show spinner
        try {
          for (const location of this.csvData) {
            await LocationModel.addLocation(location);
          }
          alert("Locations added successfully from CSV");
          this.csvData = []; // Clear CSV data array
        } catch (error) {
          console.error("Error adding locations from CSV: ", error);
        } finally {
          this.loading = false; // Hide spinner
        }
      } else {
        alert("No CSV data to upload");
      }
    },
    async addLocation() {
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
    triggerFileInput() {
      this.$refs.fileInput.click();
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
