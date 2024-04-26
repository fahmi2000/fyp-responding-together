
<template>
  <div class="card">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    label: "Router",
    icon: "pi pi-palette",
    items: [
      {
        label: "Styled",
        route: "/theming",
      },
      {
        label: "Unstyled",
        route: "/unstyled",
      },
    ],
  },
  {
    label: "Programmatic",
    icon: "pi pi-link",
    command: () => {
      router.push("/introduction");
    },
  },
  {
    label: "External",
    icon: "pi pi-home",
    items: [
      {
        label: "Vue.js",
        url: "https://vuejs.org/",
      },
      {
        label: "Vite.js",
        url: "https://vuejs.org/",
      },
    ],
  },
]);
</script>


<script>
import { useAuthController } from "@/controller/AuthController";
import { useRouter, useRoute } from "vue-router";
import { getUser } from "@/model/UserModel";

export default {
  setup() {
    const { requestSignOut, error } = useAuthController();
    const { user } = getUser();
    const router = useRouter();
    const route = useRoute();

    const navigateTo = (name) => {
      router.push({ name });
    };

    const navigateToHome = () => {
      navigateTo("Dashboard");
    };

    const isActive = (routeName) => {
      return route.name === routeName;
    };

    const handleLogoutClick = async () => {
      await requestSignOut();
      if (!error.value) {
        console.log("User logged out");
        navigateTo("LandingPage");
      }
    };

    // Return all the necessary methods and reactive properties
    return { handleLogoutClick, user, navigateTo, isActive, navigateToHome };
  },
};
</script>

<style>
</style>
