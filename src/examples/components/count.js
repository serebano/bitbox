import React from "react";
import { state, props, signal } from "../../tags";
import { inc, dec } from "../../operators";

function Count({ count, inc, dec }) {
    return (
        <div>
            <button onClick={() => inc()}>+ Increment</button>
            <strong>{count}</strong>
            <button onClick={() => dec()}>- Decrement</button>
        </div>
    );
}

Count.connect = {
    count: state`count`,
    inc: signal`increaseClicked`,
    dec: signal`decreaseClicked`
};

Count.module = {
    state: {
        count: 0
    },
    signals: {
        increment: [inc(state`count`, props`by`)],
        decrement: [dec(state`count`, props`by`)]
    }
};

export default Count;
