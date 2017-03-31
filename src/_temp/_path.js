import Compute from "./compute";
import box from "./box";
import is from "./is";

let toPrimitive = () => "";
let objTransfer = null;

class Path {
    //static isPath = Symbol("isPath");
    //static $ = Symbol("toPathTarget");

    static target(target, path, func, ...args) {
        return Path.resolve(target, path).reduce(
            (obj, key, index, path) => {
                if (index === path.length - 1) return func ? func(obj, key, ...args) : [obj, key];
                return obj && obj[key];
            },
            target
        );
    }

    static resolve(target, path) {
        path = is.path(path) ? path.path : is.array(path) ? path : [];

        const array = [];
        for (let i = 0; i < path.length; i++) {
            const key = path[i];
            if (is.path(key) || is.compute(key)) array.push(key.get(target));
            else if (is.array(key)) array.push(Path.get(target, key));
            else array.push(key);
        }

        return array;
    }

    static has(target, path) {
        return !is.undefined(
            Path.resolve(target, path).reduce((obj, key) => obj && obj[key], target)
        );
    }

    static get(target, path, args) {
        return Path.resolve(target, path).reduce(
            (obj, key, index, path) => {
                if (index === path.length - 1) return Compute.get(target, [obj[key]].concat(args));
                return obj && obj[key];
            },
            target
        );
    }

    static set(target, path, args) {
        return Path.resolve(target, path).reduce(
            (obj, key, index, path) => {
                if (index === path.length - 1)
                    obj[key] = Compute.get(target, [obj[key]].concat(args));
                return obj && !(key in obj) ? (obj[key] = {}) : obj[key];
            },
            target
        );
    }

    constructor(path, args) {
        if (is.path(path)) {
            this.root = true;
            this.path = path.path;
            this.rootArgs = args || [];
        } else {
            this.path = path;
        }
        this.args = args || [];

        return new Proxy(this, {
            get(target, key, receiver) {
                if (Reflect.has(target, key)) return Reflect.get(target, key, receiver);

                if (key === Symbol.toPrimitive) {
                    objTransfer = target;
                    return toPrimitive;
                }

                const step = objTransfer || key;
                objTransfer = undefined;

                if (target.root) return new Path(target.path.concat(step), target.rootArgs);
                target.path = target.path.concat(step);

                return receiver;
            }
        });
    }

    create(...args) {
        return new Path(this, args);
    }

    use(...args) {
        return (this.args = args) && this;
    }

    get(target, ...args) {
        return Path.get(target, this, args.length ? args : this.args);
    }

    set(target, ...args) {
        return Path.set(target, this, args);
    }

    box(target, func) {
        return box(func, this, target);
    }

    toString() {
        return this.path
            .map(
                (path, index) =>
                    is.path(path) ? "[" + path.toString() + "]" : index > 0 ? "." + path : path
            )
            .join("");
    }
}

export default Path;
