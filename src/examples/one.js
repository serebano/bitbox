import bitbox, { set, observable, observe, is } from "../main";
import { inc, compute } from "../bits";

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
    computed: app(compute(state.count, state.name, (count, name) => `${count}/${name}`))
});

observe(one => console.info(`map = { name: ${one.name}, count: ${one.count} }`), one(store));

observe(state => console.info(`count = ${state.count}`), state(store));
observe(state => console.info(`name = ${state.name}`), state(store));

state(store).count = 1;

state.name(set, `Demo App`, store);
state.count(set, inc, store);
