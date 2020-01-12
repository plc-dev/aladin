<template>
  <nav class="nav">
    <div class="nav__brand">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Htw-dresden-logo.svg"
        alt="HTW Logo"
        class="nav__brand--logo"
      />
      <router-link class="nav__brand--title" @click.native="toggle" to="/"
        >ALADIN</router-link
      >
    </div>
    <div class="nav__mobile block sm:hidden">
      <button @click="toggle" class="nav__mobile--hamburger">
        <svg
          class="fill-current h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <div
      :class="open ? 'block' : 'hidden'"
      class="nav__navigation sm:flex sm:items-center sm:w-auto"
    >
      <div class="nav__navigation--links sm:flex-grow">
        <router-link
          class="link sm:inline-block sm:mt-0"
          @click.native="toggle"
          to="/"
          >{{ texts ? texts.home : "" }}</router-link
        >
        <router-link
          class="link sm:inline-block sm:mt-0"
          @click.native="toggle"
          to="/exercises"
          >{{ texts ? texts.exercises : "" }}</router-link
        >
        <router-link
          v-if="loggedIn"
          class="link sm:inline-block sm:mt-0"
          @click.native="toggle"
          to="/settings"
          >{{ texts ? texts.settings : "" }}</router-link
        >
      </div>
      <div v-if="!loggedIn">
        <router-link
          class="nav__navigation--login sm:mt-0"
          @click.native="toggle"
          to="/login"
          >Login</router-link
        >
      </div>
      <div v-if="!loggedIn">
        <router-link
          class="nav__navigation--register sm:mt-0"
          @click.native="toggle"
          to="/register"
          >Register</router-link
        >
      </div>
      <div v-else>
        <a
          class="nav__navigation--logout sm:mt-0"
          @click.prevent="$store.dispatch('user/logout')"
          >Logout</a
        >
      </div>
      <slot name="right"></slot>
    </div>
  </nav>
</template>

<style lang="postcss">
.nav {
  @apply flex items-center justify-between flex-wrap bg-main p-4 h-navigation;
  box-shadow: inset 0 -7px 5px -7px rgba(0, 0, 0, 0.1);
  width: 100vw;
}

.nav__brand {
  @apply flex items-center text-white mr-8;
}

.nav__brand--logo {
  @apply h-8 w-auto;
}

.nav__brand--title {
  @apply font-semibold ml-4 text-xl text-textColor tracking-tight;
}

.nav__mobile--hamburger {
  @apply flex items-center px-3 py-2 border rounded text-background border-background;
}

.nav__mobile--hamburger:hover {
  @apply text-white border-white;
}

.nav__navigation {
  @apply w-full flex-grow;
  background: #b1b2b4;
  z-index: 3337;
}

.nav__navigation--links {
  @apply text-sm;
}

.link {
  @apply no-underline block text-contrast mr-4 mt-4 p-2 rounded;
}

.link:hover {
  @apply text-highlight bg-contrast;
}

.nav__navigation--install,
.nav__navigation--login,
.nav__navigation--logout,
.nav__navigation--register {
  @apply no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-contrast border-contrast mt-4 cursor-pointer ml-2 mb-2;
}

.nav__navigation--install:hover,
.nav__navigation--login:hover,
.nav__navigation--logout:hover,
.nav__navigation--register:hover {
  @apply border-transparent text-highlight bg-contrast;
}
</style>

<script>
export default {
  data: function() {
    return {
      open: true,
      texts: localStorage.texts ? localStorage.texts.nav : {}
    };
  },
  methods: {
    toggle() {
      if (window.outerWidth < 640) {
        this.open = !this.open;
      }
    },
    showOverlay() {
      document.querySelector(".overlay").style.height = "100vh";
    },
    menuResize() {
      if (window.outerWidth < 640) {
        this.open = false;
      } else {
        this.open = true;
      }
    }
  },
  computed: {
    loggedIn: function() {
      return this.$store.state.user.token;
    }
  },
  created() {
    this.$store.subscribe(mutation => {
      if (mutation.type === "user/SET_TEXTS") {
        this.texts = mutation.payload.nav;
      }
    });
  },
  mounted() {
    if (window.outerWidth < 640) {
      this.open = false;
    }
    window.addEventListener("resize", this.menuResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.menuResize);
  }
};
</script>
