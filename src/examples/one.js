import bitbox, { set, observable, observe } from "../main";
import { inc, compute, join, template } from "../bits";

export const app = bitbox();
export const state = bitbox("state", observable);
export const signals = app.signals();

export const store = {
    state: {
        count: 0
    }
};

export const one = bitbox({
    count: state.count,
    name: state.name,
    computed: bitbox(compute(state.count, state.name, join(` | `)))
});

observe(
    ({ name, count }) => {
        console.info(`map = { name: ${name}, count: ${count} }`);
    },
    one(store)
);

observe(state => console.info(`count = ${state.count}`), state(store));
observe(state => console.info(`name = ${state.name}`), state(store));

state(store).count = 1;

state.name(set, `Demo App`, store);
state.count(set, inc, store);
