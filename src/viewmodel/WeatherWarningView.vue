<template>
  <div>
    <h1>Weather Warnings</h1>
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
      </DataTable>
    </div>
    <div v-else>
      <p>No weather warnings found.</p>
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
const searching = ref(false); // Add a new ref to track searching state

const getWeatherWarnings = async () => {
  searching.value = true; // Set searching to true before fetching data
  const q = query(collection(projectFirestore, "weatherwarning"), buildQuery());
  console.log("Firestore Query:", q); // Log the generated Firestore query
  const querySnapshot = await getDocs(q);
  weatherWarnings.value = [];
  querySnapshot.forEach((doc) => {
    weatherWarnings.value.push({ id: doc.id, ...doc.data() });
  });
  searching.value = false; // Set searching to false after fetching data
};

const buildQuery = () => {
  console.log("Data Type:", dataType.value);
  console.log("Start Date:", startDate.value);
  console.log("End Date:", endDate.value);

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
</script>