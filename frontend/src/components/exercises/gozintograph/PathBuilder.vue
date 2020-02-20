<template>
  <div class="pathbuilder">
    <ul class="pathbuilder__paths">
      <li
        :class="`pathbuilder__path--${pIndex}`"
        v-for="(path, pIndex) in userPaths"
        :key="pIndex"
      >
        <div class="pathbuilder__path--state"></div>
        <div
          :class="pIndex ? 'pathbuilder__remove--path' : 'placeholder'"
          :pathIndex="pIndex"
          @click="removePath(pIndex)"
        >
          &minus;
        </div>
        <div
          class="pathbuilder__path__connection"
          v-for="(connection, cIndex) in path"
          :pathIndex="pIndex"
          :key="cIndex"
        >
          <input
            class="connection__node"
            v-if="!cIndex"
            v-model="connection.child"
            type="text"
            maxlength="2"
          />
          <div class="connection__edge">
            <input
              class="connection__edge--value"
              v-model="connection.value"
              type="number"
            />
            <span class="connection__edge--arrow">&zigrarr;</span>
          </div>
          <input
            class="connection__node"
            :value="connection.parent"
            @keyup="updateValues($event.target.value, pIndex, cIndex)"
            type="text"
            maxlength="2"
          />
          <div
            class="pathbuilder__add--connection"
            v-if="
              cIndex === path.length - 1 &&
                lengthAllowed[userPaths[pIndex].length + 1] &&
                lengthAllowed[userPaths[pIndex].length + 1].length
            "
            @click="addConnection(pIndex)"
            v-tooltip.top="{
              delay: {
                show: 500,
                hide: 100
              },
              content: 'Pfad erweitern'
            }"
          >
            &plus;
          </div>
          <div
            class="pathbuilder__remove--connection"
            v-if="cIndex === path.length - 1 && cIndex"
            @click="removeConnection(pIndex)"
          >
            &minus;
          </div>
          <div
            class="pathbuilder__validate--path"
            v-if="cIndex === path.length - 1"
            @click="validatePath(pIndex)"
            v-tooltip.right="{
              delay: {
                show: 500,
                hide: 100
              },
              content: 'Pfad validieren'
            }"
          >
            &quest;
          </div>
        </div>
      </li>
      <div class="pathbuilder__bottom--controls">
        <div
          class="pathbuilder__add--path"
          v-if="userPaths.length < paths.length"
          @click="addPath()"
          v-tooltip.bottom="{
            delay: {
              show: 500,
              hide: 100
            },
            content: 'Pfad hinzufügen'
          }"
        >
          &plus;
        </div>
        <div
          class="pathbuilder__validate--paths"
          @click="validatePaths"
          v-tooltip.bottom="{
            delay: {
              show: 500,
              hide: 100
            },
            content: 'Pfade validieren'
          }"
        >
          &quest;
        </div>
        <div
          class="pathbuilder__show--paths"
          @click="showPaths"
          v-tooltip.bottom="{
            delay: {
              show: 500,
              hide: 100
            },
            content: 'Lösung anzeigen'
          }"
        >
          &equals;
        </div>
      </div>
    </ul>
  </div>
</template>

<style lang="postcss">
.pathbuilder {
  @apply mt-5;
}

.pathbuilder__paths {
  @apply flex flex-col h-full;
}

.pathbuilder__validate--path,
.pathbuilder__validate--paths,
.pathbuilder__show--paths {
  @apply mt-3 ml-2 text-white_chocolate text-center bg-alabama_crimson rounded cursor-pointer;
  width: 28px;
}

.pathbuilder__show--paths {
  @apply bg-green;
}

.pathbuilder__path--state {
  @apply mt-3 ml-2 text-white_chocolate text-center rounded;
  width: 28px;
}

.pathbuilder__path--state.correct {
  @apply flex items-center justify-center bg-green;
}

.pathbuilder__path--state.false {
  @apply flex items-center justify-center bg-alabama_crimson;
}

.pathbuilder__bottom--controls {
  @apply flex justify-center mb-4;
}

[class*="pathbuilder__path--"] {
  @apply flex flex-wrap items-center;
}

[class*="pathbuilder__path--"]:last-child {
  @apply mb-4;
}

.pathbuilder__path__connection {
  @apply flex items-center;
}

.connection__node {
  @apply w-8 border border-russet text-center self-auto mt-3 ml-2;
}

.connection__edge {
  @apply flex flex-col relative w-10 ml-2;
}

.connection__edge--value {
  @apply flex w-8 border border-russet text-center rounded-full outline-none absolute self-center;
}

.connection__edge--arrow {
  @apply text-highlight;
  font-size: 50px;
}

.pathbuilder [class*="remove"],
.placeholder {
  @apply mt-3 ml-2 text-highlight text-center bg-contrast rounded cursor-pointer;
  width: 28px;
}

.placeholder {
  font-size: 0;
  pointer-events: none;
}

.pathbuilder [class*="add"] {
  @apply mt-3 ml-2 text-highlight text-center bg-contrast rounded cursor-pointer;
  width: 28px;
}

.pathbuilder__add--connection {
  @apply mt-3 ml-6;
}

.hidden {
  visibility: hidden;
}

.connection__node .error,
.connection__edge .error {
  @apply text-white_chocolate border-alabama_crimson bg-alabama_crimson;
}

.connection__node .success,
.connection__edge .success {
  @apply text-russet border-russet bg-success;
}
</style>

<script>
//@group [Gozintograph]
import { deepCopy } from "@/lib/helper";
export default {
  data() {
    return { markedPaths: [] };
  },
  computed: {
    paths: function() {
      return this.$store.state.gozintograph.graph.paths;
    },
    lengthAllowed: function() {
      const userPathLengths = this.userPaths.map(path => path.length);
      const pathLengths = this.paths.map(path => path.length);
      const maxLength = pathLengths.reduce((max, length) => {
        if (length > max) return length;
        return max;
      }, 0);
      let lengthAmount = {};
      // filter amount of paths per path-length
      for (let i = 1; i <= maxLength; i++) {
        lengthAmount[i] = pathLengths.filter(length => length === i);
      }
      // add amount of greater length to lower lengths
      Object.keys(lengthAmount).forEach(
        length =>
          (lengthAmount[length] = [
            ...lengthAmount[length],
            ...Object.keys(lengthAmount).flatMap(nestedLength => {
              if (nestedLength > length) return lengthAmount[nestedLength];
              return [];
            })
          ])
      );
      // subtract userPathLengths of smaller/equal lengths
      userPathLengths.forEach(userLength => {
        for (let i = userLength; i > 0; i--) {
          if (lengthAmount[i] && lengthAmount[i].length)
            lengthAmount[i].shift();
        }
      });

      return lengthAmount;
    },
    userPaths() {
      return this.$store.state.gozintograph.userPaths;
    }
  },
  methods: {
    addConnection(pathIndex) {
      const path = this.userPaths[pathIndex];
      const child = path[path.length - 1].parent;
      path.push({ child, parent: "", value: "" });
    },
    removeConnection(pathIndex) {
      const path = this.userPaths[pathIndex];
      path.pop();
    },
    addPath() {
      this.userPaths.push([{ child: "", parent: "", value: "" }]);
      // add scrolling to parent container
      window.scrollTo({ bottom: 0, behavior: "smooth" });
    },
    // removes path from userPaths and reevaluates checked paths
    removePath(pathIndex) {
      this.userPaths.splice(pathIndex, 1);
      this.markedPaths = [];
      this.userPaths.forEach((path, index) => this.validatePath(index));
    },
    updateValues(value, pathIndex, connectionIndex) {
      const path = this.userPaths[pathIndex];
      path[connectionIndex].parent = value;
      if (path.length - 1 > pathIndex) path[connectionIndex + 1].child = value;
    },
    showPaths() {
      this.$store.commit("gozintograph/SET_USER_PATHS", deepCopy(this.paths));
      this.validatePaths();
    },
    validatePath(index) {
      const userPath = this.userPaths[index];
      const length = userPath.length - 1;
      let trueConnections = 0;
      let truePath = false;
      this.paths.forEach((path, pIndex) => {
        userPath.forEach((connection, cIndex) => {
          if (userPath.length === path.length) {
            if (
              (path[cIndex].value == connection.value &&
                path[cIndex].child.toLowerCase() ==
                  connection.child.toLowerCase() &&
                path[cIndex].parent.toLowerCase() ==
                  connection.parent.toLowerCase()) ||
              (path[length - cIndex].value == connection.value &&
                path[length - cIndex].parent.toLowerCase() ==
                  connection.child.toLowerCase() &&
                path[length - cIndex].child.toLowerCase() ==
                  connection.parent.toLowerCase())
            ) {
              trueConnections = trueConnections + 1;
            }
          }
        });
        const alreadyUsed = this.markedPaths.filter(
          indices => indices.path === pIndex && indices.userPath !== index
        );
        if (
          trueConnections === this.paths[pIndex].length &&
          !alreadyUsed.length
        ) {
          this.markedPaths.push({ path: pIndex, userPath: index });
          truePath = true;
        }
        trueConnections = 0;
      });
      const path = document.querySelector(
        `.pathbuilder__path--${index} .pathbuilder__path--state`
      );
      const sign = truePath ? "&check;" : "&times;";
      path.innerHTML = sign;
      if (truePath) {
        path.classList.add("correct");
        path.classList.remove("false");
      } else {
        path.classList.add("false");
        path.classList.remove("correct");
      }
    },
    validatePaths() {
      this.markedPaths = [];
      this.userPaths.forEach((path, index) => this.validatePath(index));
    }
  }
};
</script>
