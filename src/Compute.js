import Path from "./Path";
import { isComplexObject } from "./utils";

class Keys extends Path {
    constructor(path) {
        const keys = Path.toArray(path);
        super(keys.shift());
        this.keys = keys;
    }
}

export class Compute extends Path {
    static ARRAY = Symbol("Compute/Array");
    static OBJECT = Symbol("Compute/Object");
    static KEYS = Symbol("Compute/Keys");
    static PATH = Symbol("Compute/Path");

    static value(arg) {
        if (Path.isPath(arg)) return arg;
        if (typeof arg === "object") return new Compute(arg);
        return arg;
    }

    constructor(object) {
        super("compute");

        if (arguments.length > 1) {
            this.type = Compute.ARRAY;
            this.values = Array.from(arguments).map(Compute.value);
        } else if (Path.isPath(object)) {
            this.type = Compute.PATH;
            this.values = [object].map(Compute.value);
        } else if (typeof object === "string") {
            this.type = Compute.KEYS;
            this.values = [new Keys(object)].map(Compute.value);
        } else if (Array.isArray(object)) {
            this.type = Compute.ARRAY;
            this.values = object.map(Compute.value);
        } else if (typeof object === "object") {
            this.type = Compute.OBJECT;
            this.keys = Object.keys(object);
            this.values = Object.values(object).map(Compute.value);
        } else {
            throw new Error(`Compute: invalid arguments: ${object}`);
        }
    }

    resolve(context) {
        return this.getPaths(path => {
            if (path instanceof Compute || !(path instanceof Path)) return;
            const resolved = path.resolve(context, true);
            path.context = context;
            return resolved.indexOf("*") === -1 && isComplexObject(path.get(context))
                ? resolved.concat("**")
                : resolved;
        });
    }

    get(tree) {
        //tree = tree || this.context;
        if (
            this.type === Compute.ARRAY || this.type === Compute.PATH || this.type === Compute.KEYS
        ) {
            const values = this.values.reduce(
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
            return this.type === Compute.PATH ? values.pop() : values;
        }

        if (this.type === Compute.OBJECT) {
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
}

export default function compute(/* args */) {
    return new Compute(...arguments);
}
