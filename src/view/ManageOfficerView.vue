<template>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { addUserToFirestore, UserModel } from '@/model/UserModel';

const message = ref("");
const users = ref([]);
const userData = ref({
  email: "",
  password: "",
  phoneNumber: "",
  displayName: "",
});

const officers = ref([]);

const addUser = async () => {
  try {
    // Add user to Firebase Auth
    const result = await UserModel.addUser(userData.value.email, userData.value.password);
    
    // Add user to Firestore
    await addUserToFirestore(result.user, userData.value.email, userData.value.displayName);

    message.value = "User added successfully";
    alert(message.value);
  } catch (error) {
    console.error("Error adding user:", error);
    message.value = "Failed to add user: " + error.message;
    alert(message.value);
  }
};

const deleteUser = async (uid) => {
  try {
    await UserModel.deleteUser(uid); // Use UserModel to delete user
    alert("User deleted successfully");
    await loadOfficers(); // Refresh the list after deletion
  } catch (error) {
    console.error("Error deleting user:", error);
    alert(`Failed to delete user: ${error.message}`);
  }
};

onMounted(async () => {
  await loadUsers();
  await loadOfficers();
});
</script>


<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>

