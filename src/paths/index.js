import bit from "../bit";

function extend(path, construct) {
    return path.$extend(construct);
}

export const props = extend(bit.props, resolve => {
    return function props(path, object) {
        return resolve.apply(this, arguments);
    };
});

export const state = extend(bit.state, resolve => {
    function state(path, object) {
        return resolve.apply(this, arguments);
    }

    return Object.assign(state, resolve, {
        print(object) {
            return this(print, console.log, object);
        }
    });
});

export const signal = extend(bit.signals, resolve => {
    return function signal(path, object) {
        return resolve.apply(this, arguments);
    };
});
