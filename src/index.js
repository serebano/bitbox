import Path from "./Path";
import compute, { Compute } from "./Compute";
import connect, { Connection } from "./Connect";
import * as operators from "./operators";
import * as tags from "./cerebral-proxy-tags";
import PathProxy from "./PathProxy";

const data = {
    state: {
        users: {
            one: {
                name: "tree1",
                age: 33
            }
        },
        id: "one"
    },
    foo: {},
    bar: {}
};

const state = tags.state; //Path.create("state");
const foo = Path.create("foo");
const bar = Path.create("bar");

const dev = new PathProxy(data, {
    get(target, key) {
        console.log(`[get] ${key}`);
        return target[key];
    },
    set(target, key, value) {
        console.log(`[set] ${key} = ${value}`);
        target[key] = value;
        return true;
    },
    deleteProperty(target, key) {
        console.log(`[delete] ${key}`);
        delete target[key];
        return true;
    }
});

const users = state.users[state.id];
const count = state.count;
const compo = state.users[state.id].name;

dev.connect({ compo, count, users }, function Foo(conn) {
    console.log(`on-foo`, conn.get(this));
});

dev.connect(count, function Count(conn) {
    console.log(conn.name, conn.get(this));
});

dev.set("foo", { bar: 2, baz: 3 });
dev.set("foo.xxx", 5);
dev.set("foo.bar", 3);
dev.set("id", "sereb");
dev.set(count, 100);
dev.set(compo, `Serebano`);

Object.assign(window, operators, tags, {
    dev,
    users,
    count,
    tags,
    state,
    foo,
    bar,
    count,
    PathProxy,
    data,
    state,
    compute,
    connect,
    Path
});
