<!-- /src/screens/Profile.vue -->
<template>
  <div>
    <Navbar />
    <ManageOfficerView />
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
    