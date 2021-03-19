import { Matrix } from "@/helpers/LinearAlgebra";
import { IMatrixComponent } from "@/interfaces/MatrixInterface";
import { IDOTGraphComponent } from "@/interfaces/DOTGraphInterface";
import { ITaskConfigurationComponent } from "@/interfaces/TaskConfigurationInterface";
import { IDecisionNode } from "@/interfaces/DecisionNodeInterface";

// defaults to string as typescript not yet allows for true regex based string checks
// must have shape "i__am__a__path"
type taskGraphPath = string;

interface IEdges {
  [key: number]: Array<number>;
}

interface ILayout {
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  static: boolean;
}

interface ILayouts {
  sm: ILayout[];
  md: ILayout[];
  lg: ILayout[];
}

interface IDependencies {
  [componentName: string]: {
    [dependencyName: string]: taskGraphPath;
  };
}

type keyboardEventProperties = "ctrlKey" | "altKey" | "key" | "keyCode";
interface IKeyboardShortCut {
  property: keyboardEventProperties;
  value: boolean | number | string;
}

interface IAction {
  instruction: string;
  label: string;
  type: string;
  keyboardShortcut?: Array<IKeyboardShortCut>;
  parameters?: { [parameter: string]: taskGraphPath };
}

interface IComponent {
  type: string;
  name: string;
  component: object;
  isValid: boolean;
  dependencies?: IDependencies;
  methods?: { [key: string]: string };
  actions?: [IAction];
}

interface IComponents {
  [key: number]: IMatrixComponent | IDOTGraphComponent | ITaskConfigurationComponent | IComponent | object;
}

interface IState {
  previousNode: number;
  rootNode: number;
  currentTask: string;
  layoutSize: string;
  taskData: { [key: string]: any };
  topology: Matrix;
  edges: IEdges;
  currentNode: number;
  nodes: {
    [key: number]:
      | IDecisionNode
      | {
          layouts: ILayouts;
          components: IComponents;
          zoomScale: number;
        };
  };
}

export { IState, IComponent };
