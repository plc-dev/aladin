import { Graph, DiGraph } from "../graphs/BaseGraphs";
import { RNG } from "../../helpers/NumberGenerators";

export default abstract class GraphGenerator {
    rng: RNG;

    constructor(seed?: any, ...args: any[]) {
        this.rng = new RNG(seed);
    }

    public generateGraph() {}
}

class RandomGenerator extends GraphGenerator {
    constructor(seed: any) {
        super(seed);
    }
}

class FastGnpRandomGraphGenerator extends RandomGenerator {
    p: number;
    directed: boolean;
    acyclic: boolean;
    graph: Graph;

    constructor(amountOfNodes: number, probability: number, seed: any = null, isDirected: boolean = false, isAcyclic: boolean = false) {
        super(seed);
        this.p = probability;
        this.directed = isDirected;
        this.acyclic = isAcyclic;
        this.graph = new DiGraph();
        for (let i = 0; i < amountOfNodes; i++) {
            this.graph.createNode();
        }
    }

    public generateGraph() {
        let weight = -1;
        const logarithmicProbability = Math.log(1.0 - this.p);

        this.directed
            ? this.generateDirectedGraph(weight, logarithmicProbability)
            : this.generateUndirectedGraph(weight, logarithmicProbability);
        return this.graph;
    }

    private generateDirectedGraph(w: number, lp: number) {
        let v = 0;
        let lr;
        const n: number = Object.keys(this.graph.nodes).length;
        while (v < n) {
            lr = Math.log(1 - this.rng.floatBetween());
            w = ++w + Math.floor(lr / lp);
            if (v === w) w++;
            while (w >= n && v < n) {
                w = w - n;
                v++;
                if (v === w) w++;
            }
            if (v < n) {
                this.graph.createEdge(this.graph["nodes"][v]["id"], this.graph["nodes"][w]["id"]);
            }
        }
    }

    private generateUndirectedGraph(w: number, lp: number) {
        let v = 1;
        let lr;
        const n: number = Object.keys(this.graph.nodes).length;
        while (v < n) {
            lr = Math.log(1 - this.rng.floatBetween());
            w = ++w + Math.floor(lr / lp);
            while (w >= v && v < n) {
                w = w - v;
                v++;
            }
            if (v < n) {
                this.graph.createEdge(this.graph["nodes"][v]["id"], this.graph["nodes"][w]["id"]);
            }
        }
    }
}
