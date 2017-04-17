import bitbox, { observable } from "../bitbox";

export const root = bitbox.root();
export const deep = root.more("deep");
export const signals = root.signals();
export const props = root.props;
export const state = root.state;
export const foo = root.foo;
export const count = state.count(String);
export const app = bitbox({ props, state, deep, foo, count, keys: bitbox(Object.keys) });

export default {
    state: observable({
        id: 1,
        name: "Demo",
        count: 0
    }),
    foo: { count: 7 },
    more: {
        deep: { count: 3 }
    }
};
