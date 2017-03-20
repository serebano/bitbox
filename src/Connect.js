import Path from "./Path";
import { Compute } from "./Compute";

export class Connection {
    constructor(args, listener, context) {
        this.args = args;
        this.name = listener.name;
        this.listener = listener;
        this.context = context;
        this.changes = [];
        this.changed = 0;
        this.computed = new Compute(args);
        this.paths = this.computed.resolve(context);

        Store.add(this, context);
    }

    get(context) {
        context = context || this.context;
        this.paths = this.computed.resolve(context);

        return this.computed.get(context);
    }

    has(path, child) {
        return this.paths.some(arr => {
            return arr.every((key, index) => {
                if (index <= arr.length - 1 && path[index] === key) return true;
                if (index >= path.length) return key === "**" || child;
            });
        });
    }

    remove(context) {
        return Store.remove(this, context);
    }
}

export const Store = {
    CHANGES: Symbol("Changes"),
    CONNECTIONS: Symbol("Connections"),

    add(conn, tree) {
        if (!tree[Store.CONNECTIONS]) tree[Store.CONNECTIONS] = [];
        return tree[Store.CONNECTIONS].push(conn) - 1;
    },

    get(path, tree, force) {
        const resolved = Path.resolve(path, tree);
        return tree[Store.CONNECTIONS].filter(conn => conn.has(resolved, force));
    },

    flush(tree, force = false) {
        const connections = force
            ? tree[Store.CONNECTIONS]
            : tree[Store.CHANGES].reduce(
                  (result, change) => {
                      const filtered = tree[Store.CONNECTIONS].filter(conn =>
                          conn.has(change.path, change.force));
                      if (filtered.length)
                          return result.concat(
                              filtered.filter(conn => {
                                  conn.changes.push(change);
                                  return result.indexOf(conn) === -1;
                              })
                          );
                      return result;
                  },
                  []
              );

        const changes = tree[Store.CHANGES];
        for (const connection of connections) {
            connection.listener.call(connection.context, connection);
            connection.changes = [];
            connection.changed++;
        }

        return changes.splice(0, changes.length);
    },

    remove(conn, tree) {
        return tree[Store.CONNECTIONS].splice(tree[Store.CONNECTIONS].indexOf(conn), 1);
    },

    clear(tree) {
        delete tree[Store.CONNECTIONS];
        delete tree[Store.CHANGES];
        return tree;
    }
};

function connect(path, listener, tree) {
    if (!tree) return tree => connect(path, listener, tree);
    if (!tree[Store.CONNECTIONS]) tree[Store.CONNECTIONS] = [];
    const connection = tree[Store.CONNECTIONS].find($ => $.listener === listener);

    return !connection ? new Connection(path, listener, tree) : connection;
}

Object.assign(connect, Store);

export default connect;
