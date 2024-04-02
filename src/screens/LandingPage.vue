<template>
  <div class="landing-page container">
    <p>Welcome</p>
    <div v-if="showLogin">
      <h2>Login</h2>
      <!-- Updated component reference to AuthView -->
      <AuthView @login-success="gotoDashboard" />
      <p>
        No account yet? <span @click="showLogin = false">Signup</span> instead
      </p>
    </div>

    <div v-else>
      <CreateAccountView @signup-success="gotoDashboard" />
      <p>Have account? <span @click="showLogin = true">Login</span> instead</p>
    </div>
  </div>
</template>

<script>
import CreateAccountView from "@/view/CreateAccountView.vue";
import AuthView from "@/view/AuthView.vue"; // Updated import for AuthView
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    CreateAccountView,
    AuthView, // Updated component registration
  },
  setup() {
    const showLogin = ref(true);
    const router = useRouter();

    const gotoDashboard = () => {
      router.push({ name: "Dashboard" }); // Navigation logic upon successful login or signup
    };

    return { showLogin, gotoDashboard };
  },
};
</script>

<style>
.landing-page {
  text-align: center;
  padding: 20px 0;
}
/* Additional style adjustments as necessary */
</style>
