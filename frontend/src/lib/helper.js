/**
 * Module containing various helper functions
 * @module helper
 */

/**
 * Returns a random integer between the passed numbers
 * @param {number} min
 * @param {number} max
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Takes an array of HTML elements to fix if they overlap
 * The passed fix function is called on collision and handles the current node
 * Optional array of HTML elements to check overlapping, but don't need fixing
 * Returns Boolean, True if a collision occured, else False
 * @param {array} nodesToFix
 * @param {function} fix
 * @param {array} nodes
 */
export function collisionDetection(nodesToFix, fix, nodes) {
  let collision = false;
  nodes = nodes || [];
  nodesToFix = nodesToFix.map(node => {
    return { node, rect: node.getBoundingClientRect() };
  });

  nodes = nodes.map(node => {
    return { node, rect: node.getBoundingClientRect() };
  });
  const collisionObjects = [...nodesToFix, ...nodes];

  nodesToFix.forEach((current, index) => {
    for (let i = 0; i < collisionObjects.length; i++) {
      if (
        current.rect.right >= collisionObjects[i].rect.left &&
        current.rect.left <= collisionObjects[i].rect.right &&
        current.rect.bottom >= collisionObjects[i].rect.top &&
        current.rect.top <= collisionObjects[i].rect.bottom &&
        i !== index
      ) {
        fix(current.node);
        collision = true;
        break;
      }
    }
  });
  return collision;
}

/**
 * Returns a integer array, derived from the passed string
 * @param {string} base64String
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Retrieves a matrix in the proper dimension from the passed connections and nodes.
 * Can apply an optional value to the fields != 0. The standard value is the value of the connection.
 * empty = true returns a matrix filled with empty strings.
 * @param {Array} connections
 * @param {Array} nodes
 * @param {any} applyValue
 * @param {Boolean} empty
 */
export function retrieveMatrix(connections, nodes, applyValue, empty) {
  return nodes.map(parent => {
    return {
      [parent.id]: nodes.map(child => {
        const connection = connections.filter(
          connection =>
            connection.parent === parent.id && connection.child === child.id
        );
        if (connection.length) {
          return {
            id: child.id,
            amount:
              empty !== undefined
                ? ""
                : applyValue !== undefined
                ? applyValue
                : connection[0].value
          };
        } else {
          return { id: child.id, amount: empty !== undefined ? "" : 0 };
        }
      })
    };
  });
}

/**
 * Returns a deep copy of the passed object
 * @param {Object} object
 */
export function deepCopy(object) {
  if (object !== undefined && object !== null) {
    return JSON.parse(JSON.stringify(object));
  }
}
