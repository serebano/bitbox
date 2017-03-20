import Path from "./Path";
import connect, { Connection } from "./Connect";

class PathProxy {
    static handler = {
        get(target, key) {
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            return true;
        },
        deleteProperty(target, key) {
            delete target[key];
            return true;
        }
    };
    static asyncTimeout = 0;
    static extract(tree, path, trap, ...args) {
        return Path.resolve(path, tree).reduce(
            (target, prop, index, keys) => {
                if (index === keys.length - 1) {
                    const oldValue = target[prop];
                    const result = trap.call(target, target, prop, ...args);
                    const newValue = target[prop];
                    if (oldValue !== newValue) {
                        const type = trap.name === "set"
                            ? oldValue === undefined ? "add" : "update"
                            : trap.name === "deleteProperty" ? "delete" : trap.name;

                        tree[connect.CHANGES].push({
                            type,
                            prop,
                            result,
                            path: keys,
                            rawPath: path,
                            trap: trap.name,
                            args,
                            oldValue,
                            newValue,
                            index: tree[connect.CHANGES].length
                        });

                        clearTimeout(PathProxy.asyncTimeout);
                        PathProxy.asyncTimeout = setTimeout(() => connect.flush(tree), 10);
                    }
                    return result;
                }
                if (target && !(prop in target)) target[prop] = {};
                return target[prop];
            },
            tree
        );
    }

    constructor(target, handler) {
        this._target = target;
        this._target[connect.CHANGES] = target[connect.CHANGES] || [];
        this._handler = Object.assign({}, PathProxy.handler, handler);
    }

    connect(path, func) {
        return connect(path, func, this._target);
    }

    get(path) {
        return PathProxy.extract(this._target, path, this._handler.get, this);
    }

    set(path, value) {
        const status = PathProxy.extract(this._target, path, this._handler.set, value, this);
        return status;
    }

    deleteProperty(path) {
        const status = PathProxy.extract(this._target, path, this._handler.deleteProperty, this);
        return status;
    }
}

Path.Proxy = PathProxy;

export default PathProxy;
