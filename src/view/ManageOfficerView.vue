<template>
  <div>
    <button @click="addUser">Add User</button>
  </div>
</template>
  
  <script>
import { getFunctions, httpsCallable } from "firebase/functions";

export default {
  name: "ManagerOfficeView",
  methods: {
    async addUser() {
      const functions = getFunctions();
      const addUserWithRole = httpsCallable(functions, "addUserWithRole");

      // Example data passed to the function
      const userData = {
        email: "newuser3@example.com",
        password: "strongpassword",
        role: "editor",
      };

      addUserWithRole(userData)
        .then((result) => {
          alert("User added: " + result.data.message);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          alert("Failed to add user: " + error.message);
        });
    },
  },
};
</script>
  