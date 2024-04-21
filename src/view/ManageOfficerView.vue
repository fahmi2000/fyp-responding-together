<template>
  <div>
    <button @click="addOfficer">Add Officer</button>
    <div v-if="showForm">
      <form @submit.prevent="submitOfficerForm">
        <!-- Officer form fields -->
        <input
          v-model="officerData.email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="officerData.password"
          type="password"
          placeholder="Password"
          required
        />
        <!-- More fields as necessary -->
        <button type="submit">Submit</button>
        <button @click="cancelOfficerForm">Cancel</button>
      </form>
    </div>
    <!-- Feedback Messages -->
    <p v-if="message">{{ message }}</p>
  </div>
</template>
  
  <script>
import { ref } from "vue";
import { useManageOfficerController } from "@/controller/ManageOfficerController";

export default {
  setup() {
    const {
      requestAddOfficerForm,
      submitOfficerForm,
      cancelSubmitOfficerForm,
    } = useManageOfficerController();
    const showForm = ref(false);
    const officerData = ref({ email: "", password: "" });
    const message = ref("");

    function addOfficer() {
      showForm.value = true;
    }

    function cancelOfficerForm() {
      showForm.value = false;
      officerData.value = { email: "", password: "" }; // Reset form
      cancelSubmitOfficerForm();
    }

    return {
      addOfficer,
      submitOfficerForm,
      cancelOfficerForm,
      showForm,
      officerData,
      message,
    };
  },
};
</script>
  