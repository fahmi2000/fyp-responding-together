<template>
  <div class="auth-view-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="text" required placeholder="username" v-model="userName" />
      <input type="email" required placeholder="email" v-model="email" />
      <input
        type="password"
        required
        placeholder="password"
        v-model="password"
      />
      <div class="error">{{ error }}</div>
      <button type="submit">Sign up</button>
    </form>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";
import { createAccount, updateUserProfile } from "../model/UserModel";

const error = ref(null);
const userName = ref("");
const email = ref("");
const password = ref("");

const handleSubmit = async () => {
  error.value = null;

  try {
    const res = await createAccount(email.value, password.value);
    if (!res) {
      throw new Error("Could not complete the signup!");
    }
    if (userName.value) {
      await updateUserProfile(res.user, userName.value);
    }
    console.log(
      `Signup successful. User ID: ${res.user.uid}, Display Name: ${res.user.displayName}`
    );
    emit("signup-success");
  } catch (err) {
    console.error(err.message);
    error.value = err.message;
  }
};
</script>
  
  <style>
/* Add your styles here */
</style>
  