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

<script>
import { ref } from "vue";
import useCreateAccount from "../controller/CreateAccountController.js"; // Updated import path

export default {
  setup(props, context) {
    const { error, signup } = useCreateAccount(); // This now reflects the controller usage
    const userName = ref("");
    const email = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      await signup(email.value, password.value, userName.value);
      if (!error.value) {
        console.log("User signed up successfully");
        context.emit("signup-success");
      }
    };

    return { userName, email, password, handleSubmit, error };
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
