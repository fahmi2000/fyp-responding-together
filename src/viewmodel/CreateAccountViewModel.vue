<template>
  <div class="auth-view-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="flex justify-content-center gap-2 mb-5">
        <FloatLabel>
          <InputText id="userFullName" v-model="userFullName" />
          <label for="userFullName">Full Name (Optional)</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-5">
        <FloatLabel>
          <InputText id="email" v-model="email" required />
          <label for="email">Email</label>
        </FloatLabel>
      </div>

      <div class="flex justify-content-center gap-2 mb-5">
        <FloatLabel>
          <InputText id="email" v-model="email" required />
          <label for="email">Contact Number</label>
        </FloatLabel>
      </div>

      <div class="flex justify-content-center gap-2 mb-5">
        <FloatLabel>
          <Password id="password" v-model="password" required feedback />
          <label for="password">Password</label>
        </FloatLabel>
      </div>
      <div class="flex justify-content-center gap-2 mb-5">
        <FloatLabel>
          <Password id="confirmPassword" v-model="confirmPassword" required feedback />
          <label for="confirmPassword">Confirm Password</label>
        </FloatLabel>
      </div>
      <div class="error">{{ error }}</div>
      <div class="flex justify-content-center gap-2 mb-3">
        <Button type="submit" severity="contrast">
          Register <span class="pi pi-angle-right"></span>
        </Button>
      </div>
    </form>
  </div>
</template>

<style>
/* Add your styles here */
</style>


<script setup>
import { ref, defineEmits } from "vue";
import {
  createAccount,
  addUserToFirestore,
} from "../model/UserModel";

const error = ref(null);
const userFullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const emits = defineEmits(["signup-success"]); // Define the event

const handleSubmit = async () => {
  error.value = null;

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match!";
    return;
  }

  try {
    const res = await createAccount(email.value, password.value);
    if (!res) {
      throw new Error("Could not complete the signup!");
    }
    await addUserToFirestore(res.user, email.value, userFullName.value, "Volunteer");

    console.log(`Signup successful. User ID: ${res.user.uid}`);
    emits("signup-success"); // Emit the event
  } catch (err) {
    console.error(err.message);
    error.value = err.message;
  }
};
</script>
