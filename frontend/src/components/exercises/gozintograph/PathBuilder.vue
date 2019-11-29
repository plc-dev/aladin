<template>
  <div class="pathbuilder">
    <ul class="pathbuilder__paths">
      <li class="pathbuilder__path">
        <div class="pathbuilder__remove--path" style="visibility: hidden">
          -
        </div>
        <input class="pathbuilder__path--node" type="number" />
        <div class="pathbuilder__path--edge">
          <input class="path__edge--value" type="number" />
          <span class="path__edge--arrow">&zigrarr;</span>
        </div>
        <input class="pathbuilder__path--node" type="number" />
        <div
          class="pathbuilder__add--node"
          @click="addNode($event.target.parentNode)"
        >
          +
        </div>
        <div
          class="pathbuilder__remove--node hidden"
          @click="removeNode($event.target.parentNode)"
        >
          -
        </div>
      </li>
      <div
        v-if="!hasMaxDepth"
        class="pathbuilder__add--path"
        @click="addPath($event.target.parentNode)"
      >
        +
      </div>
    </ul>
  </div>
</template>

<style lang="postcss">
.pathbuilder__paths {
  @apply flex flex-col h-full justify-between items-stretch;
}

.pathbuilder__path {
  @apply flex flex-wrap items-center;
}

.pathbuilder__path--node {
  @apply w-8 border border-russet self-auto mt-3 ml-2;
}

.pathbuilder__path--edge {
  @apply flex flex-col relative w-10 ml-2;
}

.path__edge--value {
  @apply flex w-8 border border-russet text-center rounded-full outline-none absolute self-center;
}

.path__edge--arrow {
  @apply text-brown_sugar;
  font-size: 50px;
}

[class*="remove"] {
  @apply mt-3 ml-2 text-white_chocolate text-center bg-alabama_crimson rounded cursor-pointer;
  width: 28px;
}

[class*="add"] {
  @apply mt-3 ml-2 text-white_chocolate text-center bg-alabama_crimson rounded cursor-pointer;
  width: 28px;
}

.pathbuilder__path--add {
  @apply mt-3 ml-6;
}

.pathbuilder__add--path {
  @apply mt-3;
  margin-left: 5.55em;
}

.hidden {
  visibility: hidden;
}
</style>

<script>
export default {
  data() {
    return {
      hasPathAmount: false,
      hasMaxDepth: false
    };
  },
  methods: {
    createNode() {
      const node = document.createElement("input");
      node.inputMode = "number";
      node.classList.add("pathbuilder__path--node");
      return node;
    },
    createEdge() {
      const edge = document.createElement("div");
      edge.classList.add("pathbuilder__path--edge");

      const value = document.createElement("input");
      value.inputMode = "number";
      value.classList.add("path__edge--value");

      const arrow = document.createElement("span");
      arrow.classList.add("path__edge--arrow");
      arrow.innerHTML = "&zigrarr;";

      edge.appendChild(value);
      edge.appendChild(arrow);
      return edge;
    },
    createControl(type, scope, hidden) {
      const button = document.createElement("div");
      button.classList += `pathbuilder__${type}--${scope} ${hidden}`;
      button.textContent = type === "add" ? "+" : "-";
      const eventlistener =
        scope === "node"
          ? type === "add"
            ? this.addNode
            : this.removeNode
          : this.removePath;
      button.addEventListener("click", eventlistener);
      return button;
    },
    addPath(paths) {
      const path = document.createElement("li");
      path.classList.add("pathbuilder__path");

      path.appendChild(this.createControl("remove", "path", ""));
      path.appendChild(this.createNode());
      path.appendChild(this.createEdge());
      path.appendChild(this.createNode());
      path.appendChild(this.createControl("add", "node", ""));
      path.appendChild(this.createControl("remove", "node", "hidden"));
      paths
        .querySelector(".pathbuilder__path:last-of-type")
        .insertAdjacentElement("afterend", path);
    },
    addNode() {}
  }
};
</script>
