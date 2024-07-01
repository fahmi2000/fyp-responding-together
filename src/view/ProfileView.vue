<template>
  <div class="grid">
    <div class="box1">
      <Navbar />
    </div>
    <div class="box2">
      <ProfileViewModel />
    </div>
    <div class="box3">Task History</div>
    <div class="box4">Skills</div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import ProfileViewModel from "@/viewmodel/ProfileViewModel.vue";

// Register components
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box2 box3 box3 box3"
    "box2 box4 box4 box4";
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

.box2 {
  grid-area: box2;
  overflow: auto;
}

.box3 {
  background-color: #e1e1e1;
  grid-area: box3;
}

.box4 {
  grid-area: box4;
  background-color: #c1c1c1;
}
</style>
