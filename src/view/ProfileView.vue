<template>
  <div class="grid">
    <div class="box1">
      <Navbar />
    </div>
    <div class="box2">
      <ProfileViewModel />
    </div>
    <div class="box3">
      <ProfileSkillViewModel />
    </div>
    <div class="box4">
      <ProfileTaskViewModel />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import ProfileViewModel from "@/viewmodel/ProfileViewModel.vue";
import ProfileSkillViewModel from "@/viewmodel/ProfileSkillViewModel.vue";
import ProfileTaskViewModel from "@/viewmodel/ProfileTaskViewModel.vue";

// Register components
</script>

<style scoped>
html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box2 box3 box4 box4"
    "box2 box3 box4 box4";
  height: 100%;
  gap: 2vh;
  padding: 2vh;
  padding: 1vw;
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
  /* Enable scrolling if content overflows */
}

.box3 {
  grid-area: box3;
  overflow: auto;
  /* Enable scrolling if content overflows */
}

.box4 {
  grid-area: box4;
}
</style>
