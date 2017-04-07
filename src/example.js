import * as bitbox from ".";
import * as bits from "./bits";
import * as paths from "./paths";
import { render } from "react-dom";
import { bit, path, run, component } from ".";
import { state, props, signals } from "./paths";
import { set, toggle, print, inc, dec, gt, on, compute, join } from "./bits";
import App from "./examples/components/app";

const object = bit({
    state: {
        title: "Demo",
        count: 0,
        index: 0,
        enabled: true,
        items: ["One", "Two"],
        timers: {
            foo: {
                value: 0
            }
        },
        id: "foo"
    },
    signals: {}
});

run.context = object;

const timers = path.extend(state.timers, resolve => {
    return Object.assign(
        function timers() {
            return resolve.apply(this, arguments);
        },
        resolve
    );
});

const add = (path, value, object) => set(path, { value }, object);

add(timers.xxx, 100, object);
add(timers.abc, 200, object);

// set enabled if count is greater then 5
set(state.enabled, state.count(gt(5)), object);
// stringify timers and log
timers(print, console.log, object);

set(signals.nameChanged, set(state.name, props.value), object);
set(signals.toggleClicked, set(state.enabled, toggle), object);
set(signals.incClicked, set(state.count, inc), object);
set(signals.decClicked, set(state.count, dec), object);

// run multiple actions
run([set(state.repos, { serebano: {} }), set(state.name, `bitbox`)]);

setTimeout(
    () => on(state.count, gt(6), set(state.name, state.count(c => `The count is: ${c}`)), object),
    10
);

const project = bit(
    {
        count: state.count,
        items: state.items(join(` * `)),
        computed: compute(state.count, 10, (a, b) => a + b),
        item: state.items[state.items(items => items.length - 1)],
        color: state.enabled(enabled => enabled ? "red" : "green")
    },
    object
);

render(component(App, object), document.querySelector("#root"));

Object.assign(window, paths, bits, {
    bit,
    bitbox,
    project,
    obj: object,
    timers
});
