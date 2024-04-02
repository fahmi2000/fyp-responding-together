<template>
  <nav v-if="user" class="navbar">
    <div class="left-content">
      <!-- Icon and Text on the Far Left -->
      <div class="brand">
        <img src="../assets/logo.svg" alt="Icon" class="icon" />
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
import getUser from "@/composables/getUser";

export default {
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser(); // Make sure getUser is updated to return the reactive user object
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
/* Styles as previously described */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff6c5c;
  color: black;
  padding: 0 2vw;
  height: 6.25rem;
  margin-top: 3.125rem;
  border-radius: 1.5625rem;
}

.left-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 800;
}

.icon {
  width: 1.875rem;
  height: 1.875rem;
}

.nav-button,
.dropbtn {
  background-color: #ff6c5c;
  color: black;
  border: none;
  cursor: pointer;
}

.nav-button.active,
.nav-button:active,
.dropdown-content a:active {
  background-color: black;
  color: white;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 10rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 0.75rem 1rem;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
