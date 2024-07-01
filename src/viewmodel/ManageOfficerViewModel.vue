<template>
  <div>
    <div class="card flex justify-content-center">
      <Button label="Add Officer" @click="visible = true" />
      <Dialog v-model:visible="visible" modal header="Add Officer" :style="{ width: '25rem' }">
        <template #header>
          <div class="inline-flex align-items-center justify-content-center gap-2">
            <Avatar shape="circle" icon="pi pi-user" />
            <span class="font-bold white-space-nowrap">Add New Officer</span>
          </div>
        </template>
        <span class="p-text-secondary block mb-4">Enter the officer's information below.</span>
        <div class="flex align-items-center gap-3 mb-4">
          <FloatLabel>
            <InputText v-model="email" id="email" class="flex-auto" autocomplete="off" />
            <label for="email">Email</label>
          </FloatLabel>
        </div>
        <div class="flex align-items-center gap-3 mb-4">
          <FloatLabel>
            <InputText v-model="password" id="password" type="password" class="flex-auto" autocomplete="off" />
            <label for="password">Password</label>
          </FloatLabel>
        </div>
        <div class="flex align-items-center gap-3 mb-4">
          <FloatLabel>
            <InputText v-model="userFullName" id="userFullName" class="flex-auto" autocomplete="off" />
            <label for="userFullName">Full Name</label>
          </FloatLabel>
        </div>
        <div class="flex align-items-center gap-3 mb-4">
          <FloatLabel>
            <InputText v-model="userContactNumber" id="userContactNumber" class="flex-auto" autocomplete="off" />
            <label for="userContactNumber">Contact Number</label>
          </FloatLabel>
        </div>
        <template #footer>
          <Button label="Cancel" text severity="secondary" @click="visible = false" autofocus />
          <Button label="Add Officer" outlined severity="secondary" @click="addOfficer" autofocus />
        </template>
      </Dialog>
    </div>

    <div>

      <h1>Users List</h1>
      <DataTable :value="users">
        <Column field="id" header="UID"></Column> <!-- Display the UID -->
        <Column field="userFullName" header="Full Name"></Column>
        <Column field="userEmail" header="Email"></Column>
        <Column field="userType" header="User Type"></Column>
        <Column field="userContactNumber" header="Contact Number"></Column>
        <Column field="userBio" header="Bio"></Column>
        <Column field="emailVerified" header="Email Verified"></Column> <!-- Display email verification status -->
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllUsersFromFirestore, UserModel } from '@/model/UserModel'; // Import functions

const users = ref([]);

const loadUsers = async () => {
  try {
    // Fetch users from Firestore
    const firestoreUsers = await getAllUsersFromFirestore();

    // Fetch users from Firebase Authentication
    const authUsers = await UserModel.listUsers();

    // Merge Firestore data with Authentication data
    const mergedUsers = firestoreUsers.map(firestoreUser => {
      const authUser = authUsers.find(authUser => authUser.uid === firestoreUser.id);
      return {
        ...firestoreUser,
        emailVerified: authUser ? authUser.emailVerified : false // default to false if not found
      };
    });

    users.value = mergedUsers;
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Failed to load users.');
  }
};

onMounted(() => {
  loadUsers();
});
</script>
