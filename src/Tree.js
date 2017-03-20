import Path from "./Path";
import { isComplexObject } from "./utils";
import EventEmitter from "eventemitter3";
import { Connection, Store } from "./Connect";

class Tree extends EventEmitter {
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
        if (!target[Connection.CHANGES]) target[Connection.CHANGES] = [];

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
                        return target[Store.CHANGES].push(
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

    static set(path, value, tree) {
        return Tree.prototype.update.call(
            tree,
            path,
            function set(target, key, value) {
                target[key] = value;
            },
            [value],
            true
        );
    }

    constructor(tree, options) {
        super();
        Object.assign(
            this,
            tree,
            {
                autoFlush: true,
                asyncUpdate: true
            },
            options
        );
        this[Store.CHANGES] = [];
    }

    update(path, method, args = [], force = false) {
        const operator = method.displayName || method.name;
        args = args.map(arg => arg instanceof Path ? arg.get(this) : arg);

        Path.resolve(path, this).reduce(
            (object, key, index, path) => {
                if (index === path.length - 1) {
                    const oldValue = object[key];
                    method(object, key, ...args);
                    const newValue = object[key];
                    if (
                        oldValue !== newValue ||
                        (isComplexObject(newValue) && isComplexObject(oldValue))
                    ) {
                        this[Store.CHANGES].push({ path, operator, args, force });
                    }
                } else if (!(key in object)) {
                    object[key] = {};
                }

                return object[key];
            },
            this
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
        const changes = Store.flush(this, force);
        this.emit("flush", changes);
    }

    connect(path, listener) {
        const connection = new Connection(path, listener, this);
        this.emit("connect", connection);

        return connection;
    }

    get(path) {
        return Tree.get(path, this);
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
