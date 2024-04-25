<template>
  <nav v-if="user" class="navbar">
    <div class="left-content">
      <!-- Icon and Text on the Far Left -->
      <div class="brand">
        <img src="" alt="Icon" class="icon" />
        <div class="brand-content">
          <span class="brand-text">RESPONDING</span>
          <span class="brand-text">TOGETHER</span>
        </div>
      </div>
      <!-- Navigation Buttons -->
      <button
        class="nav-button"
        :class="{ active: isActive('Dashboard') }"
        @click="navigateToHome"
      >
        Home
      </button>
      <button
        class="nav-button"
        :class="{ active: isActive('Profile') }"
        @click="navigateTo('Profile')"
      >
        Profile
      </button>
    </div>
    <div class="right-content">
      <div class="dropdown">
        <button class="dropbtn">Menu</button>
        <div class="dropdown-content">
          <a @click="navigateTo('Profile')">Profile</a>
          <a @click="handleLogoutClick">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthController } from "@/controller/AuthController";
import { useRouter, useRoute } from "vue-router";
import { getUser } from "@/model/UserModel";

export default {
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser();
    const router = useRouter();
    const route = useRoute();

    const navigateTo = (name) => {
      router.push({ name });
    };

    const navigateToHome = () => {
      navigateTo("Dashboard");
    };

    const isActive = (routeName) => {
      return route.name === routeName;
    };

    const handleLogoutClick = async () => {
      await requestSignOut();
      if (!error.value) {
        console.log("User logged out");
        navigateTo("LandingPage");
      }
    };

    // Return all the necessary methods and reactive properties
    return { handleLogoutClick, user, navigateTo, isActive, navigateToHome };
  },
};
</script>

<style>
</style>
