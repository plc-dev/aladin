<template>
  <div class="app">
    <Header>
      <template #right>
        <div>
          <!-- TODO LOGIN -->
          <a class="nav__navigation--login sm:mt-0" @click.prevent>Login</a>
        </div>
        <div v-if="installBtn">
          <a
            class="nav__navigation--install sm:mt-0 ml-2"
            @click.prevent="installer()"
            >Install</a
          >
        </div>
      </template>
    </Header>
    <router-view class="app__main" />
  </div>
</template>

<style lang="postcss">
html {
  @apply bg-background m-0 p-0;
  font-family: "Noto Sans", Times, serif;
  box-sizing: border-box;
}
body {
  scrollbar-width: thin;
  scrollbar-color: whitesmoke whitesmoke;
  width: 100vw;
  height: 100vh;
  scroll-behavior: smooth;
}
body::-webkit-scrollbar {
  width: 11px;
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
  @apply flex flex-col my-0 text-textColor bg-background rounded shadow h-screen w-screen;
  line-height: 1.7;
  height: 100%;
  width: 100%;
}
</style>

<script>
import Header from "@/components/Header";
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
  components: {
    Header
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
