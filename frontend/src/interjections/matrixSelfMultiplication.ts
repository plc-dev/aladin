import { IStore } from "@/helpers/TaskGraphUtility";
import { ILayouts } from "@/interfaces/TaskGraphInterface";
import { IMatrixSelfMultiplication } from "@/interfaces/interjectionInterfaces/matrixSelfMultiplicationInterface";

export const matrixSelfMultiplication = (storeObject: IStore, dependencies: IMatrixSelfMultiplication["dependencies"]) => {
  const { getProperty, setProperty } = storeObject;

  const currentNode = getProperty(`currentNode`);
  const nodePath = `nodes__${currentNode}`;

  const layoutsPath = `${nodePath}__layouts`;
  let layouts: ILayouts = getProperty(layoutsPath);
  let idCounter =
    layouts["lg"].reduce((startId, layout) => {
      if (layout.i > startId) startId = layout.i;
      return startId;
    }, 0) + 1;

  const nodeComponents = getProperty(`${nodePath}__components`);

  const baseMatrix = getProperty(dependencies.baseMatrix);
  const baseMatrixId = parseInt(dependencies.baseMatrix[dependencies.baseMatrix.length - 1]);

  const n = getProperty(dependencies.n);
  let factor = 1;
  for (let i = 0; i < n - 1; i++) {
    nodeComponents[idCounter] = baseMatrix;

    layouts = Object.entries(layouts).reduce((newLayouts, [layoutSize, layout]) => {
      const baseMatrixCoordinates = layout.filter((component) => component.i === baseMatrixId);
      const newLayout = [
        ...layout,
        {
          ...baseMatrixCoordinates,
          i: idCounter,
          y: baseMatrixCoordinates.y + baseMatrixCoordinates.h,
          x: baseMatrixCoordinates.x + baseMatrixCoordinates.w * factor,
        },
      ];
      newLayouts[layoutSize] = newLayout;
      return newLayouts;
    }, {} as ILayouts);
    factor++;
    idCounter++;
  }
};
