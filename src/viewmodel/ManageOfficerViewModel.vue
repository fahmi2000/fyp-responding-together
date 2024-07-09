<template>
  <div>
    <div class="card flex justify-content-center">
      <Dialog v-model:visible="visible" modal header="Add Officer" :style="{ minWidth: '25rem' }">
        <template #header>
          <div class="inline-flex align-items-right justify-content-center gap-2">
            <Avatar shape="circle" icon="pi pi-user" />
            <span class="font-bold white-space-nowrap">Add New Officer</span>
          </div>
        </template>
        <span class="p-text-secondary block mb-4">Enter the officer's information below.</span>
        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputText v-model="email" id="email" :style="{ minWidth: '25rem' }" />
            <label for="email">Email</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputText v-model="password" id="password" type="password" :style="{ minWidth: '25rem' }" />
            <label for="password">Password</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputText v-model="userFullName" id="userFullName" :style="{ minWidth: '25rem' }" />
            <label for="userFullName">Full Name</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-5">
          <FloatLabel>
            <InputText v-model="userContactNumber" id="userContactNumber" :style="{ minWidth: '25rem' }" />
            <label for="userContactNumber">Contact Number</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-end gap-2 mb-5">
          <Button label="Cancel" outlined severity="danger" @click="visible = false" icon="pi pi-times-circle" />
          <Button label="Add Officer" @click="addOfficer" icon="pi pi-file-plus" />
        </div>
      </Dialog>
    </div>

    <div>
      <div class="flex align-items-center justify-content-between mb-5">
        <h1>Officers</h1>
        <Button label="Add Officer" @click="visible = true" icon="pi pi-plus" v-if="userType === 'Admin'" />
      </div>



      <DataTable :value="users" style="margin-top: 20px;">
        <Column field="id" header="UID"></Column>
        <Column field="userFullName" header="Full Name"></Column>
        <Column field="userEmail" header="Email"></Column>
        <Column field="userType" header="User Type"></Column>
        <Column field="userContactNumber" header="Contact Number"></Column>
        <Column field="userBio" header="Bio"></Column>
        <Column field="emailVerified" header="Email Verified"></Column>
        <Column header="" v-if="userType === 'Admin'">
          <template #body="{ data }">
            <Button icon="pi pi-trash" @click="deleteUser(data.id)" severity="danger" outlined />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllOfficers, UserModel, addUserToFirestore, deleteUserFromFirestore, getUserFromFirestore } from '@/model/UserModel'; // Import functions
import { projectAuth } from '@/firebase/config';

const users = ref([]);
const visible = ref(false);
const userType = ref('');

const loadUsers = async () => {
  try {
    // Fetch users from Firestore
    const officersUsers = await getAllOfficers();

    // Fetch users from Firebase Authentication
    const authUsers = await UserModel.listUsers();

    // Merge Firestore data with Authentication data
    const mergedUsers = officersUsers.map(officersUser => {
      const authUser = authUsers.find(authUser => authUser.uid === officersUser.id);
      return {
        ...officersUser,
        emailVerified: authUser ? authUser.emailVerified : false // default to false if not found
      };
    });

    users.value = mergedUsers;
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Failed to load users.');
  }
};

const addOfficer = async () => {
  try {
    // Validate input fields (add validation logic if required)
    const userData = {
      email: email.value,
      password: password.value,
      displayName: userFullName.value,
      phoneNumber: userContactNumber.value,
      userType: 'Officer' // Assuming userType is set to 'Officer'
    };

    // Add user to Firebase Authentication using Admin SDK
    const authResult = await UserModel.addUser(userData);

    // If user creation in Authentication is successful
    if (authResult.data.uid) {
      // Add user details to Firestore
      await addUserToFirestore(authResult.data, userData.email, userData.displayName, userData.userType);

      // Reload users
      await loadUsers();

      // Close dialog and clear input fields
      visible.value = false;
      email.value = '';
      password.value = '';
      userFullName.value = '';
      userContactNumber.value = '';

      console.log('Officer added successfully.');
    } else {
      console.error('Error adding officer to Authentication.');
      alert('Failed to add officer.');
    }
  } catch (error) {
    console.error('Error adding officer:', error);
    alert('Failed to add officer.');
  }
};

const deleteUser = async (userId) => {
  try {
    // Delete user from Firestore
    await deleteUserFromFirestore(userId);

    // Delete user from Firebase Authentication
    await UserModel.deleteUser(userId);

    // Reload users
    await loadUsers();

    console.log(`User with ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user.');
  }
};


onMounted(async () => {
  try {

    const currentUser = projectAuth.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const user = await getUserFromFirestore();
    userType.value = user.userType;

  } catch (error) {
    console.error("Error fetching:", error);
  }
  loadUsers();
});
</script>
