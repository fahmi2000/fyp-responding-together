<template>
  <div class="auth-view-container">
    <form @submit.prevent="submitSignInForm" class="auth-form">
      <FloatLabel>
        <InputText id="email" v-model="email" required />
        <label for="email">Email</label>
      </FloatLabel>
      <FloatLabel>
        <Password v-model="password" inputId="password" :feedback="false" />
        <label for="password">Password</label>
      </FloatLabel>
      <Button label="Sign In" type="submit" />
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
</style>