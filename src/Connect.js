import Path from "./Path";
import { Compute } from "./Compute";
import { isComplexObject } from "./utils";
import Changes from "./models/changes";

export class Connection extends Compute {
    static OPEN = 1;
    static CLOSED = 0;
    static KEY = Symbol("Connections");

    static store(tree) {
        if (!tree[Connection.KEY]) tree[Connection.KEY] = [];
        if (!tree[Changes.KEY]) tree[Changes.KEY] = [];

        return tree[Connection.KEY];
    }

    static get(tree, listener) {
        const connections = Connection.store(tree);

        if (typeof listener === "function")
            return connections.filter(connection => connection.listener === listener)[0];

        if (listener === true) return connections;

        return tree[Changes.KEY].reduce(
            (result, change) => {
                const listeners = connections.filter(connection =>
                    connection.has(change.path, change.force));
                if (listeners) {
                    return result.concat(
                        listeners.filter(connection => {
                            connection.changes.push(change);
                            return result.indexOf(connection) === -1;
                        })
                    );
                }
                return result;
            },
            []
        );
    }

    static listeners(tree, all) {
        const connections = Connection.store(tree);
        if (all) return connections;
        return tree[Changes.KEY].reduce(
            (result, change) => {
                const listeners = connections.filter(connection =>
                    connection.has(change.path, change.force));
                if (listeners) {
                    return result.concat(
                        listeners.filter(connection => {
                            connection.changes.push(change);
                            return result.indexOf(connection) === -1;
                        })
                    );
                }
                return result;
            },
            []
        );
    }

    static flush(tree, force = false) {
        for (const connection of Connection.listeners(tree, force)) {
            connection.listener(connection, tree);
            connection.changes = [];
            connection.changed++;
        }
        const changes = tree[Changes.KEY];
        tree[Changes.KEY] = [];
        return changes;
    }

    static clear(tree) {
        return delete tree[Connection.KEY];
    }

    constructor(paths, listener, tree) {
        super(paths);

        this.name = listener.name;
        this.listener = listener;
        this.changes = [];
        this.changed = 0;

        tree && this.open(tree);
    }

    open(tree) {
        Connection.store(tree).push(this);
        this.status = Connection.OPEN;
        this._paths = this.resolve(tree);

        return this;
    }

    close(tree) {
        const connections = Connection.store(tree);
        connections.splice(connections.indexOf(this), 1);
        this.status = Connection.CLOSED;

        return this;
    }

    update(path, tree) {
        this.create(path, tree);
        this._paths = this.resolve(tree);
        return this;
    }

    resolve(tree) {
        return this.paths(path => {
            if (path instanceof Compute) return;
            const resolved = path.resolve(tree);
            return resolved.indexOf("*") === -1 && isComplexObject(path.get(tree))
                ? resolved.concat("**")
                : resolved;
        });
    }

    has(path, child) {
        path = Path.toArray(path);
        return this._paths.some(arr => {
            return arr.every((key, index) => {
                if (index <= arr.length - 1 && path[index] === key) return true;
                if (index >= path.length) return key === "**" || child;
            });
        });
    }
}

function connect(path, listener, tree) {
    if (!tree) return tree => connect(path, listener, tree);

    const connection = Connection.get(tree, listener);
    if (connection) return connection.update(path, tree);

    return new Connection(path, listener, tree);
}

export default connect;
