<template>
  <div class="grid">
    <div class="box1">
      <Navbar />
    </div>
    <div class="box2"></div>
    <div class="box3">
      <h1>Affected Area(s)</h1>
      <ManageAffectedAreaViewModel />
    </div>
    <div class="box4"></div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import ManageAffectedAreaViewModel from "@/viewmodel/ManageAffectedAreaViewModel.vue";

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

.box3 {
  overflow: auto;
  grid-area: box3;
}
</style>
