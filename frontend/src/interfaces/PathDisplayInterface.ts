import { IComponent } from "@/interfaces/TaskGraphInterface";

interface IPathDisplayComponent extends IComponent {
  component: {};
  dependencies: {
    PathDisplay: {
      userPaths: [];
      allPaths: [];
      nodes: {};
    };
  };
}

export { IPathDisplayComponent };
