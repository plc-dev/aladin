const mathlex = window.MathLex;

// const syntaxTree = mathlex.parse("z = sum(v_i/w_i^p,i)/sum(1/w_i^p ,i)");

// Interfaces
type AbstractSyntaxTree = [string, AbstractSyntaxTree, AbstractSyntaxTree];
interface IParsedTree {
  [key: string]: IParsedTree | any;
}
interface IVariableTable {
  [variable: string]: Array<number> | number;
}
interface IExpressionHandler {
  [key: string]: Function;
}

const formulaGenerator = (formula: string, variableTable: IVariableTable, texFormula: string = "") => {
  const abstractSyntaxTree = mathlex.parse(formula);
  const tex = mathlex.parse(texFormula);
  const latex = mathlex.render(tex, "latex");
  const sage = mathlex.render(abstractSyntaxTree, "sage");
  const ast = ASTParser(abstractSyntaxTree, variableTable);
  const aladin = replaceVariables(ast, variableTable);

  return { latex, sage, abstractSyntaxTree, aladin };
};

const replaceVariables = (subtree: IParsedTree, variableTable: IVariableTable, index: number = null) => {
  const keys = Object.keys(subtree);
  if (keys.includes("type") && subtree.type === "variable") {
    const value = subtree.index ? variableTable[subtree.name][index] : variableTable[subtree.name];
    subtree = [{ type: "scalar", value }];
  }
  const extractNested = (keys: Array<string>): IParsedTree | null => {
    const nestedKeys = ["slots", "terms", "rightTerm", "leftTerm"];
    for (let key of keys) {
      if (nestedKeys.includes(key)) return subtree[key];
    }
    return null;
  };

  // const nested = keys.includes("slots") ? subtree["slots"] : subtree["terms"];
  const nested = extractNested(keys);
  if (nested) {
    for (let i = 0; i < nested.length; i++) {
      const nestedTree = nested[i];
      let replacedTree = replaceVariables(nestedTree, variableTable, index);
      if (Array.isArray(replacedTree)) replacedTree = replacedTree[0];
      nested[i] = replacedTree;
    }
  }
  return subtree;
};

// ExpressionHandlers
const negativeHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  // TODO: handle case when Negative wraps non-scalar
  return [{ type: "scalar", value: `(- ${leftSubtree})`, datatype: rightSubtree }];
};
const exponentHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  return [
    {
      type: "power",
      slots: [
        { name: "base", terms: leftSubtree },
        { name: "exponent", terms: rightSubtree },
      ],
    },
  ];
};
const equationHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  return {
    leftTerm: leftSubtree,
    comparisonOperator: operator,
    rightTerm: rightSubtree,
  };
};
const fractionHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  return [
    {
      type: "fraction",
      slots: [
        { name: "numerator", terms: leftSubtree },
        { name: "denominator", terms: rightSubtree },
      ],
    },
  ];
};
const baseOperationHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  const operatorMap: { [key: string]: string } = {
    Plus: "+",
    Minus: "-",
    Times: "*",
  };
  return [
    {
      type: "BaseOperation",
      options: { operation: operatorMap[operator] },
      slots: [
        { name: "firstOperand", terms: leftSubtree },
        { name: "secondOperand", terms: rightSubtree },
      ],
    },
  ];
};
const subscriptHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  return [{ ...leftSubtree[0], index: rightSubtree[0].name }];
};
const inclusionHandler = (operator: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
  // returns just the Set variable
  return rightSubtree;
};
const functionHandler = (functionType: string, subtrees: Array<IParsedTree>, variableTable: { [key: string]: any }) => {
  const rangeHandler = () => {
    const [operand, indexVariable, startVariable, endVariable] = subtrees;
    const startIndex = startVariable[0].value;
    const endIndex = variableTable[endVariable[0].name];

    const operationTable: { [key: string]: string } = {
      sum: "+",
      prod: "*",
    };
    const operation = operationTable[functionType];

    const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

    let replacedTerm;
    let previousOperand;
    for (let i = startIndex; i < endIndex; i++) {
      const replacedOperand = replaceVariables(deepCopy(operand[0]), variableTable, i);
      if (i === startIndex) {
        previousOperand = replacedOperand;
        continue;
      }
      const parsedTerm: {} = {
        type: "BaseOperation",
        options: { operation },
        slots: [
          { name: "firstOperand", terms: [previousOperand] },
          { name: "secondOperand", terms: [replacedOperand] },
        ],
      };
      previousOperand = parsedTerm;

      if (i === endIndex - 1) {
        replacedTerm = parsedTerm;
      }
    }
    return [replacedTerm];
  };

  const rootHandler = () => {
    const [radicand, exponent] = subtrees;
    const parsedRadicand = { name: "radicand", terms: radicand };
    if (exponent && exponent[0] && [0, 1, 2].includes(exponent[0].value)) {
      return [{ type: "radical", slots: [parsedRadicand] }];
    }
    return [
      {
        type: "radical",
        slots: [{ name: "index", terms: exponent }, parsedRadicand],
      },
    ];
  };

  const functionMap: { [key: string]: Function } = {
    sum: rangeHandler,
    prod: rangeHandler,
    root: rootHandler,
    sqrt: rootHandler,
  };

  return functionMap[functionType]();
};
const expressionHandler: IExpressionHandler = {
  Equal: (operation: string, leftSubtree: IParsedTree, rightSubtree: IParsedTree) => {
    const operationTable: { [key: string]: string } = {
      Equal: "=",
      Less: "<",
      Greater: ">",
      LessEqual: "<=",
      GreaterEqual: ">=",
      Unequal: "!=",
    };
    return equationHandler(operationTable[operation], leftSubtree, rightSubtree);
  },
  Plus: baseOperationHandler,
  Minus: baseOperationHandler,
  Times: baseOperationHandler,
  Divide: fractionHandler,
  Exponent: exponentHandler,
  Negative: negativeHandler,
  Subscript: subscriptHandler,
  Inclusion: inclusionHandler,
};

const ASTParser = (abstractSyntaxTree: AbstractSyntaxTree, variableTable: IVariableTable): IParsedTree => {
  let [operation, operand1, operand2] = abstractSyntaxTree;

  if (typeof operand1 === "string") {
    if (operation === "Literal") return [{ type: "scalar", value: operand2, datatype: operand1 }];
    if (operation === "Variable") return [{ type: "variable", name: operand1 }];
  }
  if (operation === "Function") {
    // force type conversions in case of Function, see example ->
    //  [
    //     'Function',
    //     [ 'Variable', 'root' ],
    //     [ [ 'Literal', 'Int', 2 ], [ 'Literal', 'Int', 5 ] ]
    //   ]
    const functionType: string = (operand1[1] as unknown) as string;
    const operands = operand2.map((term) => ASTParser((term as unknown) as AbstractSyntaxTree, variableTable));

    return functionHandler(functionType, operands, variableTable);
  }
  const leftSubtree = ASTParser(operand1, variableTable);
  const rightSubtree = ASTParser(operand2, variableTable);
  return expressionHandler[operation](operation, leftSubtree, rightSubtree);
};

export { formulaGenerator as formulaGenerator, mathlex };
