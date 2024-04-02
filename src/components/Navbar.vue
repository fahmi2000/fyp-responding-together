<template>
  <nav v-if="user">
    <div>
      <p>Hey there... {{ user.displayName }}</p>
      <p class="email">Currently logged in as... {{ user.email }}</p>
    </div>
    <button @click="handleLogoutClick">Logout</button>
  </nav>
</template>

<script>
import { useAuthController } from "@/controller/AuthController";
import getUser from "@/composables/getUser";

export default {
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser();

    const handleLogoutClick = async () => {
      await requestSignOut();
      if (!error.value) {
        console.log("User logged out");
        // Perform additional actions upon successful logout, like redirecting
      }
    };

    return { handleLogoutClick, user };
  },
};
</script>