<template>
  <div class="grid">
    <div class="navbar">
      <Navbar />
    </div>

    <div class="box box2">
      <WeatherView />
    </div>
    <div class="box box4">
      <DashboardViewModel />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import WeatherView from "@/viewmodel/WeatherView.vue";
import DashboardViewModel from "@/viewmodel/DashboardViewModel.vue";
import { getUser } from "@/model/UserModel";
import { watch } from "vue";
import { useRouter } from "vue-router";

const { user } = getUser();
const router = useRouter();

watch(user, (newValue) => {
  if (!newValue) {
    router.push({ name: "LandingPage" });
  }
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 3.5fr auto;
  grid-template-areas:
    "navbar navbar navbar navbar"
    "box2 box2 box2 box2"
    "box4 box4 box4 box4";
  height: 100%;
  gap: 2vh;
  padding: 2vh;
  padding: 1vw;
}

.navbar {
  grid-area: navbar;
}

.box {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}

.box2 {
  grid-area: box2;
}

.box4 {
  grid-area: box4;
}
</style>
