<template>
  <form @submit.prevent="submitSignInForm" class="auth-form">
    <div class="flex justify-content-center gap-2 mb-5">
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
      <Button type="submit" severity="contrast">
        Sign In <span class="pi pi-angle-right"></span>
      </Button>
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
</template>
  
  <script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { signIn, forgotPassword } from "@/model/UserModel";

// Reactive state variables
const email = ref("");
const password = ref("");
const visible = ref(false);
const error = ref("");
const toast = useToast();

// Toast functions for various messages
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

// Function to handle sign-in form submission
const emit = defineEmits(["login-success"]);

const submitSignInForm = async () => {
  error.value = "";
  try {
    const res = await signIn(email.value, password.value);
    console.log(`Login successful: ${res.user.uid}`);
    toastGreen();
    emit("login-success");
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    error.value = "Incorrect login credentials";
    toastRed();
  }
};

// Function to handle forgot password functionality
const clickForgotPassword = async () => {
  error.value = "";
  try {
    await forgotPassword(email.value);
    console.log("Password reset email sent.");
    visible.value = false;
    toastGreenPwd();
  } catch (err) {
    console.error(`Error sending reset email: ${err.message}`);
    error.value = "Error sending password reset email";
    toastRed();
  }
};
</script>
  
  <style scoped>
/* Add your scoped styles here */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.box {
  height: 200px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.bold {
  font-weight: bold;
  cursor: pointer;
}
</style>
  