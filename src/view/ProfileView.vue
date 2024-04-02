<!-- /src/view/ProfileView.vue -->
<template>
  <div v-if="user">
    <h2>Profile Information</h2>
    <!-- Existing profile information display -->
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>UID:</strong> {{ user.uid }}</p>
    <p><strong>displayName:</strong> {{ user.displayName }}</p>
    <p><strong>photoURL:</strong> {{ user.photoURL }}</p>
    <p><strong>emailVerified:</strong> {{ user.emailVerified }}</p>
    <!-- Password update form -->
    <h3>Update Password</h3>
    <form @submit.prevent="changePassword(currentPassword, newPassword)">
      <input
        type="password"
        v-model="currentPassword"
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        v-model="newPassword"
        placeholder="New Password"
        required
      />
      <button type="submit">Update Password</button>
    </form>
    <!-- Email update form -->
    <h3>Update Email</h3>
    <form @submit.prevent="changeEmail(newEmail)">
      <input type="email" v-model="newEmail" placeholder="New Email" required />
      <button type="submit">Update Email</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-else>
    <p>Please log in.</p>
  </div>
</template>

  
<script>
import { ref } from "vue";
import { useProfileController } from "@/controller/ProfileController";

export default {
  setup() {
    const { user, changePassword, error, changeEmail } = useProfileController();
    const currentPassword = ref("");
    const newPassword = ref("");
    const newEmail = ref("");

    return {
      user,
      currentPassword,
      newPassword,
      changePassword,
      error,
      newEmail,
      changeEmail,
    };
  },
};
</script>

  