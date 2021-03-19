const NoiseGenerator = require("simplex-noise");
import { RNG, randomSample } from "../helpers/NumberGenerators";

const generateNoise = (gridX: number, gridY: number, scale: number, seed: number): Array<Array<number>> => {
    const noiseGenerator = new NoiseGenerator(seed);

    const noiseGrid = [];
    for (let x = 0; x < gridX; x++) {
        noiseGrid[x] = [];
        for (let y = 0; y < gridY; y++) {
            const noise = (noiseGenerator.noise3D(x / 16, y / 16, 0 / 16) * 0.5 + 0.5) * scale;
            noiseGrid[x][y] = noise;
        }
    }
    return noiseGrid;
};

interface IGeoInterpolationOptions {
    scale: number;
    gridRange: Array<number>;
    measurementRange: Array<number>;
    seed?: number;
}

interface IMeasurementPoint {
    id: number;
    value: number;
    x: number;
    y: number;
}

interface IEdge {
    id: number;
    distance: number;
}

interface IGeoInterpolationGraph {
    measurementPoints: Array<IMeasurementPoint>;
    unknownPoint: IMeasurementPoint;
    edges: Array<IEdge>;
}

class InterpolationTaskGenerator {
    private rng: RNG;
    constructor(private options: IGeoInterpolationOptions) {
        this.rng = new RNG(options.seed || Math.random());
    }

    public generateInterpolationTask() {
        const { scale, gridRange, measurementRange, seed } = this.options;

        const grid = this.generateNoiseGrid(scale, gridRange, seed);
        const graph = this.generateGraph(grid, measurementRange);
        const dotDescription = this.generateDotDescription(graph);
        const thresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v) => v * scale);

        return { grid, thresholds, graph, dotDescription };
    }

    private generateNoiseGrid(scale: number, gridRange: Array<number>, seed: number = Math.random()) {
        const [gridMin, gridMax] = gridRange;
        const gridSize = this.rng.intBetween(gridMin, gridMax);
        return generateNoise(gridSize, gridSize, scale, seed);
    }

    private generateGraph(grid: Array<Array<number>>, measurementRange: Array<number>): IGeoInterpolationGraph {
        const [measurementMin, measurementMax] = measurementRange;
        const measurementCount = this.rng.intBetween(measurementMin, measurementMax);

        const [x] = randomSample(Object.keys(grid), 1);
        const [y] = randomSample(Object.keys(grid[x]), 1);
        const unknownPoint: IMeasurementPoint = { id: 0, x, y, value: grid[x][y] };

        const columnIndices = randomSample(Object.keys(grid), measurementCount);
        const measurementPoints: Array<IMeasurementPoint> = columnIndices.map((columnIndex, i) => {
            const [rowIndex] = randomSample(Object.keys(grid[columnIndex]), 1);
            return { id: i + 1, value: grid[columnIndex][rowIndex], x: columnIndex, y: rowIndex };
        });

        const edges = measurementPoints.map(({ id, x, y }) => {
            const edge = {
                id,
                distance: this.euclidianDistance([unknownPoint.x, unknownPoint.y], [x, y]),
            };
            return edge;
        });

        return { unknownPoint, measurementPoints, edges };
    }

    private euclidianDistance(v1: Array<number>, v2: Array<number>) {
        const [x1, y1] = v1;
        const [x2, y2] = v2;
        return parseFloat(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)).toFixed(2));
    }

    private generateDotDescription(graph: IGeoInterpolationGraph) {
        const { edges, unknownPoint, measurementPoints } = graph;

        const nodeString = [unknownPoint, ...measurementPoints]
            .map(({ id, value, x, y }, i) =>
                i ? `${id} [pos="${x},${y}!", tooltip="${value}"]` : `${id} [pos="${x},${y}!", color=blue tooltip="${value}"]`
            )
            .join(" ");

        const edgeString = edges.map(({ id, distance }) => `${unknownPoint.id} -- ${id} [label="${distance}"]`).join(" ");

        //node ---->   width=0.05, fixedsize=true
        return `graph { 
            layout="neato" 
            graph [bgcolor="transparent"]
            node [shape=circle labelloc=b fontsize=50 penwidth=5]
            edge [style=dashed fontsize=50 penwidth=5]
            ${nodeString}
            ${edgeString}
        }
        `;
    }
}

(() => {
    const g = new InterpolationTaskGenerator({ scale: 1, gridRange: [50, 50], measurementRange: [5, 10] });
    const task = g.generateInterpolationTask();
    console.dir(task, { depth: null });
})();
