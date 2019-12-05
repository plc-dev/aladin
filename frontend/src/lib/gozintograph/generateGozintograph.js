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
  connectionThreshold
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

  // generate levels for specified depth
  for (let i = 0; i < depth; i++) {
    width = getRandomInt(rangeWidth.min, rangeWidth.max);
    graph.level.push([]);
    currentLevel = graph.level[i];
    // generate nodes per level
    for (let j = 0; j < width; j++) {
      node = {
        id: `${letters[i]}${j}`,
        amount: i === 0 ? getRandomInt(rangeAmount.min, rangeAmount.max) : 0,
        isLeaf: true
      };
      currentLevel.push(node);
      // skip root level, since it has no parents to have connections with (⌣̩̩́_⌣̩̩̀)
      if (i >= 1) {
        let parentLevels = [];
        let index = i - 1;
        // map all parent levels to generate connections with
        while (index >= 0) {
          parentLevels.unshift(graph.level[index]);
          index--;
        }
        // generate connections per node
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
        // map all connections of the second level nodes as base paths
        if (i === 1) {
          graph.paths = graph.connections.map(connection => [connection]);
        }
      }
    }
  }
  //get all leaf-nodes
  const leafs = graph.level.flatMap(nodes =>
    nodes.filter(node => node.isLeaf).map(node => node.id)
  );
  graph.paths = [];
  leafs.forEach(leaf => {
    const paths = [];
    const path = [];
    findPath(leaf, graph.connections, paths, path, -1);

    if (paths.length) {
      graph.paths.push(...paths);
    }
  });
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
        // randomize parent node to prevent weighted graph on high thresholds
        if (noConnectionOnChild) {
          parent = parents[getRandomInt(0, parentIndex)];
        }
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

/**
 * Recursive path retrieval function, starting at a leaf node
 * @param {string} node
 * @param {object} connections
 * @param {array} paths
 * @param {number} path
 */
function findPath(node, connections, paths, path) {
  // retrieve all connections to parents
  const connectionsToParent = connections.filter(
    connection => connection.child === node
  );
  // recurs for each parent node
  if (connectionsToParent.length) {
    for (let c = 0; c < connectionsToParent.length; c++) {
      const connection = connectionsToParent[c];
      // make a copy of path, to separate them
      let newPath = [...path];
      newPath.push(connection);
      findPath(connection.parent, connections, paths, newPath);
    }
    // if there are no connections we found the path to the root node
  } else if (path.length) {
    paths.push(path);
    path = [];
  }
  return;
}
