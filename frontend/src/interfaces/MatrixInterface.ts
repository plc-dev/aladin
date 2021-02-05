import { IComponent } from "@/interfaces/TaskGraphInterface";
import { Matrix } from "@/helpers/LinearAlgebra";

interface IMatrixInstruction {
  operations: Array<string>;
  matrix1Path: string;
  matrix2Path?: string | null;
}

interface IMatrixComponent extends IComponent {
  component: {
    initialize: IMatrixInstruction;
    validationData: null | Matrix;
    userData: null | Matrix;
    readOnly: boolean;
    rowLabel: string;
    columnLabel: string;
  };
}

export { IMatrixComponent, IMatrixInstruction };
