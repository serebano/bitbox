import { Compute } from "./paths/compute";
import Path from "./Path";
import { isComplexObject } from "./utils";

export class Connection extends Compute {
    static OPEN = 1;
    static CLOSE = 0;

    static get(tree, listener) {
        return tree.connections.filter(connection => connection.listener === listener)[0];
    }

    static listeners(tree, all) {
        if (all) return tree.connections;

        return tree.changes.reduce(
            (result, change) => {
                const connections = tree.connections.filter(connection =>
                    connection.has(change.path, change.forceChildPathUpdates));
                if (connections) {
                    return result.concat(
                        connections.filter(connection => {
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
        const connections = Connection.listeners(tree, force);
        const changes = tree.changes.flush();

        connections.forEach(connection => {
            connection.listener(connection, tree);
            connection.changes = [];
            connection.changed++;
        });

        return changes;
    }

    static clear(tree) {
        return delete tree.connections;
    }

    constructor(paths, listener) {
        super(paths);

        this.name = listener.name;
        this.listener = listener;
        this.changes = [];
        this.changed = 0;
    }

    open(tree) {
        if (!tree.connections) tree.connections = [];
        this._paths = this.resolve(tree);
        tree.connections.push(this);
        this.status = Connection.OPEN;
        return this;
    }

    close(tree) {
        tree.connections.splice(tree.connections.indexOf(this), 1);
        this.status = Connection.CLOSE;
        return this;
    }

    resolve(tree) {
        return this.paths(path => {
            if (path instanceof Compute) return;
            return isComplexObject(path.get(tree))
                ? path.resolve(tree).concat("**")
                : path.resolve(tree);
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

export default function connect(path, listener, tree) {
    if (!tree) return tree => connect(path, listener, tree);
    if (!tree.connections) tree.connections = [];

    const connected = Connection.get(tree, listener);
    if (connected) return connected;

    return new Connection(path, listener).open(tree);
}
