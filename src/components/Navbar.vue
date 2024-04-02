<template>
  <nav v-if="user">
    <div>
      <p>Hey there... {{ user.displayName }}</p>
      <p class="email">Currently logged in as... {{ user.email }}</p>
    </div>
    <button @click="handleLogoutClick">Logout</button>
    <!-- Button to navigate to the profile page -->
    <button @click="navigateToProfile">Profile</button>
  </nav>
</template>

<script>
import { useAuthController } from "@/controller/AuthController";
import { useRouter } from "vue-router"; // Import useRouter
import getUser from "@/composables/getUser"; // This will be updated according to the previous setup instructions

export default {
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser(); // Adjust this to use the updated method for fetching the user
    const router = useRouter(); // Use useRouter to programmatically navigate

    const handleLogoutClick = async () => {
      await requestSignOut();
      if (!error.value) {
        console.log("User logged out");
        // Optionally navigate to landing page or login screen
        router.push({ name: "LandingPage" });
      }
    };

    const navigateToProfile = () => {
      router.push({ name: "Profile" }); // Navigate to Profile page
    };

    return { handleLogoutClick, user, navigateToProfile };
  },
};
</script>
