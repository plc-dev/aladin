const { getRandomInt } = require("../../helper");

module.exports = class UCG {
  constructor({ vertices, edges, paths }) {
    this.vertices = vertices || this.generateVertices();
    this.edges = edges || this.generateEdges();
    this.paths = paths || this.findPaths();
  }

  generateVertices() {
    const amount = getRandomInt(2, 20);
    const vertices = [];

    for (let i = 0; i < amount; i++) {
      vertices.push(i);
    }
    return vertices;
  }

  generateEdges() {
    const vertices = this.vertices;
    const amount = getRandomInt(1, vertices.length);
    const edges = [];

    for (let i = 0; i < amount; i++) {
      const randomVertice = () =>
        vertices[getRandomInt(0, vertices.length - 1)];
      const vertice1 = randomVertice();
      const vertice2 = randomVertice();
      edges.push([vertice1, vertice2]);
    }
    return edges;
  }

  findPaths() {}
};
