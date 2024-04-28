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
  <div style="text-align: center">
    <span @click="visible = true">Forgot Password?</span>
  </div>

  <div class="card flex justify-content-center">
    <Dialog
      v-model:visible="visible"
      modal
      header="Forgot Password"
      :style="{ width: '25rem' }"
    >
      <span class="p-text-secondary block mb-5">Request a password reset.</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="username" class="font-semibold w-6rem">Email</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <label for="email" class="font-semibold w-6rem">Confirm Email</label>
        <InputText
          id="email"
          class="flex-auto"
          autocomplete="off"
          v-model="email"
        />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          label="Send"
          @click="clickForgotPassword"
          severity="contrast"
        ></Button>
      </div>
    </Dialog>
  </div>
  <div class="card flex justify-content-center">
    <Toast />
  </div>
  <!-- <div class="error" v-if="error">{{ error }}</div> -->
</template>

<script>
import { ref } from "vue";
import { useAuthController } from "@/controller/AuthController";
import { useToast } from "primevue/usetoast";

export default {
  setup(props, context) {
    const email = ref("");
    const password = ref("");
    const { error, requestSignIn, requestForgotPassword } = useAuthController();
    const visible = ref(false);
    const toast = useToast();

    const show = () => {
      toast.add({
        severity: "info",
        summary: "Info",
        detail: "Message Content",
        life: 3000,
      });
    };

    const toastGreen = () => {
      toast.add({
        severity: "success",
        summary: "Signed In",
        detail: "Redirecting...",
        life: 3000,
      });
    };

    const toastGreenPwd = () => {
      toast.add({
        severity: "success",
        summary: "Password Resetted",
        detail: "Please check your email...",
        life: 3000,
      });
    };

    const toastRed = () => {
      toast.add({
        severity: "error",
        summary: "Incorrect Credentials",
        detail: "Please try again...",
        life: 3000,
      });
    };

    const submitSignInForm = async () => {
      const result = await requestSignIn(email.value, password.value);
      if (result === "redirectDashboard") {
        console.log("User logged in");
        toastGreen();
        context.emit("login-success");
      } else {
        toastRed();
      }
    };

    const clickForgotPassword = async () => {
      await requestForgotPassword(email.value);
      if (!error.value) {
        visible.value = false;
        toastGreenPwd();
      } else {
        toastRed();
      }
    };

    return {
      email,
      password,
      error,
      submitSignInForm,
      clickForgotPassword,
      visible,
      show,
      toastGreen,
      toastRed,
    };
  },
};
</script>