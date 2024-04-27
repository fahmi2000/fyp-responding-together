<!-- /src/view/ProfileView.vue -->
<template>
  <div v-if="user">
    <div class="center-icon">
      <i class="pi pi-user" style="font-size: 15rem"></i>
    </div>
    <Divider />
    <div class="card flex justify-content-end">
      <Button @click="visible = true" label="Edit" severity="contrast" />
      <Dialog
        v-model:visible="visible"
        modal
        header="Edit Profile"
        :style="{ width: '25rem' }"
      >
        <span class="p-text-secondary block mb-5"
          >Update your information.</span
        >
        <form @submit.prevent="changeEmail(newEmail)">
          <div class="flex align-items-center gap-3 mb-3">
            <label for="email" class="font-semibold w-6rem">New Email</label>
            <InputText
              id="email"
              class="flex-auto"
              autocomplete="off"
              v-model="newEmail"
            />
          </div>

          <div class="flex justify-content-end gap-2">
            <Button
              type="submit"
              label="Update Email"
              severity="contrast"
            ></Button>
          </div>
        </form>
        <Divider />
        <form @submit.prevent="changePassword(currentPassword, newPassword)">
          <div class="flex align-items-center gap-3 mb-5">
            <label for="email" class="font-semibold w-6rem">Old Password</label>
            <Password
              id="email"
              class="flex-auto"
              autocomplete="off"
              :feedback="false"
              v-model="currentPassword"
            />
          </div>
          <div class="flex align-items-center gap-3 mb-5">
            <label for="email" class="font-semibold w-6rem">New Password</label>
            <Password
              id="email"
              class="flex-auto"
              autocomplete="off"
              v-model="newPassword"
            />
          </div>
          <div class="flex justify-content-end gap-2">
            <Button
              type="submit"
              label="Update Password"
              severity="contrast"
            ></Button>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
        </form>
      </Dialog>
    </div>
    <strong>Name</strong>
    <p>{{ user.displayName }}</p>

    <strong>Email</strong>
    <p>{{ user.email }}</p>

    <strong>ID</strong>
    <p>{{ user.uid }}</p>

    <strong>Location</strong>
    <p>{ user.location }</p>
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
    const visible = ref(false);

    return {
      user,
      currentPassword,
      newPassword,
      changePassword,
      error,
      newEmail,
      changeEmail,
      visible,
    };
  },
};
</script>

<style scoped>
.center-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: flex;
}
</style>