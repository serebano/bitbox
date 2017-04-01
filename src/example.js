import * as bb from ".";
import path from "./path";
import box from "./box";
import bit from "./bit";
import { render } from "react-dom";
import { run, component } from ".";
import { inc, set, toggle } from "./operators";

const github = path(function github(path) {
    return fetch(`https://api.github.com/${path.join("/")}`).then(res => res.json());
});

let object = (window.obj = bit({ id: 1 }));
run.context = object;

object.title = "XXXX";
object.a = "b";
object.id++;
Object.defineProperty(object, "a", { enumerable: false });
delete object.a;
object.items = [];
object.items.push(Date());
object.foo = {};
object.foo.bar = {};
object.foo.bar.baz = {};
object.foo.count = 0;
object.foo.bar.count = 0;
object.key = "bar";
object.signals = {};

const state = new bit.state();

const signal = new bit.signals((path, chain) => {
    if (!chain) throw new Error(`Cannot find signal: ${path}`);
    const signal = props => run(path.join("."), chain, props);
    signal.toString = () => `function ${path.join(".")}(props)`;
    return signal;
});

signal.foo(object, [inc(state.count)]);
signal.toggleClicked(object, [toggle(state.enabled)]);

//signal.foo(object, () => props => run([inc(state.count)], props));
//signal.toggleClicked(object, () => props => run([toggle(state.enabled)], props));

state(object, {
    title: "Demo",
    count: 0,
    items: ["One", "Two"],
    index: 0,
    enabled: true
});

state.title(object, `bitbox`);

const mapping = {
    count: state.count,
    items: state.items(items => items.map(String)),
    computed: [state.count, 10, (a, b) => a + b],
    item: state.items[state.items(items => items.length - 1)],
    color: state.enabled(enabled => enabled ? "red" : "green")
};

const mapped = bit(object, mapping);

box(({ count, item }) => console.log(`count`, count, item), mapped);

function Demo(props, h) {
    return h(
        "h1",
        {
            style: {
                color: props.color
            },
            onClick: () => props.clicked()
        },
        `Hello ${props.title} (${props.count})`
    );
}

Demo.map = {
    title: state.title,
    count: state.count,
    color: state.enabled(enabled => enabled ? "red" : "green"),
    clicked: signal.toggleClicked
};

render(component(Demo, object), document.querySelector("#root"));

Object.assign(window, bb, { bb, github, inc, set, toggle, state, signal, mapping, mapped, Demo });
