import { IComponent } from "@/interfaces/TaskGraphInterface";
import { Matrix } from "@/helpers/LinearAlgebra";

interface IMatrixInstruction {
  operation: string;
  matrix1Path: string;
  matrix2Path?: string;
}

interface IMatrixComponent extends IComponent {
  component: {
    initialize: IMatrixInstruction;
    validationData: null | Matrix;
    initialData: null | Matrix;
  };
}

export { IMatrixComponent, IMatrixInstruction };
