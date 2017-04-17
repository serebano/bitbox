import bitbox, { observable } from "../bitbox";
import { set, inc, dec, signal } from "../operators";
import run from "../operators/run";

export const root = bitbox.root();
export const deep = root.more("deep");
export const signals = root.signals;
export const props = root.props;
export const state = root.state;
export const foo = root.foo;
export const count = state.count(String);
export const app = bitbox({ props, state, deep, foo, count, keys: bitbox(Object.keys) });

const store = {
    state: observable({
        id: 1,
        name: "Demo",
        count: 0
    }),
    signals: {
        incClicked: signal(set(state.count, state.count(inc))),
        decClicked: signal(set(state.count, state.count(dec)))
    },
    foo: { count: 7 },
    more: {
        deep: { count: 3 }
    }
};

signal.run = run(function signal(context, action, props) {
    context.state = store.state;
    return context;
}).run;

export default store;
