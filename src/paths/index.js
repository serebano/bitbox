import Path from "../path";
import bit from "../bit";
import { $set } from "../bits/set";

export const props = Path.extend(
    bit.props,
    resolve => function props(path, object) {
        return resolve(...arguments);
    }
);

export const state = Path.extend(bit.state, resolve => {
    function state(path, object) {
        return resolve(...arguments);
    }

    state.$set = function set(value, obj) {
        return this($set, value, obj);
    };

    state.$print = function print(obj) {
        return this(print, console.log, obj);
    };

    return state;
});

export const signal = Path.extend(
    bit.signals,
    resolve => function signal(path, object) {
        return resolve(...arguments);
    }
);
