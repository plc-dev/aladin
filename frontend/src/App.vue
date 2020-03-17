<template>
  <div class="app">
    <Header>
      <template #right>
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

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.alertify {
  z-index: 4337;
}

.app {
  @apply flex flex-col my-0 text-textColor bg-background rounded shadow h-screen w-screen;
  line-height: 1.7;
  height: 100%;
  width: 100%;
}

.tooltip .tooltip-inner {
  @apply text-background bg-contrast !important;
  border: 1px solid grey;
}

.tooltip .tooltip-arrow {
  @apply border-contrast !important;
  border: 1px solid grey;
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
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
  mounted() {
    document.addEventListener("keydown", e => {
      if (e.key === "p" && e.altKey) {
        this.$store.commit("user/TOGGLE_PRESENTER_MODE");
      }
    });
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
        uuid: this.$store.state.user.uuid || ""
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
