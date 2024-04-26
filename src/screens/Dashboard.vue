<template>
  <div class="p-grid p-dir-col" style="height: 100vh">
    <div class="p-col-12"><Navbar /></div>
    <div class="p-col p-flex-fill p-grid p-justify-between">
      <div
        class="p-col-3"
        style="
          background-color: #e1e1e1;
          overflow: auto;
          height: 25vw;
          width: 25vw;
        "
      >
        <WeatherView />
      </div>
      <div class="p-col-3" style="background-color: #d1d1d1">3</div>
      <div class="p-col-3" style="background-color: #c1c1c1">4</div>
      <div class="p-col-3" style="background-color: #b1b1b1">5</div>
    </div>
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
