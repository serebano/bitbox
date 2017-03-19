import Path from "./Path";
import Changes from "./models/changes";
import { isComplexObject } from "./utils";

class Tree {
    static reduce(path, func, tree) {
        return Path.resolve(path, tree).reduce(func, tree);
    }

    /**
     * Path.get
     * Get value by path
     */

    static get(path, tree) {
        if (!tree) return tree => Path.get(path, tree);
        return Path.reduce(path, (target, key) => target[key], tree);
    }

    /**
     * Path.update
     * Update target by path
     */

    static update(path, method, target, args = [], options = {}) {
        if (!target && method) return target => Path.update(path, target, method, args, options);

        return Path.resolve(path, target).reduce(
            (object, key, index, path) => {
                if (index === path.length - 1) {
                    const oldValue = object[key];
                    method(object, key, ...args);
                    const newValue = object[key];

                    if (
                        oldValue !== newValue ||
                        (isComplexObject(newValue) && isComplexObject(oldValue))
                    ) {
                        if (!target.changes) target.changes = new Changes();

                        return target.changes.push(
                            path,
                            method.displayName || method.name,
                            args,
                            options
                        );
                    }
                } else if (!(key in object)) {
                    object[key] = {};
                }

                return object[key];
            },
            target
        );
    }

    static set(path, value, target) {
        return Tree.update(
            path,
            function set(target, key, value) {
                target[key] = value;
            },
            target,
            [value],
            { force: true }
        );
    }
}

export default Tree;
