<template>
  <div class="auth-container">
    <form @submit.prevent="submitSignInForm">
      <input type="email" required placeholder="email" v-model="email" />
      <input
        type="password"
        required
        placeholder="password"
        v-model="password"
      />
      <button type="submit">Log in</button>
    </form>
    <button @click="clickForgotPassword">Forgot Password?</button>
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
.auth-container {
  text-align: center;
  /* Additional styling */
}
.error {
  color: red;
  /* Additional error styling */
}
</style>
