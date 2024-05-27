<template>
  <div class="location-view">
    <h1>Add Location</h1>
    <form @submit.prevent="addLocation">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" required />

      <label for="address">Address:</label>
      <input type="text" id="address" v-model="address" required />

      <label for="capacity">Capacity:</label>
      <input type="number" id="capacity" v-model="capacity" required />

      <button type="submit">Add Location</button>
    </form>
  </div>
</template>
  
<script>
import LocationModel from "../model/LocationModel";

export default {
  data() {
    return {
      name: "",
      address: "",
      capacity: 0,
    };
  },
  methods: {
    async addLocation() {
      const newLocation = {
        name: this.name,
        address: this.address,
        capacity: this.capacity,
      };

      try {
        await LocationModel.addLocation(newLocation);
        alert("Location added successfully");
        this.name = "";
        this.address = "";
        this.capacity = 0;
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
  