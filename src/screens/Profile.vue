<!-- /src/screens/Profile.vue -->
<template>
  <div>
    <Navbar />
    <ProfileView />
  </div>
</template>
  
  <script>
import Navbar from "@/components/Navbar.vue";
import ProfileView from "@/view/ProfileView.vue";

export default {
  components: {
    Navbar,
    ProfileView,
  },
};
</script>
  