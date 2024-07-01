<template>
  <div class="grid">
    <div class="box1">
      <Navbar />
    </div>
    <div class="box2"></div>
    <div class="box3">
      <h1>Evacuation Centre List</h1>
      <Button label="Add" @click="visible = true" severity="contrast" />
      <Dialog v-model:visible="visible" modal header="Add Location" :style="{ width: '25rem' }">
        <LocationAddView />
      </Dialog>
      <LocationListView />
    </div>
    <div class="box4"></div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import LocationAddView from "@/viewmodel/LocationAddView.vue";
import LocationListView from "@/viewmodel/LocationListView.vue";

import { ref } from "vue";

const visible = ref(false);
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box3 box3 box3 box3"
    "box3 box3 box3 box3";
  height: 100vh;
  gap: 2vh;
  padding: 2vh;
  padding: 2vw;
}

.box {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}

.box1 {
  grid-area: box1;
}

.box3 {
  overflow: auto;
  grid-area: box3;
}
</style>