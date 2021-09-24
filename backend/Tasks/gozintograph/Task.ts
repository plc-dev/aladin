import { TaskGenerator } from "../../genericGraphs/TaskGenerator";
import { Constructor } from "../../genericGraphs/Utility";
import { Gozintograph, GozintographVertex } from "./Graph";
import { GozintographGenerator, GozintographConfig } from "./GraphGenerator";

export class GozintographTaskGenerator extends TaskGenerator<Gozintograph, GozintographConfig> {
    constructor(
        graphConstructor: Constructor<Gozintograph> = Gozintograph,
        generatorConstructor: Constructor<GozintographGenerator> = GozintographGenerator
    ) {
        super(graphConstructor, generatorConstructor);
    }

    public generateTask(config: GozintographConfig) {
        config["type"] = "digraph";
        config["edgeDirection"] = "forward";
        config.style = {
            graph: { rankdir: "BT", splines: "polyline", bgcolor: "transparent" },
            vertex: { shape: "circle", style: "filled" },
            edge: {},
        };
        super.generateTask(config);

        const graphGenerator = new this.graphGeneratorConstructor(this.rng);
        this.graph = graphGenerator.generateGraph(this.graphConstructor, config);

        const vertices = Object.values(this.graph.getVertices());
        const valueVector = vertices.map((vertex) => vertex.getProperty("value" as keyof GozintographVertex));
        const labelVector = vertices.map((vertex) => vertex.getProperty("label" as keyof GozintographVertex));
        const solution = this.calculateSolution(this.graph.getAdjacencyMatrix(), valueVector);

        const dotGraph = this.graph.dotGraph();
        const { nodes, edges, paths } = this.graph.serialize();

        return {
            dotDescription: dotGraph,
            edges,
            nodes,
            paths,
            valueVector: [valueVector],
            labelVector,
            solution,
            adjacencyMatrix: this.graph.getAdjacencyMatrix(),
            longestPath: this.graph.getLongestPathLength(),
        };
    }

    private longestPathLength() {
        const roots = this.graph.getLeafs();
        const vertices = this.graph.getVertices();
        const rootVertices = roots.map((root) => vertices[root]);

        const findPath = (vertex: GozintographVertex, path: Array<object>, paths: Array<Array<object>>) => {
            const childs = Object.values(vertex.getChilds());
            if (childs.length) {
                childs.forEach((child) => {
                    let newPath = [...path];
                    newPath.push({ between: [vertex.getId(), child.getId()] });
                    findPath(child, newPath, paths);
                });
            } else if (path.length) {
                paths.push(path);
                path = [];
            }
            return paths;
        };

        const paths = rootVertices.reduce((paths, root) => findPath(root, [], paths), []);
        this.graph.setPaths(paths);

        const longestPathLength = paths.reduce(
            (longestPath, path, i, paths) => (path.length > paths[longestPath].length ? i : longestPath),
            0
        );
        this.graph.setLongestPathLength(longestPathLength);
        return longestPathLength;
    }

    private calculateSolution(matrix: Array<Array<number>>, valueVector: Array<number>): Array<Array<number>> {
        const transpose = (matrix: Array<Array<number>>) =>
            matrix[0].map((element, elementIndex) => matrix.map((row) => row[elementIndex]));
        const sum = (list: Array<number>): number => list.reduce((sum, element) => (sum += element), 0);
        const matmul = (m1: Array<Array<number>>, m2: Array<Array<number>>) =>
            m1.map((row) => transpose(m2).map((column) => sum(row.map((element, elementIndex) => element * column[elementIndex]))));
        const matadd = (m1: Array<Array<number>>, m2: Array<Array<number>>) =>
            m1.map((row, i) => row.map((element, j) => (m2[i][j] += element)));
        const unity = (matrix: Array<Array<number>>) => {
            return matrix.reduce((unityMatrix, rows, i) => {
                const unityRow = rows.reduce((unityRow, row, j) => {
                    unityRow[j] = i === j ? 1 : 0;
                    return unityRow;
                }, []);
                unityMatrix.push(unityRow);
                return unityMatrix;
            }, [] as Array<Array<number>>);
        };

        let current = matrix;
        let result = matrix;
        const longestPathLength = this.longestPathLength();
        for (let i = 1; i < longestPathLength; i++) {
            result = matmul(current, result);
            result = matadd(current, result);
        }
        result = matadd(result, unity(matrix));

        const resultVector = result.reduce((vector, row) => {
            const scalar = row.reduce((scalar, element, i) => {
                scalar += element * valueVector[i];
                return scalar;
            }, 0);
            vector.push(scalar);
            return vector;
        }, [] as Array<number>);

        return [resultVector];
    }
}

// const tg = new GozintographTaskGenerator();
// const t = tg.generateTask({
//     nodeAmount: 10,
//     edgeDensity: 0.2,
//     nodeValueRange: [1, 10],
//     edgeWeightRange: [1, 10],
//     seed: "",
//     style: { vertex: {}, edge: {}, graph: {} },
// });
// console.log(t.paths);

// nodeAmount: number;
// edgeDensity: number;
// nodeValueRange: [number, number];
// edgeWeightRange: [number, number];
