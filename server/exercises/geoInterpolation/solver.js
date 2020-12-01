const { generateTree } = require("./geoInterpolation");

const IDWSolver = graph => {
  const nodes = graph["nodes"];
  const edges = graph["edges"];
  const denominator = [];
  const numerator = [];

  const knownNodes = nodes.filter(node => node.is_known);

  edges.forEach(edge => {

    const relevantNodeID = edge.to;

    const findrelevantNode = node => {
      return relevantNodeID == node.id;
    }

    const weight = edge.weight;

    const relevantNode = knownNodes.filter(findrelevantNode)[0];
    denominator.push(relevantNode.attribute / Math.pow(edge.weight, 2));
    numerator.push(1 / Math.pow(edge.weight, 2));
  });

  const sum = (array) => {
    let sum = 0
    for (const n of array) sum += n
    return sum;
  }

  return sum(denominator)/sum(numerator);
};