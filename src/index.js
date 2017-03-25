import * as bb from "./bitbox";
import observe from "./observe";
import store from "./examples/proxy";
import path from "./path";

observe.changes = store.state.changes;

const obs = changes => console.log(`change#${changes.length}`, changes);
let object = (window.obj = observe({ id: 1 }, obs));

object.a = "b";
object.id++;
Object.defineProperty(object, "a", { enumerable: false });
delete object.a;
object.items = [];
object.items.push(Date());
object.foo = {};
object.foo.bar = {};
object.foo.bar.baz = {};

const app = path({
    apply(p, ...args) {
        const root = p.concat(args);
        console.log(`app.root`, root);
        return path(path => `my path: ${path.join("/")}`, root);
    },
    get(target, key) {
        return target[key];
    },
    set(target, key, value) {
        target[key] = value;
    },
    pop(target, key) {
        target[key].pop();
    },
    push(target, key, ...args) {
        target[key].push(...args);
    },
    inc(target, key, value) {
        target[key] = (target[key] || 0) + (value || 1);
    }
});

Object.assign(window, bb, { bb, app });
