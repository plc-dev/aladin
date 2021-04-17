import { matrixSelfMultiplication } from "@/interjections/matrixSelfMultiplication";
import { IStore } from "@/helpers/TaskGraphUtility";
import { IInterjection } from "@/interfaces/TaskGraphInterface";

const interjectionMap = {
  matrixSelfMultiplication,
};

export const interjectionHandler = async (storeObject: IStore, interjections: Array<IInterjection>) => {
  for (let interjection of interjections) {
    const { method, dependencies } = interjection;
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
