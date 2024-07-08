<template>
  <div class="grid">
    <div class="box1">
      <Navbar />
    </div>
    <div class="box2"></div>
    <div class="box3">
      <div class="flex align-items-center justify-content-between mb-2 mr-4">
        <h1 class="mr-auto">Evacuation Centre</h1>
        <div>
          <Button icon="pi pi-plus" @click="visible = true" severity="contrast" v-if="userType === 'Admin'" />
        </div>
      </div>
      <Dialog v-model:visible="visible" modal header="Add Location" :style="{ width: '25rem' }">
        <LocationAddView />
      </Dialog>
      <LocationListView />
    </div>
    <div class="box4"></div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import LocationAddView from "@/viewmodel/LocationAddView.vue";
import LocationListView from "@/viewmodel/LocationListView.vue";
import { projectAuth } from '@/firebase/config';
import { getUserFromFirestore } from '@/model/UserModel';
import { ref, onMounted } from "vue";

const visible = ref(false);
const userType = ref('');

onMounted(async () => {
  const currentUser = projectAuth.currentUser;
  if (!currentUser) {
    throw new Error('No user logged in');
  }

  const user = await getUserFromFirestore();
  userType.value = user.userType;
});
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box3 box3 box3 box3"
    "box3 box3 box3 box3";
  height: 100%;
  gap: 2vh;
  padding: 2vh;
  padding: 1vw;
}

.box {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}

.box1 {
  grid-area: box1;
}

.box3 {
  overflow: auto;
  grid-area: box3;
}
</style>