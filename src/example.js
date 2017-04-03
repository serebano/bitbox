import * as bb from ".";
import { render } from "react-dom";
import { bit, path, run, component } from ".";
import { inc, dec, set, toggle } from "./operators";
import { state, signal, props, github, one } from "./api";
import * as bits from "./bits";

import App from "./examples/components/app";

const object = (run.context = bit({
    state: {},
    signals: {}
}));

state(object, {
    title: "Demo",
    count: 0,
    items: ["One", "Two"],
    index: 0,
    enabled: true,
    timers: {
        foo: {
            value: 0
        },
        bar: {
            value: 0
        },
        baz: {
            value: 0
        }
    },
    id: "foo"
});

const timers = bit(
    state.timers,
    reducer => function timers(path) {
        return reducer(...arguments);
    }
);

const o = bit({ x: 100, state: { count: 9 } });

console.log(bit.count(o.state));

state.title(object, `bitbox`);

signal.incClicked(object, inc(state.count));
signal.decClicked(object, dec(state.count));

signal.nameChanged(object, set(state.name, props.value));

signal.toggleClicked(object, toggle(state.enabled));

//state(on(({ count }) => console.log(`{{count}}: ${count}`)))(object);

//ctx => state.name(state => event => state.name = event.target.value)

// state.paths(object, new Set());
// state.paths(object).add(state.count);
//
// const bx = box(
//     ({ state }) => {
//         console.log(`paths: ${state.paths.size}`);
//
//         for (let path of state.paths) {
//             console.log(`path:`, path.$path, path(object));
//         }
//     },
//     object
// );
//
// state.paths(object).add(state.title);
// state.paths(object).add(state.enabled(o => o ? "red" : "blue"));
// state.title(object, `bitbox!`);
//
// toggle(state.enabled)(object);

// const mapping = {
//     count: state.count,
//     items: state.items(items => items.map(String)),
//     computed: [state.count, 10, (a, b) => a + b],
//     item: state.items[state.items(items => items.length - 1)],
//     color: state.enabled(enabled => enabled ? "red" : "green")
// };
//
// const mapped = bit(object, mapping);
// box(({ count, item }) => console.log(`count`, count, item), mapped);

render(component(App, object), document.querySelector("#root"));

Object.assign(window, bb, bits, {
    bb,
    timers,
    one,
    o,
    obj: object,
    github,
    inc,
    set,
    //bx,
    toggle,
    state,
    signal
    //mapping,
    //mapped
});
