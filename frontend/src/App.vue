<template>
  <div class="app">
    <div class="app__header app__nav">
      <router-link class="app__nav-item" to="/">Home</router-link>|
      <router-link class="app__nav-item" to="/exercise/gozintograph"
        >Gozintograph</router-link
      >|
      <a
        class="app__nav-item"
        style="cursor:pointer"
        v-if="installBtn"
        @click="installer()"
        >Install</a
      >
    </div>
    <router-view class="app__main" />
  </div>
</template>

<style lang="postcss">
html {
  @apply bg-brown_sugar m-0 p-0;
}
body::-webkit-scrollbar {
  width: 11px;
}
body {
  scrollbar-width: thin;
  scrollbar-color: whitesmoke whitesmoke;
}
body::-webkit-scrollbar-track {
  background: grey;
}
body::-webkit-scrollbar-thumb {
  background-color: whitesmoke;
  border-radius: 6px;
  border: 3px solid whitesmoke;
}

.app {
  @apply flex flex-col mx-auto my-0 text-russet bg-white_chocolate rounded shadow h-screen w-screen;
  line-height: 1.7;
}
.app__header {
  @apply h-navigation p-6 text-lg font-bold text-sunray;
  box-shadow: inset 0 -7px 9px -7px rgba(0, 0, 0, 0.4);
}
.app__nav {
  @apply flex py-2 px-6 bg-brown_sugar;
}
.app__nav-item {
  @apply flex mx-2 justify-center py-1 px-3 text-white_chocolate no-underline text-sm font-bold rounded;
  transition: background-color 0.15s, color 0.15s;
}
.app__nav-item:hover {
  @apply bg-white_chocolate text-russet;
}
.app__nav-item.router-link-exact-active {
  @apply bg-russet text-white_chocolate;
}
</style>

<script>
import { urlBase64ToUint8Array } from "@/lib/helper";

import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  data() {
    return {
      installBtn: false,
      installer: undefined
    };
  },
  created() {
    let installPrompt;

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      installPrompt = event;
      this.installBtn = true;
    });

    this.installer = async () => {
      this.installBtn = false;
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") {
        this.subscribe();
      }
    };
  },
  computed: {
    ...mapState(["publicVapidKey"])
  },
  methods: {
    async subscribe() {
      const register = await navigator.serviceWorker.register(
        "service-worker.js"
      );

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(this.publicVapidKey)
      });
      const payload = {
        subscription,
        id: "5dd99036a3e6444168c04a6d"
      };
      await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json"
        }
      });
    }
  }
};
</script>
