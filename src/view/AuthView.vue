<template>
  <form @submit.prevent="submitSignInForm" class="auth-form">
    <div class="flex justify-content-center gap-2 mb-3">
      <FloatLabel>
        <InputText id="email" v-model="email" required />
        <label for="email">Email</label>
      </FloatLabel>
    </div>
    <div class="flex justify-content-center gap-2 mb-3">
      <FloatLabel>
        <Password v-model="password" inputId="password" :feedback="false" />
        <label for="password">Password</label>
      </FloatLabel>
    </div>
    <div class="flex justify-content-center gap-2 mb-3">
      <Button type="submit" severity="contrast"
        >Sign In <span class="pi pi-angle-right"></span
      ></Button>
    </div>
  </form>
  <span @click="clickForgotPassword">Forgot Password?</span>
  <div class="error" v-if="error">{{ error }}</div>
</template>

<script>
import { ref } from "vue";
import { useAuthController } from "@/controller/AuthController";

export default {
  setup(props, context) {
    const email = ref("");
    const password = ref("");
    const { error, requestSignIn, requestForgotPassword } = useAuthController();

    const submitSignInForm = async () => {
      const result = await requestSignIn(email.value, password.value);
      if (result === "redirectDashboard") {
        console.log("User logged in");
        context.emit("login-success");
      }
    };

    const clickForgotPassword = async () => {
      await requestForgotPassword(email.value);
    };

    return { email, password, error, submitSignInForm, clickForgotPassword };
  },
};
</script>

<style>
</style>