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

      <h1>Users List</h1>
      <DataTable :value="users">
        <Column field="id" header="UID"></Column> <!-- Display the UID -->
        <Column field="userFullName" header="Full Name"></Column>
        <Column field="userEmail" header="Email"></Column>
        <Column field="userType" header="User Type"></Column>
        <Column field="userContactNumber" header="Contact Number"></Column>
        <Column field="userBio" header="Bio"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { UserModel, createUserDocument, getAllUsersFromFirestore } from '@/model/UserModel'; // Import UserModel and createUserDocument

const visible = ref(false);
const email = ref('');
const password = ref('');
const userFullName = ref('');
const userContactNumber = ref('');
const userBio = ref('');
const userType = ref('Officer'); // Set userType directly to 'Officer'

const addOfficer = async () => {
  try {
    // Create user in Firebase Authentication
    const result = await UserModel.addUser({ email: email.value, password: password.value });

    // Log the Firebase Authentication User data
    console.log('Firebase Authentication User:', result.data);

    // Extract UID from the response
    const uid = result.data.uid;
    if (uid) {
      console.log('UID of newly created user:', uid);

      // Create a document in the 'users' collection using the uid and additional user data
      await createUserDocument(uid, {
        email: email.value,
        userFullName: userFullName.value,
        userType: userType.value,
        userContactNumber: userContactNumber.value,
        userBio: userBio.value
      });
    }

    // Clear form fields
    email.value = '';
    password.value = '';
    userFullName.value = '';
    userContactNumber.value = '';
    userBio.value = '';

    alert('Officer added successfully');

    // Close the dialog
    visible.value = false;
  } catch (error) {
    console.error('Error adding officer:', error);
    alert(`Failed to add officer: ${error.message}`);
  }
};

const users = ref([]);

const loadUsers = async () => {
  try {
    users.value = await getAllUsersFromFirestore();
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Failed to load users.');
  }
};

onMounted(() => {
  loadUsers();
});
</script>
