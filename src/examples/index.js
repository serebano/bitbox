import { set } from "../handler";
import { observable } from "../observer";
import * as bits from "../bits";
import funtree from "../bits/run";
import { render } from "react-dom";
import { is } from "../utils";
import component from "../views/react";
import { app, state, props, signals } from "./app";
import {
    toggle,
    inc,
    dec,
    gt,
    eq,
    on,
    compute,
    project,
    join,
    signal,
    template,
    observe
} from "../bits";
import App from "./components/app";

const object = observable({
    state: {
        title: "Demo",
        count: 0,
        index: 0,
        enabled: true,
        nativeSet: new Set(["One", "Two"]),
        timers: {
            one: {
                value: 0
            }
        },
        items: ["Item #1", "Item #2"],
        id: "one"
    },
    signals: {}
});

const run = (signal.run = funtree([
    context => {
        context.state = object.state;
        return context;
    }
]).run);

object.state.items = {
    one: {
        count: 0,
        name: "One"
    }
};

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
const timer = state.timers[state.id]();

observe(state, o => console.warn(`observer\nname: ${o.name}\ncount: ${o.count}`), object);

setTimeout(
    () => {
        window.f = observe(
            timer,
            function One(props = {}) {
                console.log(`One(${props.iid}/${props.running})`, this.changes);
            },
            object
        );
        on(state.count, eq(9), set(state.name, template`Hola ${0}!`), object);
        on(state.count, gt(5), set(state.enabled, true), object);
        on(state.count, gt(6), set(state.name, state.count(template`Count: ${0}`)), object);
    },
    10
);

const mapping = app(
    project({
        timer,
        count: state.count,
        items: state.items(Object.keys, join(` * `)),
        computed: compute(state.count, 10, (a, b) => a + b),
        item: state.nativeSet(Array.from, arr => arr[arr.length - 1]),
        color: state.enabled(enabled => enabled ? "red" : "green")
    }),
    object
);
const mapped = state => {
    return {
        timer: state.timers[state.id],
        get count() {
            return state.count;
        },
        set count(value) {
            state.count = value;
        },
        items: Object.keys(state.items),
        computed: state.count + 10,
        item: Array.from(state.nativeSet)[state.nativeSet.size - 1],
        color: state.enabled ? "red" : "green"
    };
};

const map = app(
    project({
        a: state.count,
        b: {
            name: state.name(template`App name: ${0}`)
        },
        d: [state(Object.keys, join(" * "))],
        inc(obj) {
            return (i = 10) => state.count(set, count => count + i, obj);
        },
        setName(obj) {
            return name => state.name(set, name, obj);
        },
        print: () => () => print(map)
    }),
    object
);

const m2 = app(
    project({
        a: state.count,
        k: state(Object.keys),
        i: timer.value,
        s: signals.incClicked
    }),
    object
);

render(component(App, object), document.querySelector("#root"));

Object.assign(window, bits, {
    is,
    obj: object,
    mapping,
    mapped,
    m2,
    map,
    run,
    app,
    state,
    props,
    signals
});
