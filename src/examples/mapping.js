import bitbox, { observable } from "../main";

const state = bitbox("state", observable);

const foo = bitbox({
    title: state.title,
    count: [observable, "state", "count"],
    timer: [observable, "state", "timers", ["state", "id"]],
    nameChanged: ["signals", "nameChanged"]
});

const bar = bitbox();

Object.assign(bar, {
    title: state.title,
    count: state.count,
    timer: state.timers[state.id]
});

export { foo, bar };

//observe(() => foo(print, console.log, obj))
