<template>
  <div class="grid">
    <div class="box1"><Navbar /></div>
    <div class="box2"><LocationAddView /></div>
    <div class="box3"><LocationListView /></div>
    <div class="box4"></div>
  </div>
</template>
    
  <script>
import Navbar from "@/components/Navbar.vue";
import LocationAddView from "@/view/LocationAddView.vue";
import LocationListView from "@/view/LocationListView.vue";

export default {
  components: {
    Navbar,
    LocationAddView,
    LocationListView,
  },
};
</script>
  <style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box2 box3 box3 box3"
    "box2 box3 box3 box3";
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
  overflow: auto;
  grid-area: box3;
}
</style>