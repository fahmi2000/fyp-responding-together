<template>
  <div class="landing-page container">
    <!-- Correct class reference -->
    <div class="auth-container" v-if="showLogin">
      <h2>Login</h2>
      <AuthView @login-success="gotoDashboard" />
      <p>
        Don't have an account yet?
        <span @click="showLogin = false" class="bold">Register</span>
      </p>
    </div>

    <div v-else class="auth-container">
      <CreateAccountView @signup-success="gotoDashboard" />
      <p>
        Have account?
        <span @click="showLogin = true" class="bold">Login</span>
      </p>
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
</style>

