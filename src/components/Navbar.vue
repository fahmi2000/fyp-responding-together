<template>
  <Menubar v-if="user" :model="items" class="custom-navbar">
    <template #start>
      <div class="brand">
        <div class="brand-content">
          <strong class="brand-text" style="padding-right: 2rem">
            RESPONDING TOGETHER
          </strong>
        </div>
      </div>
    </template>

    <template #item="{ item, props }">
      <a v-ripple class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
      </a>
    </template>

    <template #end>
      <div class="dropdown">
        <div class="dropdown-content">
          <a @click="navigateTo('Profile')" class="dropdown-item">
            <i class="pi pi-user"></i>
            <span style="padding-left: 10px">Profile</span>
          </a>
          <a @click="handleLogoutClick" class="dropdown-item" style="padding-left: 10px">
            <i class="pi pi-sign-out"></i>
            <span style="padding-left: 10px">Logout</span>
          </a>
        </div>
      </div>
    </template>
  </Menubar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUser, signOut } from "@/model/UserModel";
import Menubar from "primevue/menubar";

const user = getUser().user;
const router = useRouter();
const route = useRoute();
const error = ref("");

const items = [
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    command: () => {
      navigateTo("Dashboard");
    },
  },
  {
    label: "Tasks",
    icon: "pi pi-fw pi-list-check",
    command: () => {
      navigateTo("Task");
    },
  },
  {
    label: "Users",
    icon: "pi pi-fw pi-address-book",
    command: () => {
      navigateTo("Users");
    },
  },
  {
    label: "Locations",
    icon: "pi pi-fw pi-money-bill",
    command: () => {
      navigateTo("Location");
    },
  },
  {
    label: "Affected Area(s)",
    icon: "pi pi-fw pi-exclamation-circle",
    command: () => {
      navigateTo("Affected Area");
    },
  },
];

const navigateTo = (name) => {
  router.push({ name });
};

const handleLogoutClick = async () => {
  try {
    await signOut();
    console.log("User logged out");
    navigateTo("LandingPage");
  } catch (err) {
    console.error(`Logout error: ${err.message}`);
    error.value = err.message;
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color: #ff6c5c;
}
</style>
