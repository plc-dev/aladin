import { Ref } from "vue";
import { Matrix } from "@/helpers/LinearAlgebra";
import { IMatrixComponent } from "@/interfaces/MatrixInterface";
import { IDOTGraphComponent } from "@/interfaces/DOTGraphInterface";
import { ITaskConfigurationComponent } from "@/interfaces/TaskConfigurationInterface";
import { IDecisionNode } from "@/interfaces/DecisionNodeInterface";

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

interface IDimensions {
  width: number;
  height: number;
}

interface IComponent {
  type: string;
  name: string;
  dimensions: IDimensions;
  component: object;
  isValid: boolean;
  dependencies?: object;
}

interface IComponents {
  [key: number]: IMatrixComponent | IDOTGraphComponent | ITaskConfigurationComponent | IComponent | object;
}

interface IStateChange {
  timestamp: number;
  path: string;
  value: any;
}

interface ITaskReplay {
  stateChange: Array<IStateChange>;
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
