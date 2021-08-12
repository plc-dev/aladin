import { matrixSelfMultiplication } from "@/interjections/matrixSelfMultiplication";
import { IStore } from "@/helpers/TaskGraphUtility";
import { IInterjection } from "@/interfaces/TaskGraphInterface";

const interjectionMap = {
  matrixSelfMultiplication,
};

export const interjectionHandler = async (storeObject: IStore, interjections: Array<IInterjection>) => {
  for (let interjection of interjections) {
    const { method, dependencies, applied } = interjection;
    if (applied) continue;
    if (Reflect.has(interjectionMap, method)) {
      await interjectionMap[method](storeObject, dependencies);
    } else {
      try {
        const interjectionFunction = new Function(method);
        await interjectionFunction(storeObject, dependencies);
      } catch (error) {
        throw new Error(`Unknown interjection method.\n${error}`);
      }
    }
  }
};

export const getCurrentTaskNode = (storeObject: IStore) => {
  const { getProperty } = storeObject;

  const currentNode = getProperty(`currentNode`);
  const nodePath = `nodes__${currentNode}`;

  return getProperty(nodePath);
};

export const cloneComponent = (storeObject: IStore, dependency: string) => {
  const { getProperty } = storeObject;

  JSON.parse(JSON.stringify(getProperty(dependency)));
};
