<template>
  <div class="grid">
    <div class="box1"><Navbar /></div>
    <div class="box2"><LocationAddView /></div>
    <div class="box3">
      <h1>Locations</h1>
      <Button label="Show" @click="visible = true" />
      <Dialog
        v-model:visible="visible"
        modal
        header="Edit Profile"
        :style="{ width: '25rem' }"
      >
        <span class="p-text-secondary block mb-5"
          >Update your information.</span
        >
        <div class="flex align-items-center gap-3 mb-3">
          <label for="username" class="font-semibold w-6rem">Username</label>
          <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
          <label for="email" class="font-semibold w-6rem">Email</label>
          <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-content-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visible = false"
          ></Button>
          <Button type="button" label="Save" @click="visible = false"></Button>
        </div>
      </Dialog>
      <LocationListView />
    </div>
    <div class="box4"></div>
  </div>
</template>
    
<script>
import Navbar from "@/components/Navbar.vue";
import LocationAddView from "@/view/LocationAddView.vue";
import LocationListView from "@/view/LocationListView.vue";

import { ref } from "vue";

const visible = ref(false);

export default {
  components: {
    Navbar,
    LocationAddView,
    LocationListView,
    visible,
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0.5fr 2fr 2fr;
  grid-template-areas:
    "box1 box1 box1 box1"
    "box2 box3 box3 box3"
    "box2 box3 box3 box3";
  height: 100vh;
  gap: 2vh;
  padding: 2vh;
  padding: 2vw;
}

.box {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}

.box1 {
  grid-area: box1;
}

.box2 {
  grid-area: box2;
  overflow: auto;
}

.box3 {
  overflow: auto;
  grid-area: box3;
}
</style>