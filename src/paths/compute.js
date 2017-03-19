import Path from "../Path";

export class Compute extends Path {
    constructor(object) {
        if (object instanceof Path || typeof object === "string") object = [object];

        super("compute");

        this.computeType = Array.isArray(object) ? "array" : typeof object;
        this.keys = Object.keys(object);
        this.values = Object.values(object).map(value => {
            if (Array.isArray(value)) return new Compute(value);
            return Path.ensure(value);
        });
    }

    resolve(tree) {
        return this.paths(path => !(path instanceof Compute) && path.resolve(tree));
    }

    get(tree) {
        if (this.computeType === "array") {
            return this.values.reduce(
                (result, value, index) => {
                    if (typeof value === "function")
                        return index === this.values.length - 1
                            ? value(...result)
                            : [value(...result)];

                    if (value instanceof Path) result.push(value.get(tree));
                    else result.push(value);

                    return result;
                },
                []
            );
        }

        return this.keys.reduce(
            (obj, key, idx) => {
                const value = this.values[idx];

                obj[key] = value instanceof Path
                    ? value.get(tree)
                    : typeof value === "function" ? value(obj) : value;

                return obj;
            },
            {}
        );
    }
}

export default arg => new Compute(arg);
