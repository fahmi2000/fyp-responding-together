<!-- /src/view/ProfileView.vue -->
<template>
  <div v-if="user" class="profile-container">
    <h2>Profile Information</h2>
    <div class="user-info">
      <p>
        <strong>Email:</strong> <span>{{ user.email }}</span>
      </p>
      <p>
        <strong>UID:</strong> <span>{{ user.uid }}</span>
      </p>
      <p>
        <strong>displayName:</strong> <span>{{ user.displayName }}</span>
      </p>
      <p>
        <strong>photoURL:</strong> <span>{{ user.photoURL }}</span>
      </p>
      <p>
        <strong>emailVerified:</strong> <span>{{ user.emailVerified }}</span>
      </p>
    </div>
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

<style scoped>
.profile-container {
  width: 370px;
  background-color: #f5f4f4;
  padding: 20px; /* Adds some padding around the content */
  margin: auto; /* Centers the container */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: adds a subtle shadow */
}

.user-info p {
  margin: 10px 0; /* Adds some spacing between each piece of information */
}

.user-info p strong {
  display: block; /* Makes the label appear above the user info */
}

input[type="email"],
input[type="password"],
button {
  display: block; /* Ensure inputs and button take the full width */
  width: 100%; /* Use the full width of the parent container */
  margin: 10px 0; /* Adds some spacing */
  box-sizing: border-box; /* Includes padding and border in the element's total width and height */
}

button {
  background-color: black;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #333; /* Darkens the button on hover */
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
