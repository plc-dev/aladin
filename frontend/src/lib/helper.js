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
 * The passed fix function is called on collision and is passed the current node
 * Optional array of HTML elements to check overlapping, but don't need fixing
 * @param {array} nodesToFix
 * @param {function} fix
 * @param {array} nodes
 */
export function collisionDetection(nodesToFix, fix, nodes) {
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
        break;
      }
    }
  });
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
