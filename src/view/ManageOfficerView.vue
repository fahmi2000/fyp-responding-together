<template>
  <div>
    <form @submit.prevent="addUser">
      <h3>Add User</h3>
      <div class="field grid">
        <div class="col">
          <InputText v-model="userData.email" placeholder="Email" />
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <Password v-model="userData.password" placeholder="Password" />
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <Dropdown
            v-model="selectedRole"
            :options="roles"
            optionLabel="name"
            placeholder="Select a Role"
          />
        </div>
      </div>

      <Button type="submit">Add User</Button>
    </form>
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
import { ref, onMounted } from "vue";
import { ManageOfficerController } from "../controller/ManageOfficerController";

export default {
  name: "ManageOfficerView",
  setup() {
    const message = ref("");
    const users = ref([]);
    const selectedRole = ref();
    const userData = ref({
      email: "",
      password: "",
      role: selectedRole,
    });

    const roles = ref([
      { name: "Officer", value: "Officer" },
      { name: "Admin", value: "Admin" },
      { name: "Volunteer", value: "Volunteer" },
    ]);

    const addUser = async () => {
      try {
        const result = await ManageOfficerController.addUser(userData.value);
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

    onMounted(async () => {
      await listUsers();
      await listOfficers();
    });

    return {
      addUser,
      listUsers,
      deleteUser,
      listOfficers,
      users,
      officers,
      userData,
      roles,
      selectedRole,
    };
  },
};
</script>
