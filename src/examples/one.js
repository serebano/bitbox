import bitbox, { set, observable, observe } from "../main";
import { inc } from "../bits";

export const app = bitbox(observable);
export const state = app.state();
export const signals = app.signals();

export const store = {
    state: {
        count: 0
    }
};

observe(({ state }) => console.info(`count = ${state.count}`), app(store));
observe(({ state }) => console.info(`name = ${state.name}`), app(store));
observe(({ state }) => console.info(`{ name: ${state.name}, count: ${state.count} }`), app(store));

state.name(set, `Demo App`, store);
state.count(set, inc, store);
