import Tag from "./Tag";
import Path from "./Path";
import { keys, values, push, unshift } from "./model/methods";

import Listeners from "./models/listeners";

function isComplexObject(obj) {
    return typeof obj === "object" && obj !== null;
}

function Tree(target = {}, desc) {
    const tree = {
        target,
        resolve(path, props) {
            return Path.resolve(path, tree, props);
        },

        get(path, view) {
            return tree.resolve(path).reduce(
                (target, key, index, path) => {
                    if (index === path.length - 1) {
                        if (typeof view === "function") return view(target, key);
                        return {
                            get value() {
                                return target[key];
                            },
                            key,
                            index
                        };
                    } else if (!target[key]) {
                        console.log(`path`, path);
                        throw new Error(`The path "${path}" is invalid. Does the path "${path}"`);
                    }

                    return target[key];
                },
                target
            );
        },

        apply(path, func, ...args) {
            const method = (target, key, ...args) => {
                target[key] = func(target[key], ...args);
            };
            method.displayName = func.displayName || func.name;

            return Model.update(tree, path, method, args);
        }
    };

    Listeners(tree);

    return Object.keys(desc).reduce(
        (tree, type) => {
            tree[type] = Create(tree, type, desc[type]);
            return tree;
        },
        tree
    );
}

function Create(tree, type, methods) {
    function resolve(path) {
        if (path instanceof Path && path.type === type) return Path.resolve(path, tree);
        return Path.join(type, path);
    }

    return {
        type,
        apply(path, func, ...args) {
            return tree.apply(resolve(path), func, ...args);
        },
        get(path) {
            return tree.get(resolve(path), (target, key) => target[key]);
        },
        ...methods
    };
}

class Model {
    static isModel(arg) {
        return arg instanceof Model;
    }

    static tree = Tree;
    static create = Create;

    static update(tree, path, method, args = [], options = {}) {
        return tree.resolve(path).reduce(
            (target, key, index, path) => {
                if (index === path.length - 1) {
                    const oldValue = target[key];
                    method(target, key, ...args);
                    const newValue = target[key];

                    if (
                        oldValue !== newValue ||
                        (isComplexObject(newValue) && isComplexObject(oldValue))
                    )
                        return tree.target.changes.push(
                            path,
                            method.displayName || method.name,
                            args,
                            options
                        );
                } else if (!(key in target)) {
                    target[key] = {};
                }

                return target[key];
            },
            tree.target
        );
    }

    constructor(type) {
        this.type = type;
        this.path = Path.toArray(type);
    }
}

export default Model;
