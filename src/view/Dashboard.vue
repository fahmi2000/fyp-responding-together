<template>
  <div class="grid">
    <div class="navbar">
      <Navbar />
    </div>
    <div class="box box2">
      <TabView>
        <TabPanel header="Forecast">
          <WeatherView />
        </TabPanel>

        <TabPanel header="Warnings">
          <WeatherWarningView />
        </TabPanel>
      </TabView>
    </div>
    <div class="box box4"></div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ManageOfficerView from "@/view/ManageOfficerView.vue";
import WeatherView from "@/viewmodel/WeatherView.vue";
import WeatherWarningView from "@/viewmodel/WeatherWarningView.vue";
import { getUser } from "@/model/UserModel";
import { watch } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Navbar,
    ManageOfficerView,
    WeatherView,
    WeatherWarningView,
  },
  setup() {
    const { user } = getUser();
    const router = useRouter();
    console.log(user);
    watch(user, () => {
      if (!user.value) {
        router.push({ name: "LandingPage" });
      }
    });
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 3.5fr 0.5fr;
  grid-template-areas:
    "navbar navbar navbar navbar"
    "box2 box2 box4 box4"
    "box2 box2 box4 box4";
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
  border-radius: 25px;
}

.box2 {
  grid-area: box2;
  overflow-x: auto;
  /* Enable horizontal scrolling */
  overflow-y: hidden;
  /* Disable vertical scrolling */
  white-space: nowrap;
  /* Prevents the content from wrapping onto the next line */
}

.box4 {
  grid-area: box4;

  overflow-x: auto;
  /* Enable horizontal scrolling */
  overflow-y: auto;
}
</style>
