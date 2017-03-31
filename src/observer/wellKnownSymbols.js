const wellKnowSymbols = new Set();

for (let key of Object.getOwnPropertyNames(Symbol)) {
    const value = Symbol[key];
    if (typeof value === "symbol") {
        wellKnowSymbols.add(value);
    }
}

export default wellKnowSymbols;
