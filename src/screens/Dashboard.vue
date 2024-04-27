<template>
  <div class="grid">
    <div class="navbar">
      <Navbar />
    </div>
    <div class="box box2">2</div>
    <div class="box box3">
      <WeatherView />
    </div>
    <div class="box box4">4</div>
    <div class="box box5">5</div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ManageOfficerView from "@/view/ManageOfficerView.vue";
import WeatherView from "@/view/WeatherView.vue";
import { getUser } from "@/model/UserModel";
import { watch } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Navbar,
    ManageOfficerView,
    WeatherView,
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
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "navbar navbar navbar navbar"
    "box2 box3 box3 box5"
    "box2 box4 box4 box5";
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
  background-color: #e1e1e1;
  overflow: auto;
}

.box3 {
  grid-area: box3;
}

.box4 {
  grid-area: box4;
  background-color: #c1c1c1;
}

.box5 {
  grid-area: box5;
  background-color: #b1b1b1;
}
</style>
