import seedrandom from "seedrandom";

export default class RNG {
    private rng: Math["random"] | seedrandom.prng;

    constructor(seed?: any) {
        this.rng = seed ? seedrandom(seed) : Math.random;
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
