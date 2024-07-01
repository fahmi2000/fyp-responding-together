<template>
  <div>
    <div>
      <label for="datatype">Data Type:</label>
      <input type="text" id="datatype" v-model="dataType" />
    </div>
    <div>
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" />
      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" />
    </div>
    <button @click="getWeatherWarnings">Search</button>
    <div v-if="searching">
      <p>Loading...</p>
    </div>
    <div v-else-if="weatherWarnings.length > 0">
      <h2>Results</h2>
      <DataTable :value="weatherWarnings" paginator :rows="5">
        <Column field="datatype" header="Data Type"></Column>
        <Column field="title" header="Title"></Column>
        <Column field="date" header="Date"></Column>
        <Column field="textwarning" header="Warning"></Column>
        <Column field="validfrom" header="Valid From"></Column>
        <Column field="validto" header="Valid To"></Column>
        <Column header="" style="width: 6rem">
          <template #body="{ data }">
            <Button
              label="Add"
              severity="contrast"
              @click="handleEditShow(data)"
            />
          </template>
        </Column>
      </DataTable>
      <Dialog
        v-model:visible="visible"
        modal
        header="Add Disaster"
        :style="{ width: '25rem' }"
      >
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="datatype" v-model="datatype" />
            <label for="datatype">Type</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="title" v-model="title" />
            <label for="title">Title</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="date" v-model="date" />
            <label for="date">Type</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="warningtext" v-model="warningtext" />
            <label for="warningtext">Notice</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="validfrom" v-model="validfrom" />
            <label for="validfrom">From</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel>
            <InputText id="validto" v-model="validto" />
            <label for="validto">To</label>
          </FloatLabel>
        </div>

        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel class="w-full md:w-14rem">
            <Dropdown
              v-model="selectedCity"
              inputId="dd-city"
              :options="cities"
              optionLabel="name"
              class="w-full"
              filter
            />
            <label for="dd-city">Locations</label>
          </FloatLabel>
        </div>
        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel class="w-full md:w-14rem">
            <Dropdown
              v-model="selectedCity"
              inputId="district"
              :options="cities"
              optionLabel="name"
              class="w-full"
              filter
            />
            <label for="district">District</label>
          </FloatLabel>
        </div>

        <div class="flex justify-content-center gap-2 mb-3">
          <FloatLabel class="w-full md:w-14rem">
            <Dropdown
              v-model="selectedCity"
              inputId="pic"
              :options="cities"
              optionLabel="name"
              class="w-full"
              filter
            />
            <label for="pic">Person-in-Charge</label>
          </FloatLabel>
        </div>
      </Dialog>
    </div>
    <div v-else>
      <p>No weather warnings found.</p>
    </div>
    <!-- Add form component here -->
    <div v-if="showForm">
      <!-- Form to add entry to the 'disaster' collection -->
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

const dataType = ref("");
const startDate = ref("");
const endDate = ref("");
const weatherWarnings = ref([]);
const searching = ref(false);
const showForm = ref(false); // Add ref to track form visibility
let selectedRowData = ref(null); // Ref to store selected row data
const visible = ref(false);

const getWeatherWarnings = async () => {
  searching.value = true;
  const q = query(collection(projectFirestore, "weatherwarning"), buildQuery());
  console.log("Firestore Query:", q);
  const querySnapshot = await getDocs(q);
  weatherWarnings.value = [];
  querySnapshot.forEach((doc) => {
    weatherWarnings.value.push({ id: doc.id, ...doc.data() });
  });
  searching.value = false;
};

const buildQuery = () => {
  let q = collection(projectFirestore, "weatherwarning");
  let conditions = [];

  if (dataType.value) {
    conditions.push(where("datatype", "==", dataType.value));
  }
  if (startDate.value && endDate.value) {
    conditions.push(where("validfrom", ">=", startDate.value));
    conditions.push(where("validto", "<=", endDate.value));
  }

  if (conditions.length > 0) {
    q = query(q, ...conditions);
  }

  return q;
};
// Define reactive variables to store form data
const editDataType = ref("");
const editTitle = ref("");
const editDate = ref("");
const editTextWarning = ref("");
const editValidFrom = ref("");
const editValidTo = ref("");

// Method to populate form fields with selected row data
const editDisaster = (rowData) => {
  // Populate form fields with data from the selected row
  editDataType.value = rowData.datatype;
  editTitle.value = rowData.title;
  editDate.value = rowData.date;
  editTextWarning.value = rowData.textwarning;
  editValidFrom.value = rowData.validfrom;
  editValidTo.value = rowData.validto;
};

const handleEditShow = (data) => {
  editDisaster(data);
  visible.value = true;
};
</script>
  