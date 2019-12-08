import { collisionDetection } from "@/lib/helper";

/**
 * Draws Gozintograph from passed object and applies strategy for colliding edge-values
 * @param {object} graph
 */
export function drawGozintograph(graph, appendTo, height) {
  appendTo.innerHTML = "";
  graph.level.forEach((nodes, level, levels) =>
    drawNodes(nodes, level, levels.length, appendTo, height)
  );
  drawConnections(graph.connections, appendTo);
  setTimeout(() => {
    collisionDetection(
      Array.from(document.querySelectorAll(".edgeValue")),
      node => (node.classList += " showOnHover"),
      Array.from(document.querySelectorAll(".graph__node"))
    );
  }, 200);
}

/**
 *
 * @param {array} nodes
 * @param {*} level
 * @param {*} depth
 * @param {*} graph
 * @param {*} exerciseHeight
 */
function drawNodes(nodes, level, depth, graph, exerciseHeight) {
  let heightPerLevel = exerciseHeight / depth;
  const levelElement = document.createElement("div");
  levelElement.className += `graph__level--${level}`;
  levelElement.style.height = `${heightPerLevel}px`;
  graph.appendChild(levelElement);

  nodes.forEach(node => {
    const element = document.createElement("div");
    element.id = node.id;
    element.style.position = "absolute";
    element.style.top = "0px";
    element.className += "graph__node";
    element.textContent = node.id;
    const nodeValue = document.createElement("div");
    nodeValue.className += "graph__node--value";
    nodeValue.style.position = "relative";
    nodeValue.style.zIndex = 2337;
    nodeValue.style.overflow = "hidden";

    levelElement.appendChild(nodeValue);
    nodeValue.appendChild(element);
  });
}

/**
 *
 * @param {array} connections
 */
function drawConnections(connections, graph) {
  connections.forEach(connection => {
    const { parent, child, value } = connection;

    let connector = `<connection id="${parent}${child}" class="connector" from="#${parent}" to="#${child}" color="grey" onlyVisible head ></connection>`;
    graph.innerHTML += connector;
    setTimeout(() => {
      const edge = document.querySelector(`#${parent}${child} div`);
      const transformValue = edge.style.transform.replace(/[^-\d.]/g, "");
      const edgeValue = document.createElement("span");
      edgeValue.classList += `edgeValue ${parent}${child}`;
      edgeValue.style.position = "absolute";
      edgeValue.style.transform = `rotate(${-transformValue}deg)`;
      edgeValue.style.zIndex = 1337;
      edgeValue.textContent = value;
      edge.append(edgeValue);
    }, 50);
  });
}
