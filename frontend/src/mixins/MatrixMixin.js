import { camelCase } from "@/lib/helper";

export default {
  methods: {
    showSolution() {
      const userSecondary = Array.from(
        document.querySelectorAll(".matrix__secondary input")
      );
      const secondary = this.secondary[0]["S"].reduce(
        (values, node) => [...values, node.amount],
        []
      );
      if (this.$store.state.gozintograph.matrixPathStep === "MatrixPathStep5") {
        Array.from(
          document.querySelectorAll(".matrices__fill--complete")
        ).forEach(node => node.click());
      }
      userSecondary.forEach((node, index) => {
        node.value = secondary[index];
        this.validateSecondary({ id: node.id, value: node.value });
      });
    },
    fillMatrix(target, array) {
      const onlyZero = /zero/.test(target.classList);
      let filledMatrix, userMatrix;
      let matrixType = target.parentNode.previousSibling.classList[0].substring(
        8
      );
      if (array) {
        let index;
        [, matrixType, index] = matrixType.match(/(\w*)__(\d*)/);
        filledMatrix = this[matrixType][index];
        userMatrix = this[camelCase(`user ${matrixType}`)][index];
      } else {
        filledMatrix = this[matrixType];
        userMatrix = this[camelCase(`user ${matrixType}`)];
      }
      for (let i = 0; i < filledMatrix.length; i++) {
        const filledVector = filledMatrix[i];
        const userVector = userMatrix[i];
        const vectorKey = Object.keys(filledVector)[0];
        for (let j = 0; j < filledMatrix.length; j++) {
          if (
            !onlyZero ||
            (onlyZero && filledVector[vectorKey][j].amount === 0)
          ) {
            userVector[vectorKey][j].amount = filledVector[vectorKey][j].amount;
          }
        }
      }
      const self = this;
      setTimeout(() => {
        Array.from(
          target.parentNode.previousElementSibling.querySelectorAll("input")
        ).forEach(field =>
          self.validateField({ value: field.value, id: field.id })
        );
      }, 5);
    },
    /**
     * Validates matrix field on the focusout-Event.
     * Returns if element-id does not match expected pattern.
     */
    validateField({ value, id }) {
      if (!/(.*)__(\d*)_(\d*)/.test(id)) return;
      let [, matrix, row, column] = id.match(/(.*)__(\d*)_(\d*)/);
      let correctValue, rowObject, key;

      if (/(\w*)__(\d*)/.test(matrix)) {
        let index;
        [, matrix, index] = matrix.match(/(\w*)__(\d*)/);
        rowObject = this[matrix][index][row];
        key = Object.keys(rowObject);
        correctValue = this[matrix][index][row][key][column]["amount"];
      } else {
        rowObject = this[matrix][row];
        key = Object.keys(rowObject);
        correctValue = this[matrix][row][key][column]["amount"];
      }
      const inputField = document.querySelector(`#${id}`);
      if (value === "") {
        inputField.classList.remove("error");
        inputField.classList.remove("success");
      } else if (correctValue == value) {
        inputField.classList.remove("error");
        inputField.classList.add("success");
        return true;
      } else {
        inputField.classList.remove("success");
        inputField.classList.add("error");
      }
      this.noError = false;
      return false;
    },
    validateAll() {
      const matrices = document.querySelectorAll('[class*="matrix__"]');
      let noError = true;
      matrices.forEach(matrix =>
        Array.from(matrix.querySelectorAll("input")).forEach(field => {
          const fieldCorrect = this.validateField({
            value: field.value,
            id: field.id
          });
          if (!fieldCorrect) {
            noError = false;
          }
        })
      );
      if (noError) {
        this.noError = true;
        this.$emit("step-direction", "forward");
      } else {
        this.$alertify
          .alert("Es sind noch nicht alle Felder korrekt ausgefüllt!", () => {
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          })
          .set({ title: "Fehler!" });
      }
    },
    validateSecondary({ value, id }) {
      let [, index] = id.match(/.*__\d*_(\d*)/);
      if (this.secondary[0]["S"][index]["amount"] == value) {
        document.querySelector(`#${id}`).classList.remove("error");
        document.querySelector(`#${id}`).classList.add("success");
      } else if (value === "") {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.remove("error");
      } else {
        document.querySelector(`#${id}`).classList.remove("success");
        document.querySelector(`#${id}`).classList.add("error");
      }
      const correctAmount = document.querySelectorAll(
        ".matrix__secondary .success"
      ).length;
      if (this.secondary[0]["S"].length === correctAmount) {
        this.onSuccess();
      }
    },
    onSuccess() {
      this.$alertify
        .confirm(
          this.success.body,
          () => {
            this.$store.commit("gozintograph/CLEAR_STATE");
            this.$destroy();
            location.reload();
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          },
          () => {
            const layer = document.querySelector(".alertify");
            layer.parentNode.removeChild(layer);
          }
        )
        .set({ title: this.success.title })
        .set({
          labels: {
            ok: this.success.labels.ok,
            cancel: this.success.labels.cancel
          }
        });
    }
  },
  computed: {
    success: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.success;
    },
    buttons: function() {
      const texts = this.$store.state.user.texts;
      return texts.exercises.gozintograph.tabs.GozintographMatrixPath
        .matrixButtons;
    }
  }
};
