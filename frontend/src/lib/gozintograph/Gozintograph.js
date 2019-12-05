class Gozintograph {
  constructor(depth, rangeAmount, rangeWidth, rangeValue, connectionThreshold) {
    this.depth = depth;
    this.rangeAmount = rangeAmount;
    this.rangeWidth = rangeWidth;
    this.rangeValue = rangeValue;
    this.connectionThreshold = connectionThreshold;
    this.nodes = [];
    this.connections = [];
    this.paths = [];
  }

  generateNodes(depth, rangeWidth) {}
}
