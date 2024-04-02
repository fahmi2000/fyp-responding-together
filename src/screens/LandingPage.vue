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
.landing-page.container {
  display: flex;
  justify-content: center; /* Centers children vertically */
  align-items: center; /* Centers children horizontally */
  min-height: 100vh; /* Ensures it takes at least the full height of the viewport */
  width: 100vw; /* Ensures it takes the full width of the viewport */
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 48vh;
  width: 23vw;
  background-color: #ff6c5c;
  color: black;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 1.5625rem;
  /* Ensure horizontal centering if not flexed by parent */
  margin: 0 auto;
}

input[type="email"],
input[type="password"] {
  width: calc(19rem - 4rem); /* Adjusts width considering padding */
  height: 2rem;
  margin: 0.5rem 0; /* Adds a bit of margin for spacing */
  border-radius: 0.7rem;
}

button {
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 8.25rem; /* Adjusts width considering padding */
  margin: 0.5rem 0; /* Adds a bit of margin for spacing */
}

button:hover {
  background-color: #333;
}

.error {
  color: red;
  margin-top: 1rem;
}

span.bold {
  font-weight: bold;
}
</style>

