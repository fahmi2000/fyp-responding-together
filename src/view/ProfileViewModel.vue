<template>
  <div v-if="userData">
    <div class="center-icon">
      <img v-if="userData.profilePicture" :src="userData.profilePicture" alt="Profile Picture" class="profile-picture" />
      <i v-else class="pi pi-user" style="font-size: 15rem"></i>
    </div>
    <div class="button-group">
      <Button label="Update Picture" icon="pi pi-image" @click="triggerFileInput" />
    </div>
    <input type="file" ref="fileInput" @change="handleProfilePictureUpload" style="display: none;" />
    <Divider />
    <div class="button-group right-aligned">
      <SpeedDial :model="speedDialItems" direction="up" :style="{ left: '1rem', bottom: '1rem' }" :tooltipOptions="{ position: 'left' }" />
    </div>
    <strong>Name</strong>
    <p>{{ userData.userFullName }}</p>

    <strong>Email</strong>
    <p>{{ userData.userEmail }}</p>

    <strong>Area</strong>
    <p>{{ userData.userArea }}</p>

    <strong>Bio</strong>
    <p>{{ userData.userBio }}</p>

    <!-- PrimeVue Dialog for Editing Profile -->
    <Dialog v-model:visible="visibleProfileDialog" modal header="Edit Profile" :style="{ width: '25rem' }">
      <template #header>
        <div class="header-content">
          <Avatar :image="userData.profilePicture || 'default-avatar-url.png'" shape="circle" />
          <span class="user-name">{{ userData.userFullName }}</span>
        </div>
      </template>
      <span class="p-text-secondary block mb-5">Update your information.</span>
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <InputText id="userFullName" v-model="editUserData.userFullName" />
          <label for="userFullName">Full Name</label>
        </FloatLabel>
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <InputText id="userEmail" v-model="editUserData.userEmail" />
          <label for="userEmail">Email</label>
        </FloatLabel>
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <InputText id="userArea" v-model="editUserData.userArea" />
          <label for="userArea">Area</label>
        </FloatLabel>
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <Textarea id="userBio" v-model="editUserData.userBio" />
          <label for="userBio">Bio</label>
        </FloatLabel>
      </div>
      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="visibleProfileDialog = false" autofocus />
        <Button label="Save" outlined severity="secondary" @click="updateUserProfile" autofocus />
      </template>
    </Dialog>

    <!-- PrimeVue Dialog for Updating Account -->
    <Dialog v-model:visible="visibleAccountDialog" modal header="Update Account" :style="{ width: '25rem' }">
      <!-- Form fields for old password and new password -->
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <InputText id="oldPassword" v-model="oldPassword" type="password" />
          <label for="oldPassword">Old Password</label>
        </FloatLabel>
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <FloatLabel>
          <InputText id="newPassword" v-model="newPassword" type="password" />
          <label for="newPassword">New Password</label>
        </FloatLabel>
      </div>
      <template #footer>
        <Button label="Cancel" text severity="secondary" @click="visibleAccountDialog = false" autofocus />
        <Button label="Save" outlined severity="secondary" @click="updateUserAccount" autofocus />
      </template>
    </Dialog>
  </div>
  <div v-else>
    <p>Loading user data...</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getUserFromFirestore, updateUserProfileInFirestore, uploadProfilePictureToFirebase, updateProfilePictureURLInFirestore, updatePasswordWithReauth  } from '@/model/UserModel';
import { projectAuth } from '../firebase/config';

const userData = ref(null);
const visibleProfileDialog = ref(false);
const visibleAccountDialog = ref(false);
const fileInput = ref(null);
const currentUser = projectAuth.currentUser;
const oldPassword = ref('');
const newPassword = ref('');
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

const triggerFileInput = () => {
  fileInput.value.click();
};

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
    visibleProfileDialog.value = false;
  } catch (error) {
    console.error('Error updating user profile:', error.message);
  }
};

const speedDialItems = [
  {
    label: 'Update Profile',
    icon: 'pi pi-pencil',
    command: () => {
      visibleProfileDialog.value = true;
    }
  },
  {
    label: 'Update Account',
    icon: 'pi pi-cog',
    command: () => {
      visibleAccountDialog.value = true;
    }
  }
];

const updateUserAccount = async () => {
  const result = await updatePasswordWithReauth(currentUser, oldPassword.value, newPassword.value);
  if (result.success) {
    console.log("Password changed successfully.");
    visibleAccountDialog.value = false;
  } else {
    // Display error message to the user
    console.error(`Error updating account: ${result.error}`);
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

.button-group {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.right-aligned {
  justify-content: flex-end;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name {
  display: inline-block;
  max-width: 12rem; /* Adjust as needed */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
