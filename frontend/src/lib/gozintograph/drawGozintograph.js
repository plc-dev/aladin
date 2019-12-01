import { collisionDetection } from "@/lib/helper";

/**
 * Draws Gozintograph from passed object and applies strategy for colliding edge-values
 * @param {object} graph
 */
export function drawGozintograph(graph) {
  document.querySelector(".graph").innerHTML = "";
  graph.level.forEach((nodes, level, levels) =>
    drawNodes(nodes, level, levels.length)
  );
  drawConnections(graph.connections);
  setTimeout(() => {
    collisionDetection(
      Array.from(document.querySelectorAll(".edgeValue")),
      node => (node.classList += " showOnHover"),
      Array.from(document.querySelectorAll(".graph__node"))
    );
  }, 50);
}

/**
 *
 * @param {array} nodes
 * @param {number} level
 * @param {number} depth
 */
function drawNodes(nodes, level, depth) {
  const graph = document.querySelector(".graph");
  const exerciseHeight = document.querySelector(".exercise").offsetHeight;
  const exerciseOptionsHeight = document.querySelector(".graph__options")
    .scrollHeight;
  const heightPerLevel = (exerciseHeight - exerciseOptionsHeight) / depth;
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
function drawConnections(connections) {
  connections.forEach(connection => {
    const { parent, child, value } = connection;
    let connector = `<connection id="${parent}${child}" class="connector" from="#${parent}" to="#${child}" color="grey" ></connection>`;
    const graph = document.querySelector(".graph");
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
