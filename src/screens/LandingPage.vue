<template>
  <div class="grid min-h-screen">
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">1</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">2</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">3</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">4</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">5</div>
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
          Have account?
          <span @click="showLogin = true" class="bold">Login</span>
        </p>
      </div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">6</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">7</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">8</div>
    </div>
    <div class="col-4 h-auto">
      <div class="text-center p-3 border-round bg-primary font-bold">9</div>
    </div>
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
    AuthView, // Updated component registration
  },
  setup() {
    const showLogin = ref(true);
    const router = useRouter();

    const gotoDashboard = () => {
      router.push({ name: "Dashboard" }); // Navigation logic upon successful login or signup
    };

    return { showLogin, gotoDashboard };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}
</style>

