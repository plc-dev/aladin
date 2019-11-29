import { getRandomInt } from "@/lib/helper";

/**
 * Returns a object containing nodes and edges
 * @param {number} depth
 * @param {object} rangeAmount
 * @param {object} rangeWidth
 * @param {object} rangeValue
 * @param {number} connectionThreshold
 */
export function generateGraph(
  depth,
  rangeAmount,
  rangeWidth,
  rangeValue,
  connectionThreshold = 0.5
) {
  const graph = {
    level: [],
    connections: [],
    maxWidth: 0,
    depth
  };
  let width, currentLevel, node;
  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];

  for (let i = 0; i < depth; i++) {
    width = getRandomInt(rangeWidth.min, rangeWidth.max);
    graph.maxWidth = width > graph.maxWidth ? width : graph.maxWidth;
    graph.level.push([]);
    currentLevel = graph.level[i];
    for (let j = 0; j < width; j++) {
      node = {
        id: `${letters[i]}${j}`,
        amount: i === 0 ? getRandomInt(rangeAmount.min, rangeAmount.max) : 0
      };
      currentLevel.push(node);
      if (i >= 1) {
        let parentLevels = [];
        let index = i - 1;
        while (index >= 0) {
          parentLevels.push(graph.level[index]);
          index--;
        }
        graph.connections.push(
          ...generateConnections(
            node,
            parentLevels,
            rangeValue,
            connectionThreshold,
            graph
          )
        );
      }
    }
  }
  return graph;
}

/**
 *
 * @param {object} node
 * @param {array} parentLevels
 * @param {object} range
 * @param {number} connectionThreshold
 * @param {object} graph
 */
function generateConnections(
  node,
  parentLevels,
  range,
  connectionThreshold,
  graph
) {
  const connections = parentLevels.flatMap((level, levelIndex) =>
    level.reduce((result, parent, parentIndex, parents) => {
      // guarantee to have a connection to a root-node on every child-node
      let noConnectionOnChild = false;
      if (parentIndex === parents.length - 1) {
        noConnectionOnChild = ~[...graph.connections, ...result].findIndex(
          connection => node.id === connection.child
        )
          ? false
          : true;
      }
      // guarantee to have a connection on every root-node
      let noConnectionOnParent = false;
      if (levelIndex === graph.depth - 2) {
        noConnectionOnParent = ~[...graph.connections, ...result].findIndex(
          connection => parent.id === connection.parent
        )
          ? false
          : true;
      }
      if (
        Math.random() > connectionThreshold ||
        noConnectionOnChild ||
        noConnectionOnParent
      ) {
        const connection = {
          parent: parent.id,
          child: node.id,
          value: getRandomInt(range.min, range.max)
        };
        node.amount += parent.amount * connection.value;
        result.push(connection);
      }
      return result;
    }, [])
  );
  return connections;
}
