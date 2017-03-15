import Store from "../../Store";
import { state, props } from "../../operators";
import { set, inc, dec } from "../../operators";
import mount from "../mount";

function Counter({ count, color, inc, dec }) {
    return (
        <div style={{ background: "#eee", padding: 16, margin: 8 }}>
            <h1 style={{ color }}>Count: {count}</h1>
            <button onClick={() => inc()}>Increment</button>
            <button onClick={() => dec()}>Decrement</button>
        </div>
    );
}

Counter.connect = ({ props, state, signal, path }) => {
    return {
        count: state`counter.count`,
        color: state`counter.color`,
        inc: signal`counter.increment`,
        dec: signal`counter.decrement`
    };
};

Counter.module = ({ name, path }, store) => {
    return {
        state: {
            count: 0,
            color: "magenta"
        },
        signals: {
            colorChanged: [set(state`counter.color`, props`color`)],
            increment: [inc(state`counter.count`, 7)],
            decrement: [dec(state`counter.count`, 9)]
        }
    };
};

const store = Store(Counter.module);

mount(Counter, store, "#root");
