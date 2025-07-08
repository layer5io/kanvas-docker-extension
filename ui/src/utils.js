export function trueRandom() {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
}

export function randomApplicationNameGenerator() {
    return "kanvas-design-" + Math.floor(trueRandom() * 100);
}

