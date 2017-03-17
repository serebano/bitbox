import Path from "./Path";
import Listeners from "./models/listeners";
import Model from "./Model-2";
import EventEmitter from "eventemitter3";

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

Tree.create = function create(tree, desc) {
    return Object.keys(desc).reduce(
        (tree, type) => {
            tree[type] = Create(tree, type, desc[type]);
            return tree;
        },
        tree
    );
};

function Tree(target = {}, desc) {
    const EE = new EventEmitter();

    const tree = {
        //EE,
        target,

        on() {
            return EE.on(...arguments);
        },

        off() {
            return EE.off(...arguments);
        },

        once() {
            return EE.once(...arguments);
        },

        emit() {
            return EE.emit(...arguments);
        },

        resolve(path, props) {
            return Path.resolve(path, this, props);
        },

        connect(paths, listener) {
            const connection = Path.connect(target, paths, listener);
            EE.emit("tree:connect", paths, listener);

            return connection;
        },

        changes() {
            return Path.changes(target);
        },

        flush(force) {
            if (!target.changes.length) return;
            const changes = Path.flush(target, force);

            EE.emit("tree:flush", changes, force);
            return changes;
        },

        get(path, view) {
            return Path.get(target, path, view);
        },

        set(path, value) {
            return Path.set(target, path, value);
        },

        update(path, method, args, options) {
            Path.update(target, path, method, args, options);

            EE.emit("tree:update", path, method, args, options);
        },

        apply(path, func, ...args) {
            const method = (target, key, ...args) => {
                target[key] = func(target[key], ...args);
            };
            method.displayName = func.displayName || func.name;
            Path.update(target, path, method, args);

            EE.emit("tree:apply", path, method, args);
        },

        create(desc) {
            const model = Tree.create(this, desc);
            EE.emit("tree:create", desc);

            return model;
        }
    };

    //Object.assign(tree, EventEmitter.prototype);
    //EventEmitter.call(tree);

    return tree;
}

export default Tree;
