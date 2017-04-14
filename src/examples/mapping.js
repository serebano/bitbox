import bitbox, { observable } from "../main";

const state = bitbox("state", observable);

const baz = state();
baz.count = [...baz, "count"];
baz.timer = baz.timers[baz.id];
baz.count2 = baz.count(String);

const bar = bitbox();

Object.assign(bar, {
    title: state.title,
    count: state.count,
    timer: state.timers[state.id]
});

const map = {
    title: state.title,
    count: [observable, "state", "count"],
    timer: [observable, "state", "timers", ["state", "id"]],
    nameChanged: ["signals", "nameChanged"],
    baz,
    bar
};

const foo = bitbox(map);

//baz.bar = bar;

export { foo, bar, baz, map };

//observe(() => foo(stringify, console.log, obj))
