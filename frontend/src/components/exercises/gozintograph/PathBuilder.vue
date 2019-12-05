<template>
  <div class="pathbuilder">
    <ul class="pathbuilder__paths">
      <li
        :class="`pathbuilder__path--${pIndex}`"
        v-for="(path, pIndex) in userPaths"
        :key="pIndex"
      >
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
        </div>
      </li>
      <div
        class="pathbuilder__add--path"
        v-if="userPaths.length < paths.length"
        @click="addPath()"
      >
        &plus;
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

[class*="remove"],
.placeholder {
  @apply mt-3 ml-2 text-white_chocolate text-center bg-alabama_crimson rounded cursor-pointer;
  width: 28px;
}

.placeholder {
  font-size: 0;
  pointer-events: none;
}

[class*="add"] {
  @apply mt-3 ml-2 text-white_chocolate text-center bg-alabama_crimson rounded cursor-pointer;
  width: 28px;
}

.pathbuilder__add--connection {
  @apply mt-3 ml-6;
}

.pathbuilder__add--path {
  @apply mt-3 mb-4;
  margin-left: 5.55em;
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
export default {
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
    removePath(pathIndex) {
      this.userPaths.splice(pathIndex, 1);
    },
    updateValues(value, pathIndex, connectionIndex) {
      const path = this.userPaths[pathIndex];
      path[connectionIndex].parent = value;
      if (path.length - 1 > pathIndex) path[connectionIndex + 1].child = value;
    }
  }
};
</script>
