import { getRandomInt } from "@/lib/helper";

/**
 * Returns a object containing nodes, edges and paths
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
  connectionThreshold = 0.7
) {
  const graph = {
    level: [],
    connections: [],
    paths: [],
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
    graph.level.push([]);
    currentLevel = graph.level[i];
    for (let j = 0; j < width; j++) {
      node = {
        id: `${letters[i]}${j}`,
        amount: i === 0 ? getRandomInt(rangeAmount.min, rangeAmount.max) : 0,
        isLeaf: true
      };
      currentLevel.push(node);
      if (i >= 1) {
        let parentLevels = [];
        let index = i - 1;
        while (index >= 0) {
          parentLevels.unshift(graph.level[index]);
          index--;
        }
        graph.connections.push(
          ...generateConnections(
            node,
            parentLevels,
            rangeValue,
            connectionThreshold,
            graph,
            i
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
  graph,
  currentDepth
) {
  const connections = parentLevels.flatMap((level, levelIndex) =>
    level.reduce((result, parent, parentIndex, parents) => {
      // guarantee a connection to a parent-node on every child-node
      let noConnectionOnChild = false;
      if (parentIndex === parents.length - 1) {
        noConnectionOnChild = ~[...graph.connections, ...result].findIndex(
          connection => node.id === connection.child
        )
          ? false
          : true;
      }
      // guarantee a connection on every root-node
      let noConnectionOnRoot = false;
      if (!levelIndex && currentDepth === graph.depth - 1) {
        noConnectionOnRoot = ~[...graph.connections, ...result].findIndex(
          connection => parent.id === connection.parent
        )
          ? false
          : true;
      }
      if (
        Math.random() > connectionThreshold ||
        noConnectionOnChild ||
        noConnectionOnRoot
      ) {
        // console.warn(
        //   noConnectionOnRoot,
        //   noConnectionOnChild,
        //   node.id,
        //   parent.id
        // );
        const newConnection = {
          parent: parent.id,
          child: node.id,
          value: getRandomInt(range.min, range.max),
          type: !levelIndex ? "root" : ""
        };
        // if parent has Connection it is no longer a leaf node
        parent.isLeaf = false;
        // calculate secondary needs vector
        node.amount += parent.amount * newConnection.value;
        result.push(newConnection);
      }
      return result;
    }, [])
  );
  return connections;
}
