import seedrandom from "seedrandom";

export class RNG {
    private rng: Math["random"] | seedrandom.prng;

    constructor(seed?: any) {
        this.rng = seed ? seedrandom(seed) : Math.random;
    }

    public coinFlip() {
        return this.floatBetween(0, 1) > 0.5;
    }

    public floatBetween(min?: number, max?: number) {
        if (min && max) return this.rng() * (max - min) + min;
        return this.rng();
    }

    public intBetween(min: number, max: number) {
        return Math.round(this.rng() * (max - min) + min);
    }
}

export const statefulCounter = (start: number = 0): Generator => {
    function* counter() {
        while (true) {
            yield start;
            start++;
        }
    }
    return counter();
};

export const randomSample = (array: Array<any>, n: number, rng?: RNG) => {
    const clonedArray = JSON.parse(JSON.stringify(array));
    if (n > clonedArray.length - 1) throw new Error("Samplesize is greater than number of elements in the given array.");

    if (!rng) rng = new RNG();

    function* elementGenerator() {
        let stopCondition = 0;
        while (stopCondition < n) {
            stopCondition++;
            const index = rng.intBetween(0, clonedArray.length - 1);
            yield clonedArray.splice(index, 1)[0];
        }
    }

    const elements = [];
    for (let element of elementGenerator()) {
        elements.push(element);
    }
    return elements;
};
