<template>
  <div class="location-view">
    <h1>Add Location</h1>
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
    };
  },
  methods: {
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
  },
};
</script>
  
  <style scoped>
.location-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
  