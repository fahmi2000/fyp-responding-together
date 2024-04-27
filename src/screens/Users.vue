<template>
  <div class="grid">
    <div class="navbar">
      <Navbar />
    </div>
    <div class="box box1">
      <ManageOfficerView />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ManageOfficerView from "@/view/ManageOfficerView.vue";

export default {
  components: {
    Navbar,
    ManageOfficerView,
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "navbar navbar navbar"
    "box1 box1 box1"
    "box1 box1 box1";
  height: 100vh;
  gap: 2vh;
  padding: 2vh;
  padding: 2vw;
}

.navbar {
  grid-area: navbar;
}

.box {
  width: 100%;
  height: 100%;
}

.box1 {
  grid-area: box1;
}

.box2 {
  grid-area: box2;
}
</style>
