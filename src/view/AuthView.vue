<template>
  <div class="auth-view-container">
    <form @submit.prevent="submitSignInForm" class="auth-form">
      <label for="email">Email </label><br />
      <input type="email" required v-model="email" />
      <label for="Password">Password </label><br />
      <input type="password" required v-model="password" />
      <button type="submit">Log in</button>
    </form>
    <span @click="clickForgotPassword">Forgot Password?</span>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthController } from "@/controller/AuthController"; // Ensure path is correct

export default {
  setup(props, context) {
    const email = ref("");
    const password = ref("");
    const { error, requestSignIn, requestForgotPassword } = useAuthController(); // Adjust based on updated AuthController

    const submitSignInForm = async () => {
      const result = await requestSignIn(email.value, password.value);
      if (result === "redirectDashboard") {
        console.log("User logged in");
        // Directly navigate or emit event for parent component to handle navigation
        context.emit("login-success");
      }
    };

    const clickForgotPassword = async () => {
      await requestForgotPassword(email.value); // Assuming email input for password reset
      // Optionally handle feedback to the user about password reset email sent
    };

    return { email, password, error, submitSignInForm, clickForgotPassword };
  },
};
</script>

<style>
.auth-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-form {
  width: 100%; /* Ensures form elements align with the container's width */
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  cursor: pointer;
}

.error {
  color: red;
}
</style>