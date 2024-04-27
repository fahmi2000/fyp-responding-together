<template>
  <div class="grid">
    <div class="box1"></div>
    <div class="box box2"></div>
    <div class="box box3">
      <div class="auth-container" v-if="showLogin">
        <AuthView @login-success="gotoDashboard" />
        <p>
          Don't have an account yet?
          <span @click="showLogin = false" class="bold">Register</span>
        </p>
      </div>
      <div v-else class="auth-container">
        <CreateAccountView @signup-success="gotoDashboard" />
        <p>
          Have an account?
          <span @click="showLogin = true" class="bold">Login</span>
        </p>
      </div>
    </div>
    <div class="box box4"></div>
    <div class="box box5"></div>
  </div>
</template>

<script>
import CreateAccountView from "@/view/CreateAccountView.vue";
import AuthView from "@/view/AuthView.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    CreateAccountView,
    AuthView,
  },
  setup() {
    const showLogin = ref(true);
    const router = useRouter();

    const gotoDashboard = () => {
      router.push({ name: "Dashboard" });
    };

    return { showLogin, gotoDashboard };
  },
};
</script>

<style scoped>
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
</style>
