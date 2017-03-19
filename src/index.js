import Path from "./Path";
import Tree from "./Tree";
import compute, { Compute } from "./Compute";
import connect, { Connection } from "./Connect";
import * as operators from "./operators";

const tree = new Tree(
    {
        state: {
            users: {
                one: {
                    name: "tree1",
                    age: 33
                }
            },
            id: "one"
        }
    },
    {
        autoFlush: true
    }
);

const state = Path.create("state");

tree.on("flush", function(changes) {
    console.log("on flush", changes);
});

tree.on("connect", function(connection) {
    console.log("on connect", connection.name);
});

tree.connect(
    {
        name: [state`users.${state`id`}.name`, name => name.toUpperCase()],
        count: state`count`,
        age: state`users.${state`id`}.age`
    },
    function Username(conn, tree) {
        console.log(conn.name, conn.get(tree));
    }
);

tree.set(state`users.${state`id`}.name`, "Serebov");

tree.apply(
    state`count`,
    function inc(c = 0, n) {
        return c + n;
    },
    10
);

Object.assign(
    window,
    { state, tree, compute, connect, Compute, Tree, Connection, Path },
    operators
);
