import * as bb from "./bitbox";
import path from "./path";
import is from "./is";
import box from "./box";
import bit from "./bit";
import { render } from "react-dom";
import { run, component } from "./bitbox";
import { inc, dec, set, toggle } from "./operators";

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

const state = bit.state;
const signal = bit.signals.$(chain => props => run(chain, props));

signal.foo(object, [inc(state.count)]);

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

signal.toggleClicked(object, [toggle(state.enabled)]);

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

Object.assign(window, bb, { bb, inc, set, toggle, state, signal, mapping, mapped, Demo });
