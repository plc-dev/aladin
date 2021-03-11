import { DAG } from "./BaseGraphs";
import { statefulCounter } from "../../helpers/NumberGenerators";

export default class Gozintograph extends DAG {
    constructor(public solver: Function) {
        super();
    }
    private labelGenerator() {
        const c = statefulCounter();
        this.topology.forEach((level, levelIndex) =>
            level.forEach((node) => {
                levelIndex;
            })
        );
    }
}
