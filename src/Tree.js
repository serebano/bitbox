import Path from "./Path";
import Changes from "./models/changes";
import { isComplexObject } from "./utils";
import EventEmitter from "eventemitter3";
import { Connection } from "./Connect";

class Tree extends EventEmitter {
    static KEY = Symbol("Tree");
    static reduce(path, func, tree) {
        return Path.resolve(path, tree).reduce(func, tree);
    }

    /**
     * Path.get
     * Get value by path
     */

    static get(path, tree) {
        if (!tree) return tree => Path.get(path, tree);
        return Tree.reduce(path, (target, key) => target[key], tree);
    }

    /**
     * Path.update
     * Update target by path
     */

    static update(path, method, target, args = [], options = {}) {
        if (!target && method) return target => Tree.update(path, method, target, args, options);
        if (!target[Changes.KEY]) target[Changes.KEY] = [];

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
                        return target[Changes.KEY].push(
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

    constructor(tree, options) {
        super();
        Object.assign(
            this,
            {
                tree: tree || Object.create(null),
                autoFlush: true,
                asyncUpdate: true
            },
            options
        );
        this[Changes.KEY] = [];
    }

    update(path, method, args = [], force) {
        const operation = method.displayName || method.name;
        Path.resolve(path, this.tree).reduce(
            (object, key, index, path) => {
                if (index === path.length - 1) {
                    const oldValue = object[key];
                    method(object, key, ...args);
                    const newValue = object[key];
                    if (
                        oldValue !== newValue ||
                        (isComplexObject(newValue) && isComplexObject(oldValue))
                    ) {
                        this[Changes.KEY].push({ path, operation, args, force });
                    }
                } else if (!(key in object)) {
                    object[key] = {};
                }

                return object[key];
            },
            this.tree
        );

        if (this.autoFlush) {
            if (this.asyncUpdate) {
                clearTimeout(this.asyncTimeout);
                this.asyncTimeout = setTimeout(() => this.flush());
            } else {
                this.flush();
            }
        }
    }

    flush(force) {
        const changes = Connection.flush(this, force);
        this.emit("flush", changes);
    }

    connect(path, listener) {
        const connection = new Connection(path, listener, this);
        this.emit("connect", connection);
        return connection;
    }

    get(path) {
        return Tree.get(path, this.tree);
    }

    set(path, value) {
        return this.update(
            path,
            function set(target, key, value) {
                target[key] = value;
            },
            [value],
            true
        );
    }

    apply(path, func, ...args) {
        function apply(target, key, ...args) {
            target[key] = func(target[key], ...args);
        }

        apply.displayName = func.name;
        apply.force = func.force;

        return this.update(path, apply, args, func.force);
    }
}

export default Tree;
