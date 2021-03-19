import { RNG, randomSample } from "../helpers/NumberGenerators";

type VerticeConstructor = new (...args: Array<any>) => Vertice;

abstract class Vertice {
    static counter = 0;
    protected id: number;

    constructor() {
        this.id = Vertice.counter++;
    }

    public getId(): number {
        return this.id;
    }
}

class DirectedVertice extends Vertice {
    private parents: Array<Vertice> = [];
    private children: Array<Vertice> = [];

    public getParents(): Array<Vertice> {
        return this.parents;
    }
    public getChildren(): Array<Vertice> {
        return this.children;
    }

    public addChild(child: Vertice) {
        this.children.push(child);
    }
    public addParent(parent: Vertice) {
        this.parents.push(parent);
    }
}

type EdgeConstructor = new (...args: any[]) => Edge;
abstract class Edge {}

class WeightedEdge extends Edge {
    constructor(private parent: DirectedVertice, private child: DirectedVertice, readonly weight: number | string) {
        super();
        this.parent.addChild(child);
        this.child.addParent(parent);
    }
}

type GraphConstructor = new (...args: any[]) => Graph;
abstract class Graph {
    protected vertices: Array<Vertice> = [];
    protected edges: Set<Edge> = new Set();
    constructor(protected verticeConstructor: VerticeConstructor, protected edgeConstructor: EdgeConstructor) {}

    public addVertice(args?: any[]) {
        this.vertices.push(new this.verticeConstructor());
    }

    public addEdge(parent: Vertice, child: Vertice, args?: any[]) {
        const edge = new this.edgeConstructor(parent, child, ...args);
        this.edges.add(edge);
    }

    public dotDescription() {}
}

class DiGraph extends Graph {
    public addEdge(parent: Vertice, child: Vertice, args?: any[]) {
        const edge = new this.edgeConstructor(parent, child, ...args);
        this.edges.add(edge);
    }

    public getVertice(index: number): Vertice {
        return this.vertices[index];
    }

    public dotDescription() {}
}

class GraphGenerator {
    constructor(private graphConstructor: typeof DiGraph, private rng: RNG) {}

    public generateGraph(verticeAmount: number, edgeAmount: number): DiGraph {
        const graph = new this.graphConstructor(DirectedVertice, WeightedEdge);
        for (let i = 0; i < verticeAmount; i++) {
            graph.addVertice();
        }

        for (let i = 0; i < edgeAmount; i++) {
            const [parentIndex, childIndex] = randomSample([...Array(verticeAmount).keys()], 2);
            const parent = graph.getVertice(parentIndex);
            const child = graph.getVertice(childIndex);
            const weight = this.rng.floatBetween(0, 1);
            graph.addEdge(parent, child, [weight]);
        }
        return graph;
    }
}

const gg = new GraphGenerator(DiGraph, new RNG());
const graph = gg.generateGraph(15, 25);
console.dir(graph);
