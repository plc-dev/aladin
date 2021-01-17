import { IComponent } from "@/interfaces/TaskGraphInterface";

interface IComponentState {
  dotDescription: string;
}

interface IDOTGraphComponent extends IComponent {
  component: IComponentState;
}

export { IDOTGraphComponent };
