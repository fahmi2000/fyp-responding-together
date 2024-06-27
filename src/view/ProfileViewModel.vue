<template>
  <div v-if="userData">
    <div class="center-icon">
      <img v-if="userData.profilePicture" :src="userData.profilePicture" alt="Profile Picture" class="profile-picture" />
      <i v-else class="pi pi-user" style="font-size: 15rem"></i>
    </div>
    <button @click="visible = true">Update Profile</button>
    <input type="file" ref="fileInput" @change="handleProfilePictureUpload" style="display: none;" />
    <Divider />
    <strong>Name</strong>
    <p>{{ userData.userFullName }}</p>

    <strong>Email</strong>
    <p>{{ userData.userEmail }}</p>

    <strong>Area</strong>
    <p>{{ userData.userArea }}</p>

    <strong>Bio</strong>
    <p>{{ userData.userBio }}</p>

    <!-- PrimeVue Dialog for Editing Profile -->
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <Avatar :image="userData.profilePicture || 'default-avatar-url.png'" shape="circle" />
          <span class="font-bold white-space-nowrap">{{ userData.userFullName }}</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">Update your information.</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="userFullName" class="font-semibold w-6rem">Full Name</label>
        <InputText id="userFullName" v-model="editUserData.userFullName" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="userEmail" class="font-semibold w-6rem">Email</label>
        <InputText id="userEmail" v-model="editUserData.userEmail" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="userArea" class="font-semibold w-6rem">Area</label>
        <InputText id="userArea" v-model="editUserData.userArea" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="userBio" class="font-semibold w-6rem">Bio</label>
        <Textarea  id="userBio" v-model="editUserData.userBio" class="flex-auto" autocomplete="off" />
      </div>
      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
        <Button label="Save" outlined severity="secondary" @click="updateUserProfile" autofocus />
      </template>
    </Dialog>
  </div>
  <div v-else>
    <p>Loading user data...</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getUserFromFirestore, updateUserProfileInFirestore, uploadProfilePictureToFirebase, updateProfilePictureURLInFirestore } from '@/model/UserModel';
import { projectAuth } from '../firebase/config';

const userData = ref(null);
const visible = ref(false);
const fileInput = ref(null);
const currentUser = projectAuth.currentUser;
const editUserData = reactive({
  userFullName: '',
  userEmail: '',
  userArea: '',
  userBio: ''
});

onMounted(async () => {
  if (currentUser) {
    try {
      const userDoc = await getUserFromFirestore(currentUser.uid);
      userData.value = userDoc;
      Object.assign(editUserData, userDoc); // Copy the user data to editUserData
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  } else {
    console.error('No user is signed in.');
  }
});

const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (file && currentUser) {
    try {
      const url = await uploadProfilePictureToFirebase(file, currentUser.uid);
      await updateProfilePictureURLInFirestore(currentUser.uid, url);
      userData.value.profilePicture = url;
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    }
  }
};

const updateUserProfile = async () => {
  try {
    await updateUserProfileInFirestore(currentUser.uid, editUserData);
    Object.assign(userData.value, editUserData); // Update the displayed user data
    visible.value = false;
  } catch (error) {
    console.error('Error updating user profile:', error.message);
  }
};
</script>

<style scoped>
.center-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: flex;
}

.profile-picture {
  width: 15rem;
  height: 15rem;
  border-radius: 50%;
  object-fit: cover;
}
</style>
