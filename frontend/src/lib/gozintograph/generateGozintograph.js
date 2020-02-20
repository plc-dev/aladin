import { getRandomInt } from "@/lib/helper";

/**
 * Returns a graph-object containing nodes, edges and paths
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
  const labels = ["P", "B", ["K", "R"]];

  // generate levels for specified depth
  for (let i = 0; i < depth; i++) {
    width = getRandomInt(rangeWidth.min, rangeWidth.max);
    graph.level.push([]);
    currentLevel = graph.level[i];
    // generate nodes per level
    for (let j = 0; j < width; j++) {
      const name = () => {
        if (!i) return `${labels[i]}${j}`;
        if (i < depth - 1) return `${labels[1]}${j}`;
        else {
          const randomLabel = Math.round(Math.random());
          return `${labels[2][randomLabel]}${j}`;
        }
      };
      node = {
        id: name(),
        amount: !i ? getRandomInt(rangeAmount.min, rangeAmount.max) : 0,
        need: i ? getRandomInt(rangeAmount.min, rangeAmount.max) : 0,
        isLeaf: true,
        needAdded: false
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
  let resourceIndex = 0;
  let purchasedIndex = 0;
  // function to rename the leaf nodes semantically correct
  const renameLeaf = node => {
    if (/B/.test(node.id)) {
      const randomLabel = Math.round(Math.random());
      if (randomLabel) {
        const id = `${labels[2][randomLabel]}${purchasedIndex}`;
        purchasedIndex++;
        return id;
      } else {
        const id = `${labels[2][randomLabel]}${resourceIndex}`;
        resourceIndex++;
        return id;
      }
    } else if (/K/.test(node.id)) {
      const id = `${labels[2][0]}${resourceIndex}`;
      resourceIndex++;
      return id;
    } else if (/R/.test(node.id)) {
      const id = `${labels[2][1]}${purchasedIndex}`;
      purchasedIndex++;
      return id;
    }
    return node.id;
  };
  const renamed = [];

  //get all leaf-nodes and rename semantically
  const leafs = graph.level.flatMap(nodes =>
    nodes
      .filter(node => node.isLeaf)
      .map(node => {
        const id = renameLeaf(node);
        renamed.push({ previous: node.id, now: id });
        node.id = id;
        return node.id;
      })
  );
  // rename node.ids in connections
  graph.connections.forEach(connection => {
    let childRenamed = 1;
    let parentRenamed = 1;
    renamed.forEach(id => {
      if (id.previous == connection.child && childRenamed) {
        connection.child = id.now;
        childRenamed = 0;
      }
      if (id.previous == connection.parent && parentRenamed) {
        connection.parent = id.now;
        parentRenamed = 0;
      }
    });
  });
  graph.level[0].forEach(node => (node.need = node.amount));
  //accumulate paths
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
        if (!node.needAdded) {
          node.needAdded = true;
          node.amount += node.need;
        }
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
