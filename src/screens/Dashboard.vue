<template>
  <div>
    <Navbar />
    <ManageOfficerView />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ManageOfficerView from "@/view/ManageOfficerView.vue"; // Make sure the path is correct
import { getUser } from "@/model/UserModel";
import { watch } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Navbar,
    ManageOfficerView, // Register the ManageOfficeView component
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
