interface IPathDescription {
  image: string;
  description: string;
}

interface IDecisionNode {
  pathDescriptions: {
    [key: number]: IPathDescription;
  };
}

export { IDecisionNode };
