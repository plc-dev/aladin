import { IComponent } from "@/interfaces/TaskGraphInterface";

interface IAction {
  type: string;
  label: string;
  instruction: string;
}

interface INumericParameter {
  type: string;
  initial: { lowerValue: number; upperValue: number };
  boundaries: { min: number; max: number };
  presets: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface IStringParameter {}

interface IParameters {
  [key: string]: INumericParameter | IStringParameter;
}

interface IParameterSelection extends IComponent {
  dependencies: {
    DOTGraph: { dotDescription: string };
  };
  component: {
    title: string;
    actions: Array<IAction>;
    state: IParameters;
  };
}

export { IParameterSelection };
