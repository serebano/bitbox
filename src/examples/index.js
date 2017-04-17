import bitbox, { set, observable } from "../bitbox";
import * as operators from "../operators";
import { is } from "../utils";
import funtree from "../operators/run";
import { render } from "react-dom";
import component from "../views/react";
import { app, state, props, signals } from "./app";
import { toggle, inc, dec, compute, join, signal } from "../operators";
import App from "./components/app";

const object = {
    state: observable({
        title: "Demo",
        count: 0,
        index: 0,
        enabled: true,
        nativeSet: new Set(["One", "Two"]),
        timers: {
            one: {
                value: 0
            },
            abc: {},
            xxx: {}
        },
        items: ["Item #1", "Item #2"],
        id: "one"
    }),
    signals: {}
};

const run = (signal.run = funtree([
    context => {
        context.state = object.state;
        return context;
    }
]).run);

state.timers.abc(set, { value: 200 }, object);
state.timers.xxx(set, { value: 100 }, object);

set(signals.nameChanged, signal(set(state.name, props.value)), object);
set(signals.toggleClicked, signal(set(state.enabled, toggle)), object);
set(signals.incClicked, signal(set(state.count, inc)), object);
set(signals.decClicked, signal(set(state.count, dec)), object);

set(
    signals.timerRemoved,
    signal(({ state, props }) => {
        const timer = state.timers[props.id];
        clearInterval(timer.iid);
        delete state.timers[props.id];
    }),
    object
);
const timers = state.timers();
const mapping = bitbox({
    count: state.count,
    timer: timers[state.id],
    items: state.items(Object.keys, join(` * `)),
    computed: bitbox(compute(state.count, timers(Object.keys).length, join("-"))),
    item: state.nativeSet(Array.from, arr => arr[arr.length - 1]),
    color: state.enabled(enabled => (enabled ? "red" : "green"))
});

component.debug = true;

render(component(App, object), document.querySelector("#root"));

Object.assign(window, operators, {
    is,
    obj: object,
    mapping,
    run,
    app,
    state,
    props,
    signals
});
