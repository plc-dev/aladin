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
}

interface IComponents {
  [key: number]: IMatrixComponent | IDOTGraphComponent | ITaskConfigurationComponent | IComponent;
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
  previousNode: Ref<number>;
  rootNode: number;
  zoomScale: Ref<number>;
  currentTask: string;
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
        };
  };
  taskReplay: ITaskReplay;
}

export { IState, IComponent };
