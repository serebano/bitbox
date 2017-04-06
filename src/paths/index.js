import Path from "../path";
import bit from "../bit";

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

    return Object.assign(state, resolve, {
        print(object) {
            return this(print, console.log, object);
        }
    });
});

export const signal = Path.extend(
    bit.signals,
    resolve => function signal(path, object) {
        return resolve(...arguments);
    }
);
