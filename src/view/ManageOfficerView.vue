<template>
  <div>
    <button @click="addUser">Add User</button>
    <button @click="listUsers">List Users</button>
    <button @click="listOfficers">List Officers</button>
    <ul>
      <li v-for="officer in officers" :key="officer.uid">
        {{ officer.email }} - {{ officer.role }}
        <button @click="deleteUser(officer.uid)">Delete</button>
      </li>
    </ul>
    <ul>
      <li v-for="user in users" :key="user.uid">
        {{ user.email }} - {{ user.displayName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
import { ManageOfficerController } from "../controller/ManageOfficerController";

export default {
  name: "ManageOfficerView",
  setup() {
    const message = ref("");
    const users = ref([]);

    const addUser = async () => {
      // Example data passed to the function
      const userData = {
        email: "newuser2@example.com",
        password: "strongpassword",
        role: "Officer",
      };

      try {
        const result = await ManageOfficerController.addUser(userData);
        message.value = "User added: " + result.data.message;
        alert(message.value);
      } catch (error) {
        console.error("Error adding user:", error);
        message.value = "Failed to add user: " + error.message;
        alert(message.value);
      }
    };

    const listUsers = async () => {
      try {
        users.value = await ManageOfficerController.getUsers();
      } catch (error) {
        console.error("Error listing users:", error);
        message.value = `Failed to list users: ${error.message}`;
        alert(message.value);
      }
    };

    const officers = ref([]);

    const listOfficers = async () => {
      try {
        officers.value = await ManageOfficerController.getOfficers();
      } catch (error) {
        console.error("Error listing officers:", error);
        alert(`Failed to list officers: ${error.message}`);
      }
    };

    const deleteUser = async (uid) => {
      try {
        const result = await ManageOfficerController.deleteUser(uid);
        alert(result.message);
        listOfficers(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(`Failed to delete user: ${error.message}`);
      }
    };

    return {
      addUser,
      listUsers,
      deleteUser,
      listOfficers,
      users,
      officers,
    };
  },
};
</script>
