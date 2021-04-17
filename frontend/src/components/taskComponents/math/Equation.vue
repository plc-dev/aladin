<template>
  <div class="equation">
    <Term :terms="leftTerm" />
    <div class="operator">{{ comparisonOperator }}</div>
    <Term :terms="rightTerm" />
  </div>
</template>

<script lang="ts">
import Term from "@/components/taskComponents/math/Term.vue";

export default {
  name: "Equation",
  components: {
    Term,
  },
  setup() {
    const comparisonOperator = "=";

    const leftTerm = [
      {
        type: "radical",
        slots: [
          { name: "index", terms: [{ type: "scalar", value: 3 }] },
          { name: "radicand", terms: [{ type: "scalar", value: 20 }] },
        ],
      },
    ];

    const rightTerm = [
      {
        type: "fraction",
        slots: [
          {
            name: "numerator",
            terms: [
              {
                type: "BaseOperation",
                options: { operation: "+" },
                slots: [
                  {
                    name: "firstOperand",
                    terms: [
                      {
                        type: "fraction",
                        slots: [
                          { name: "numerator", terms: [{ type: "scalar", value: 12 }] },
                          {
                            name: "denominator",
                            terms: [
                              {
                                type: "power",
                                slots: [
                                  { name: "base", terms: [{ type: "scalar", value: 350 }] },
                                  {
                                    name: "exponent",
                                    terms: [
                                      {
                                        type: "power",
                                        slots: [
                                          { name: "base", terms: [{ type: "scalar", value: 350 }] },
                                          { name: "exponent", terms: [{ type: "scalar", value: 2 }] },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: "secondOperand",
                    terms: [
                      {
                        type: "fraction",
                        slots: [
                          { name: "numerator", terms: [{ type: "scalar", value: 12 }] },
                          {
                            name: "denominator",
                            terms: [
                              {
                                type: "power",
                                slots: [
                                  { name: "base", terms: [{ type: "scalar", value: 350 }] },
                                  {
                                    name: "exponent",
                                    terms: [
                                      {
                                        type: "fraction",
                                        slots: [
                                          { name: "numerator", terms: [{ type: "scalar", value: 500 }] },
                                          { name: "denominator", terms: [{ type: "scalar", value: 500 }] },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "denominator",
            terms: [
              {
                type: "fraction",
                slots: [
                  { name: "numerator", terms: [{ type: "scalar", value: 1 }] },
                  {
                    name: "denominator",
                    terms: [
                      {
                        type: "power",
                        slots: [
                          { name: "base", terms: [{ type: "scalar", value: 350 }] },
                          { name: "exponent", terms: [{ type: "scalar", value: 2 }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const formula = {
      leftTerm,
      comparisonOperator,
      rightTerm,
    };

    return { leftTerm, rightTerm, comparisonOperator };
  },
};
</script>

<style scoped>
.equation {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.equation > * {
  margin: 0 10px;
}

.operator {
  font-size: 20px;
  width: 20px;
}
</style>
