<template>
  <div class="grid">
    <div class="box1"></div>
    <div class="box box2"></div>
    <div class="box box3">
      <div class="auth-container" v-if="showLogin">
        <div style="text-align: center; padding-bottom: 50px;">
          <h2 class="brand-title">
            Responding<br />Together
          </h2>
        </div>

        <AuthViewModel @login-success="handleLoginSuccess" />
        <div style="text-align: center">
          <p>
            Don't have an account yet?
            <a @click.prevent="showLogin = false" href="#" class="bold">Register</a>
          </p>
        </div>
      </div>
      <div v-else class="auth-container">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 class="brand-title">
            Create an Account
          </h2>
        </div>
        <CreateAccountViewModel @signup-success="handleSignupSuccess" />
        <p style="text-align: center">
          Have an account?
          <a @click.prevent="showLogin = true" href="#" class="bold">Sign In</a>
        </p>
      </div>
    </div>
    <div class="box box4"></div>
    <div class="box box5"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateAccountViewModel from "@/viewmodel/CreateAccountViewModel.vue";
import AuthViewModel from "@/viewmodel/AuthViewModel.vue";

const showLogin = ref(true);
const router = useRouter();

const handleLoginSuccess = () => {
  gotoDashboard();
};

const handleSignupSuccess = () => {
  gotoDashboard();
};

const gotoDashboard = () => {
  router.push({ name: "Dashboard" });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-areas:
    "box1 box1 box1"
    "box2 box3 box5"
    "box2 box4 box4";
  height: 100vh;
  gap: 2vh;
  padding: 2vh;
  padding: 2vw;
}

.box1 {
  grid-area: box1;
}

.box {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}

.box2 {
  grid-area: box2;
  overflow: auto;
}

.box3 {
  grid-area: box3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ff6c5c;
}

.box4 {
  grid-area: box4;
}

.box5 {
  grid-area: box5;
}

.brand-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  /* You can adjust the weight as needed */
  margin: 0;
  padding: 0;
  line-height: 1.2;
  /* Adjust line-height if needed */
}
</style>
