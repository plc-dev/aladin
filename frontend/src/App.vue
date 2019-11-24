<template>
  <div class="app">
    <div class="app__header app__nav">
      <router-link class="app__nav-item" to="/">Home</router-link>
      |
      <router-link class="app__nav-item" to="/about">About</router-link>
      |
      <a class="app__nav-item" style="cursor:pointer" v-if="installBtn" @click="installer()">
        Install
      </a>
    </div>
    <router-view class="app__main" />
  </div>
</template>

<style lang="postcss">
html {
  @apply bg-brown_sugar m-0 p-0;
}
.app {
  @apply mx-auto my-0 text-russet bg-white_chocolate rounded shadow;
  width: 100vw;
  line-height: 1.7;
}
.app__header {
  @apply p-6 text-lg font-bold text-sunray;
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
.app__main {
  @apply p-6;
}
</style>

<script>
export default {
  data() {
    return {
      installBtn: false,
      installer: undefined,
      publicVapidKey: "BHaC5UbbkQBKz6v-I-JQ2abGaTZYfvO6j1CtPQYIBqJJeXdNcETen-BMP0rqZTscCkjPtJDFwqFYwdPPGtX5Tzo"
    };
  },
  created() {
    let installPrompt;

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      installPrompt = e;
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
  methods: {
    async subscribe() {
      const register = await navigator.serviceWorker.register("service-worker.js");

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
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
    },
    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
};
</script>
