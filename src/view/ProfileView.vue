<!-- /src/view/ProfileView.vue -->
<template>
  <div v-if="user">
    <h2>Profile Information</h2>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>UID:</strong> {{ user.uid }}</p>
    <p><strong>displayName:</strong> {{ user.displayName }}</p>
    <p><strong>photoURL:</strong> {{ user.photoURL }}</p>
    <p><strong>emailVerified:</strong> {{ user.emailVerified }}</p>
    <!-- Add more fields as needed -->
  </div>
  <div v-else>
    <p>Please log in.</p>
  </div>
</template>
  
  <script>
import { useProfileController } from "@/controller/ProfileController";

export default {
  setup() {
    const { user } = useProfileController();
    return { user };
  },
};
</script>
  