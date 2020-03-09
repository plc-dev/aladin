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
 * Returns Boolean, True if a collision occurs, else False
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
 * Returns an integer array, derived from the passed string
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

/**
 * Checks if object is valid JSON. If so deserializes and returns it.
 * Otherwise returns the original object, due to it being a non-nested String.
 * Returns undefined if object is null
 * @param {any} object
 */
export function deserializeLocalStorage(object) {
  if (!object) return undefined;

  try {
    const json = JSON.parse(object);
    if (json && typeof json === "object") {
      return json;
    }
  } catch (e) {
    if (typeof object === "string") {
      return object;
    }
  }
  return undefined;
}

/**
 * Returns a camelcased string
 * @param {String} string
 */
export function camelCase(string) {
  return string.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return "";
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Matrix inversion algorithm as implemented here: http://blog.acipo.com/matrix-inversion-in-javascript/
 * Expects a n by n matrix in the format: [[1,2,...], [3,4,...], ...]
 * Returns inverted matrix if the inversion is possible
 * @param {array} M
 */
export function invertMatrix(M) {
  if (M.length !== M[0].length) {
    return;
  }
  let i = 0,
    ii = 0,
    j = 0,
    dim = M.length,
    e = 0;
  let I = [],
    C = [];
  for (i = 0; i < dim; i += 1) {
    I[I.length] = [];
    C[C.length] = [];
    for (j = 0; j < dim; j += 1) {
      if (i == j) {
        I[i][j] = 1;
      } else {
        I[i][j] = 0;
      }

      C[i][j] = M[i][j];
    }
  }
  for (i = 0; i < dim; i += 1) {
    e = C[i][i];
    if (e == 0) {
      for (ii = i + 1; ii < dim; ii += 1) {
        if (C[ii][i] != 0) {
          for (j = 0; j < dim; j++) {
            e = C[i][j];
            C[i][j] = C[ii][j];
            C[ii][j] = e;
            e = I[i][j];
            I[i][j] = I[ii][j];
            I[ii][j] = e;
          }
          break;
        }
      }
      e = C[i][i];
      if (e == 0) {
        return;
      }
    }
    for (j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e;
      I[i][j] = I[i][j] / e;
    }
    for (ii = 0; ii < dim; ii++) {
      if (ii == i) {
        continue;
      }
      e = C[ii][i];
      for (j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j];
        I[ii][j] -= e * I[i][j];
      }
    }
  }
  return I;
}

/**
 * Receives two arrays of arrays in the form of [[1,2,...], [2,3...], ...]
 * Returns a matrix with the dimensionality of n*m
 * @param {array} A
 * @param {array} B
 */
export function matrixMultiplication(A, B) {
  const result = new Array(A.length)
    .fill(0)
    .map(() => new Array(B[0].length).fill(0));

  return result.map((vector, vIndex) =>
    vector.map((field, fieldIndex) =>
      A[vIndex].reduce(
        (sum, resField, resIndex) => sum + resField * B[resIndex][fieldIndex],
        0
      )
    )
  );
}

/**
 * Returns a dynamically filled string on runtime
 * Takes a template string in the form of 'This is a ...${template} ${string}' and an object with string/array values {template: ['template', 'engine'], string: 'string'}
 * ...${} to concat an array of unknown length to a string on runtime
 * ${} to substitute the placeholder for the passed value on runtime
 * standard for concatWith is a empty space ' '
 */
export function templateString(template, values, concatWith) {
  let output = "";
  concatWith = concatWith || " ";
  Object.keys(values).forEach(key => {
    output = template
      .replace(new RegExp("\\$" + `{\\.\\.\\.${key}}`, "g"), () =>
        values[key].reduce((string, value, i) => {
          return !i ? value : string + concatWith + value;
        }, "")
      )
      .replace(new RegExp("\\$" + `{${key}}`, "g"), values[key]);
  });
  return output;
}

/**
 * Naive recursive check if two objects are equal (hold the exact same values to the exact same fields)
 */
export function isObjectEqual(a, b) {
  const keys = Object.keys,
    ta = typeof a,
    tb = typeof b;
  return a && b && ta === "object" && ta === tb
    ? keys(a).length === keys(b).length &&
        keys(a).every(key => isObjectEqual(a[key], b[key]))
    : a === b;
}

/**
 * Fuzzy recursive check if two objects values are equal and their keys are equal with a predefined maximum editor distance
 * Editor distance is checked via levensthein, hence the lowercasing of the keys
 */
export function isObjectFuzzyEqual(a, b, maxDifference) {
  const keys = Object.keys,
    ta = typeof a,
    tb = typeof b;
  const truth =
    a && b && ta === "object" && ta === tb
      ? keys(a).length === keys(b).length &&
        keys(a).every(
          (aKey, index) =>
            levenshtein(aKey.toLowerCase(), keys(b)[index].toLowerCase()) <=
              maxDifference &&
            isObjectFuzzyEqual(a[aKey], b[keys(b)[index]], maxDifference)
        )
      : a === b;
  return truth;
}

/**
 * Implementation of the levenshtein-distance algorithm to check edit distance between two strings
 * Different casing of the same letter will be count as a difference
 * @param {String} a
 * @param {String} b
 */
export function levenshtein(a, b) {
  let alen = a.length;
  let blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev;
  if (alen > blen) {
    tmp = a;
    a = b;
    b = tmp;
  }
  row = new Int8Array(alen + 1);
  // init the row
  for (i = 0; i <= alen; i++) {
    row[i] = i;
  }
  // fill in the rest
  for (i = 1; i <= blen; i++) {
    prev = i;
    bprev = b[i - 1];
    for (j = 1; j <= alen; j++) {
      if (bprev === a[j - 1]) {
        val = row[j - 1];
      } else {
        ma = prev + 1;
        mb = row[j] + 1;
        mc = ma - ((ma - mb) & ((mb - ma) >> 7));
        md = row[j - 1] + 1;
        val = mc - ((mc - md) & ((md - mc) >> 7));
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[alen] = prev;
  }
  return row[alen];
}
