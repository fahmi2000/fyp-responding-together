<template>
  <Fieldset legend="Add User" :toggleable="true" style="width: 25vw">
    <form @submit.prevent="addUser">
      <h3>Add User</h3>

      <div class="field grid">
        <div class="col">
          <FloatLabel>
            <InputText v-model="userData.displayName" style="width: 16.5rem" />
            <label for="displayName">Name</label>
          </FloatLabel>
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <FloatLabel>
            <InputText v-model="userData.email" style="width: 16.5rem" />
            <label for="email">Email</label>
          </FloatLabel>
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <FloatLabel>
            <Password
              v-model="userData.password"
              placeholder="Password"
              toggleMask
            />
            <label for="Password">Password</label>
          </FloatLabel>
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <FloatLabel>
            <InputText v-model="userData.phoneNumber" style="width: 16.5rem" />
            <label for="Phone Number">Phone Number</label>
          </FloatLabel>
        </div>
      </div>

      <div class="field grid">
        <div class="col">
          <Dropdown
            v-model="selectedRole"
            :options="roles"
            optionLabel="name"
            placeholder="Select a Role"
            style="width: 16.5rem"
          />
        </div>
      </div>

      <Button type="submit" severity="contrast">Add User</Button>
    </form>
  </Fieldset>
  <Fieldset legend="Officers List" :toggleable="true">
    <DataTable :value="officers">
      <Column field="email" header="Email" sortable></Column>
      <Column field="displayName" header="Display Name"></Column>
      <Column field="role" header="Role" sortable></Column>
      <Column field="phoneNumber" header="Phone Number"></Column>
      <Column field="emailVerified" header="Email Verified"></Column>
      <Column>
        <template #body="slotProps">
          <Button @click="deleteUser(slotProps.data.uid)" severity="danger"
            >Delete</Button
          >
        </template>
      </Column>
    </DataTable>
  </Fieldset>
  <Fieldset legend="Users List" :toggleable="true">
    <DataTable :value="users">
      <Column field="email" header="Email"></Column>
      <Column field="displayName" header="Display Name"></Column>
      <Column field="phoneNumber" header="Phone Number"></Column>
      <Column field="emailVerified" header="Email Verified"></Column>
    </DataTable>
  </Fieldset>
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
    const visible = ref(false);
    const userData = ref({
      email: "",
      password: "",
      phoneNumber: "",
      displayName: "",
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
      visible,
    };
  },
};
</script>
