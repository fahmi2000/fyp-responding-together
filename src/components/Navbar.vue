<template>
  <Menubar v-if="user" :model="items">
    <template #start>
      <div class="brand">
        <div class="brand-content">
          <span class="brand-text" style="padding-right: 2rem"
            >RESPONDING TOGETHER</span
          >
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
          <a
            @click="handleLogoutClick"
            class="dropdown-item"
            style="padding-left: 10px"
          >
            <i class="pi pi-sign-out"></i>
            <span style="padding-left: 10px">Logout</span>
          </a>
        </div>
      </div>
    </template>
  </Menubar>
</template>

<script>
import { useAuthController } from "@/controller/AuthController";
import { useRouter, useRoute } from "vue-router";
import { getUser } from "@/model/UserModel";
import Menubar from "primevue/menubar";

export default {
  components: {
    Menubar,
  },
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser();
    const router = useRouter();
    const route = useRoute();

    const items = [
      {
        label: "Home",
        icon: "pi pi-fw pi-home",
        command: () => {
          navigateTo("Dashboard");
        },
      },
      {
        label: "Task",
        icon: "pi pi-fw pi-list-check",
        command: () => {
          navigateTo("Profile");
        },
      },
      {
        label: "User",
        icon: "pi pi-fw pi-address-book",
        command: () => {
          navigateTo("Users");
        },
      },
      {
        label: "Location",
        icon: "pi pi-fw pi-money-bill",
        command: () => {
          navigateTo("Profile");
        },
      },
      {
        label: "Disaster",
        icon: "pi pi-fw pi-exclamation-circle",
        command: () => {
          navigateTo("Profile");
        },
      },
    ];

    const navigateTo = (name) => {
      router.push({ name });
    };

    const handleLogoutClick = async () => {
      await requestSignOut();
      if (!error.value) {
        console.log("User logged out");
        navigateTo("LandingPage");
      }
    };

    // Return all the necessary methods and reactive properties
    return { handleLogoutClick, user, navigateTo, items };
  },
};
</script>

<style>
</style>
