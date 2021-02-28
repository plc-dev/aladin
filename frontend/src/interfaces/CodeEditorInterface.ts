import { IComponent } from "@/interfaces/TaskGraphInterface";

interface ICodeEditor extends IComponent {
  component: {
    code: string;
  };
}

export { ICodeEditor };
